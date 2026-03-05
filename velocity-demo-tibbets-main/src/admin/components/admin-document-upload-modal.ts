import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface AccountOption {
    id: number;
    name: string;
}

@customElement('admin-document-upload-modal')
export class AdminDocumentUploadModal extends LitElement {
    static styles = css`
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
            animation: fade-in 0.2s ease-out;
        }

        .modal {
            background: white;
            padding: 32px;
            border-radius: 12px;
            width: 500px;
            max-width: 90%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: slide-up 0.2s ease-out;
        }

        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .modal-header {
            margin-bottom: 24px;
        }

        h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            font-family: var(--font-heading, 'Space Grotesk', sans-serif);
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #64748b;
        }

        .form-control {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-family: var(--font-body, 'Inter', sans-serif);
            font-size: 14px;
            color: #1e293b;
            box-sizing: border-box;
            transition: all 0.15s ease;
        }

        .form-control:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        textarea.form-control {
            resize: vertical;
            min-height: 80px;
        }

        .file-drop-area {
            border: 2px dashed #e2e8f0;
            border-radius: 8px;
            padding: 32px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            background: #f8fafc;
        }

        .file-drop-area:hover, .file-drop-area.drag-over {
            border-color: #6366f1;
            background: #eef2ff;
        }

        .file-icon {
            color: #6366f1;
            margin-bottom: 12px;
        }

        .file-name {
            font-size: 14px;
            font-weight: 500;
            color: #1e293b;
            margin-top: 8px;
        }

        .file-hint {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 4px;
        }

        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 32px;
        }

        button {
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.15s ease;
            font-family: var(--font-body, 'Inter', sans-serif);
        }

        .btn-secondary {
            background: white;
            border: 1px solid #e2e8f0;
            color: #64748b;
        }

        .btn-secondary:hover {
            background: #f1f5f9;
            color: #475569;
        }

        .btn-primary {
            background: #6366f1;
            border: none;
            color: white;
        }

        .btn-primary:hover {
            background: #4f46e5;
        }

        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;

    @property({ type: Boolean }) isOpen = false;
    @property({ type: Array }) accounts: AccountOption[] = [];

    @state() private selectedFile: File | null = null;
    @state() private selectedAccountId = '';
    @state() private memo = '';
    @state() private isDragging = false;

    private handleDragOver(e: DragEvent) {
        e.preventDefault();
        this.isDragging = true;
    }

    private handleDragLeave(e: DragEvent) {
        e.preventDefault();
        this.isDragging = false;
    }

    private handleDrop(e: DragEvent) {
        e.preventDefault();
        this.isDragging = false;

        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            this.selectedFile = e.dataTransfer.files[0];
        }
    }

    private handleFileSelect(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        }
    }

    private triggerFileSelect() {
        const input = this.shadowRoot?.getElementById('file-input') as HTMLInputElement;
        input?.click();
    }

    private handleClose() {
        this.resetForm();
        this.dispatchEvent(new CustomEvent('close-modal'));
    }

    private handleUpload() {
        if (!this.selectedFile || !this.selectedAccountId) return;

        this.dispatchEvent(new CustomEvent('upload-document', {
            detail: {
                file: this.selectedFile,
                accountId: this.selectedAccountId,
                memo: this.memo
            }
        }));
        this.handleClose();
    }

    private resetForm() {
        this.selectedFile = null;
        this.selectedAccountId = '';
        this.memo = '';
    }

    render() {
        if (!this.isOpen) return null;

        return html`
            <div class="modal-overlay" @click=${this.handleClose}>
                <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h2>Upload Document</h2>
                    </div>

                    <div class="form-group">
                        <label>Select Account</label>
                        <select 
                            class="form-control"
                            .value=${this.selectedAccountId}
                            @change=${(e: Event) => this.selectedAccountId = (e.target as HTMLSelectElement).value}
                        >
                            <option value="">Choose a customer...</option>
                            ${this.accounts.map(acc => html`
                                <option value=${acc.id}>${acc.name}</option>
                            `)}
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Document</label>
                        <input type="file" id="file-input" style="display: none" @change=${this.handleFileSelect}>
                        <div 
                            class="file-drop-area ${this.isDragging ? 'drag-over' : ''}"
                            @dragover=${this.handleDragOver}
                            @dragleave=${this.handleDragLeave}
                            @drop=${this.handleDrop}
                            @click=${this.triggerFileSelect}
                        >
                            ${this.selectedFile ? html`
                                <div style="color: #6366f1; font-weight: 500;">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 8px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    <div class="file-name">${this.selectedFile.name}</div>
                                    <div class="file-hint">${(this.selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                            ` : html`
                                <div class="file-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                </div>
                                <div style="font-weight: 500; color: #1e293b;">Click to upload or drag and drop</div>
                                <div class="file-hint">PDF, PNG, JPG or XLSX (max 10MB)</div>
                            `}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Memo / Notes (Optional)</label>
                        <textarea 
                            class="form-control" 
                            placeholder="Add a note about this document..."
                            .value=${this.memo}
                            @input=${(e: Event) => this.memo = (e.target as HTMLTextAreaElement).value}
                        ></textarea>
                    </div>

                    <div class="modal-actions">
                        <button class="btn-secondary" @click=${this.handleClose}>Cancel</button>
                        <button 
                            class="btn-primary" 
                            @click=${this.handleUpload}
                            ?disabled=${!this.selectedFile || !this.selectedAccountId}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}
