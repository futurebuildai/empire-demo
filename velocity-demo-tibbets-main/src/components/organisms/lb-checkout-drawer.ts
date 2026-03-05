import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PvBase } from '../../components/pv-base.js';

@customElement('lb-checkout-drawer')
export class LbCheckoutDrawer extends PvBase {
  static styles = [
    ...PvBase.styles,
    css`
      :host {
        display: block;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2000;
        pointer-events: none;
      }

      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .backdrop.open {
        opacity: 1;
        pointer-events: auto;
      }

      .drawer {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        max-width: 450px;
        height: 100%;
        background: white;
        box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
      }

      .drawer.open {
        transform: translateX(0);
      }

      .drawer-header {
        padding: var(--space-lg);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .drawer-title {
        font-family: var(--font-heading);
        font-size: var(--text-xl);
        font-weight: 700;
        color: var(--color-text);
      }

      .btn-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text-muted);
        padding: var(--space-xs);
      }

      .btn-close:hover {
        color: var(--color-text);
      }

      .drawer-content {
        flex: 1;
        padding: var(--space-lg);
        overflow-y: auto;
      }

      .summary-box {
        background: var(--color-bg-alt);
        padding: var(--space-lg);
        border-radius: var(--radius-lg);
        margin-bottom: var(--space-xl);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--space-sm);
        color: var(--color-text-light);
      }

      .summary-row.total {
        margin-top: var(--space-md);
        padding-top: var(--space-md);
        border-top: 1px solid var(--color-border);
        font-weight: 700;
        color: var(--color-text);
        font-size: var(--text-lg);
      }

      .payment-methods {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
        margin-bottom: var(--space-xl);
      }

      .payment-method-card {
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--space-md);
        display: flex;
        align-items: center;
        gap: var(--space-md);
        cursor: pointer;
        transition: all 0.2s;
      }

      .payment-method-card:hover {
        border-color: var(--color-primary);
      }

      .payment-method-card.selected {
        border-color: var(--color-primary);
        background: rgba(0, 94, 184, 0.05); /* Brand Blue Tint */
      }

      .radio-circle {
        width: 18px;
        height: 18px;
        border: 2px solid var(--color-text-muted);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .payment-method-card.selected .radio-circle {
        border-color: var(--color-primary);
      }

      .radio-inner {
        width: 10px;
        height: 10px;
        background: var(--color-primary);
        border-radius: 50%;
        opacity: 0;
        transform: scale(0);
        transition: all 0.2s;
      }

      .payment-method-card.selected .radio-inner {
        opacity: 1;
        transform: scale(1);
      }

      .drawer-footer {
        padding: var(--space-lg);
        border-top: 1px solid var(--color-border);
      }

      .btn-pay {
        width: 100%;
        padding: var(--space-md);
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        font-size: var(--text-lg);
        cursor: pointer;
        transition: background 0.2s;
      }

      .btn-pay:hover {
        background: var(--color-primary-dark);
      }

      .btn-pay:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .success-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
      }

      .success-icon {
        width: 64px;
        height: 64px;
        background: var(--color-success);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--space-lg);
      }
    `,
  ];

  @property({ type: Boolean }) open = false;
  @property({ type: Number }) amount = 0;
  @property({ type: Number }) itemCount = 0;
  @property({ type: String }) description = 'Invoice Payment';

  @state() private processing = false;
  @state() private success = false;
  @state() private selectedMethod = 'card';

  private handleClose() {
    if (this.processing) return;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    // Reset state after transition
    setTimeout(() => {
      this.success = false;
      this.processing = false;
    }, 300);
  }

  private async handlePay() {
    this.processing = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.processing = false;
    this.success = true;

    // Emit success after showing success state briefly
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('payment-success', { bubbles: true, composed: true }));
      this.open = false; // Close drawer
      setTimeout(() => {
        this.success = false; // Reset for next time
      }, 300);
    }, 1500);
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  render() {
    return html`
      <div class="backdrop ${this.open ? 'open' : ''}" @click=${this.handleClose}></div>
      <div class="drawer ${this.open ? 'open' : ''}">
        ${this.success ? html`
          <div class="drawer-content">
            <div class="success-view">
              <div class="success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 class="drawer-title" style="margin-bottom: var(--space-sm);">Payment Successful</h2>
              <p style="color: var(--color-text-muted);">Your transaction has been processed securely.</p>
            </div>
          </div>
        ` : html`
          <div class="drawer-header">
            <h2 class="drawer-title">Secure Checkout</h2>
            <button class="btn-close" @click=${this.handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="drawer-content">
            <div class="summary-box">
              <div class="summary-row">
                <span>Description</span>
                <span>${this.description}</span>
              </div>
              ${this.itemCount > 0 ? html`
              <div class="summary-row">
                <span>Items</span>
                <span>${this.itemCount}</span>
              </div>` : ''}
              <div class="summary-row total">
                <span>Total Due</span>
                <span>${this.formatCurrency(this.amount)}</span>
              </div>
            </div>

            <h3 style="font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-md);">Payment Method</h3>
            <div class="payment-methods">
              <div 
                class="payment-method-card ${this.selectedMethod === 'card' ? 'selected' : ''}"
                @click=${() => this.selectedMethod = 'card'}
              >
                <div class="radio-circle"><div class="radio-inner"></div></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <div style="flex: 1;">
                  <div style="font-weight: 500;">Visa ending in 4242</div>
                  <div style="font-size: var(--text-xs); color: var(--color-text-muted);">Expires 12/2025</div>
                </div>
              </div>

              <div 
                class="payment-method-card ${this.selectedMethod === 'bank' ? 'selected' : ''}"
                 @click=${() => this.selectedMethod = 'bank'}
              >
                <div class="radio-circle"><div class="radio-inner"></div></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm9-5L3 6V4l9-2 9 2v2l-9-2z"></path>
                </svg>
                <div style="flex: 1;">
                  <div style="font-weight: 500;">Bank Account ****8892</div>
                  <div style="font-size: var(--text-xs); color: var(--color-text-muted);">Checking</div>
                </div>
              </div>
            </div>
          </div>

          <div class="drawer-footer">
            <button 
              class="btn-pay" 
              @click=${this.handlePay}
              ?disabled=${this.processing}
            >
              ${this.processing ? 'Processing...' : `Pay ${this.formatCurrency(this.amount)}`}
            </button>
            <div style="text-align: center; margin-top: var(--space-md); font-size: var(--text-xs); color: var(--color-text-muted);">
              <svg style="width: 10px; height: 10px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Payments processed securely by Velocity
            </div>
          </div>
        `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lb-checkout-drawer': LbCheckoutDrawer;
  }
}
