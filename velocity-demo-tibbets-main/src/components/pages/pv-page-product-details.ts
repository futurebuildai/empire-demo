
import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { RouterService } from '../../services/router.service.js';
import { MOCK_PRODUCTS } from '../../mock/store-mock.js';
import { Product } from '../../types/index.js';
import '../molecules/pv-product-card.js';

@customElement('pv-page-product-details')
export class PvPageProductDetails extends PvBase {
  @property({ type: String }) productId: string | null = null;
  @state() private product: Product | null = null;
  @state() private quantity: number = 1;
  @state() private selectedLength: string = '8';

  static styles = [
    ...PvBase.styles,
    css`
      :host {
        display: block;
        padding-bottom: var(--space-4xl);
      }

      .container {
        max-width: 1440px;
        margin: 0 auto;
        padding: 0 var(--space-xl);
      }

      /* Breadcrumbs */
      .breadcrumbs {
        padding: var(--space-lg) 0;
        color: var(--color-text-muted);
        font-size: 0.875rem;
        display: flex;
        gap: var(--space-xs);
        flex-wrap: wrap;
      }

      .breadcrumbs a {
        color: var(--color-text-muted);
        text-decoration: none;
        transition: color 0.2s;
      }

      .breadcrumbs a:hover {
        color: var(--color-primary);
      }

      .separator::before {
        content: '>';
        margin: 0 var(--space-xs);
        color: var(--color-text-subtle);
      }

      /* Main Layout */
      .product-layout {
        display: grid;
        grid-template-columns: 1fr 450px;
        gap: var(--space-3xl);
        margin-top: var(--space-lg);
      }

      /* Image Section */
      .product-media {
        background: white;
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 1px solid var(--color-border);
      }

      .main-image-container {
        aspect-ratio: 4/3;
        width: 100%;
        display: grid;
        place-items: center;
        background: #f8fafc;
        padding: var(--space-3xl);
      }

      .product-img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;
      }

      .product-img:hover {
        transform: scale(1.05);
      }

      /* Info Section */
      .product-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-xl);
      }

      .product-title {
        font-family: var(--font-heading);
        font-size: 2rem;
        font-weight: 800;
        line-height: 1.2;
        color: var(--color-text);
      }

      .sku {
        color: var(--color-text-muted);
        font-size: 0.875rem;
        margin-top: var(--space-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
      }

      /* Pricing Box */
      .pricing-box {
        background: white;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-xl);
        box-shadow: var(--shadow-sm);
      }

      .price-row {
        display: flex;
        align-items: baseline;
        gap: var(--space-xs);
        margin-bottom: var(--space-lg);
      }

      .price {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--color-text);
      }

      .unit {
        font-size: 1.25rem;
        color: var(--color-text-muted);
        font-weight: 500;
      }

      /* Variants */
      .variant-label {
        font-weight: 600;
        margin-bottom: var(--space-sm);
        display: block;
        font-size: 0.875rem;
      }

      .variant-options {
        display: flex;
        gap: var(--space-sm);
        margin-bottom: var(--space-xl);
      }

      .variant-btn {
        padding: var(--space-sm) var(--space-lg);
        border: 1px solid var(--color-border);
        background: white;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-weight: 600;
        min-width: 60px;
        transition: all 0.2s;
      }

      .variant-btn:hover {
        border-color: var(--color-primary);
      }

      .variant-btn.selected {
        border-color: var(--color-primary);
        background: color-mix(in srgb, var(--color-primary) 5%, white);
        color: var(--color-primary);
        box-shadow: 0 0 0 1px var(--color-primary);
      }

      /* Inventory */
      .inventory-status {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        padding: var(--space-lg);
        background: var(--color-bg-subtle);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-xl);
      }

      .location-stock {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.875rem;
      }

      .stock-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #16a34a;
        font-weight: 600;
      }

      /* Actions */
      .actions-row {
        display: flex;
        gap: var(--space-md);
        align-items: center;
      }

      .qty-selector {
        display: flex;
        align-items: center;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        height: 48px;
        background: white;
      }

      .qty-btn {
        width: 40px;
        height: 100%;
        display: grid;
        place-items: center;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text-muted);
        font-size: 1.25rem;
      }
      
      .qty-btn:hover { color: var(--color-primary); }

      .qty-input {
        width: 50px;
        text-align: center;
        border: none;
        font-weight: 600;
        font-size: 1rem;
        -moz-appearance: textfield;
      }

      .btn-add {
        flex: 1;
        height: 48px;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-sm);
      }

      .btn-quote {
        width: 100%;
        margin-top: var(--space-md);
        height: 48px;
        font-size: 1rem;
      }

      /* Content Sections */
      .content-section {
        margin-top: var(--space-4xl);
        border-top: 1px solid var(--color-border);
        padding-top: var(--space-2xl);
      }

      .section-heading {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: var(--space-lg);
      }

      .description-content {
        max-width: 800px;
        line-height: 1.6;
        color: var(--color-text);
      }

      .description-content ul {
        margin: var(--space-md) 0;
        padding-left: var(--space-xl);
      }

      .description-content li {
        margin-bottom: var(--space-xs);
      }

      /* Related Products */
      .related-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-lg);
        margin-top: var(--space-lg);
      }

      @media (max-width: 1024px) {
        .product-layout {
          grid-template-columns: 1fr;
        }
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    this._loadProduct();
    window.addEventListener('route-changed', this._handleRouteUpdate.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('route-changed', this._handleRouteUpdate.bind(this));
  }

  private _handleRouteUpdate() {
    this._loadProduct();
  }

  private _loadProduct() {
    const params = RouterService.getParams();
    const id = params.get('id');
    if (id) {
      this.productId = id;
      this.product = MOCK_PRODUCTS.find(p => p.id === id) || null;
    }
  }

  private _handleAddToCart() {
    if (!this.product) return;

    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: {
        product: this.product,
        quantity: this.quantity
      },
      bubbles: true,
      composed: true
    }));
  }

  private _handleAddToQuote() {
    if (!this.product) return;

    this.dispatchEvent(new CustomEvent('add-to-quote', {
      detail: {
        product: this.product,
        quantity: this.quantity
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (!this.product) return html`<div class="container" style="padding: 40px">Loading product...</div>`;

    return html`
      <div class="container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs">
            <a href="#shop">All Products</a>
            <span class="separator"></span>
            <a href="#shop">${this.product.category}</a>
            <span class="separator"></span>
            <span style="color: var(--color-text)">${this.product.name}</span>
        </nav>

        <div class="product-layout">
            <!-- Left: Media -->
            <div class="product-media">
                <div class="main-image-container">
                    ${this.product.image
        ? html`<img src="${this.product.image}" alt="${this.product.name}" class="product-img">`
        : html`
                            <div style="font-size: 4rem; color: var(--color-border);">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            </div>
                        `}
                </div>
            </div>

            <!-- Right: Details -->
            <div class="product-info">
                <div>
                    <h1 class="product-title">${this.product.name}</h1>
                    <div class="sku">SKU: ${this.product.sku || this.product.id}</div> 
                    ${this.product.manufacturerLink ? html`
                      <div style="margin-top: var(--space-xs);">
                        <a href="${this.product.manufacturerLink}" target="_blank" rel="noopener noreferrer" style="font-size: 0.8125rem; color: var(--color-primary); text-decoration: none; display: inline-flex; align-items: center; gap: 4px; font-weight: 500;">
                          Visit Manufacturer Website
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      </div>
                    ` : ''}
                </div>

                <div class="pricing-box">
                    <div class="price-row">
                        <span class="price">$${this.product.price.toFixed(2)}</span>
                        <span class="unit">/ each</span>
                    </div>

                    <div style="margin-bottom: var(--space-lg);">
                        <label class="variant-label">Length (ft):</label>
                        <div class="variant-options">
                            ${['8', '16', '20'].map(size => html`
                                <button class="variant-btn ${this.selectedLength === size ? 'selected' : ''}"
                                        @click=${() => this.selectedLength = size}>
                                    ${size}
                                </button>
                            `)}
                        </div>
                    </div>

                    <div class="inventory-status">
                         <div class="location-stock">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <strong>San Diego</strong>
                            </div>
                            <div class="stock-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                In Stock
                            </div>
                         </div>
                         <a href="#" style="font-size:0.75rem; color:var(--color-text-muted); text-decoration:underline; margin-left: 24px;">
                            Check inventory at other locations
                         </a>
                    </div>

                    <div class="actions-group">
                        <div class="actions-row">
                            <div class="qty-selector">
                                <button class="qty-btn" @click=${() => this.quantity = Math.max(1, this.quantity - 1)}>−</button>
                                <input class="qty-input" type="number" .value=${this.quantity.toString()} readonly>
                                <button class="qty-btn" @click=${() => this.quantity++}>+</button>
                            </div>
                            <button class="btn btn-primary btn-add" @click=${this._handleAddToCart}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                Add To Cart
                            </button>
                        </div>
                        <button class="btn btn-outline btn-quote" @click=${this._handleAddToQuote}>Request Pricing</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Description -->
        <div class="content-section">
            <h2 class="section-heading">Description</h2>
            <div class="description-content">
                <p>${this.product.description}</p>
                <ul>
                    <li>Meets highest grading standards for strength and appearance</li>
                    <li>Ideal for structural applications and general construction</li>
                    <li>Sustainably sourced Douglas Fir</li>
                    <li>Kiln dried for stability</li>
                </ul>
                <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: var(--space-lg);">
                    WARNING: Drilling, sawing, sanding or machining wood products can expose you to wood dust, 
                    a substance known to the State of California to cause cancer. Avoid inhaling wood dust or use a dust mask.
                </p>
            </div>
        </div>

        <!-- Related -->
        <div class="content-section">
            <h2 class="section-heading">Related Products</h2>
            <div class="related-grid">
                 ${MOCK_PRODUCTS.slice(0, 4).map(p => html`
                    <pv-product-card 
                        .product=${p} 
                        @add-to-cart=${(e: CustomEvent) => this.dispatchEvent(new CustomEvent('add-to-cart', { detail: e.detail, bubbles: true, composed: true }))}
                    ></pv-product-card>
                 `)}
            </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-page-product-details': PvPageProductDetails;
  }
}
