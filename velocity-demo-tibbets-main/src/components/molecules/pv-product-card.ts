
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Product } from '../../types/index.js';
import '../atoms/pv-store-badge.js';

@customElement('pv-product-card')
export class PvProductCard extends LitElement {
    @property({ type: Object }) product!: Product;

    static styles = css`
        :host {
            display: block;
        }

        .product-card {
            background: white;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            overflow: hidden;
            transition: all 0.2s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .product-card:hover {
            border-color: var(--color-primary-300);
            box-shadow: var(--shadow-md);
            transform: translateY(-2px);
        }

        .image-container {
            position: relative;
            padding-top: 100%; /* 1:1 Aspect Ratio */
            background-color: #f8fafc;
            overflow: hidden;
        }

        .product-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 1rem;
            transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
            transform: scale(1.05);
        }

        .badges {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            z-index: 2;
        }

        .content {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .brand {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            font-weight: 500;
            text-transform: uppercase;
            margin-bottom: 0.25rem;
            letter-spacing: 0.025em;
        }

        .name {
            font-size: 0.9375rem;
            font-weight: 600;
            color: var(--color-text);
            margin-bottom: 0.5rem;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            flex: 1;
        }

        .rating {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
            gap: 0.25rem;
        }

        .stars {
            color: #FBBF24;
            font-size: 0.875rem;
        }

        .review-count {
            font-size: 0.75rem;
            color: var(--color-text-muted);
        }

        .price-section {
            display: flex;
            align-items: baseline;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .current-price {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--color-text);
        }

        .original-price {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            text-decoration: line-through;
        }

        .actions {
            margin-top: auto;
        }

        .add-btn {
            width: 100%;
            padding: 0.5rem;
            background-color: white;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
            font-weight: 600;
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }

        .add-btn:hover {
            background-color: var(--color-primary);
            color: white;
        }

        .actions-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }

        .quote-btn {
            padding: 0.5rem;
            background-color: white;
            border: 1px solid var(--color-border);
            color: var(--color-text-muted);
            font-weight: 600;
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.8125rem;
        }

        .quote-btn:hover {
            border-color: var(--color-primary);
            color: var(--color-primary);
        }
        
        /* New sleek design token support if possible */
        @media (min-width: 768px) {
            .name {
                min-height: 2.8em; 
            }
        }
    `;

    private _addToCart(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('add-to-cart', {
            detail: { product: this.product },
            bubbles: true,
            composed: true
        }));
    }

    private _addToQuote(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('add-to-quote', {
            detail: { product: this.product },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (!this.product) return null;

        return html`
            <div class="product-card" @click=${() => {
                import('../../services/router.service').then(({ RouterService }) => {
                    RouterService.navigate('product-details', { id: this.product.id });
                });
            }}>
                <!-- Image Container -->
                <div class="image-container">
                    <img src="${this.product.image || ''}" alt="${this.product.name}" class="product-image" loading="lazy">
                    <div class="badges">
                        ${this.product.isNew ? html`<pv-store-badge type="new" label="New"></pv-store-badge>` : ''}
                        ${this.product.isOnSale ? html`<pv-store-badge type="sale" label="Sale"></pv-store-badge>` : ''}
                    </div>
                </div>

                <div class="content">
                    <div class="brand">${this.product.brand}</div>
                    <div class="name" title="${this.product.name}">${this.product.name}</div>
                    ${this.product.sku ? html`<div class="sku" style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">SKU: ${this.product.sku}</div>` : ''}
                    
                    <div class="rating">
                        <span class="stars">★★★★★</span>
                        <span class="review-count">(${this.product.reviews})</span>
                    </div>

                    <div class="price-section">
                        <span class="current-price">$${this.product.price.toFixed(2)}</span>
                    </div>

                    <div class="actions">
                        <div class="actions-group">
                            <button class="add-btn" @click="${this._addToCart}">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Buy
                            </button>
                            <button class="quote-btn" @click="${this._addToQuote}">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Request Pricing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
