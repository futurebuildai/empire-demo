
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';

@customElement('pv-page-privacy')
export class PvPagePrivacy extends PvBase {
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
    `,
    ];

    render() {
        return html`
      <div class="container">
        <h1>Privacy Policy</h1>
        <div class="content">
          <p>Last Updated: February 2026</p>
          
          <h2>1. Information Collection</h2>
          <p>We collect information you provide directly to us when you create an account, request a quote, make a purchase, or contact us for support. This may include your name, email address, phone number, and mailing address.</p>

          <h2>2. Use of Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, to send technical notices and support messages, and to communicate with you about products and services.</p>

          <h2>3. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>

          <h2>4. Disclosure of Information</h2>
          <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>

          <h2>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@tibbettslumber.com.</p>
        </div>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pv-page-privacy': PvPagePrivacy;
    }
}
