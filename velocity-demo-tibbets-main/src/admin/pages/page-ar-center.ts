import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { MOCK_PAYMENT_REQUESTS } from '../../mock/admin-mock.js';
import { AdminInvoice } from '../services/admin-data.service.js';
import { PvToast } from '../../components/atoms/pv-toast';
import '../components/organisms/pv-send-reminders-modal.js';

@customElement('admin-page-ar-center')
export class PageArCenter extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: 100%;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
        }

        h1 {
            font-family: var(--font-heading, sans-serif);
            font-size: 24px;
            font-weight: 600;
            color: #1e293b; /* slate-800 */
            margin: 0;
        }

        .btn-primary {
            background: var(--admin-primary, #6366f1);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        }

        .btn-primary:hover {
            background: var(--admin-primary-dark, #4f46e5);
            transform: translateY(-1px);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .stat-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #0f172a;
            font-family: var(--font-heading, sans-serif);
        }

        .stat-trend {
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .trend-up { color: #10b981; }
        .trend-down { color: #ef4444; }

        .table-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            overflow: hidden;
        }

        .table-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .table-title {
            font-weight: 600;
            color: #1e293b;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            text-align: left;
            padding: 16px 24px;
            font-size: 12px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
            letter-spacing: 0.05em;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
        }

        td {
            padding: 16px 24px;
            font-size: 14px;
            color: #334155;
            border-bottom: 1px solid #f1f5f9;
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background: #f8fafc;
        }

        .checkbox-cell {
            width: 40px;
            text-align: center;
            padding-right: 0;
        }

        input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #6366f1;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-paid { background: #dcfce7; color: #166534; }
        .status-open { background: #e0f2fe; color: #075985; }
        .status-overdue, .status-past-due { background: #fee2e2; color: #991b1b; }

        .btn-action {
            background: transparent;
            color: #6366f1;
            border: 1px solid #e0e7ff;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-action:hover {
            background: #e0e7ff;
            border-color: #6366f1;
        }

        .empty-state {
            padding: 48px;
            text-align: center;
            color: #64748b;
        }
    `;

    @state() private invoices: AdminInvoice[] = [];
    @state() private selectedIds: Set<number> = new Set();
    @state() private showRemindersModal = false;

    connectedCallback() {
        super.connectedCallback();
        // Load mock data
        this.invoices = [...MOCK_PAYMENT_REQUESTS].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }

    private get totalReceivables(): number {
        return this.invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
    }

    private get pastDueAmount(): number {
        return this.invoices
            .filter(inv => inv.status === 'past_due')
            .reduce((sum, inv) => sum + (inv.balance || 0), 0);
    }

    private get pastDueInvoices(): AdminInvoice[] {
        return this.invoices.filter(inv => inv.status === 'past_due');
    }

    private get selectedInvoicesList(): AdminInvoice[] {
        return this.invoices.filter(inv => this.selectedIds.has(inv.internalId));
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    private formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString();
    }

    private toggleSelection(id: number) {
        const newSelected = new Set(this.selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        this.selectedIds = newSelected;
    }

    private toggleAll() {
        if (this.selectedIds.size === this.invoices.length) {
            this.selectedIds = new Set();
        } else {
            this.selectedIds = new Set(this.invoices.map(inv => inv.internalId));
        }
    }

    private handleSendReminders() {
        this.showRemindersModal = true;
    }

    private handleModalClose() {
        this.showRemindersModal = false;
    }

    private handleConfirmSend(e: CustomEvent) {
        const sentInvoices = e.detail.invoices as AdminInvoice[];
        if (sentInvoices.length > 0) {
            PvToast.show(`Sent payment reminders to ${sentInvoices.length} customers.`, 'success');
            this.selectedIds = new Set(); // Clear selection after send
        }
    }

    private handleSingleReminder(invoice: AdminInvoice) {
        // Pre-select and open modal
        this.selectedIds = new Set([invoice.internalId]);
        this.showRemindersModal = true;
    }

    render() {
        const isAllSelected = this.invoices.length > 0 && this.selectedIds.size === this.invoices.length;

        return html`
            <div class="header">
                <h1>AR Center</h1>
                <button class="btn-primary" @click=${this.handleSendReminders}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    Send Reminders
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Receivables</div>
                    <div class="stat-value">${this.formatCurrency(this.totalReceivables)}</div>
                    <div class="stat-trend trend-up">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        <span>8.2% vs last month</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Past Due</div>
                    <div class="stat-value" style="color: #ef4444;">${this.formatCurrency(this.pastDueAmount)}</div>
                    <div class="stat-trend trend-down">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                        <span>12.5% vs last month</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">DSO (Days Sales Outstanding)</div>
                    <div class="stat-value">34</div>
                    <div class="stat-trend trend-up" style="color: #64748b;">
                        <span>Avg. 32 days</span>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <div class="table-title">Payment Requests</div>
                </div>
                ${this.invoices.length > 0 ? html`
                    <table>
                        <thead>
                            <tr>
                                <th class="checkbox-cell">
                                    <input type="checkbox" .checked=${isAllSelected} @change=${this.toggleAll}>
                                </th>
                                <th>Invoice</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Due Date</th>
                                <th>Amount</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.invoices.map(inv => html`
                                <tr>
                                    <td class="checkbox-cell">
                                        <input type="checkbox" 
                                            .checked=${this.selectedIds.has(inv.internalId)} 
                                            @change=${() => this.toggleSelection(inv.internalId)}
                                        >
                                    </td>
                                    <td><strong>#${inv.internalId}</strong><br><span style="font-size:11px;color:#94a3b8">${inv.id}</span></td>
                                    <td>${inv.accountName}</td>
                                    <td>${this.formatDate(inv.date)}</td>
                                    <td>${this.formatDate(inv.dueDate)}</td>
                                    <td>${this.formatCurrency(inv.total)}</td>
                                    <td style="font-weight:600;">${this.formatCurrency(inv.balance || 0)}</td>
                                    <td>
                                        <span class="status-badge status-${inv.status.toLowerCase().replace(' ', '-')}">${inv.status}</span>
                                    </td>
                                    <td>
                                        ${(inv.status === 'Past Due' || inv.status === 'past_due') ? html`
                                            <button class="btn-action" @click=${() => this.handleSingleReminder(inv)}>
                                                Remind
                                            </button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                ` : html`
                    <div class="empty-state">No payment requests found.</div>
                `}
            </div>

            <pv-send-reminders-modal
                .open=${this.showRemindersModal}
                .selectedInvoices=${this.selectedInvoicesList}
                .allPastDueInvoices=${this.pastDueInvoices}
                @close=${this.handleModalClose}
                @send=${this.handleConfirmSend}
            ></pv-send-reminders-modal>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'admin-page-ar-center': PageArCenter;
    }
}
