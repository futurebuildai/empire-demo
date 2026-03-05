import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PvBase } from '../../../components/pv-base.js';
import { AdminInvoice } from '../../services/admin-data.service.js';

@customElement('pv-send-reminders-modal')
export class PvSendRemindersModal extends PvBase {
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
                width: 100%;
                height: 100%;
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(4px);
                z-index: 100;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity var(--transition-base);
            }

            .modal-overlay.open {
                opacity: 1;
                pointer-events: auto;
            }

            .modal-container {
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                transform: translateY(20px);
                transition: transform var(--transition-base);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .modal-overlay.open .modal-container {
                transform: translateY(0);
            }

            .modal-header {
                padding: 24px;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .modal-title {
                font-family: var(--font-heading);
                font-size: 20px;
                font-weight: 700;
                color: #1e293b;
                margin: 0;
            }

            .btn-close {
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: color 0.2s;
            }

            .btn-close:hover {
                color: #1e293b;
                background: #f1f5f9;
            }

            .modal-body {
                padding: 24px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .summary-card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 24px;
            }

            .summary-title {
                font-size: 14px;
                font-weight: 600;
                color: #334155;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .summary-stats {
                display: flex;
                gap: 24px;
            }

            .stat-item {
                display: flex;
                flex-direction: column;
            }

            .stat-label {
                font-size: 12px;
                color: #64748b;
            }

            .stat-value {
                font-size: 18px;
                font-weight: 700;
                color: #0f172a;
            }

            .preview-section {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
            }

            .preview-header {
                background: #f1f5f9;
                padding: 8px 12px;
                font-size: 12px;
                font-weight: 600;
                color: #475569;
                border-bottom: 1px solid #e2e8f0;
            }

            .preview-content {
                padding: 16px;
                font-size: 14px;
                color: #334155;
                line-height: 1.5;
            }

            .accounts-list {
                list-style: none;
                padding: 0;
                margin: 0;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                max-height: 200px;
                overflow-y: auto;
            }

            .account-item {
                padding: 12px 16px;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .account-item:last-child {
                border-bottom: none;
            }

            .account-name {
                font-weight: 500;
                color: #1e293b;
            }

            .account-amount {
                font-family: monospace;
                color: #ef4444;
            }

            .modal-footer {
                padding: 24px;
                border-top: 1px solid #e2e8f0;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                background: #f8fafc;
            }

            .btn {
                padding: 10px 20px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid transparent;
            }

            .btn-secondary {
                background: white;
                border-color: #e2e8f0;
                color: #475569;
            }

            .btn-secondary:hover {
                border-color: #cbd5e1;
                color: #1e293b;
            }

            .btn-primary {
                background: #6366f1;
                color: white;
            }

            .btn-primary:hover {
                background: #4f46e5;
            }

            .btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `
    ];

    @property({ type: Boolean }) open = false;
    @property({ type: Array }) selectedInvoices: AdminInvoice[] = [];
    @property({ type: Array }) allPastDueInvoices: AdminInvoice[] = [];

    @state() private showPreview = false;

    private close() {
        this.open = false;
        this.showPreview = false;
        this.dispatchEvent(new CustomEvent('close'));
    }

    private handleSend() {
        this.dispatchEvent(new CustomEvent('send', {
            detail: {
                invoices: this.targetInvoices
            }
        }));
        this.close();
    }

    private get isBulkMode() {
        return this.selectedInvoices.length === 0;
    }

    private get targetInvoices() {
        return this.isBulkMode ? this.allPastDueInvoices : this.selectedInvoices;
    }

    private get uniqueAccounts() {
        const accounts = new Set(this.targetInvoices.map(inv => inv.accountName));
        return Array.from(accounts);
    }

    private get totalAmount() {
        return this.targetInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
    }

    private formatCurrency(amount: number) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    render() {
        const invoices = this.targetInvoices;
        const accountCount = this.uniqueAccounts.length;

        return html`
            <div class="modal-overlay ${this.open ? 'open' : ''}" @click=${(e: Event) => {
                if (e.target === e.currentTarget) this.close();
            }}>
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            ${this.isBulkMode ? 'Send Bulk Reminders' : 'Send Selected Reminders'}
                        </h2>
                        <button class="btn-close" @click=${this.close}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="summary-card">
                            <div class="summary-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                Summary
                            </div>
                            <div class="summary-stats">
                                <div class="stat-item">
                                    <span class="stat-label">Invoices</span>
                                    <span class="stat-value">${invoices.length}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Accounts</span>
                                    <span class="stat-value">${accountCount}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Total Balance</span>
                                    <span class="stat-value" style="color: #ef4444;">${this.formatCurrency(this.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        ${!this.showPreview ? html`
                            <div style="margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 14px;">Target Accounts</div>
                            <ul class="accounts-list">
                                ${this.targetInvoices.map(inv => html`
                                    <li class="account-item">
                                        <div>
                                            <div class="account-name">${inv.accountName}</div>
                                            <div style="font-size: 12px; color: #64748b;">Invoice #${inv.internalId} • Due ${new Date(inv.dueDate).toLocaleDateString()}</div>
                                        </div>
                                        <div class="account-amount">${this.formatCurrency(inv.balance || 0)}</div>
                                    </li>
                                `)}
                            </ul>
                            
                            ${this.isBulkMode ? html`
                                <div style="margin-top: 16px; padding: 12px; background: #eff6ff; border-radius: 8px; display: flex; gap: 8px; align-items: start;">
                                    <svg style="color: #3b82f6; flex-shrink: 0;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.4;">
                                        You are about to send automated reminders to <strong>all</strong> accounts with past due invoices. Each contact will receive a personalized email with their invoice details.
                                    </p>
                                </div>
                            ` : ''}

                        ` : html`
                            <div style="margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 14px;">Notification Preview</div>
                            <div class="preview-section">
                                <div class="preview-header">Subject: Payment Reminder - Invoice #INV-XXXX</div>
                                <div class="preview-content">
                                    <p>Dear [Contact Name],</p>
                                    <p>This is a friendly reminder that invoice #INV-XXXX sent on [Date] was due on [Due Date].</p>
                                    <p><strong>Outstanding Balance: [Amount]</strong></p>
                                    <p>Please click the link below to view the invoice and make a payment.</p>
                                    <p><a href="#" style="color: #6366f1; text-decoration: none;">View Invoice</a></p>
                                    <p>Thank you,<br><strong>Tibbetts Lumber Co.</strong></p>
                                </div>
                            </div>
                        `}
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click=${this.close}>Cancel</button>
                        ${!this.showPreview ? html`
                            <button class="btn btn-secondary" @click=${() => this.showPreview = true}>Preview Email</button>
                        `: html`
                             <button class="btn btn-secondary" @click=${() => this.showPreview = false}>Back</button>
                        `}
                        <button class="btn btn-primary" ?disabled=${invoices.length === 0} @click=${this.handleSend}>
                            Send ${invoices.length} Reminders
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pv-send-reminders-modal': PvSendRemindersModal;
    }
}
