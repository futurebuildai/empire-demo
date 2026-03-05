import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { PvToast } from '../atoms/pv-toast.js';
import { DocumentService } from '../../admin/services/document.service.js'; // Reusing mock service for now

@customElement('pv-share-document-modal')
export class PvShareDocumentModal extends PvBase {
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
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(4px);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
            }

            .modal-overlay.open {
                opacity: 1;
                pointer-events: auto;
            }

            .modal-container {
                background: white;
                width: 100%;
                max-width: 500px;
                border-radius: 16px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                transform: scale(0.95);
                transition: transform 0.2s ease;
                overflow: hidden;
            }

            .modal-overlay.open .modal-container {
                transform: scale(1);
            }

            .modal-header {
                padding: 20px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #e2e8f0;
            }

            h2 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #0f172a;
            }

            .close-btn {
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
            }

            .close-btn:hover {
                color: #0f172a;
                background: #f1f5f9;
            }

            .modal-body {
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            label {
                font-size: 14px;
                font-weight: 500;
                color: #334155;
            }

            .select-wrapper {
                position: relative;
            }

            select, input, textarea {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 14px;
                color: #0f172a;
                font-family: var(--font-body);
                outline: none;
                box-sizing: border-box;
                transition: border-color 0.2s;
            }

            select:focus, input:focus, textarea:focus {
                border-color: #6366f1;
                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
            }
            
            textarea {
                resize: vertical;
                min-height: 80px;
            }

            .file-preview {
                display: flex;
                align-items: center;
                padding: 10px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                background: #f8fafc;
                gap: 12px;
            }
            
            .helper-text {
                font-size: 12px;
                color: #64748b;
                margin-top: -4px;
            }

            .modal-footer {
                padding: 20px 24px;
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .btn {
                padding: 10px 16px;
                border-radius: 8px;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .btn-secondary {
                background: white;
                border: 1px solid #cbd5e1;
                color: #475569;
            }

            .btn-secondary:hover {
                background: #f1f5f9;
                border-color: #94a3b8;
            }

            .btn-primary {
                background: #6366f1;
                border: 1px solid #6366f1;
                color: white;
            }

            .btn-primary:hover {
                background: #4f46e5;
                border-color: #4f46e5;
            }
        `
    ];

    @property({ type: Boolean }) open = false;
    @property({ type: String }) selectedDocumentId = '';

    @state() private documents: any[] = [];
    @state() private message = '';
    @state() private recipient = '';

    async connectedCallback() {
        super.connectedCallback();
        // Load documents for the dropdown
        try {
            this.documents = await DocumentService.getDocuments();
        } catch (e) {
            console.error('Failed to load docs for modal', e);
        }
    }

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has('open') && this.open) {
            // Reset fields on open if needed, or keep previous state
        }
    }

    private handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    private handleCopyLink() {
        // Mock copy link
        navigator.clipboard.writeText(`https://portal.empireinc.com/docs/${this.selectedDocumentId || '123'}`);
        PvToast.show('Link copied to clipboard', 'success');
    }

    private handleShare() {
        if (!this.selectedDocumentId && this.documents.length > 0) {
            // Default to first if not selected? Or require selection
            this.selectedDocumentId = this.documents[0].id;
        }

        // Emit share event
        this.dispatchEvent(new CustomEvent('share', {
            detail: {
                documentId: this.selectedDocumentId,
                recipient: this.recipient,
                message: this.message
            }
        }));

        PvToast.show('Document shared successfully', 'success');
        this.handleClose();
    }

    render() {
        const selectedDoc = this.documents.find(d => d.id === this.selectedDocumentId) || (this.documents.length > 0 ? this.documents[0] : null);

        return html`
            <div class="modal-overlay ${this.open ? 'open' : ''}" @click=${(e: Event) => {
                if ((e.target as Element).classList.contains('modal-overlay')) this.handleClose();
            }}>
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>Share Document</h2>
                        <button class="close-btn" @click=${this.handleClose}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Select Document</label>
                            <div class="select-wrapper">
                                <select 
                                    @change=${(e: Event) => this.selectedDocumentId = (e.target as HTMLSelectElement).value}
                                    .value=${this.selectedDocumentId}
                                >
                                    ${this.documents.map(doc => html`
                                        <option value="${doc.id}">${doc.name} (${doc.size})</option>
                                    `)}
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Attention</label>
                            <input 
                                type="text" 
                                placeholder="E.g. Sales Rep, Accounting Dept"
                                .value=${this.recipient}
                                @input=${(e: Event) => this.recipient = (e.target as HTMLInputElement).value}
                            >
                        </div>

                        <div class="form-group">
                            <label>Message <span style="font-weight: 400; color: #94a3b8">(Optional)</span></label>
                            <textarea 
                                placeholder="Add a personal note to go with this document..."
                                .value=${this.message}
                                @input=${(e: Event) => this.message = (e.target as HTMLTextAreaElement).value}
                            ></textarea>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click=${this.handleCopyLink}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            Copy Link
                        </button>
                        <div style="display: flex; gap: 12px;">
                            <button class="btn btn-secondary" style="border: none; background: none;" @click=${this.handleClose}>Cancel</button>
                            <button class="btn btn-primary" @click=${this.handleShare}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                Share via Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
