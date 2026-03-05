
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { RouterService } from '../../services/router.service.js';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '../../mock/store-mock.js';
import { AuthService } from '../../services/auth.service.js';
import '../organisms/pv-store-hero.js';
import '../organisms/pv-store-filters.js';
import '../molecules/pv-product-card.js';
import { Product } from '../../types/index.js';

@customElement('pv-page-shop')
export class PvPageShop extends PvBase {
    @state() private products: Product[] = MOCK_PRODUCTS;
    @state() private filteredProducts: Product[] = MOCK_PRODUCTS;
    @state() private activeCategory: string | null = null;
    @state() private activeBrand: string | null = null;
    @state() private searchQuery: string = '';

    static styles = [
        ...PvBase.styles,
        css`
            :host {
                display: block;
            }

            .page-content {
                width: 100%;
            }

            .store-layout {
                display: grid;
                grid-template-columns: 280px 1fr;
                gap: var(--space-xl);
                align-items: start;
                max-width: 1440px;
                margin: 0 auto;
                padding: var(--space-xl);
            }

            .product-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: var(--space-lg);
            }

            .no-results {
                text-align: center;
                padding: var(--space-3xl);
                background: var(--color-bg-subtle);
                border-radius: var(--radius-lg);
                grid-column: 1 / -1;
                color: var(--color-text-muted);
            }

            @media (max-width: 1024px) {
                .store-layout {
                    grid-template-columns: 1fr;
                }
                
                aside {
                    display: none; /* For now, or add mobile toggle logic later */
                }
            }

            .shop-toolbar {
                margin-bottom: var(--space-xl);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-lg);
            }

            .search-wrapper {
                position: relative;
                flex: 1;
                max-width: 600px;
            }

            .search-input {
                width: 100%;
                padding: 1rem 1rem 1rem 3rem;
                font-size: 1rem;
                border: 1px solid var(--color-border);
                border-radius: var(--radius-full);
                background: white;
                box-shadow: var(--shadow-sm);
                transition: all 0.2s;
            }

            .search-input:focus {
                outline: none;
                border-color: var(--color-primary);
                box-shadow: 0 0 0 4px var(--color-primary-100);
            }

            .search-icon {
                position: absolute;
                left: 1.25rem;
                top: 50%;
                transform: translateY(-50%);
                color: var(--color-text-muted);
                pointer-events: none;
            }

            .results-count {
                color: var(--color-text-muted);
                font-size: 0.875rem;
            }
        `
    ];

    private _handleFilterChange(e: CustomEvent) {
        const { category, brand, search } = e.detail;
        this.activeCategory = category;
        this.activeBrand = brand;
        // Search might come from filter component or main page, prioritize filter event if present?
        // Actually, if filter component no longer has search, this property might be empty or stale there.
        // We should fix the filter component to NOT emit search if it doesn't control it.
        // But for now, let's just ignore search from filter event if we control it here.
        // Wait, I left search in the detail of filter-change event in previous step.
        // Let's assume if it's passed, we use it, but since we removed input there, it will be distinct.
        // Actually, let's keep it simple: We update activeCategory/Brand from sidebar. 
        // Search is updated locally.

        this._applyFilters();
    }

    private _handleSearchInput(e: Event) {
        const target = e.target as HTMLInputElement;
        this.searchQuery = target.value;
        this._applyFilters();
    }

    private _applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            const matchesCategory = !this.activeCategory || product.category === this.activeCategory;
            const matchesBrand = !this.activeBrand || product.brand === this.activeBrand;
            const matchesSearch = !this.searchQuery ||
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(this.searchQuery.toLowerCase());

            return matchesCategory && matchesBrand && matchesSearch;
        });
    }

    private _boundRouteUpdate = this._handleRouteUpdate.bind(this);

    connectedCallback() {
        super.connectedCallback();
        // Check initial params
        const params = RouterService.getParams();
        const search = params.get('search');
        const category = params.get('category');
        const brand = params.get('brand');

        if (search) {
            this.searchQuery = search;
        }

        if (category) {
            this.activeCategory = category;
        }

        if (brand) {
            this.activeBrand = brand;
        }

        if (search || category || brand) {
            this._applyFilters();
        }

        window.addEventListener('route-changed', this._boundRouteUpdate);
        window.addEventListener('hashchange', this._boundRouteUpdate);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('route-changed', this._boundRouteUpdate);
        window.removeEventListener('hashchange', this._boundRouteUpdate);
    }

    private _handleRouteUpdate() {
        const params = RouterService.getParams();
        const search = params.get('search');
        const category = params.get('category');
        const brand = params.get('brand');

        let changed = false;

        // Only update if search param is present, allowing empty string to clear
        if (search !== null && search !== this.searchQuery) {
            this.searchQuery = search;
            changed = true;
        } else if (search === null && this.searchQuery) {
            this.searchQuery = '';
            changed = true;
        }

        if (category !== null && category !== this.activeCategory) {
            this.activeCategory = category;
            changed = true;
        } else if (category === null && this.activeCategory) {
            this.activeCategory = null;
            changed = true;
        }

        if (brand !== null && brand !== this.activeBrand) {
            this.activeBrand = brand;
            changed = true;
        } else if (brand === null && this.activeBrand) {
            this.activeBrand = null;
            changed = true;
        }

        if (changed) {
            this._applyFilters();
        }
    }

    private _handleAddToCart(e: CustomEvent) {
        // Bubble up to app
        this.dispatchEvent(new CustomEvent('add-to-cart', {
            detail: e.detail,
            bubbles: true,
            composed: true
        }));
    }

    private _handleHeroSearch(e: CustomEvent) {
        this.searchQuery = e.detail.query;
        this._applyFilters();
    }

    render() {
        return html`
            <div class="page-content">
                <pv-store-hero 
                    title="Spring Building Event"
                    subtitle="Exclusive deals on lumber, tools, and safety gear for logged-in pros."
                    .showSearch=${true}
                    .isLoggedIn=${AuthService.isAuthenticated()}
                    @search=${this._handleHeroSearch}
                ></pv-store-hero>

                <div class="store-layout">
                    <aside>
                        <pv-store-filters
                            .categories=${MOCK_CATEGORIES}
                            .brands=${MOCK_BRANDS}
                            .selectedCategory=${this.activeCategory}
                            .selectedBrand=${this.activeBrand}
                            .searchQuery=${this.searchQuery}
                            @filter-change=${this._handleFilterChange}
                        ></pv-store-filters>
                    </aside>

                    <main>
                         <!-- Toolbar removed, search is in header now -->

                        ${this.filteredProducts.length > 0 ? html`
                            <div class="product-grid">
                                ${this.filteredProducts.map(product => html`
                                    <pv-product-card 
                                        .product=${product}
                                        @add-to-cart=${this._handleAddToCart}
                                    ></pv-product-card>
                                `)}
                            </div>
                        ` : html`
                            <div class="no-results">
                                <h3>No products found</h3>
                                <p>Try adjusting your search or filters.</p>
                                <button class="btn btn-outline" @click=${() => {
                    this.searchQuery = '';
                    this.activeCategory = null;
                    this.activeBrand = null;
                    this._applyFilters();
                }}>Clear all filters</button>
                            </div>
                        `}
                    </main>
                </div>
            </div>
        `;
    }
}
