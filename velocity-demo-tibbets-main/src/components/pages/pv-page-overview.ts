/**
 * PvPageOverview - Dashboard overview page
 * Displays quick stats and account summary
 */

import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { DataService } from '../../services/data.service.js';
import { RouterService } from '../../services/router.service.js';
import { PvToast } from '../atoms/pv-toast.js';
import type { AccountData } from '../../types/index.js';
import '../../features/billing/components/pv-payment-modal.js';
import '../organisms/pv-quick-quote-modal.js';

@customElement('pv-page-overview')
export class PvPageOverview extends PvBase {
  static styles = [
    ...PvBase.styles,
    css`
      :host {
        display: block;
      }

      .section-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: var(--space-xl);
        gap: var(--space-lg);
      }

      .section-title {
        font-family: var(--font-heading);
        font-size: var(--text-3xl);
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: var(--space-xs);
      }

      .section-subtitle {
        color: var(--color-text-muted);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--space-lg);
      }

      .stat-card {
        background: var(--color-bg-alt);
        border-radius: var(--radius-lg);
        padding: var(--space-xl);
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      }

      .stat-card-balance {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
        color: white;
      }

      .stat-card-balance .stat-label,
      .stat-card-balance .stat-meta {
        color: rgba(255, 255, 255, 0.8);
      }

      .stat-card-balance .stat-value {
        color: white;
      }

      .stat-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
      }

      .stat-label {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        font-weight: 500;
      }

      .stat-value {
        font-family: var(--font-heading);
        font-size: var(--text-3xl);
        font-weight: 700;
        color: var(--color-text);
      }

      .stat-meta {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }

      .stat-action {
        margin-top: auto;
      }

      .stat-progress {
        height: 6px;
        background: var(--color-border);
        border-radius: var(--radius-full);
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        background: var(--color-accent);
        border-radius: var(--radius-full);
      }

      .stat-link {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--color-accent);
        margin-top: auto;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        text-decoration: none;
      }

      .stat-link:hover {
        color: var(--color-primary);
      }

      .btn-cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-md) var(--space-xl);
        background: var(--color-accent);
        color: white;
        font-family: var(--font-heading);
        font-weight: 700;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .btn-cta:hover {
        background: var(--color-cta-hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .btn-cta:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    `,
  ];

  @state() private accountData: AccountData | null = null;
  @state() private loading = true;
  @state() private activeOrdersCount = 0;
  @state() private pendingEstimatesCount = 0;
  @state() private openInvoicesTotal = 0;
  @state() private creditLimit = 0;
  @state() private creditAvailable = 0;

  // Payment Modal
  @state() private paymentModalOpen = false;
  @state() private paymentAmount = 0;

  // Quick Quote
  @state() private quickQuoteOpen = false;

  async connectedCallback() {
    super.connectedCallback();
    this.refreshDashboard();
  }

  private async refreshDashboard() {
    try {
      const summary = await DataService.getDashboardSummary(); // Fetches aggregated stats from /dashboard/summary
      const account = await DataService.getAccountData();

      this.accountData = account;

      // Hydrate state from backend summary
      // Note: creditAvailable is computed as creditLimit - currentBalance
      this.creditLimit = summary.creditLimit ?? 0;
      this.openInvoicesTotal = summary.currentBalance;
      this.creditAvailable = this.creditLimit - this.openInvoicesTotal;
      this.activeOrdersCount = summary.activeOrdersCount;
      this.pendingEstimatesCount = summary.pendingQuotesCount;

    } catch (e) {
      console.error('Failed to load dashboard data', e);
      PvToast.show('Failed to load dashboard summary', 'error');
    } finally {
      this.loading = false;
    }
  }

  private handlePayNow() {
    this.paymentAmount = this.openInvoicesTotal;
    this.paymentModalOpen = true;
  }

  private handlePaymentSuccess() {
    this.refreshDashboard();
    this.paymentModalOpen = false;
  }


  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  render() {
    if (this.loading) {
      return html`<p>Loading...</p>`;
    }

    const user = this.accountData?.user;
    const creditPercent = this.creditLimit > 0 ? (this.openInvoicesTotal / this.creditLimit) * 100 : 0;

    return html`
      <div class="section-header">
        <div>
          <h1 class="section-title">Welcome back, ${user?.firstName ?? 'User'}</h1>
          <p class="section-subtitle">Here's what's happening with your account</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card stat-card-balance">
          <div class="stat-content">
            <span class="stat-label">Balance Due</span>
            <span class="stat-value">${this.formatCurrency(this.openInvoicesTotal)}</span>
            <span class="stat-meta">From open invoices</span>
          </div>
          <button class="btn-cta stat-action" @click=${this.handlePayNow} ?disabled=${this.openInvoicesTotal <= 0}>Pay Now</button>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <span class="stat-label">Credit Available</span>
            <span class="stat-value">${this.formatCurrency(this.creditAvailable)}</span>
            <span class="stat-meta">of ${this.formatCurrency(this.creditLimit)} limit</span>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" style="width: ${creditPercent}%"></div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <span class="stat-label">Active Orders</span>
            <span class="stat-value">${this.activeOrdersCount}</span>
            <span class="stat-meta">${this.activeOrdersCount === 1 ? '1 order' : `${this.activeOrdersCount} orders`} in progress</span>
          </div>
          <button class="stat-link" @click=${() => RouterService.navigate('orders')}>View Orders →</button>
        </div>

        <!-- Sales Rep Contact Info -->
        <div class="summary-card">
          <div class="card-header">
            <div class="header-content">
              <h3 class="card-title">Your Sales Representative</h3>
              <p class="card-subtitle">Direct contact for orders and quotes</p>
            </div>
            <div class="header-icon" style="background: var(--color-primary-light-10); color: var(--color-primary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <div class="card-body">
            <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-bg-alt); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--color-primary);">MA</div>
              <div>
                <div style="font-weight: 600; color: var(--color-text);">Mark Anderson</div>
                <div style="font-size: var(--text-sm); color: var(--color-text-muted);">Senior Sales Specialist</div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: var(--space-xs); font-size: var(--text-sm);">
              <a href="tel:7135550123" style="display: flex; align-items: center; gap: var(--space-sm); color: var(--color-primary); text-decoration: none;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                (713) 555-0123
              </a>
              <a href="mailto:m.anderson@empireinc.com" style="display: flex; align-items: center; gap: var(--space-sm); color: var(--color-primary); text-decoration: none;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                m.anderson@empireinc.com
              </a>
            </div>
          </div>
        </div>

        <!-- Submit Purchase Order -->
        <div class="summary-card action-card primary" @click=${() => this.quickQuoteOpen = true}>
          <div class="card-header">
            <div class="header-content">
              <h3 class="card-title">Submit Purchase Order</h3>
              <p class="card-subtitle">Upload PDF or Spreadsheet</p>
            </div>
            <div class="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
          </div>
          <div class="card-body">
            <p class="action-desc">Upload your material list or PO to bypass manual entry. Our team will process it and sync it with your account.</p>
            <button class="action-button">
              Submit Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <pv-payment-modal
        .open=${this.paymentModalOpen}
        .amount=${this.paymentAmount}
        type="balance"
        @close=${() => this.paymentModalOpen = false}
        @payment-success=${this.handlePaymentSuccess}
      ></pv-payment-modal>

      <pv-quick-quote-modal
        .open=${this.quickQuoteOpen}
        @close=${() => this.quickQuoteOpen = false}
      ></pv-quick-quote-modal>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-page-overview': PvPageOverview;
  }
}
