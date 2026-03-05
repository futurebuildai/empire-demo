
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CartItem, Product } from '../../types/index.js';
import { MOCK_PRODUCTS } from '../../mock/store-mock.js';

@customElement('pv-quote-drawer')
export class PvQuoteDrawer extends LitElement {
    @property({ type: Boolean, reflect: true }) open = false;
    @property({ type: Array }) items: CartItem[] = [];

    @state() private searchQuery = '';
    @state() private searchResults: Product[] = [];
    @state() private step: 'selection' | 'scope' | 'success' = 'selection';

    // Form state
    @state() private requiredDate = '';
    @state() private fulfillmentMethod: 'pickup' | 'delivery' = 'pickup';

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

        .quote-content {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

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

        .quote-items {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .empty-quote {
            text-align: center;
            color: var(--color-text-muted);
            margin: 3rem 1.5rem;
            padding: 2rem;
            border: 2px dashed var(--color-border);
            border-radius: var(--radius-lg);
        }

        .quote-item {
            display: flex;
            gap: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--color-border);
        }

        .item-image {
            width: 64px;
            height: 64px;
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
            font-size: 0.875rem;
        }

        .item-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.5rem;
        }

        .quantity-control {
            display: flex;
            align-items: center;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
        }

        .qty-btn {
            padding: 0.15rem 0.5rem;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-text);
        }
        
        .qty-val {
            padding: 0 0.5rem;
            font-size: 0.8125rem;
            font-weight: 600;
        }

        .item-price {
            font-weight: 700;
            font-size: 0.875rem;
        }

        .remove-btn {
            color: #ef4444;
            font-size: 0.75rem;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            margin-top: 0.25rem;
        }

        .footer {
            padding: 1.5rem;
            border-top: 1px solid var(--color-border);
            background: white;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin: 1rem 0;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--color-text);
        }

        .scope-form {
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

        .form-select {
            background-color: white;
        }

        .btn-group {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.75rem;
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
        }

        .submit-btn:hover {
            background-color: var(--color-primary-600);
            transform: translateY(-1px);
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
        this.step = 'selection';
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
        this.dispatchEvent(new CustomEvent('add-to-quote', {
            detail: { product },
            bubbles: true,
            composed: true
        }));
        this.searchQuery = '';
        this.searchResults = [];
    }

    private _updateQuantity(item: CartItem, change: number) {
        this.dispatchEvent(new CustomEvent('update-quote-quantity', {
            detail: { item, change },
            bubbles: true,
            composed: true
        }));
    }

    private _goToScope() {
        this.step = 'scope';
    }

    private _goBack() {
        this.step = 'selection';
    }

    private _submitQuote() {
        // In a real app, this would call an API
        this.dispatchEvent(new CustomEvent('submit-quote', {
            detail: {
                items: this.items,
                requiredDate: this.requiredDate,
                fulfillmentMethod: this.fulfillmentMethod
            },
            bubbles: true,
            composed: true
        }));
        this.step = 'success';
    }

    private _renderSuccess() {
        return html`
            <div class="review-state">
                <div class="success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h3>Request Submitted!</h3>
                <p>Your request has been sent to our team for review. You'll receive a notification shortly.</p>
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
                    <label class="form-label">How would you like to get them?</label>
                    <select 
                        class="form-select" 
                        .value="${this.fulfillmentMethod}"
                        @change="${(e: any) => this.fulfillmentMethod = e.target.value}"
                    >
                        <option value="pickup">Store Pick-up</option>
                        <option value="delivery">Delivery to Job Site</option>
                    </select>
                </div>

                <div style="margin-top: 2rem; color: var(--color-text-muted); font-size: 0.875rem; line-height: 1.5;">
                    <p><strong>Note:</strong> By submitting this request, you are asking our sales team to provide a firm quote based on your material list and timeline.</p>
                </div>
            </div>
        `;
    }

    render() {
        const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);

        return html`
            <div class="overlay" @click="${this._close}"></div>
            <div class="drawer">
                <div class="header">
                    <h2>${this.step === 'scope' ? 'Fulfillment' : 'Requests'} ${this.items.length > 0 ? `(${itemCount} items)` : ''}</h2>
                    <button class="close-btn" @click="${this._close}">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="quote-content">
                    ${this.step === 'success' ? this._renderSuccess() : this.step === 'scope' ? this._renderScopeForm() : html`
                        <div class="catalog-search">
                            <div class="search-input-wrapper">
                                <svg class="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input 
                                    type="text" 
                                    class="search-input" 
                                    placeholder="Add items from catalog..."
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
                                                </div>
                                                <button class="add-result-btn">+</button>
                                            </div>
                                        `)}
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <div class="quote-items">
                            ${this.items.length === 0 ? html`
                                <div class="empty-quote">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p>Your draft quote is waiting for items.</p>
                                    <p style="font-size: 0.875rem;">Add products from the storefront or search above.</p>
                                </div>
                            ` : this.items.map(item => html`
                                <div class="quote-item">
                                    <img src="${item.image}" alt="${item.name}" class="item-image">
                                    <div class="item-details">
                                        <div class="item-name">${item.name}</div>
                                        <div class="item-controls">
                                            <div class="quantity-control">
                                                <button class="qty-btn" @click="${() => this._updateQuantity(item, -1)}">-</button>
                                                <span class="qty-val">${item.quantity}</span>
                                                <button class="qty-btn" @click="${() => this._updateQuantity(item, 1)}">+</button>
                                            </div>
                                        </div>
                                        <button class="remove-btn" @click="${() => this._updateQuantity(item, -item.quantity)}">Remove Item</button>
                                    </div>
                                </div>
                            `)}
                        </div>
                    `}
                </div>

                ${this.items.length > 0 && this.step !== 'success' ? html`
                    <div class="footer">
                        ${this.step === 'selection' ? html`
                            <button class="submit-btn" @click="${this._goToScope}">Review & Submit</button>
                        ` : html`
                            <div class="btn-group" style="grid-template-columns: 1fr 2fr;">
                                <button class="submit-btn" style="background: white; color: var(--color-text); border: 1px solid var(--color-border);" @click="${this._goBack}">Back</button>
                                <button class="submit-btn" @click="${this._submitQuote}" ?disabled="${!this.requiredDate}">Submit Request</button>
                            </div>
                        `}
                    </div>
                ` : ''}
            </div>
        `;
    }
}
