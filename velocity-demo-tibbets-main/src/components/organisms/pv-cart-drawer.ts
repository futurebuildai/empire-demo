
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CartItem, Product } from '../../types/index.js';
import { MOCK_PRODUCTS } from '../../mock/store-mock.js';
import { BillingService } from '../../connect/services/billing.js';
import { PaymentMethod } from '../../connect/types/domain.js';

@customElement('pv-cart-drawer')
export class PvCartDrawer extends LitElement {
    @property({ type: Boolean, reflect: true }) open = false;
    @property({ type: Array }) items: CartItem[] = [];

    @state() private searchQuery = '';
    @state() private searchResults: Product[] = [];
    @state() private step: 'selection' | 'scope' | 'payment' | 'success' = 'selection';
    @state() private paymentMethods: PaymentMethod[] = [];

    // Form state
    @state() private requiredDate = '';
    @state() private fulfillmentMethod: 'pickup' | 'delivery' = 'pickup';
    @state() private paymentMethod: 'account' | string = 'account';

    async connectedCallback() {
        super.connectedCallback();
        this.paymentMethods = await BillingService.getPaymentMethods();
    }

    static styles = css`
        :host {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
            pointer-events: none;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: auto;
        }

        :host([open]) .overlay {
            opacity: 1;
        }
        
        :host(:not([open])) .overlay {
            pointer-events: none;
        }

        .drawer {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 450px;
            max-width: 95vw;
            background: white;
            box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            pointer-events: none;
        }

        :host([open]) .drawer {
            transform: translateX(0);
            pointer-events: auto;
        }

        .header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--color-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--color-bg-subtle);
        }

        h2 {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
            color: var(--color-text);
        }

        .close-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            color: var(--color-text-muted);
            transition: color 0.2s;
        }

        .close-btn:hover {
            color: var(--color-text);
        }

        .cart-content {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        .cart-items {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .empty-cart {
            text-align: center;
            color: var(--color-text-muted);
            margin: 3rem 1.5rem;
            padding: 2rem;
            border: 2px dashed var(--color-border);
            border-radius: var(--radius-lg);
        }

        .cart-item {
            display: flex;
            gap: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--color-border);
        }

        .item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: var(--radius-md);
            background: #f8fafc;
        }

        .item-details {
            flex: 1;
        }

        .item-name {
            font-weight: 600;
            margin-bottom: 0.25rem;
            font-size: 0.9375rem;
        }

        .item-brand {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            margin-bottom: 0.5rem;
        }

        .item-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .quantity-control {
            display: flex;
            align-items: center;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
        }

        .qty-btn {
            padding: 0.25rem 0.5rem;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-text);
        }
        
        .qty-val {
            padding: 0 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
        }

        .item-price {
            font-weight: 700;
        }

        .footer {
            padding: 1.5rem;
            border-top: 1px solid var(--color-border);
            background: white;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
        }

        .subtotal-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            font-size: 1.125rem;
            font-weight: 700;
        }

        .submit-btn {
            width: 100%;
            padding: 1rem;
            background-color: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--radius-md);
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
            text-decoration: none;
            display: block;
        }

        .submit-btn:hover {
            background-color: var(--color-primary-600);
            transform: translateY(-1px);
        }

        .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .remove-btn {
            background: none;
            border: none;
            color: #ef4444;
            font-size: 0.75rem;
            cursor: pointer;
            text-decoration: underline;
            margin-top: 0.5rem;
            padding: 0;
        }

        /* Catalog Search */
        .catalog-search {
            padding: 1.5rem;
            border-bottom: 1px solid var(--color-border);
            background: white;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .search-input-wrapper {
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            transition: all 0.2s;
        }

        .search-input:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px var(--color-primary-100);
        }

        .search-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-text-muted);
        }

        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            margin-top: 0.5rem;
            max-height: 300px;
            overflow-y: auto;
            z-index: 20;
        }

        .result-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            cursor: pointer;
            transition: background 0.15s;
        }

        .result-item:hover {
            background: var(--color-bg);
        }

        .result-img {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: var(--radius-sm);
        }

        .result-info {
            flex: 1;
        }

        .result-name {
            font-size: 0.875rem;
            font-weight: 600;
        }

        .result-price {
            font-size: 0.75rem;
            color: var(--color-text-muted);
        }

        .add-result-btn {
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--radius-sm);
            width: 24px;
            height: 24px;
            display: grid;
            place-items: center;
            cursor: pointer;
        }

        /* Form & Multi-step */
        .scope-form, .payment-form {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .form-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--color-text);
        }

        .form-input, .form-select {
            padding: 0.75rem;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            font-size: 0.875rem;
        }

        .payment-option {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.2s;
        }

        .payment-option:hover {
            border-color: var(--color-primary);
            background: var(--color-bg-subtle);
        }

        .payment-option.selected {
            border-color: var(--color-primary);
            background: var(--color-primary-50);
            box-shadow: 0 0 0 1px var(--color-primary);
        }

        .btn-group {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 0.75rem;
        }

        .review-state {
            padding: 2rem;
            text-align: center;
        }

        .success-icon {
            width: 64px;
            height: 64px;
            background: #dcfce7;
            color: #16a34a;
            border-radius: 50%;
            display: grid;
            place-items: center;
            margin: 0 auto 1.5rem;
        }
    `;

    private _close() {
        if (this.step === 'success') {
            this.step = 'selection';
            this.dispatchEvent(new CustomEvent('clear-cart', {
                bubbles: true,
                composed: true
            }));
        }
        this.searchQuery = '';
        this.searchResults = [];
        this.dispatchEvent(new CustomEvent('close-drawer', {
            bubbles: true,
            composed: true
        }));
    }

    private _handleSearch(e: Event) {
        const query = (e.target as HTMLInputElement).value;
        this.searchQuery = query;

        if (query.length > 2) {
            this.searchResults = MOCK_PRODUCTS.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.brand.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
        } else {
            this.searchResults = [];
        }
    }

    private _addItem(product: Product) {
        this.dispatchEvent(new CustomEvent('add-to-cart', {
            detail: { product },
            bubbles: true,
            composed: true
        }));
        this.searchQuery = '';
        this.searchResults = [];
    }

    private _updateQuantity(item: CartItem, change: number) {
        this.dispatchEvent(new CustomEvent('update-quantity', {
            detail: { item, change },
            bubbles: true,
            composed: true
        }));
    }

    private _nextStep() {
        if (this.step === 'selection') this.step = 'scope';
        else if (this.step === 'scope') this.step = 'payment';
    }

    private _prevStep() {
        if (this.step === 'scope') this.step = 'selection';
        else if (this.step === 'payment') this.step = 'scope';
    }

    private _placeOrder() {
        // Mock finalization
        this.step = 'success';
        this.dispatchEvent(new CustomEvent('order-placed', {
            detail: {
                paymentMethod: this.paymentMethod,
                fulfillmentMethod: this.fulfillmentMethod,
                requiredDate: this.requiredDate,
                items: this.items
            },
            bubbles: true,
            composed: true
        }));
    }

    private _renderSuccess() {
        return html`
            <div class="review-state">
                <div class="success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h3>Order Placed!</h3>
                <p>Thank you for your order. We've sent a confirmation email to your account.</p>
                <button class="submit-btn" style="margin-top: 2rem;" @click="${this._close}">Done</button>
            </div>
        `;
    }

    private _renderScopeForm() {
        return html`
            <div class="scope-form">
                <div class="form-group">
                    <label class="form-label">When do you need these materials?</label>
                    <input 
                        type="date" 
                        class="form-input" 
                        .value="${this.requiredDate}"
                        @input="${(e: any) => this.requiredDate = e.target.value}"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">Fulfillment Method</label>
                    <select 
                        class="form-select" 
                        .value="${this.fulfillmentMethod}"
                        @change="${(e: any) => this.fulfillmentMethod = e.target.value}"
                    >
                        <option value="pickup">Store Pick-up</option>
                        <option value="delivery">Delivery to Job Site</option>
                    </select>
                </div>

                <div style="margin-top: 1rem; color: var(--color-text-muted); font-size: 0.875rem; line-height: 1.5;">
                    <p>Estimated tax and shipping will be calculated in the next step.</p>
                </div>
            </div>
        `;
    }

    private _renderPaymentStep(subtotal: number) {
        const tax = subtotal * 0.0825;
        const total = subtotal + tax;

        return html`
            <div class="payment-form">
                <div class="form-label" style="margin-bottom: 0.5rem;">Select Payment Method</div>
                
                <div 
                    class="payment-option ${this.paymentMethod === 'account' ? 'selected' : ''}"
                    @click="${() => this.paymentMethod = 'account'}"
                >
                    <input type="radio" name="payment" .checked="${this.paymentMethod === 'account'}" @change="${() => this.paymentMethod = 'account'}">
                    <div>
                        <div style="font-weight: 600;">Net 30 Terms (On Account)</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-muted);">Available Credit: $34,700.00</div>
                    </div>
                </div>

                ${this.paymentMethods.map(method => {
            const methodId = `card-${method.id}`;
            const label = method.type === 'card'
                ? `${method.brand} ending in ${method.last4}`
                : `Bank Account ending in ${method.last4}`;

            return html`
                        <div 
                            class="payment-option ${this.paymentMethod === methodId ? 'selected' : ''}"
                            @click="${() => this.paymentMethod = methodId}"
                        >
                            <input type="radio" name="payment" .checked="${this.paymentMethod === methodId}" @change="${() => this.paymentMethod = methodId}">
                            <div>
                                <div style="font-weight: 600;">${method.brand || (method.type === 'ach' ? 'ACH' : 'Stored Card')}</div>
                                <div style="font-size: 0.75rem; color: var(--color-text-muted);">${label}</div>
                            </div>
                        </div>
                    `;
        })}

                <div style="margin-top: 1rem; padding: 1.25rem; background: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--color-text-muted);">
                        <span>Subtotal</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--color-text-muted);">
                        <span>Estimated Tax (8.25%)</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1rem; font-weight: 700; color: var(--color-text); padding-top: 0.75rem; border-top: 1px solid var(--color-border); margin-top: 0.25rem;">
                        <span>Final Total</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const tax = subtotal * 0.0825;
        const total = subtotal + tax;
        const displayTotal = this.step === 'payment' ? total : subtotal;

        return html`
            <div class="overlay" @click="${this._close}"></div>
            <div class="drawer">
                <div class="header">
                    <h2>
                        ${this.step === 'selection' ? 'Shopping Cart' :
                this.step === 'scope' ? 'Fulfillment' :
                    this.step === 'payment' ? 'Payment' : 'Order Success'}
                        ${this.items.length > 0 && this.step === 'selection' ? `(${itemCount} items)` : ''}
                    </h2>
                    <button class="close-btn" @click="${this._close}">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="cart-content">
                    ${this.step === 'success' ? this._renderSuccess() :
                this.step === 'scope' ? this._renderScopeForm() :
                    this.step === 'payment' ? this._renderPaymentStep(subtotal) : html`
                        <div class="catalog-search">
                            <div class="search-input-wrapper">
                                <svg class="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input 
                                    type="text" 
                                    class="search-input" 
                                    placeholder="Search products to add..."
                                    .value="${this.searchQuery}"
                                    @input="${this._handleSearch}"
                                >
                                
                                ${this.searchResults.length > 0 ? html`
                                    <div class="search-results">
                                        ${this.searchResults.map(p => html`
                                            <div class="result-item" @click="${() => this._addItem(p)}">
                                                <img src="${p.image}" alt="${p.name}" class="result-img">
                                                <div class="result-info">
                                                    <div class="result-name">${p.name}</div>
                                                    <div class="result-price">$${p.price.toFixed(2)}</div>
                                                </div>
                                                <button class="add-result-btn">+</button>
                                            </div>
                                        `)}
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <div class="cart-items">
                            ${this.items.length === 0 ? html`
                                <div class="empty-cart">
                                    <p>Your cart is empty.</p>
                                    <button class="submit-btn" style="margin-top: 1rem; width: auto; display: inline-block;" @click="${this._close}">Continue Shopping</button>
                                </div>
                            ` : this.items.map(item => html`
                                <div class="cart-item">
                                    <img src="${item.image}" alt="${item.name}" class="item-image">
                                    <div class="item-details">
                                        <div class="item-name">${item.name}</div>
                                        <div class="item-brand">${item.brand}</div>
                                        <div class="item-controls">
                                            <div class="quantity-control">
                                                <button class="qty-btn" @click="${() => this._updateQuantity(item, -1)}">-</button>
                                                <span class="qty-val">${item.quantity}</span>
                                                <button class="qty-btn" @click="${() => this._updateQuantity(item, 1)}">+</button>
                                            </div>
                                            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                        <button class="remove-btn" @click="${() => this._updateQuantity(item, -item.quantity)}">Remove</button>
                                    </div>
                                </div>
                            `)}
                        </div>
                    `}
                </div>

                ${this.items.length > 0 && this.step !== 'success' ? html`
                    <div class="footer">
                        <div class="subtotal-row">
                            <span>${this.step === 'payment' ? 'Grand Total' : 'Total'}</span>
                            <span>$${displayTotal.toFixed(2)}</span>
                        </div>
                        
                        ${this.step === 'selection' ? html`
                            <button class="submit-btn" @click="${this._nextStep}">Proceed to Fulfillment</button>
                        ` : this.step === 'scope' ? html`
                            <div class="btn-group">
                                <button class="submit-btn" style="background: white; color: var(--color-text); border: 1px solid var(--color-border);" @click="${this._prevStep}">Back</button>
                                <button class="submit-btn" @click="${this._nextStep}" ?disabled="${!this.requiredDate}">Continue to Payment</button>
                            </div>
                        ` : html`
                            <div class="btn-group">
                                <button class="submit-btn" style="background: white; color: var(--color-text); border: 1px solid var(--color-border);" @click="${this._prevStep}">Back</button>
                                <button class="submit-btn" @click="${this._placeOrder}">Place Order</button>
                            </div>
                        `}
                    </div>
                ` : ''}
            </div>
        `;
    }
}
