/**
 * PvPageEstimates - Estimates page component
 * Displays estimate list with drill-down to detail view
 */

import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { DataService } from '../../services/data.service.js';
import { RouterService } from '../../services/router.service.js';
import { DocumentsService } from '../../connect/services/documents.js';
import { PvToast } from '../atoms/pv-toast.js';
import type { Estimate } from '../../types/index.js';
import { buildPaginationTokens, getPaginationBounds } from '../../utils/pagination.js';
import './pv-checkout-modal.js';

@customElement('pv-page-estimates')
export class PvPageQuotes extends PvBase {
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

      .filters-bar {
        display: flex;
        gap: var(--space-sm);
        margin-bottom: var(--space-xl);
        flex-wrap: wrap;
      }

      .filter-chip {
        padding: var(--space-sm) var(--space-lg);
        background: var(--color-bg-alt);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        font-size: var(--text-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .filter-chip:hover {
        border-color: var(--color-accent);
      }

      .filter-chip.active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }

      .estimates-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
      }

      .estimate-card {
        background: var(--color-bg-alt);
        border-radius: var(--radius-lg);
        padding: var(--space-xl);
      }

      .estimate-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-lg);
      }

      .estimate-info {
        display: flex;
        align-items: center;
        gap: var(--space-md);
      }

      .estimate-number {
        font-weight: 600;
        font-size: var(--text-lg);
      }

      .estimate-expiry, .estimate-date {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }

      .estimate-body {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-lg) 0;
        border-top: 1px solid var(--color-border);
        border-bottom: 1px solid var(--color-border);
        margin-bottom: var(--space-lg);
      }

      .estimate-products {
        display: flex;
        align-items: center;
        gap: var(--space-md);
      }

      .estimate-thumb-placeholder {
        width: 48px;
        height: 48px;
        background: var(--color-border);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted);
      }

      .estimate-details-text {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
      }

      .estimate-project-name {
        font-weight: 500;
      }

      .estimate-summary {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }

      .estimate-total {
        text-align: right;
      }

      .total-label {
        display: block;
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }

      .total-value {
        font-family: var(--font-heading);
        font-size: var(--text-2xl);
        font-weight: 700;
      }

      .estimate-actions {
        display: flex;
        gap: var(--space-sm);
      }

      /* Detail View */
      .detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-xl);
      }

      .btn-back {
        display: inline-flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-sm) var(--space-md);
        background: transparent;
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
      }

      .btn-back:hover {
        background: var(--color-primary);
        color: white;
      }

      .detail-card {
        background: var(--color-bg-alt);
        border-radius: var(--radius-lg);
        padding: var(--space-xl);
      }

      .detail-title-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: var(--space-xl);
      }

      .detail-id {
        font-family: var(--font-heading);
        font-size: var(--text-2xl);
        font-weight: 700;
        margin-bottom: var(--space-xs);
      }

      .detail-project-info {
        color: var(--color-text-muted);
      }

      .line-items-table {
        width: 100%;
        border-collapse: collapse;
      }

      .line-items-table th {
        text-align: left;
        padding: var(--space-md);
        border-bottom: 2px solid var(--color-border);
        color: var(--color-text-muted);
        font-weight: 600;
        font-size: var(--text-sm);
      }

      .line-items-table td {
        padding: var(--space-md);
        border-bottom: 1px solid var(--color-border);
        vertical-align: top;
      }

      .line-items-table .text-right {
        text-align: right;
      }

      .line-items-table .text-center {
        text-align: center;
      }

      .line-item-name {
        font-weight: 500;
        color: var(--color-text);
        margin-bottom: 2px;
      }

      .line-item-sku {
        font-size: var(--text-xs);
        color: var(--color-text-muted);
        font-family: var(--font-mono);
      }
    `,
  ];

  @state() private estimates: Estimate[] = [];
  @state() private loading = true;
  @state() private error: string | null = null;
  @state() private currentView: 'list' | 'detail' = 'list';
  @state() private selectedEstimate: Estimate | null = null;
  @state() private activeFilter = 'All';
  @state() private loadingLines = false;
  @state() private lineError: string | null = null;
  @state() private estimatesLoading = false;
  @state() private page = 1;
  @state() private pageSize = 10;
  @state() private totalCount = 0;
  @state() private checkoutModalOpen = false;

  private filters = ['All', 'Pending', 'Accepted', 'Expired'];

  async connectedCallback() {
    super.connectedCallback();
    await this.loadEstimates(true);
  }

  private async loadEstimates(initialLoad = false) {
    if (initialLoad) {
      this.loading = true;
      this.error = null;
    } else {
      this.estimatesLoading = true;
    }
    try {
      const params = RouterService.getParams();
      const jobId = params.get('jobId') ? Number(params.get('jobId')) : undefined;

      const { items, total } = await DataService.getEstimates(
        this.pageSize,
        (this.page - 1) * this.pageSize,
        undefined, // accountId
        jobId
      );
      this.estimates = items;
      this.totalCount = total;
    } catch (e) {
      console.error('Failed to load estimates', e);
      if (initialLoad) {
        this.error = 'Failed to load estimates. Please try again later.';
      }
      PvToast.show('Failed to load estimates. Please try again later.', 'error');
    } finally {
      this.loading = false;
      this.estimatesLoading = false;
    }
  }

  private async handlePageChange(page: number) {
    const totalPages = Math.ceil(this.totalCount / this.pageSize);
    if (page < 1 || page > totalPages || page === this.page) return;
    this.page = page;
    await this.loadEstimates();
  }

  private async viewEstimateDetail(estimate: Estimate) {
    this.selectedEstimate = estimate;
    this.currentView = 'detail';

    // Fetch line items if not already present
    if (!estimate.lines || estimate.lines.length === 0) {
      this.loadingLines = true;
      this.lineError = null;
      try {
        const lines = await DataService.getQuoteLines(estimate.id);
        this.selectedEstimate = { ...estimate, lines };

        // Update in list as well for caching
        const index = this.estimates.findIndex(e => e.id === estimate.id);
        if (index !== -1) {
          this.estimates[index] = this.selectedEstimate;
        }
      } catch (e) {
        console.error('Failed to load estimate lines', e);
        this.lineError = 'Failed to load item details. Please try again.';
      } finally {
        this.loadingLines = false;
      }
    }
  }

  private backToList() {
    this.currentView = 'list';
    this.selectedEstimate = null;
  }

  private openCheckoutModal(estimate: Estimate) {
    this.selectedEstimate = estimate;
    this.checkoutModalOpen = true;
  }

  private handleCheckoutSuccess() {
    if (this.selectedEstimate) {
      // Update local status
      this.selectedEstimate = { ...this.selectedEstimate, status: 'converted' };
      const index = this.estimates.findIndex(e => e.id === this.selectedEstimate!.id);
      if (index !== -1) {
        this.estimates[index] = this.selectedEstimate;
        // Trigger re-render of list
        this.estimates = [...this.estimates];
      }
      PvToast.show('Estimate converted to order successfully', 'success');
    }
    this.checkoutModalOpen = false;
  }

  private getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'status-pending',
      'accepted': 'status-accepted',
      'expired': 'status-expired',
      'converted': 'status-success',
    };
    return statusMap[status] || 'status-pending';
  }

  private getDisplayStatus(status: string): string {
    const displayMap: Record<string, string> = {
      'pending': 'Pending Approval',
      'accepted': 'Accepted',
      'expired': 'Expired',
      'converted': 'Converted',
    };
    return displayMap[status] || status;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  private async downloadEstimatePdf(estimate: Estimate) {
    try {
      PvToast.show('Preparing PDF...', 'info');
      const response = await DocumentsService.getDocumentPdf({
        type: 'quote',
        id: estimate.id,
        idType: 'internal',
      });

      const url = URL.createObjectURL(response.blob);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error('[PvPageEstimates] Failed to download estimate PDF', err);
      PvToast.show('Failed to download PDF. Please try again.', 'error');
    }
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private getProjectName(estimate: Estimate): string {
    // Backend may not provide project name directly in Quote object yet
    return estimate.projectId ? `Project #${estimate.projectId}` : estimate.estimateNumber;
  }

  private renderPageNumbers() {
    const totalPages = Math.ceil(this.totalCount / this.pageSize);
    if (totalPages <= 1) return null;

    return buildPaginationTokens(this.page, totalPages).map(token =>
      token === 'ellipsis'
        ? html`<span style="align-self: center; color: var(--color-text-muted);">...</span>`
        : html`
            <button
              class="btn btn-outline btn-sm ${this.page === token ? 'active' : ''}"
              ?disabled=${this.quotesLoading}
              @click=${() => this.handlePageChange(token)}
              style="${this.page === token ? 'background: var(--color-primary); color: white; border-color: var(--color-primary);' : ''}"
            >
              ${token}
            </button>
          `,
    );
  }

  private renderListView() {
    const { start, end } = getPaginationBounds(this.page, this.pageSize, this.totalCount);
    return html`
      ${this.quotesLoading ? html`
        <div style="margin-bottom: var(--space-md); color: var(--color-text-muted); font-size: var(--text-sm);">
          Updating quotes...
        </div>
      ` : ''}
      <div class="filters-bar">
        ${this.filters.map(filter => html`
          <button 
            class="filter-chip ${this.activeFilter === filter ? 'active' : ''}"
            @click=${() => this.activeFilter = filter}
          >${filter}</button>
        `)}
      </div>

      <div class="quotes-list">
        ${this.quotes.map(quote => html`
          <div class="quote-card">
            <div class="quote-header">
              <div class="quote-info">
                <span class="quote-number">${quote.quoteNumber}</span>
                <span class="status-badge ${this.getStatusClass(quote.status)}">${this.getDisplayStatus(quote.status)}</span>
              </div>
              <span class="quote-${quote.status === 'expired' ? 'date' : 'expiry'}">
                ${quote.status === 'expired' ? 'Expired' : quote.status === 'accepted' ? 'Accepted' : 'Expires'}: ${quote.validUntil ? this.formatDate(quote.validUntil) : 'N/A'}
              </span>
            </div>
            <div class="quote-body">
              <div class="quote-products">
                <div class="quote-thumb-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <div class="quote-details-text">
                  <span class="quote-project-name">${this.getProjectName(quote)}</span>
                  <span class="quote-summary">${quote.lines?.length || 0} products</span>
                </div>
              </div>
              <div class="stat-content">
                <span class="stat-label">Active Quotes</span>
                <span class="stat-value">${this.quotes.length}</span>
              </div>
              <div class="quote-total">
                <span class="total-label">Quote Total</span>
                <span class="total-value">${this.formatCurrency(quote.total)}</span>
              </div>
            </div>
            <div class="quote-actions">
              <button class="btn btn-outline" @click=${() => this.viewQuoteDetail(quote)}>View Details</button>
            </div>
          </div>
        `)}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-lg);">
        <div style="color: var(--color-text-muted); font-size: var(--text-sm);">
          Showing ${start}-${end} of ${this.totalCount}
        </div>
        <div style="display: flex; gap: var(--space-sm);">
          <button class="btn btn-outline btn-sm" ?disabled=${this.page === 1 || this.quotesLoading} @click=${() => this.handlePageChange(this.page - 1)}>Previous</button>
          ${this.renderPageNumbers()}
          <button class="btn btn-outline btn-sm" ?disabled=${this.page >= Math.ceil(this.totalCount / this.pageSize) || this.quotesLoading} @click=${() => this.handlePageChange(this.page + 1)}>Next</button>
        </div>
      </div>
    `;
  }

  private renderDetailView() {
    if (!this.selectedQuote) return html``;

    const quote = this.selectedQuote;
    const projectName = this.getProjectName(quote);
    const subtitle = projectName === quote.quoteNumber
      ? `Valid until ${quote.validUntil ? this.formatDate(quote.validUntil) : 'N/A'}`
      : `${projectName} • Valid until ${quote.validUntil ? this.formatDate(quote.validUntil) : 'N/A'}`;

    return html`
      <div class="detail-header">
        <button class="btn-back" @click=${this.backToList}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to List
        </button>
        <div class="quote-actions-group">
          ${quote.status === 'sent' || quote.status === 'accepted' ? html`
            <button class="btn btn-primary btn-sm" @click=${() => this.openCheckoutModal(quote)}>Accept & Convert</button>
          ` : nothing}
          <button class="btn btn-outline btn-sm" @click=${() => this.downloadQuotePdf(quote)}>Download PDF</button>
          <button class="btn btn-outline btn-sm" @click=${() => PvToast.show('Data export coming soon', 'info')}>Export Data</button>
        </div>
      </div>

      <div class="detail-card">
        <div class="detail-title-row">
          <div>
            <h2 class="detail-id">${quote.quoteNumber}</h2>
            <p class="detail-project-info">${subtitle}</p>
          </div>
          <span class="status-badge ${this.getStatusClass(quote.status)}">${this.getDisplayStatus(quote.status)}</span>
        </div>

        <p>Quote total: <strong>${this.formatCurrency(quote.total)}</strong></p>
        
        <table class="line-items-table" style="margin-top: var(--space-xl);">
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${this.loadingLines ? html`
              <tr>
                <td colspan="4" class="text-center" style="padding: var(--space-xl);">
                  <div class="loading-spinner"></div>
                  <p>Loading items...</p>
                </td>
              </tr>
            ` : this.lineError ? html`
              <tr>
                <td colspan="4" class="text-center" style="padding: var(--space-xl); color: var(--color-error);">
                  <p>${this.lineError}</p>
                  <button class="btn btn-outline btn-sm" style="margin-top: var(--space-md);" @click=${() => this.viewQuoteDetail(quote)}>Retry</button>
                </td>
              </tr>
            ` : quote.lines && quote.lines.length > 0 ? quote.lines.map(line => html`
              <tr>
                <td>
                  <div class="line-item-name">${line.name}</div>
                  <div class="line-item-sku">SKU: ${line.sku}</div>
                </td>
                <td class="text-right">${line.quantity}</td>
                <td class="text-right">${this.formatCurrency(line.unitPrice)}</td>
                <td class="text-right">${this.formatCurrency(line.lineTotal)}</td>
              </tr>
            `) : html`
              <tr>
                <td colspan="4" class="text-center" style="padding: var(--space-xl);">
                  <p>No line items found for this quote.</p>
                </td>
              </tr>
            `}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">Subtotal</td>
              <td class="text-right">${this.formatCurrency(quote.subtotal || 0)}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-right">Tax</td>
              <td class="text-right">${this.formatCurrency(quote.tax || 0)}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-right"><strong>Total</strong></td>
              <td class="text-right"><strong>${this.formatCurrency(quote.total)}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div class="detail-actions-footer" style="margin-top: var(--space-xl); padding-top: var(--space-lg); border-top: 1px solid var(--color-border); color: var(--color-text-muted); font-size: var(--text-sm);">
          <p>This quote is valid for 30 days. Contact your sales representative to convert this quote to an order.</p>
        </div>
      </div>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div style="display: flex; justify-content: center; padding: var(--space-2xl);">
          <div class="loading-spinner">Loading quotes...</div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div style="text-align: center; padding: var(--space-2xl); background: #fee2e2; border-radius: var(--radius-lg); color: #991b1b;">
          <p>${this.error}</p>
          <button class="btn btn-outline" style="margin-top: var(--space-md);" @click=${() => this.loadQuotes(true)}>Retry</button>
        </div>
      `;
    }

    return html`
      <div class="page-header">
        <div class="header-main">
          <h1 class="page-title">Quotes</h1>
          <p class="page-subtitle">View and manage your bulk quote requests</p>
        </div>
      </div>

      ${this.currentView === 'list' ? this.renderListView() : this.renderDetailView()}
      
      <pv-checkout-modal
        .open=${this.checkoutModalOpen}
        .estimate=${this.selectedEstimate}
        @close=${() => this.checkoutModalOpen = false}
        @success=${this.handleCheckoutSuccess}
      ></pv-checkout-modal>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-page-estimates': PvPageQuotes;
  }
}
