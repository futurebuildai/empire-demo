
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';

@customElement('pv-page-brand-partners')
export class PvPageBrandPartners extends PvBase {
  static styles = [
    ...PvBase.styles,
    css`
      :host {
        display: block;
        width: 100%;
        color: var(--color-text);
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--space-xl);
      }

      .hero-content {
        padding: 100px 0;
        background: var(--color-primary);
        color: white;
        text-align: center;
      }

      h1 {
        font-family: var(--font-heading);
        font-size: 3.5rem;
        margin-bottom: var(--space-md);
      }

      .section {
        padding: var(--space-3xl) 0;
      }

      .brand-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-2xl);
        align-items: center;
        text-align: center;
      }

      .brand-item {
        padding: var(--space-lg);
        filter: grayscale(1);
        opacity: 0.6;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .brand-item:hover {
        filter: grayscale(0);
        opacity: 1;
        transform: scale(1.1);
      }

      .brand-placeholder {
        width: 150px;
        height: 80px;
        background: #f1f5f9;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: var(--color-primary);
      }

      .brand-name {
        margin-top: var(--space-sm);
        font-weight: 600;
        color: var(--color-text);
      }

      @media (max-width: 768px) {
        h1 { font-size: 2.5rem; }
      }
    `,
  ];

  private brandList = [
    'Milgard', 'Andersen', 'James Hardie', 'Simpson Strong-Tie',
    'Trex', 'PGT', 'Therma-Tru', 'Deckorators', 'MiTeK',
    'Silver Line', 'Custom Window', 'Marvin', 'JELD-WEN', 'Azek'
  ];

  render() {
    return html`
      <div class="hero-content">
        <div class="container">
          <h1>Our Brand Partners</h1>
          <p>We partner with the industry's most trusted manufacturers</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <h2 style="text-align: center; font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: var(--space-3xl); color: var(--color-primary);">Industry Leaders</h2>
          
          <div style="text-align: center;">
            <img src="/brand-logos.png" alt="Tibbetts Lumber Brand Partners" style="max-width: 100%; height: auto; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); margin-bottom: var(--space-2xl);">
          </div>
          
          <div class="brand-grid">
            ${this.brandList.map(brand => html`
              <div class="brand-item">
                <div class="brand-name">${brand}</div>
              </div>
            `)}
          </div>
        </div>
      </section>

      <section class="section" style="background: #f8fafc;">
        <div class="container" style="text-align: center;">
          <h2 style="font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: var(--space-lg); color: var(--color-primary);">Uncompromising Quality</h2>
          <p style="max-width: 800px; margin: 0 auto; font-size: 1.125rem; line-height: 1.8; color: var(--color-text-light);">
            We carefully select our partners based on their reputation for innovation, 
            durability, and support. By working with the best in the business, 
            we ensure that our customers receive materials they can stand behind.
          </p>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-page-brand-partners': PvPageBrandPartners;
  }
}
