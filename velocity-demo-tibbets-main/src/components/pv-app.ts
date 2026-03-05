/**
 * PvApp - Root application shell component
 * Handles auth state, routing, and global toast events
 */

import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PvBase } from './pv-base.js';
import { AuthService } from '../services/auth.service.js';
import { RouterService } from '../services/router.service.js';
import { PvToast } from './atoms/pv-toast.js';
import type { RouteId, ToastEvent } from '../types/index.js';
import { BrandingService } from '../services/branding.service.js';

// Import components
import './pv-login.js';
import './organisms/pv-header.js';
import './organisms/pv-sidebar.js';
import './pages/pv-page-overview.js';
import './pages/pv-page-orders.js';
import './pages/pv-page-estimates.js';
import './pages/pv-page-billing.js';
import './pages/pv-page-projects.js';
import './pages/pv-page-wallet.js';
import './pages/pv-page-team.js';
import './pages/pv-page-settings.js';
import './pages/pv-page-shop.js';
import './pages/pv-page-product-details.js';
import './pages/pv-page-checkout.js';
import './organisms/pv-cart-drawer.js';
import './organisms/pv-quote-drawer.js';
import { CartItem } from '../types/index.js';

import './pages/pv-page-landing.js';
import './pages/pv-page-showrooms.js';
import './pages/pv-page-services.js';
import './pages/pv-page-about.js';
import './pages/pv-page-employment.js';
import './pages/pv-page-brand-partners.js';
import './pages/pv-page-contact.js';
import './pages/pv-page-terms.js';
import './pages/pv-page-privacy.js';
import './pages/pv-page-documents.js';

@customElement('pv-app')
export class PvApp extends PvBase {
  static styles = [
    ...PvBase.styles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        font-family: var(--font-body);
        background: var(--color-bg);
      }

      .app-layout {
        display: flex;
        min-height: calc(100vh - var(--header-height, 80px));
      }
      
      .app-layout.full-width {
        display: block;
      }

      .app-main {
        flex: 1;
        padding: var(--space-2xl);
        background: white;
        overflow-x: auto;
      }
      
      .app-main.no-padding {
        padding: 0;
      }

      .impersonation-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 44px;
        background: linear-gradient(90deg, #7f1d1d, #991b1b);
        color: #fff;
        z-index: 1200;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        font-size: var(--text-sm);
      }

      .impersonation-banner button {
        border: 1px solid rgba(255, 255, 255, 0.45);
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
        border-radius: 6px;
        padding: 4px 10px;
        font-size: var(--text-xs);
        cursor: pointer;
      }

      .has-impersonation {
        --impersonation-banner-height: 44px;
        padding-top: 44px;
      }

      .placeholder-page {
        padding: var(--space-xl);
      }

      .placeholder-page h1 {
        font-family: var(--font-heading);
        font-size: var(--text-3xl);
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: var(--space-md);
      }

      .placeholder-page p {
        color: var(--color-text-muted);
      }
    `,
  ];

  @state() private isAuthenticated = false;
  @state() private currentRoute: RouteId = 'home';
  @state() private sidebarOpen = false;
  @state() private isImpersonating = false;
  @state() private impersonationEmail = '';

  // Cart State
  @state() private cartItems: CartItem[] = [];
  @state() private cartOpen = false;

  // Quote State
  @state() private quoteItems: CartItem[] = [];
  @state() private quoteOpen = false;

  private authUnsubscribe?: () => void;
  private routeUnsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();

    // Initialize router
    RouterService.init();

    // Check initial auth state
    this.isAuthenticated = AuthService.isAuthenticated();
    this.refreshImpersonationState();

    // Subscribe to auth changes
    this.authUnsubscribe = AuthService.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      this.refreshImpersonationState();
      this.updateTitle();
      // Don't force redirect if we are on home/landing, only if we were on a protected route?
      // Actually, if logging out, we probably go to home/login. 
      // If logging in, go to overview or shop.
      if (!isAuth && this.currentRoute !== 'home') {
        this.currentRoute = 'login';
      }
    });

    // Subscribe to route changes
    this.routeUnsubscribe = RouterService.subscribe((route) => {
      this.currentRoute = route;
      this.updateTitle();
    });

    // Listen for global toast events
    window.addEventListener('show-toast', this.handleToastEvent as EventListener);

    // Listen for cart events bubbling up
    this.addEventListener('add-to-cart', this.handleAddToCart as EventListener);
    this.addEventListener('toggle-cart', this.handleToggleCart as EventListener);
    this.addEventListener('clear-cart', this.handleClearCart as EventListener);
    this.addEventListener('checkout-requested', this.handleCheckoutRequested as EventListener);
    this.addEventListener('update-quantity', this.handleUpdateQuantity as EventListener);
    this.addEventListener('close-drawer', this.handleCloseDrawer as EventListener);

    // Quote Events
    this.addEventListener('add-to-quote', this.handleAddToQuote as EventListener);
    this.addEventListener('toggle-quote', this.handleToggleQuote as EventListener);
    this.addEventListener('update-quote-quantity', this.handleUpdateQuoteQuantity as EventListener);
    this.addEventListener('submit-quote', this.handleSubmitQuote as EventListener);

    this.updateTitle();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.authUnsubscribe?.();
    this.routeUnsubscribe?.();
    window.removeEventListener('show-toast', this.handleToastEvent as EventListener);
    this.removeEventListener('add-to-cart', this.handleAddToCart as EventListener);
    this.removeEventListener('toggle-cart', this.handleToggleCart as EventListener);
    this.removeEventListener('clear-cart', this.handleClearCart as EventListener);
    this.removeEventListener('checkout-requested', this.handleCheckoutRequested as EventListener);
    this.removeEventListener('update-quantity', this.handleUpdateQuantity as EventListener);
    this.removeEventListener('close-drawer', this.handleCloseDrawer as EventListener);

    this.removeEventListener('add-to-quote', this.handleAddToQuote as EventListener);
    this.removeEventListener('toggle-quote', this.handleToggleQuote as EventListener);
    this.removeEventListener('update-quote-quantity', this.handleUpdateQuoteQuantity as EventListener);
    this.removeEventListener('submit-quote', this.handleSubmitQuote as EventListener);
  }

  private handleToastEvent = (e: CustomEvent<ToastEvent>) => {
    const { message, type, duration } = e.detail;
    PvToast.show(message, type, duration);
  };

  private async updateTitle() {
    await BrandingService.getBranding();
    document.title = BrandingService.getAccountTitle();
  }

  private handleLoginSuccess() {
    this.isAuthenticated = true;
    RouterService.navigate('shop');
  }

  private handleMenuToggle() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  private refreshImpersonationState() {
    const raw = localStorage.getItem('impersonation_session');
    if (!raw) {
      this.isImpersonating = false;
      this.impersonationEmail = '';
      return;
    }
    try {
      const data = JSON.parse(raw) as { active?: boolean; targetEmail?: string };
      this.isImpersonating = !!data.active;
      this.impersonationEmail = data.targetEmail || '';
    } catch {
      this.isImpersonating = false;
      this.impersonationEmail = '';
    }
  }

  private exitImpersonation() {
    localStorage.removeItem('impersonation_session');
    AuthService.logout();
    window.location.assign('/admin');
  }

  // Cart Handlers
  private handleAddToCart(e: CustomEvent) {
    const product = e.detail.product;
    const existingItem = this.cartItems.find(item => item.id === product.id);

    if (existingItem) {
      this.cartItems = this.cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      this.cartItems = [...this.cartItems, { ...product, quantity: 1 }];
    }

    this.cartOpen = true;
    PvToast.show(`Added ${product.name} to cart`, 'success');
  }

  private handleUpdateQuantity(e: CustomEvent) {
    const { item, change } = e.detail;
    const targetItem = this.cartItems.find(i => i.id === item.id);

    if (targetItem) {
      const newQuantity = targetItem.quantity + change;
      if (newQuantity <= 0) {
        this.cartItems = this.cartItems.filter(i => i.id !== item.id);
      } else {
        this.cartItems = this.cartItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: newQuantity }
            : i
        );
      }
    }
  }

  private handleClearCart() {
    this.cartItems = [];
    this.cartOpen = false;
  }

  private handleToggleCart() {
    this.cartOpen = !this.cartOpen;
  }


  private handleCheckoutRequested() {
    RouterService.navigate('checkout');
    this.cartOpen = false;
  }

  // Quote Handlers
  private handleAddToQuote(e: CustomEvent) {
    const product = e.detail.product;
    const existingItem = this.quoteItems.find(item => item.id === product.id);

    if (existingItem) {
      this.quoteItems = this.quoteItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + (e.detail.quantity || 1) }
          : item
      );
    } else {
      this.quoteItems = [...this.quoteItems, { ...product, quantity: e.detail.quantity || 1 }];
    }

    this.quoteOpen = true;
    PvToast.show(`Added ${product.name} to draft quote`, 'success');
  }

  private handleUpdateQuoteQuantity(e: CustomEvent) {
    const { item, change } = e.detail;
    const targetItem = this.quoteItems.find(i => i.id === item.id);

    if (targetItem) {
      const newQuantity = targetItem.quantity + change;
      if (newQuantity <= 0) {
        this.quoteItems = this.quoteItems.filter(i => i.id !== item.id);
      } else {
        this.quoteItems = this.quoteItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: newQuantity }
            : i
        );
      }
    }
  }

  private handleToggleQuote() {
    this.quoteOpen = !this.quoteOpen;
  }

  private handleSubmitQuote(e: CustomEvent) {
    console.log('Submitting request with details:', e.detail);
    PvToast.show('Request submitted successfully!', 'success');
  }

  private handleCloseDrawer() {
    this.cartOpen = false;
    this.quoteOpen = false;
  }

  private renderPage() {
    switch (this.currentRoute) {
      case 'home':
        return html`<pv-page-landing></pv-page-landing>`;
      case 'product-details':
        return html`<pv-page-product-details></pv-page-product-details>`;
      case 'overview':
        return html`<pv-page-overview></pv-page-overview>`;
      case 'billing':
        return html`<pv-page-billing></pv-page-billing>`;
      case 'projects':
        return html`<pv-page-projects></pv-page-projects>`;
      case 'orders':
        return html`<pv-page-orders></pv-page-orders>`;
      case 'estimates':
        return html`<pv-page-estimates></pv-page-estimates>`;
      case 'wallet':
        return html`<pv-page-wallet></pv-page-wallet>`;
      case 'team':
        return html`<pv-page-team></pv-page-team>`;
      case 'settings':
        return html`<pv-page-settings></pv-page-settings>`;
      case 'shop':
        return html`<pv-page-shop></pv-page-shop>`;
      case 'checkout':
        return html`<pv-page-checkout .cartItems=${this.cartItems}></pv-page-checkout>`;
      case 'showrooms':
        return html`<pv-page-showrooms></pv-page-showrooms>`;
      case 'services':
        return html`<pv-page-services></pv-page-services>`;
      case 'about':
        return html`<pv-page-about></pv-page-about>`;
      case 'employment':
        return html`<pv-page-employment></pv-page-employment>`;
      case 'brand-partners':
        return html`<pv-page-brand-partners></pv-page-brand-partners>`;
      case 'contact':
        return html`<pv-page-contact></pv-page-contact>`;
      case 'terms':
        return html`<pv-page-terms></pv-page-terms>`;
      case 'privacy':
        return html`<pv-page-privacy></pv-page-privacy>`;
      case 'documents':
        return html`<pv-page-documents></pv-page-documents>`;
      default:
        return html`<pv-page-overview></pv-page-overview>`;
    }
  }

  private renderPlaceholder(title: string, description: string) {
    return html`
      <div class="placeholder-page">
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
    `;
  }

  render() {
    // Handling specific full-page routes (login handled separately but home is public)
    if (this.currentRoute === 'login') {
      return html`<pv-login @login-success=${this.handleLoginSuccess}></pv-login>`;
    }

    const contentRoutes: RouteId[] = ['home', 'shop', 'product-details', 'showrooms', 'services', 'about', 'employment', 'brand-partners', 'contact', 'terms', 'privacy'];
    const isFullPage = contentRoutes.includes(this.currentRoute);

    // Render main app layout
    return html`
      ${this.isImpersonating ? html`
        <div class="impersonation-banner">
          <span>Impersonating ${this.impersonationEmail || 'tenant user'}.</span>
          <button @click=${this.exitImpersonation}>Exit Impersonation</button>
        </div>
      ` : ''}
      <div class="${this.isImpersonating ? 'has-impersonation' : ''}">
      <pv-header 
        @menu-toggle=${this.handleMenuToggle}
        .cartCount=${this.cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        .isLanding=${isFullPage}
      ></pv-header>
      
      <pv-cart-drawer
        .open=${this.cartOpen}
        .items=${this.cartItems}
      ></pv-cart-drawer>

      <pv-quote-drawer
        .open=${this.quoteOpen}
        .items=${this.quoteItems}
      ></pv-quote-drawer>
      
      <div class="app-layout ${isFullPage ? 'full-width' : ''}">
        ${!isFullPage ? html`
        <pv-sidebar 
          class="${this.sidebarOpen ? 'open' : ''}"
          .activeRoute=${this.currentRoute}
        ></pv-sidebar>
        ` : ''}
        
        <main class="app-main ${isFullPage ? 'no-padding' : ''}">
          ${this.renderPage()}
        </main>
      </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-app': PvApp;
  }
}
