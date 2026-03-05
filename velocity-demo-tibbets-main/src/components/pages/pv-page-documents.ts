import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { DocumentService } from '../../admin/services/document.service.js'; // Reusing service
import '../organisms/pv-share-document-modal.js';

@customElement('pv-page-documents')
export class PvPageDocuments extends PvBase {
    static styles = [
        ...PvBase.styles,
        css`
            :host {
                display: block;
            }

            .page-header {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 32px;
            }

            .header-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            h1 {
                font-size: 24px;
                font-weight: 700;
                color: var(--color-text);
                margin: 0;
            }

            .subtitle {
                color: var(--color-text-muted);
                font-size: 14px;
            }

            .btn-primary {
                background: var(--color-primary);
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
                transition: opacity 0.2s;
            }

            .btn-primary:hover {
                opacity: 0.9;
            }

            .controls-bar {
                background: white;
                padding: 16px;
                border-radius: 12px;
                border: 1px solid var(--color-border);
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
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
                color: var(--color-text-muted);
                pointer-events: none;
            }

            .search-input {
                width: 100%;
                padding: 10px 12px 10px 40px;
                border: 1px solid var(--color-border);
                border-radius: 8px;
                font-size: 14px;
                outline: none;
                font-family: var(--font-body);
                box-sizing: border-box;
            }

            .search-input:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
            }

            .filter-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 16px;
                border: 1px solid var(--color-border);
                background: white;
                border-radius: 8px;
                color: var(--color-text);
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .filter-btn:hover {
                background: var(--color-bg-alt);
            }

            .grid-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }

            .doc-card {
                background: white;
                border: 1px solid var(--color-border);
                border-radius: 12px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: pointer;
            }

            .doc-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                border-color: var(--color-primary);
            }

            .doc-icon-large {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                margin-bottom: 4px;
            }

            .type-pdf { background: #fee2e2; color: #ef4444; }
            .type-image { background: #dbeafe; color: #3b82f6; }
            .type-spreadsheet { background: #dcfce7; color: #22c55e; }
            .type-default { background: #f1f5f9; color: #64748b; }

            .doc-details h3 {
                margin: 0 0 4px 0;
                font-size: 16px;
                font-weight: 600;
                color: var(--color-text);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .doc-meta {
                font-size: 13px;
                color: var(--color-text-muted);
                display: flex;
                justify-content: space-between;
            }

            .action-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 16px;
                border-top: 1px solid var(--color-border);
                margin-top: auto;
            }

            .user-info {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: var(--color-text-muted);
            }

            .avatar-small {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--color-bg-alt);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 10px;
            }

            .menu-dots {
                color: var(--color-text-muted);
                padding: 4px;
                border-radius: 4px;
            }

            .menu-dots:hover {
                background: var(--color-bg-alt);
                color: var(--color-text);
            }
        `
    ];

    @state() private documents: any[] = [];
    @state() private filteredDocuments: any[] = [];
    @state() private searchQuery = '';
    @state() private loading = true;
    @state() private shareModalOpen = false;
    @state() private selectedDocId = '';

    async connectedCallback() {
        super.connectedCallback();
        await this.loadDocuments();
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
            doc.name.toLowerCase().includes(q)
        );
    }

    openShareModal(docId: string = '') {
        this.selectedDocId = docId;
        this.shareModalOpen = true;
    }

    closeShareModal() {
        this.shareModalOpen = false;
        this.selectedDocId = '';
    }

    getIcon(type: string) {
        switch (type) {
            case 'pdf': return html`<div class="doc-icon-large type-pdf"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>`;
            case 'image': return html`<div class="doc-icon-large type-image"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>`;
            case 'spreadsheet': return html`<div class="doc-icon-large type-spreadsheet"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h8"></path><path d="M8 17h8"></path><path d="M10 9v8"></path></svg></div>`;
            default: return html`<div class="doc-icon-large type-default"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg></div>`;
        }
    }

    render() {
        return html`
            <div class="page-header">
                <div class="header-top">
                    <div>
                        <h1>Documents</h1>
                        <span class="subtitle">Manage and share your project documents</span>
                    </div>
                    <button class="btn-primary" @click=${() => this.openShareModal()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        Upload & Share
                    </button>
                </div>
            </div>

            <div class="controls-bar">
                <div class="search-container">
                    <div class="search-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search documents..."
                        .value=${this.searchQuery}
                        @input=${this.handleSearch}
                    >
                </div>
                <button class="filter-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Filter
                </button>
                <button class="filter-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                    Sort
                </button>
            </div>

            <div class="grid-container">
                ${this.loading ? html`<div>Loading...</div>` : this.filteredDocuments.map(doc => html`
                    <div class="doc-card" @click=${() => this.openShareModal(doc.id)}>
                        ${this.getIcon(doc.type)}
                        <div class="doc-details">
                            <h3>${doc.name}</h3>
                            <div class="doc-meta">
                                <span>${doc.size}</span>
                                <span>${new Date(doc.dateUploaded).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="action-row">
                            <div class="user-info">
                                <div class="avatar-small">${doc.uploadedBy.substring(0, 1).toUpperCase()}</div>
                                <span>${doc.uploadedBy}</span>
                            </div>
                            <div class="menu-dots">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                            </div>
                        </div>
                    </div>
                `)}
            </div>

            <pv-share-document-modal
                .open=${this.shareModalOpen}
                .selectedDocumentId=${this.selectedDocId}
                @close=${this.closeShareModal}
            ></pv-share-document-modal>
        `;
    }
}
