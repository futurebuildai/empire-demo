
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Category, Brand } from '../../types/index.js';

@customElement('pv-store-filters')
export class PvStoreFilters extends LitElement {
    @property({ type: Array }) categories: Category[] = [];
    @property({ type: Array }) brands: Brand[] = [];
    @property({ type: String }) selectedCategory: string | null = null;
    @property({ type: String }) selectedBrand: string | null = null;
    @property({ type: String }) searchQuery = '';

    @state() private isExpanded = false; // Mobile toggle

    static styles = css`
        :host {
            display: block;
            padding-right: var(--space-xl);
        }

        .section-title {
            font-size: 0.9375rem;
            font-weight: 700;
            color: var(--color-text);
            margin-bottom: var(--space-lg);
            padding-bottom: var(--space-sm);
            border-bottom: 2px solid var(--color-border);
        }

        .filter-group {
            margin-bottom: var(--space-2xl);
        }
        
        .filter-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
        }

        .filter-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            cursor: pointer;
            font-size: 0.9375rem;
            color: var(--color-text);
            padding: 4px 0;
            transition: color 0.15s;
        }

        .filter-item:hover {
            color: var(--color-primary);
        }

        .filter-checkbox {
            width: 18px;
            height: 18px;
            border: 1px solid var(--color-border-bold);
            border-radius: 4px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
            background: white;
            transition: all 0.15s;
        }

        .filter-item.active .filter-checkbox {
            background: var(--color-primary);
            border-color: var(--color-primary);
            color: white;
        }

        .checkmark {
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.15s;
        }

        .filter-item.active .checkmark {
            opacity: 1;
            transform: scale(1);
        }

        .count {
            color: var(--color-text-muted);
            font-size: 0.8125rem;
            margin-left: auto;
        }

        input[type="radio"] {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }
    `;

    private _handleCategoryChange(slug: string | null) {
        this.selectedCategory = slug;
        this._dispatchFilterChange();
    }

    private _handleBrandChange(slug: string | null) {
        this.selectedBrand = slug;
        this._dispatchFilterChange();
    }

    private _dispatchFilterChange() {
        this.dispatchEvent(new CustomEvent('filter-change', {
            detail: {
                category: this.selectedCategory,
                brand: this.selectedBrand,
                search: this.searchQuery
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="filter-group">
                <div class="section-title">Department</div>
                <div class="filter-list">
                    <label class="filter-item ${!this.selectedCategory ? 'active' : ''}">
                        <input type="radio" name="category" value="all" .checked="${!this.selectedCategory}" @change="${() => this._handleCategoryChange(null)}">
                        <div class="filter-checkbox">
                            <svg class="checkmark" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span>All Departments</span>
                    </label>
                    ${this.categories.map(cat => html`
                        <label class="filter-item ${this.selectedCategory === cat.slug ? 'active' : ''}">
                            <input type="radio" name="category" value="${cat.slug}" .checked="${this.selectedCategory === cat.slug}" @change="${() => this._handleCategoryChange(cat.slug)}">
                            <div class="filter-checkbox">
                                <svg class="checkmark" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span>${cat.name}</span>
                            <span class="count">(${cat.count})</span>
                        </label>
                    `)}
                </div>
            </div>

            <div class="filter-group">
                <div class="section-title">Brand</div>
                <div class="filter-list">
                    <label class="filter-item ${!this.selectedBrand ? 'active' : ''}">
                        <input type="radio" name="brand" value="all" .checked="${!this.selectedBrand}" @change="${() => this._handleBrandChange(null)}">
                        <div class="filter-checkbox">
                            <svg class="checkmark" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span>All Brands</span>
                    </label>
                    ${this.brands.map(brand => html`
                        <label class="filter-item ${this.selectedBrand === brand.slug ? 'active' : ''}">
                            <input type="radio" name="brand" value="${brand.slug}" .checked="${this.selectedBrand === brand.slug}" @change="${() => this._handleBrandChange(brand.slug)}">
                            <div class="filter-checkbox">
                                <svg class="checkmark" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span>${brand.name}</span>
                            <span class="count">(${brand.count})</span>
                        </label>
                    `)}
                </div>
            </div>

            <div class="filter-group">
                <div class="section-title">Price</div>
                <div class="filter-list">
                    ${['Under $25', '$25 - $50', '$50 - $100', '$100 - $200', '$200+'].map(price => html`
                        <label class="filter-item">
                            <div class="filter-checkbox"></div>
                            <span>${price}</span>
                        </label>
                    `)}
                </div>
            </div>
        `;
    }
}
