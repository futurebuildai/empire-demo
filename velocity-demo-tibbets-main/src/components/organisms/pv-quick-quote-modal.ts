/**
 * PvQuickQuoteModal - Quick Quote Wizard
 * Allows users to upload material lists or manually enter items to request a quote.
 */

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { PvToast } from '../atoms/pv-toast';

type QuoteStep = 'selection' | 'upload' | 'manual' | 'fulfillment' | 'success';
type FulfillmentMethod = 'delivery' | 'willcall';
type EntryMethod = 'upload' | 'manual';

@customElement('pv-quick-quote-modal')
export class PvQuickQuoteModal extends PvBase {
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
        background: var(--color-bg);
        border-radius: var(--radius-xl);
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-xl);
        transform: translateY(20px);
        transition: transform var(--transition-base);
        display: flex;
        flex-direction: column;
      }

      .modal-overlay.open .modal-container {
        transform: translateY(0);
      }

      .modal-header {
        padding: var(--space-xl);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .modal-title {
        font-family: var(--font-heading);
        font-size: var(--text-2xl);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
      }

      .btn-close {
        background: none;
        border: none;
        color: var(--color-text-muted);
        cursor: pointer;
        padding: var(--space-xs);
        border-radius: var(--radius-md);
        transition: color var(--transition-fast);
      }

      .btn-close:hover {
        color: var(--color-text);
        background: var(--color-bg-alt);
      }

      .modal-body {
        padding: var(--space-xl);
        flex: 1;
      }

      /* Step 0: Selection */
      .selection-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-xl);
      }

      .selection-card {
        background: var(--color-bg-alt);
        border: 2px solid transparent;
        border-radius: var(--radius-lg);
        padding: var(--space-2xl) var(--space-xl);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        transition: all var(--transition-base);
        gap: var(--space-md);
      }

      .selection-card:hover {
        border-color: var(--color-accent);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }

      .selection-icon {
        width: 48px;
        height: 48px;
        color: var(--color-accent);
      }

      .selection-title {
        font-family: var(--font-heading);
        font-size: var(--text-xl);
        font-weight: 700;
        color: var(--color-text);
      }

      .selection-desc {
        color: var(--color-text-muted);
        font-size: var(--text-sm);
        line-height: 1.5;
      }

      /* Step 1: Upload Layout */
      .upload-container {
        max-width: 600px;
        margin: 0 auto;
      }

      .upload-zone {
        border: 2px dashed var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-xl);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 300px;
        background: var(--color-bg-alt);
        transition: border-color var(--transition-base);
        cursor: pointer;
      }

      .upload-zone:hover, .upload-zone.drag-active {
        border-color: var(--color-accent);
        background: rgba(249, 115, 22, 0.05);
      }

      .upload-icon {
        width: 48px;
        height: 48px;
        color: var(--color-accent);
        margin-bottom: var(--space-md);
      }

      .upload-text {
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: var(--space-xs);
      }

      .upload-subtext {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }
      
      /* Step 1: Manual Layout */
      .manual-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      }
      
      .manual-label {
        font-weight: 600;
        color: var(--color-text);
      }

      .manual-textarea {
        width: 100%;
        box-sizing: border-box;
        flex: 1;
        min-height: 300px;
        padding: var(--space-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-family: var(--font-body);
        font-size: var(--text-base);
        resize: vertical;
      }
      
      .manual-textarea:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }
      
      .feature-list {
        margin-bottom: var(--space-xl);
      }
      
      .feature-item {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        margin-bottom: var(--space-sm);
        color: var(--color-text-light);
        font-size: var(--text-sm);
      }
      
      .feature-icon {
         color: var(--color-success);
      }

      /* Step 2: Fulfillment Layout */
      .fulfillment-form {
        max-width: 500px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }

      .form-label {
        font-weight: 600;
        color: var(--color-text);
        font-size: var(--text-sm);
      }

      .form-input, .form-select {
        padding: var(--space-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--text-base);
      }

      /* Step 3: Success Layout */
      .success-state {
        text-align: center;
        padding: var(--space-2xl) 0;
      }

      .success-icon {
        width: 64px;
        height: 64px;
        color: var(--color-success);
        margin-bottom: var(--space-md);
      }

      .success-title {
        font-family: var(--font-heading);
        font-size: var(--text-2xl);
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: var(--space-sm);
      }

      .success-message {
        color: var(--color-text-light);
        max-width: 400px;
        margin: 0 auto;
      }

      .modal-footer {
        padding: var(--space-xl);
        border-top: 1px solid var(--color-border);
        display: flex;
        justify-content: flex-end;
        gap: var(--space-md);
      }

      .btn {
        padding: var(--space-md) var(--space-xl);
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
        border: none;
      }

      .btn-secondary {
        background: var(--color-bg-alt);
        color: var(--color-text);
        border: 1px solid var(--color-border);
      }

      .btn-secondary:hover {
        background: var(--color-border);
      }

      .btn-primary {
        background: var(--color-cta);
        color: white;
      }

      .btn-primary:hover {
        background: var(--color-cta-hover);
      }

      @media (max-width: 768px) {
        .selection-grid {
            grid-template-columns: 1fr;
        }
      }
    `,
  ];

  @property({ type: Boolean }) open = false;

  @state() private currentStep: QuoteStep = 'selection';
  @state() private entryMethod: EntryMethod = 'upload';
  @state() private manualText = '';
  @state() private fulfillmentDate = '';
  @state() private fulfillmentMethod: FulfillmentMethod = 'delivery';
  @state() private dragActive = false;
  @state() private uploadedFiles: File[] = [];

  private reset() {
    this.currentStep = 'selection';
    this.entryMethod = 'upload';
    this.manualText = '';
    this.fulfillmentDate = '';
    this.fulfillmentMethod = 'delivery';
    this.uploadedFiles = [];
    this.dragActive = false;
  }

  private close() {
    this.open = false;
    setTimeout(() => this.reset(), 300); // Reset after animation
    this.dispatchEvent(new CustomEvent('close'));
  }

  private setStep(step: QuoteStep) {
    this.currentStep = step;
  }

  private handleSelection(method: EntryMethod) {
    this.entryMethod = method;
    this.currentStep = method;
  }

  private handleBack() {
    if (this.currentStep === 'fulfillment') {
      this.currentStep = this.entryMethod;
    } else if (this.currentStep === 'upload' || this.currentStep === 'manual') {
      this.currentStep = 'selection';
    } else {
      this.close();
    }
  }

  private handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dragActive = true;
  }

  private handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dragActive = false;
  }

  private handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  private handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dragActive = false;

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      this.uploadedFiles = Array.from(e.dataTransfer.files);
      PvToast.show(`Uploaded ${this.uploadedFiles.length} file(s)`, 'success');
    }
  }

  private handleFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFiles = Array.from(input.files);
      PvToast.show(`Uploaded ${this.uploadedFiles.length} file(s)`, 'success');
    }
  }

  private handleProcessList() {
    if (this.currentStep === 'upload') {
      if (this.uploadedFiles.length === 0) {
        PvToast.show('Please upload a file to proceed', 'warning');
        return;
      }
    } else if (this.currentStep === 'manual') {
      if (!this.manualText.trim()) {
        PvToast.show('Please enter items to proceed', 'warning');
        return;
      }
    }

    this.currentStep = 'fulfillment';
  }

  private handleSubmit() {
    if (!this.fulfillmentDate) {
      PvToast.show('Please select a desired fulfillment date', 'warning');
      return;
    }

    // In a real app, this would submit to backend
    this.currentStep = 'success';
  }

  render() {
    return html`
      <div class="modal-overlay ${this.open ? 'open' : ''}" @click=${(e: Event) => {
        if (e.target === e.currentTarget) this.close();
      }}>
        <div class="modal-container">
            ${this.renderHeader()}
            <div class="modal-body">
                ${this.renderStepContent()}
            </div>
            ${this.renderFooter()}
        </div>
      </div>
    `;
  }

  private renderHeader() {
    let title = 'Start a New Quote';
    if (this.currentStep === 'fulfillment') title = 'Fulfillment Details';
    if (this.currentStep === 'success') title = 'Request Submitted';

    return html`
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="btn-close" @click=${this.close}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;
  }

  private renderStepContent() {
    switch (this.currentStep) {
      case 'selection':
        return this.renderSelectionStep();
      case 'upload':
        return this.renderUploadStep();
      case 'manual':
        return this.renderManualStep();
      case 'fulfillment':
        return this.renderFulfillmentStep();
      case 'success':
        return this.renderSuccessStep();
    }
  }

  private renderSelectionStep() {
    return html`
        <div class="selection-grid">
            <div class="selection-card" @click=${() => this.handleSelection('upload')}>
                <svg class="selection-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div>
                    <div class="selection-title">Upload Material List</div>
                    <div class="selection-desc">Drag & drop images, PDFs, or Excel files. AI-powered SKU matching.</div>
                </div>
            </div>
            
            <div class="selection-card" @click=${() => this.handleSelection('manual')}>
                <svg class="selection-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <div>
                    <div class="selection-title">Manual Entry</div>
                    <div class="selection-desc">Type or paste your list of items directly. Perfect for quick requests.</div>
                </div>
            </div>
        </div>
    `;
  }

  private renderUploadStep() {
    return html`
        <div class="upload-container">
            <div class="feature-list">
                <div class="feature-item">
                    <span class="feature-icon">✓</span> AI-powered handwriting recognition for images
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✓</span> Instant SKU matching for PDFs and Spreadsheets
                </div>
            </div>

            <div 
                class="upload-zone ${this.dragActive ? 'drag-active' : ''}"
                @dragenter=${this.handleDragEnter}
                @dragleave=${this.handleDragLeave}
                @dragover=${this.handleDragOver}
                @drop=${this.handleDrop}
                @click=${() => this.shadowRoot?.querySelector<HTMLInputElement>('#fileInput')?.click()}
            >
                <input type="file" id="fileInput" multiple style="display: none" @change=${this.handleFileInput} accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv" />
                <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div class="upload-text">Upload Material List</div>
                <div class="upload-subtext">Drop your files here, or browse</div>
                <div class="upload-subtext" style="margin-top: var(--space-xs); opacity: 0.7;">SUPPORTS: JPG, PNG, PDF, XLSX</div>
                ${this.uploadedFiles.length > 0 ?
        html`<div style="margin-top: var(--space-md); color: var(--color-success); font-weight: 600;">${this.uploadedFiles.length} file(s) selected</div>`
        : ''}
            </div>
        </div>
    `;
  }

  private renderManualStep() {
    return html`
        <div class="manual-container">
            <div class="feature-list">
                <p class="section-subtitle">
                    Type or paste your requirements below. Be as specific as possible.
                </p>
            </div>
            
            <div>
                <div class="manual-label" style="margin-bottom: var(--space-xs);">Paste or type your material list:</div>
                <textarea 
                    class="manual-textarea" 
                    placeholder="Example:\n10 2x4x8 studs\n5lb box of 16d nails\n3 sheets of 3/4 plywood"
                    .value=${this.manualText}
                    @input=${(e: Event) => this.manualText = (e.target as HTMLTextAreaElement).value}
                    autofocus
                ></textarea>
            </div>
        </div>
    `;
  }

  private renderFulfillmentStep() {
    return html`
        <div class="fulfillment-form">
            <div class="form-group">
                <label class="form-label">Desired Fulfillment Date</label>
                <input 
                    type="date" 
                    class="form-input" 
                    .value=${this.fulfillmentDate}
                    @change=${(e: Event) => this.fulfillmentDate = (e.target as HTMLInputElement).value}
                />
            </div>

            <div class="form-group">
                <label class="form-label">Fulfillment Method</label>
                <select 
                    class="form-select"
                    .value=${this.fulfillmentMethod}
                    @change=${(e: Event) => this.fulfillmentMethod = (e.target as HTMLSelectElement).value as FulfillmentMethod}
                >
                    <option value="delivery">Delivery</option>
                    <option value="willcall">Will Call (Pickup)</option>
                </select>
            </div>
            
            <div style="background: var(--color-bg-alt); padding: var(--space-md); border-radius: var(--radius-md); font-size: var(--text-sm); color: var(--color-text-light);">
                <p><strong>Note:</strong> Your sales representative will review this request and provide a formal quote with pricing and availability within 24 hours.</p>
            </div>
        </div>
    `;
  }

  private renderSuccessStep() {
    return html`
        <div class="success-state">
            <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h3 class="success-title">Request Sent!</h3>
            <p class="success-message">Your quote request has been successfully pushed to your sales representative. You will receive a notification once it is ready for review.</p>
        </div>
    `;
  }

  private renderFooter() {
    if (this.currentStep === 'success') {
      return html`
            <div class="modal-footer" style="justify-content: center;">
                <button class="btn btn-primary" @click=${this.close}>Back to Dashboard</button>
            </div>
        `;
    }

    if (this.currentStep === 'selection') {
      return html`
            <div class="modal-footer">
                <button class="btn btn-secondary" @click=${this.close}>Cancel</button>
            </div>
        `;
    }

    return html`
        <div class="modal-footer">
            <button class="btn btn-secondary" @click=${this.handleBack}>
                Back
            </button>
            <button class="btn btn-primary" @click=${(this.currentStep === 'upload' || this.currentStep === 'manual') ? this.handleProcessList : this.handleSubmit}>
                ${(this.currentStep === 'upload' || this.currentStep === 'manual') ? 'Process List' : 'Submit Request'}
            </button>
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-quick-quote-modal': PvQuickQuoteModal;
  }
}
