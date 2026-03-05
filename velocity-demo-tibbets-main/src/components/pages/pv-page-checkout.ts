
import { html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { CartItem } from '../../types/index.js';
import { RouterService } from '../../services/router.service.js';

@customElement('pv-page-checkout')
export class PvPageCheckout extends PvBase {
    @property({ type: Array }) cartItems: CartItem[] = [];

    @state() private currentStep: 'review' | 'payment' | 'success' = 'review';
    @state() private paymentMethod: 'account' | 'card' = 'account';
    @state() private processing = false;

    static styles = [
        ...PvBase.styles,
        css`
            :host {
                display: block;
            }

            .checkout-container {
                max-width: 1000px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr 380px;
                gap: var(--space-xl);
            }

            .section {
                background: white;
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                padding: var(--space-xl);
                margin-bottom: var(--space-lg);
            }

            .section-title {
                font-size: 1.25rem;
                font-weight: 700;
                margin-bottom: var(--space-lg);
                padding-bottom: var(--space-md);
                border-bottom: 1px solid var(--color-border);
            }

            .cart-item {
                display: flex;
                gap: var(--space-lg);
                padding: var(--space-lg) 0;
                border-bottom: 1px solid var(--color-border);
            }

            .cart-item:last-child {
                border-bottom: none;
            }

            .item-image {
                width: 100px;
                height: 100px;
                object-fit: cover;
                border-radius: var(--radius-md);
                background: #f8fafc;
            }

            .item-info {
                flex: 1;
            }

            .item-name {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: var(--space-sm);
                color: var(--color-text-muted);
            }

            .summary-total {
                display: flex;
                justify-content: space-between;
                margin-top: var(--space-lg);
                padding-top: var(--space-lg);
                border-top: 1px solid var(--color-border);
                font-weight: 700;
                font-size: 1.25rem;
            }

            .payment-option {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-md);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-md);
                margin-bottom: var(--space-md);
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

            .action-btn {
                width: 100%;
                padding: 1rem;
                background-color: var(--color-primary);
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-weight: 700;
                cursor: pointer;
                transition: background-color 0.2s;
                font-size: 1rem;
            }

            .action-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .success-state {
                text-align: center;
                padding: var(--space-3xl);
            }

            .success-icon {
                width: 64px;
                height: 64px;
                color: #10B981;
                margin-bottom: var(--space-lg);
            }

            .job-ref-input {
                width: 100%;
                padding: 0.75rem;
                margin-top: 0.5rem;
                border: 1px solid var(--color-border);
                border-radius: var(--radius-md);
            }

            @media (max-width: 768px) {
                .checkout-container {
                    grid-template-columns: 1fr;
                }
            }
        `
    ];

    private _renderCartSummary() {
        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.0825; // Mock tax
        const total = subtotal + tax;

        return html`
            <div class="section">
                <div class="section-title">Order Summary</div>
                ${this.cartItems.map(item => html`
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="text-sm text-muted">Qty: ${item.quantity}</div>
                            <div class="text-sm text-muted">$${item.price.toFixed(2)} / ea</div>
                        </div>
                        <div class="font-bold">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `)}
                
                <div class="summary-total"></div> <!-- Separator -->

                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (8.25%)</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                
                <div class="summary-total">
                    <span>Total</span>
                    <span>$${total.toFixed(2)}</span>
                </div>

                ${this.currentStep !== 'success' ? html`
                    <button 
                        class="action-btn" 
                        style="margin-top: 1.5rem"
                        @click="${this._handleNextStep}"
                        ?disabled="${this.processing || this.cartItems.length === 0}"
                    >
                        ${this.processing ? 'Processing...' : (this.currentStep === 'payment' ? 'Place Order' : 'Proceed to Payment')}
                    </button>
                ` : ''}
            </div>
        `;
    }

    private async _handleNextStep() {
        if (this.currentStep === 'review') {
            this.currentStep = 'payment';
            window.scrollTo(0, 0);
        } else if (this.currentStep === 'payment') {
            this.processing = true;
            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.processing = false;
            this.currentStep = 'success';
            window.scrollTo(0, 0);

            // Clear cart in main app
            this.dispatchEvent(new CustomEvent('clear-cart', {
                bubbles: true,
                composed: true
            }));
        }
    }

    render() {
        if (this.currentStep === 'success') {
            return html`
                <div class="checkout-container" style="display: block;">
                    <div class="section success-state">
                        <svg class="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h1>Order Placed Successfully!</h1>
                        <p style="margin-bottom: 2rem; color: var(--color-text-muted);">
                            Thank you for your order. A confirmation email has been sent to your inbox.<br>
                            Order Reference: #${Math.floor(Math.random() * 1000000)}
                        </p>
                        <button class="action-btn" style="max-width: 300px; margin: 0 auto;" @click="${() => RouterService.navigate('shop')}">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="page-header">
                <h1 style="margin-bottom: 0.5rem">Checkout</h1>
                <p style="color: var(--color-text-muted)">
                    Step ${this.currentStep === 'review' ? '1' : '2'} of 2: 
                    ${this.currentStep === 'review' ? 'Review Items' : 'Payment Details'}
                </p>
            </div>

            <div class="checkout-container">
                <div class="main-content">
                    ${this.currentStep === 'review' ? html`
                        <div class="section">
                            <div class="section-title">Shipping Address</div>
                            <div style="line-height: 1.6;">
                                <strong>Generic Contractor Co.</strong><br>
                                123 Construction Way<br>
                                Building B, Suite 100<br>
                                Austin, TX 78701<br>
                                (512) 555-0123
                            </div>
                            <button style="margin-top: 1rem; color: var(--color-primary); background: none; border: none; padding: 0; cursor: pointer; text-decoration: underline;">
                                Edit Address
                            </button>
                        </div>
                    ` : html`
                        <div class="section">
                            <div class="section-title">Payment Method</div>
                            
                            <div 
                                class="payment-option ${this.paymentMethod === 'account' ? 'selected' : ''}"
                                @click="${() => this.paymentMethod = 'account'}"
                            >
                                <input type="radio" name="payment" ?checked="${this.paymentMethod === 'account'}">
                                <div>
                                    <div style="font-weight: 600;">Net 30 Terms</div>
                                    <div class="text-sm text-muted">Available Credit: $12,500.00</div>
                                </div>
                            </div>

                            <div 
                                class="payment-option ${this.paymentMethod === 'card' ? 'selected' : ''}"
                                @click="${() => this.paymentMethod = 'card'}"
                            >
                                <input type="radio" name="payment" ?checked="${this.paymentMethod === 'card'}">
                                <div>
                                    <div style="font-weight: 600;">Credit Card</div>
                                    <div class="text-sm text-muted">Visa ending in 4242</div>
                                </div>
                            </div>

                            <div style="margin-top: 1.5rem;">
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">PO Number / Job Reference</label>
                                <input type="text" class="job-ref-input" placeholder="e.g. Project Alpha - Phase 1">
                            </div>
                        </div>
                    `}
                </div>

                <div class="order-sidebar">
                    ${this._renderCartSummary()}
                </div>
            </div>
        `;
    }
}
