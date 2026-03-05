import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { BillingService } from '../../connect/services/billing.js';
import { DataService } from '../../services/data.service.js';
import { PvToast } from '../atoms/pv-toast.js';
import type { PaymentMethod, Estimate } from '../../types/index.js';

@customElement('pv-checkout-modal')
export class PvCheckoutModal extends PvBase {
  static styles = [
    ...PvBase.styles,
    css`
      :host {
        display: block;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: var(--space-lg);
      }

      .modal-content {
        background: var(--color-bg);
        border-radius: var(--radius-lg);
        width: 100%;
        max-width: 500px;
        box-shadow: var(--shadow-xl);
        max-height: 90vh;
        overflow-y: auto;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-xl);
        border-bottom: 1px solid var(--color-border);
      }

      .modal-title {
        font-family: var(--font-heading);
        font-size: var(--text-xl);
        font-weight: 600;
        margin: 0;
      }

      .close-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
        color: var(--color-text-muted);
        transition: all var(--transition-fast);
        background: transparent;
        border: none;
        cursor: pointer;
      }

      .close-btn:hover {
        background: var(--color-border);
        color: var(--color-text);
      }

      .modal-body {
        padding: var(--space-xl);
      }

      .order-summary {
        background: var(--color-bg-alt);
        border-radius: var(--radius-md);
        padding: var(--space-lg);
        margin-bottom: var(--space-xl);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--space-xs);
        font-size: var(--text-sm);
      }

      .summary-row.total {
        margin-top: var(--space-md);
        padding-top: var(--space-md);
        border-top: 1px solid var(--color-border);
        font-weight: 700;
        font-size: var(--text-lg);
      }

      .section-label {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--color-text-muted);
        margin-bottom: var(--space-md);
        display: block;
      }

      .payment-options {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }

      .payment-option-card {
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--space-md);
        cursor: pointer;
        transition: all var(--transition-fast);
        display: flex;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .payment-option-card:hover {
        border-color: var(--color-primary);
        background: var(--color-bg-alt);
      }

      .payment-option-card.selected {
        border-color: var(--color-primary);
        background: var(--color-primary-light-10);
        box-shadow: 0 0 0 1px var(--color-primary);
      }

      .payment-option-card.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--color-bg-alt);
        border-color: var(--color-border);
      }

      .radio-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--color-border);
        flex-shrink: 0;
        position: relative;
        margin-top: 2px;
      }

      .payment-option-card.selected .radio-circle {
        border-color: var(--color-primary);
      }

      .payment-option-card.selected .radio-circle::after {
        content: '';
        position: absolute;
        top: 4px;
        left: 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-primary);
      }

      .option-content {
        flex: 1;
      }

      .option-title {
        font-weight: 600;
        display: block;
        margin-bottom: var(--space-xs);
      }

      .option-description {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        display: block;
      }

      .balance-info {
        display: flex;
        gap: var(--space-md);
        margin-top: var(--space-xs);
        font-size: var(--text-sm);
      }

      .balance-label {
        color: var(--color-text-muted);
      }
      
      .balance-value {
        font-weight: 600;
      }

      .balance-error {
        color: var(--color-error);
        font-size: var(--text-xs);
        margin-top: var(--space-xs);
      }

      .stored-payment-methods {
        margin-top: var(--space-md);
        padding-left: var(--space-xl);
        border-left: 2px solid var(--color-border);
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-md);
        padding: var(--space-xl);
        border-top: 1px solid var(--color-border);
      }

      .btn-cancel {
        padding: var(--space-md) var(--space-lg);
        background: transparent;
        color: var(--color-text-muted);
        border: none;
        font-weight: 500;
        cursor: pointer;
        border-radius: var(--radius-md);
      }

      .btn-cancel:hover {
        color: var(--color-text);
        background: var(--color-bg-alt);
      }

      .btn-confirm {
        padding: var(--space-md) var(--space-xl);
        background: var(--color-primary);
        color: white;
        border: none;
        font-weight: 600;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-base);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
      }

      .btn-confirm:hover:not(:disabled) {
        background: var(--color-primary-dark);
      }

      .btn-confirm:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      .success-view {
        text-align: center;
        padding: var(--space-2xl) 0;
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
        margin: 0 auto var(--space-lg);
      }
    `,
  ];

  @property({ type: Boolean }) open = false;
  @property({ type: Object }) estimate: Estimate | null = null;

  @state() private paymentMethods: PaymentMethod[] = [];
  @state() private loadingMethods = false;
  @state() private currentStep: 'select' | 'processing' | 'success' = 'select';

  // Selection state
  @state() private selectedOption: 'account' | 'card' = 'account';
  @state() private selectedCardId: number | null = null;

  // Account data
  @state() private availableBalance = 0;
  @state() private loadingBalance = false;

  async updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open') && this.open) {
      this.resetState();
      this.loadData();
    }
  }

  private resetState() {
    this.currentStep = 'select';
    this.selectedOption = 'account';
    this.selectedCardId = null;
  }

  private async loadData() {
    this.loadingMethods = true;
    this.loadingBalance = true;

    try {
      // Load payment methods
      this.paymentMethods = await (BillingService as any).getPaymentMethods();
      if (this.paymentMethods.length > 0) {
        const defaultMethod = this.paymentMethods.find(pm => pm.isDefault);
        this.selectedCardId = defaultMethod ? defaultMethod.id : this.paymentMethods[0].id;
      }

      // Load account balance
      const accountData = await DataService.getAccountData();
      this.availableBalance = accountData.company.available;

      // If balance is insufficient, default to card if available
      if (this.estimate && this.availableBalance < this.estimate.total && this.paymentMethods.length > 0) {
        this.selectedOption = 'card';
      }
    } catch (e) {
      console.error('Failed to load checkout data', e);
      PvToast.show('Failed to load checkout information', 'error');
    } finally {
      this.loadingMethods = false;
      this.loadingBalance = false;
    }
  }

  private handleClose() {
    if (this.currentStep === 'processing') return;
    this.dispatchEvent(new CustomEvent('close'));
  }

  private handleOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.handleClose();
    }
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  private async handleConfirm() {
    if (!this.estimate) return;

    if (this.selectedOption === 'card' && !this.selectedCardId) {
      PvToast.show('Please select a payment method', 'warning');
      return;
    }

    if (this.selectedOption === 'account' && this.availableBalance < this.estimate.total) {
      PvToast.show('Insufficient credit balance', 'error');
      return;
    }

    this.currentStep = 'processing';

    try {
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (this.selectedOption === 'card') {
        // Create payment record
        await BillingService.createPayment({
          amount: this.estimate.total,
          paymentMethodId: this.selectedCardId!,
          currency: 'USD',
          type: 'invoice', // Ideally 'order' or 'estimate_conversion'
          referenceId: this.estimate.id
        });
      }

      // Success!
      this.currentStep = 'success';
      this.dispatchEvent(new CustomEvent('success', { detail: { estimate: this.estimate } }));

    } catch (e) {
      console.error('Checkout failed', e);
      PvToast.show('Checkout failed. Please try again.', 'error');
      this.currentStep = 'select';
    }
  }

  private renderPaymentMethodItem(method: PaymentMethod) {
    const isSelected = this.selectedCardId === method.id;
    const isCard = method.type === 'card';
    const label = isCard ? `Card ending in ${method.last4}` : `Bank Account ending in ${method.last4}`;
    const meta = isCard
      ? `${method.brand || 'Card'} • Exp ${method.expMonth}/${method.expYear}`
      : 'ACH Direct Debit';

    return html`
      <div 
        class="payment-option-card ${isSelected ? 'selected' : ''}"
        @click=${(e: Event) => {
        e.stopPropagation();
        this.selectedCardId = method.id;
        this.selectedOption = 'card';
      }}
        style="padding: var(--space-sm); font-size: var(--text-sm);"
      >
        <div class="radio-circle"></div>
        <div class="option-content">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 500;">${label}</span>
            ${isCard ? html`
              <svg width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            ` : ''}
          </div>
          <div style="color: var(--color-text-muted); font-size: var(--text-xs);">${meta}</div>
        </div>
      </div>
    `;
  }

  private renderSelectStep() {
    if (!this.estimate) return nothing;

    const canPayOnAccount = this.availableBalance >= this.estimate.total;
    const accountBalance = this.formatCurrency(this.availableBalance);
    const estimateTotal = this.formatCurrency(this.estimate.total);

    return html`
      <div class="modal-body">
        <div class="order-summary">
          <div class="summary-row">
            <span>Estimate Number</span>
            <span style="font-weight: 500">${this.estimate.estimateNumber}</span>
          </div>
          <div class="summary-row">
             <span>Items</span>
             <span>${this.estimate.lines?.length || 0}</span>
          </div>
          <div class="summary-row total">
            <span>Total to Pay</span>
            <span>${estimateTotal}</span>
          </div>
        </div>

        <span class="section-label">Select Payment Method</span>
        
        <div class="payment-options">
          <!-- On Account Option -->
          <div 
            class="payment-option-card ${this.selectedOption === 'account' ? 'selected' : ''} ${!canPayOnAccount ? 'disabled' : ''}"
            @click=${() => {
        if (canPayOnAccount) {
          this.selectedOption = 'account';
          this.selectedCardId = null;
        }
      }}
          >
            <div class="radio-circle"></div>
            <div class="option-content">
              <span class="option-title">Pay on Account</span>
              <span class="option-description">Use your company credit line. Approval required.</span>
              <div class="balance-info">
                 <span class="balance-label">Available Credit:</span>
                 <span class="balance-value">${accountBalance}</span>
              </div>
              ${!canPayOnAccount ? html`
                <div class="balance-error">Insufficient credit balance to cover this order.</div>
              ` : nothing}
            </div>
          </div>

          <!-- Stored Payment Option -->
          <div 
             class="payment-option-card ${this.selectedOption === 'card' ? 'selected' : ''}"
             @click=${() => this.selectedOption = 'card'}
          >
            <div class="radio-circle"></div>
            <div class="option-content">
              <span class="option-title">Pay with Card or Bank</span>
              <span class="option-description">Select from your stored payment methods.</span>
              
              ${this.selectedOption === 'card' ? html`
                 <div class="stored-payment-methods">
                   ${this.loadingMethods ? html`<div>Loading methods...</div>` :
          this.paymentMethods.length === 0 ? html`<div>No payment methods found.</div>` :
            this.paymentMethods.map(pm => this.renderPaymentMethodItem(pm))
        }
                   <button class="btn-link" style="text-align: left; padding: 0; background: none; border: none; color: var(--color-primary); cursor: pointer; font-size: var(--text-sm); margin-top: var(--space-xs);" @click=${() => PvToast.show('Manage payments in Billing settings', 'info')}>+ Add new payment method</button>
                 </div>
              ` : nothing}
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click=${this.handleClose}>Cancel</button>
        <button 
          class="btn-confirm" 
          @click=${this.handleConfirm}
          ?disabled=${(this.selectedOption === 'account' && !canPayOnAccount) || (this.selectedOption === 'card' && !this.selectedCardId)}
        >
          Confirm & Convert
        </button>
      </div>
    `;
  }

  private renderProcessingStep() {
    return html`
      <div class="modal-body" style="text-align: center; padding: var(--space-2xl);">
        <div class="loading-spinner" style="margin: 0 auto var(--space-lg);"></div>
        <h3 style="font-weight: 600; margin-bottom: var(--space-sm);">Processing Order...</h3>
        <p style="color: var(--color-text-muted);">Please do not close this window.</p>
      </div>
    `;
  }

  private renderSuccessStep() {
    return html`
      <div class="modal-body">
        <div class="success-view">
          <div class="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 style="font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-md);">Success!</h2>
          <p style="color: var(--color-text-muted); margin-bottom: var(--space-xl);">
            Estimate #${this.estimate?.estimateNumber} has been successfully converted to an order.
          </p>
          <div style="display: flex; justify-content: center; gap: var(--space-md);">
            <button class="btn-confirm" @click=${this.handleClose}>Return to Estimates</button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.open) return nothing;

    return html`
      <div class="modal-overlay" @click=${this.handleOverlayClick}>
        <div class="modal-content">
          ${this.currentStep !== 'success' ? html`
            <div class="modal-header">
              <h2 class="modal-title">Convert Estimate</h2>
              ${this.currentStep !== 'processing' ? html`
                <button class="close-btn" @click=${this.handleClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
              ` : nothing}
            </div>
          ` : nothing}

          ${this.currentStep === 'select' ? this.renderSelectStep() :
        this.currentStep === 'processing' ? this.renderProcessingStep() :
          this.renderSuccessStep()}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-checkout-modal': PvCheckoutModal;
  }
}
