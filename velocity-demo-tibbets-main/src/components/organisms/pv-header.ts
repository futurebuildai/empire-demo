/**
 * PvHeader - Main header component
 * Displays logo and utility navigation
 */

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { BrandingService, type BrandingInfo } from '../../services/branding.service.js';

@customElement('pv-header')
export class PvHeader extends PvBase {
  static styles = [
    ...PvBase.styles,
    css`
      :host {
        display: block;
        background: white;
        border-bottom: 1px solid var(--color-border);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .header-main {
        padding: var(--space-sm) 0;
        border-bottom: 1px solid var(--color-border);
      }

      .header-container {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: 0 var(--space-xl);
        gap: var(--space-xl);
      }

      /* Contact Info Section */
      .header-contact {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 0.8125rem;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--color-text-light);
        font-weight: 500;
        transition: color var(--transition-fast);
      }

      .contact-item:hover {
        color: var(--color-primary);
      }

      .contact-icon {
        color: var(--color-accent);
        opacity: 0.8;
      }

      .contact-label {
        font-size: 0.6875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-muted);
        font-weight: 600;
      }

      /* Logo */
      .logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
      }

      .logo-icon {
        width: 154px;
        height: 77px;
        display: grid;
        place-items: center;
        transition: transform var(--transition-base);
      }

      .logo:hover .logo-icon {
        transform: scale(1.02);
      }

      .logo-image {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
      }


      /* Actions */
      .header-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--space-xl);
      }

      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: var(--color-text);
        text-decoration: none;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        transition: color 0.15s;
      }

      .action-item:hover {
        color: var(--color-primary);
      }

      .icon-wrapper {
        position: relative;
        display: flex;
      }

      .badge-count {
        position: absolute;
        top: -4px;
        right: -4px;
        background: var(--color-accent);
        color: white;
        font-size: 10px;
        font-weight: 700;
        min-width: 16px;
        height: 16px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      }

      /* Secondary Nav */
      .header-subnav {
        background: white;
        border-bottom: 1px solid var(--color-border);
      }

      .subnav-container {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 1440px;
        margin: 0 auto;
        padding: 0 var(--space-xl);
        height: 48px;
        gap: var(--space-2xl);
      }

      .location-picker {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text);
        cursor: pointer;
      }

      .subnav-links {
        display: flex;
        gap: var(--space-xl);
      }

      .subnav-links a {
        text-decoration: none;
        color: var(--color-text-light);
        font-size: 0.875rem;
        font-weight: 500;
        transition: color 0.15s;
        padding: 13px 0;
        border-bottom: 2px solid transparent;
      }

      .subnav-links a:hover {
        color: var(--color-primary);
        border-bottom-color: var(--color-primary);
      }

      @media (max-width: 1024px) {
        .header-container {
          gap: var(--space-md);
        }

        .logo-icon {
          width: 112px;
          height: 56px;
        }

        .logo-name {
          display: none;
        }

        .subnav-links, .location-picker span {
          display: none;
        }

        .header-search {
          max-width: none;
        }
      }
    `,
  ];

  @property({ type: Boolean }) isLanding = false;

  private handleMenuToggle() {
    this.dispatchEvent(new CustomEvent('menu-toggle', {
      bubbles: true,
      composed: true,
    }));
  }

  @state() private branding: BrandingInfo = BrandingService.getBrandingSync();
  @property({ type: Number }) cartCount = 0;
  private unsubscribeBranding?: () => void;

  private _emitCartToggle() {
    this.dispatchEvent(new CustomEvent('toggle-cart', {
      bubbles: true,
      composed: true
    }));
  }

  private _emitQuoteToggle() {
    this.dispatchEvent(new CustomEvent('toggle-quote', {
      bubbles: true,
      composed: true
    }));
  }

  connectedCallback() {
    super.connectedCallback();
    BrandingService.getBranding().then((branding) => {
      this.branding = branding;
    });
    this.unsubscribeBranding = BrandingService.subscribe((branding) => {
      this.branding = branding;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeBranding?.();
  }

  render() {
    const tenantName = this.branding.tenantName || 'Velocity';
    let logoUrl = this.branding.logoUrl || null;

    if (!logoUrl && this.branding.logoBase64 && this.branding.logoType) {
      logoUrl = `data:${this.branding.logoType};base64,${this.branding.logoBase64}`;
    }

    return html`
      <div class="header-main">
        <div class="header-container">
          <!-- Left: Contact Info -->
          <div class="header-contact">
            <div class="contact-item">
              <span class="contact-label">Call Us:</span>
              <span>${this.branding.contactPhone}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">Email:</span>
              <span>${this.branding.contactEmail}</span>
            </div>
          </div>

          <!-- Center: Logo -->
          <a href="#home" class="logo">
            <div class="logo-icon">
              ${logoUrl
        ? html`<img class="logo-image" src="${logoUrl}" alt="${tenantName} logo">`
        : html`⬡`}
            </div>
          </a>

          <!-- Right: Actions -->
          <div class="header-actions">
            <a href="#overview" class="action-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>My Account</span>
            </a>
            
            <button class="action-item" @click="${this._emitQuoteToggle}">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              <span>Requests</span>
            </button>

            <button class="action-item" @click="${this._emitCartToggle}">
              <div class="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                ${this.cartCount > 0 ? html`<span class="badge-count">${this.cartCount}</span>` : ''}
              </div>
              <span>Cart</span>
            </button>

            ${!this.isLanding ? html`
            <button class="action-item mobile-menu" @click=${this.handleMenuToggle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <span>Menu</span>
            </button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Secondary Navigation -->
      ${this.isLanding ? html`
      <div class="header-subnav">
        <div class="subnav-container">
          <div class="location-picker">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>San Diego</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <nav class="subnav-links">
            <a href="#shop">All Products</a>
            <a href="#showrooms">Showrooms</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#employment">Employment</a>
            <a href="#brand-partners">Our Brand Partners</a>
          </nav>
        </div>
      </div>
      ` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-header': PvHeader;
  }
}
