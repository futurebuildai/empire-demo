import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { DocumentService, Document } from '../services/document.service.js';
import { AdminDataService, AdminAccount } from '../services/admin-data.service.js';
import '../components/admin-document-upload-modal.js';

@customElement('admin-page-document-center')
export class AdminPageDocumentCenter extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        h2 {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
            font-family: var(--font-heading, 'Space Grotesk', sans-serif);
        }

        .btn-upload {
            background-color: #6366f1;
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
            font-family: var(--font-body, 'Inter', sans-serif);
            transition: background-color 0.2s;
        }

        .btn-upload:hover {
            background-color: #4f46e5;
        }

        .controls-bar {
            background: white;
            padding: 16px;
            border-radius: 12px;
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            align-items: center;
        }

        .search-container {
            flex: 1;
            position: relative;
        }

        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            pointer-events: none;
        }

        .search-input {
            width: 100%;
            padding: 10px 12px 10px 40px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            color: #1e293b;
            font-family: var(--font-body, 'Inter', sans-serif);
            box-sizing: border-box;
        }

        .search-input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .control-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border: 1px solid #e2e8f0;
            background: white;
            border-radius: 8px;
            color: #475569;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            font-family: var(--font-body, 'Inter', sans-serif);
            transition: all 0.2s;
        }

        .control-btn:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
        }

        .table-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            text-align: left;
            padding: 16px 24px;
            background: #f8fafc;
            color: #64748b;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #e2e8f0;
        }

        td {
            padding: 16px 24px;
            border-bottom: 1px solid #f1f5f9;
            color: #1e293b;
            font-size: 14px;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .doc-name-cell {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .doc-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        
        .type-pdf { background: #fee2e2; color: #ef4444; }
        .type-image { background: #dbeafe; color: #3b82f6; }
        .type-spreadsheet { background: #dcfce7; color: #22c55e; }
        .type-default { background: #f1f5f9; color: #64748b; }

        .doc-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .doc-title {
            font-weight: 500;
            color: #0f172a;
        }

        .doc-meta {
            font-size: 12px;
            color: #94a3b8;
        }

        .user-cell {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .user-avatar {
            width: 24px;
            height: 24px;
            background: #e2e8f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #64748b;
            font-weight: 600;
        }

        .status-pill {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            background: #f1f5f9;
            color: #475569;
        }

        .empty-state {
            padding: 48px;
            text-align: center;
            color: #64748b;
        }
        .toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 2000;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: toast-in 200ms ease-out;
        }
        .toast-success { background: #059669; color: white; }
        .toast-error { background: #dc2626; color: white; }
        .toast-info { background: #0f172a; color: white; }
        @keyframes toast-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    `;

    @state() private documents: Document[] = [];
    @state() private filteredDocuments: Document[] = [];
    @state() private searchQuery = '';
    @state() private loading = true;
    @state() private showUploadModal = false;
    @state() private accounts: { id: number; name: string }[] = [];

    @state() private toastMessage = '';
    @state() private toastType: 'success' | 'error' | 'info' = 'info';
    private toastTimer?: ReturnType<typeof setTimeout>;

    private showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
        clearTimeout(this.toastTimer);
        this.toastMessage = message;
        this.toastType = type;
        this.toastTimer = setTimeout(() => { this.toastMessage = ''; }, 3000);
    }

    async connectedCallback() {
        super.connectedCallback();
        await Promise.all([
            this.loadDocuments(),
            this.loadAccounts()
        ]);
    }

    async loadAccounts() {
        try {
            const result = await AdminDataService.getAccounts(100); // Get first 100 accounts for dropdown
            this.accounts = result.items.map(a => ({ id: a.id, name: a.name }));
        } catch (err) {
            console.error('Failed to load accounts', err);
            this.showToast('Failed to load account list', 'error');
        }
    }

    async loadDocuments() {
        this.loading = true;
        try {
            const docs = await DocumentService.getDocuments();
            this.documents = docs;
            this.filterDocuments();
        } catch (err) {
            console.error('Failed to load documents', err);
        } finally {
            this.loading = false;
        }
    }

    handleSearch(e: Event) {
        this.searchQuery = (e.target as HTMLInputElement).value;
        this.filterDocuments();
    }

    filterDocuments() {
        if (!this.searchQuery) {
            this.filteredDocuments = this.documents;
            return;
        }

        const q = this.searchQuery.toLowerCase();
        this.filteredDocuments = this.documents.filter(doc =>
            doc.name.toLowerCase().includes(q) ||
            doc.customerName.toLowerCase().includes(q) ||
            doc.accountNumber.toLowerCase().includes(q)
        );
    }

    getIconForType(type: string) {
        switch (type) {
            case 'pdf': return html`<div class="doc-icon type-pdf"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>`;
            case 'image': return html`<div class="doc-icon type-image"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>`;
            case 'spreadsheet': return html`<div class="doc-icon type-spreadsheet"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h8"></path><path d="M8 17h8"></path><path d="M10 9v8"></path></svg></div>`;
            default: return html`<div class="doc-icon type-default"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg></div>`;
        }
    }

    private handleUploadClick() {
        this.showUploadModal = true;
    }

    private handleUploadSubmit(e: CustomEvent) {
        const { file, accountId, memo } = e.detail;
        const account = this.accounts.find(a => a.id == accountId);

        this.showToast(`Uploading ${file.name} for ${account?.name}...`, 'info');

        // Simulate upload delay
        setTimeout(() => {
            if (memo) {
                this.showToast(`Upload complete! Memo: "${memo}"`, 'success');
            } else {
                this.showToast('Upload successful!', 'success');
            }
        }, 1500);
    }

    private handleView(doc: Document) {
        this.showToast(`Downloading ${doc.name}...`, 'success');

        // Simulate file download
        const dummyContent = `Content for ${doc.name}\nGenerated by Velocity Admin Portal`;
        const blob = new Blob([dummyContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    render() {
        return html`
            <div class="page-header">
                <h2>Document Center</h2>
                <button class="btn-upload" @click=${this.handleUploadClick}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Upload Document
                </button>
            </div>

            <div class="controls-bar">
                <div class="search-container">
                    <div class="search-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search by filename, customer name, or account #"
                        .value=${this.searchQuery}
                        @input=${this.handleSearch}
                    >
                </div>
                <button class="control-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Filter
                </button>
                <button class="control-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                    Sort
                </button>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Document Name</th>
                            <th>Customer/Account</th>
                            <th>Date Uploaded</th>
                            <th>Uploaded By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.loading ? html`
                            <tr><td colspan="5" style="text-align:center; padding: 40px;">Loading documents...</td></tr>
                        ` : this.filteredDocuments.length === 0 ? html`
                            <tr><td colspan="5" class="empty-state">No documents found matching your search.</td></tr>
                        ` : this.filteredDocuments.map(doc => html`
                            <tr>
                                <td>
                                    <div class="doc-name-cell">
                                        ${this.getIconForType(doc.type)}
                                        <div class="doc-info">
                                            <div class="doc-title">${doc.name}</div>
                                            <div class="doc-meta">${doc.size}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="doc-info">
                                        <div class="doc-title">${doc.customerName}</div>
                                        <div class="doc-meta">${doc.accountNumber}</div>
                                    </div>
                                </td>
                                <td>
                                    <div style="color: #475569; font-weight: 500;">
                                        ${new Date(doc.dateUploaded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </td>
                                <td>
                                    <div class="user-cell">
                                        <div class="user-avatar">
                                            ${doc.uploadedBy.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div style="color: #475569; font-weight: 500;">${doc.uploadedBy}</div>
                                    </div>
                                </td>
                                <td>
                                    <button class="control-btn" style="padding: 6px 12px; font-size: 12px;" @click=${() => this.handleView(doc)}>View/Download</button>
                                </td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 24px; color: #94a3b8; font-size: 13px; text-align: center;">
                Showing ${this.filteredDocuments.length} of ${this.documents.length} documents
            </div>

            ${this.toastMessage ? html`
                <div class="toast toast-${this.toastType}" role="status" aria-live="polite">${this.toastMessage}</div>
            ` : ''}

            <admin-document-upload-modal
                .isOpen=${this.showUploadModal}
                .accounts=${this.accounts}
                @close-modal=${() => this.showUploadModal = false}
                @upload-document=${this.handleUploadSubmit}
            ></admin-document-upload-modal>
        `;
    }
}
