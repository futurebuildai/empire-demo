
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';

@customElement('pv-page-terms')
export class PvPageTerms extends PvBase {
    static styles = [
        ...PvBase.styles,
        css`
      :host {
        display: block;
        width: 100%;
        color: var(--color-text);
      }

      .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 60px var(--space-xl);
      }

      h1 {
        font-family: var(--font-heading);
        font-size: 3rem;
        margin-bottom: var(--space-xl);
        color: var(--color-primary);
        text-align: center;
      }

      .content {
        line-height: 1.8;
        font-size: 1.125rem;
        color: var(--color-text-light);
      }

      h2 {
        font-family: var(--font-heading);
        font-size: 1.75rem;
        margin-top: var(--space-2xl);
        margin-bottom: var(--space-md);
        color: var(--color-primary);
      }

      p {
        margin-bottom: var(--space-md);
      }

      ul {
        margin-bottom: var(--space-md);
        padding-left: var(--space-xl);
      }

      li {
        margin-bottom: var(--space-xs);
      }
    `,
    ];

    render() {
        return html`
      <div class="container">
        <h1>Terms of Service</h1>
        <div class="content">
          <p>Last Updated: February 2026</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to the Tibbetts Lumber Co. website. By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our site.</p>

          <h2>2. Commercial Credit</h2>
          <p>Commercial credit accounts are subject to approval and are governed by our separate Commercial Credit Agreement. Payment terms for such accounts are typically NET 30 unless otherwise specified in writing.</p>

          <h2>3. Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, and images, is the property of Tibbetts Lumber Co. or its content suppliers and is protected by international copyright laws.</p>

          <h2>4. Limitation of Liability</h2>
          <p>Tibbetts Lumber Co. shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services or website.</p>

          <h2>5. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions.</p>
        </div>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pv-page-terms': PvPageTerms;
    }
}
