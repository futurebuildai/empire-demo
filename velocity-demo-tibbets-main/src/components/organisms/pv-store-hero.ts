
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pv-store-hero')
export class PvStoreHero extends LitElement {
    @property({ type: String }) title = 'Spring Sale Event';
    @property({ type: String }) subtitle = 'Up to 40% off on select power tools and accessories.';
    @property({ type: String }) background?: string;
    @property({ type: Boolean }) showSearch = false;
    @property({ type: Boolean }) isLoggedIn = false;

    static styles = css`
        :host {
            display: block;
            margin-bottom: var(--space-xl);
        }

        .hero-container {
            position: relative;
            background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
            border-radius: var(--radius-lg);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            text-align: center;
            color: white;
            padding: var(--space-2xl);
            box-shadow: var(--shadow-lg);
        }

        .content {
            max-width: 800px;
            animation: fadeIn 1s ease-out;
            width: 100%;
        }

        h1 {
            font-size: 3.5rem;
            font-weight: 600;
            margin-bottom: var(--space-md);
            letter-spacing: 0.01em;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        p {
            font-size: 1.25rem;
            margin-bottom: var(--space-xl);
            opacity: 0.9;
            line-height: 1.6;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .cta-button {
            display: inline-block;
            background-color: var(--color-primary);
            color: white;
            padding: 1rem 2.5rem;
            border-radius: var(--radius-full);
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border: 2px solid transparent;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            background-color: var(--color-primary-dark);
        }

        /* Search Styles */
        .hero-search {
            max-width: 600px;
            margin: 0 auto;
            position: relative;
        }

        .search-input-wrapper {
            position: relative;
            display: flex;
            background: white;
            border-radius: var(--radius-full);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            padding: 6px;
        }

        .hero-search input {
            flex: 1;
            border: none;
            padding: 16px 16px 16px 52px;
            font-size: 1.125rem;
            border-radius: var(--radius-full);
            outline: none;
            color: var(--color-text);
            min-width: 0;
        }

        .search-icon {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-text-muted);
            width: 24px;
            height: 24px;
            pointer-events: none;
        }

        .search-btn {
            background: var(--color-accent);
            color: white;
            border: none;
            padding: 0 32px;
            border-radius: var(--radius-full);
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
        }

        .search-btn:hover {
            background: var(--color-accent-dark);
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        /* Hero Actions */
        .hero-actions {
            display: flex;
            justify-content: center;
            gap: var(--space-lg);
            margin-top: var(--space-xl);
            animation: fadeIn 1s ease-out 0.2s both;
        }

        .hero-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: var(--radius-full);
            font-weight: 700;
            font-size: 0.9375rem;
            text-decoration: none;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .hero-btn-primary {
            background: var(--color-accent);
            color: white;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .hero-btn-primary:hover {
            background: var(--color-accent-dark);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
        }

        .hero-btn-outline {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(8px);
        }

        .hero-btn-outline:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
            h1 { font-size: 2.5rem; }
            .hero-container { min-height: 350px; }
            .search-btn { padding: 0 20px; font-size: 0.875rem; }
            .hero-actions { flex-direction: column; align-items: stretch; padding: 0 var(--space-xl); }
        }
    `;

    private _handleSearch(searchQuery: string) {
        if (searchQuery.trim()) {
            this.dispatchEvent(new CustomEvent('search', {
                detail: { query: searchQuery.trim() },
                bubbles: true,
                composed: true
            }));
        }
    }

    render() {
        return html`
            <div class="hero-container" style="${this.background ? `background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${this.background}');` : ''}">
                <div class="content">
                    <h1>${this.title}</h1>
                    <p>${this.subtitle}</p>
                    
                    ${this.showSearch ? html`
                        <div class="hero-search">
                            <div class="search-input-wrapper">
                                <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input type="text" placeholder="What are you building today?" 
                                    @keydown=${(e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        this._handleSearch(target.value);
                    }
                }}>
                                <button class="search-btn" @click=${() => {
                    const input = this.shadowRoot?.querySelector('.hero-search input') as HTMLInputElement;
                    if (input) this._handleSearch(input.value);
                }}>Search</button>
                            </div>
                        </div>

                        <div class="hero-actions">
                            <a href="#shop" class="hero-btn hero-btn-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                                Explore Our Catalog
                            </a>
                            
                            ${this.isLoggedIn ? html`
                                <a href="#projects" class="hero-btn hero-btn-outline">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                    Manage Projects
                                </a>
                            ` : ''}
                        </div>
                    ` : html`
                        <a href="#featured" class="cta-button">Shop Now</a>
                    `}
                </div>
            </div>
        `;
    }
}
