import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AdminDataService } from '../services/admin-data.service.js';
import type { AdminQuote } from '../services/admin-data.service.js';

interface RouterLocation {
    params: Record<string, string>;
}

@customElement('admin-page-estimate-details')
export class PageEstimateDetails extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 2rem;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        h1 {
            font-size: 1.875rem;
            font-weight: 600;
            color: var(--color-text, #0f172a);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-family: var(--font-heading, 'Space Grotesk', sans-serif);
        }

        .back-btn {
            font-size: 1rem;
            color: var(--color-text-muted, #6b7280);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            font-family: var(--font-body, 'Inter', sans-serif);
        }

        .back-btn:hover {
            color: var(--color-primary, #0f172a);
        }

        .meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            background: #ffffff;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-bottom: 2rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .meta-item label {
            display: block;
            font-size: 0.8125rem;
            color: var(--color-text-muted, #6b7280);
            margin-bottom: 0.25rem;
            font-weight: 500;
        }

        .meta-item .value {
            font-size: 1.125rem;
            font-weight: 500;
            color: var(--color-text, #0f172a);
        }

        .status-badge {
            display: inline-flex;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: capitalize;
        }

        .status-Draft { background: #f3f4f6; color: #4b5563; }
        .status-Sent { background: #dbeafe; color: #1e40af; }
        .status-Expired { background: #fee2e2; color: #991b1b; }
        .status-Accepted { background: #dcfce7; color: #166534; }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .data-table th,
        .data-table td {
            text-align: left;
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
        }

        .data-table th {
            background: #f9fafb;
            font-weight: 600;
            color: var(--color-text-light, #374151);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .data-table td {
            color: var(--color-text, #334155);
            font-size: 0.9375rem;
        }

        .text-right { text-align: right !important; }
        .font-mono { font-family: 'Space Mono', monospace;  }
        .font-medium { font-weight: 500; }
        .text-muted { color: var(--color-text-muted, #6b7280); }
    `;

    @state() private estimate: AdminQuote | null = null;
    @state() private loading = true;
    location?: RouterLocation;

    async onBeforeEnter(location: RouterLocation) {
        this.location = location;
        const id = location.params.id;
        if (id) {
            await this.fetchEstimate(id);
        }
    }

    private async fetchEstimate(id: string) {
        this.loading = true;
        try {
            // In a real app, we'd have a getQuote(id) method. 
            // For now, we'll fetch all and find it, or add a mock method.
            // Let's assume we added getQuote implementation to AdminDataService or use a helper.
            // Since we mocked getQuotes(accountId), we can fetch that if we knew the account, 
            // but here we just have ID. We should update AdminDataService to support getQuote(id).
            this.estimate = await AdminDataService.getQuote(id);
        } catch (e) {
            console.error('Failed to load estimate', e);
        } finally {
            this.loading = false;
        }
    }

    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date);
        } catch {
            return dateStr;
        }
    }

    render() {
        if (this.loading) {
            return html`<div style="padding: 2rem;">Loading estimate details...</div>`;
        }

        if (!this.estimate) {
            return html`
                <div style="padding: 2rem;">
                    <a href="javascript:history.back()" class="back-btn">← Back</a>
                    <div style="margin-top: 2rem; color: var(--color-text-muted);">Estimate not found.</div>
                </div>
            `;
        }

        const e = this.estimate;

        return html`
            <a href="javascript:history.back()" class="back-btn">← Back</a>
            
            <div class="header">
                <div>
                    <h1 style="margin-bottom: 0.5rem;">
                        Estimate #${e.id}
                        <span class="status-badge status-${e.status}">${e.status}</span>
                    </h1>
                    <div style="color: var(--color-text-muted); font-size: 1.1rem;">${e.name}</div>
                </div>
                
                <div>
                     <!-- Actions could go here -->
                </div>
            </div>

            <div class="meta-grid">
                <div class="meta-item">
                    <label>Account</label>
                    <div class="value">
                        ${e.accountName ? html`<a href="/admin/accounts/${e.accountId}" style="text-decoration: none; color: #2563eb;">${e.accountName}</a>` : 'N/A'}
                    </div>
                </div>
                <div class="meta-item">
                    <label>Date Issued</label>
                    <div class="value">${this.formatDate(e.date)}</div>
                </div>
                <div class="meta-item">
                    <label>Expiry Date</label>
                    <div class="value">${this.formatDate(e.expiryDate)}</div>
                </div>
                <div class="meta-item">
                    <label>Total Value</label>
                    <div class="value font-mono">$${e.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
            </div>

            <h3 style="margin-bottom: 1rem; color: var(--color-text, #0f172a); font-family: var(--font-heading, 'Space Grotesk');">Line Items</h3>
            <div style="padding: 2rem; background: #f8fafc; border-radius: 8px; text-align: center; color: var(--color-text-muted);">
                Line item details not available in this preview.
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'admin-page-estimate-details': PageEstimateDetails;
    }
}
