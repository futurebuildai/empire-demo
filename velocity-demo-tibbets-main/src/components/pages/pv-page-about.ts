
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';

@customElement('pv-page-about')
export class PvPageAbout extends PvBase {
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

      .content-section {
        padding: var(--space-3xl) 0;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-2xl);
        align-items: center;
      }

      .text-content h2 {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        margin-bottom: var(--space-lg);
        color: var(--color-primary);
      }

      .text-content p {
        font-size: 1.125rem;
        line-height: 1.8;
        margin-bottom: var(--space-md);
        color: var(--color-text-light);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-xl);
        margin-top: var(--space-2xl);
      }

      .stat-item {
        text-align: center;
      }

      .stat-number {
        display: block;
        font-size: 3rem;
        font-weight: 700;
        color: var(--color-accent);
        margin-bottom: var(--space-xs);
      }

      .stat-label {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-text-muted);
      }

      .values-section {
        background: #f8fafc;
        padding: var(--space-3xl) 0;
      }

      .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--space-xl);
        margin-top: var(--space-2xl);
      }

      .value-card {
        background: white;
        padding: var(--space-xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
      }

      .value-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: var(--space-sm);
        color: var(--color-primary);
      }

      @media (max-width: 768px) {
        .grid { grid-template-columns: 1fr; }
        h1 { font-size: 2.5rem; }
      }
    `,
  ];

  render() {
    return html`
      <div class="hero-content">
        <div class="container">
          <h1>About Tibbetts Lumber</h1>
          <p>Building Florida's Future Since 1949</p>
        </div>
      </div>

      <section class="content-section">
        <div class="container">
          <div class="grid">
            <div class="text-content">
              <h2>Our Heritage</h2>
              <p>
                Founded in 1949 by Linton N. Tibbetts, Tibbetts Lumber Co. has grown from a single location 
                into a major force in the Florida construction industry. Our commitment to quality materials 
                and exceptional service has remained unchanged for over seven decades.
              </p>
              <p>
                Today, we serve professional builders and homeowners alike across Florida and the Caribbean, 
                providing everything from foundation to roof, powered by a team of dedicated experts 
                who understand the unique needs of our local markets.
              </p>
            </div>
            <div class="image-content">
              <img src="/tibbetts-heritage.png" alt="Tibbetts Lumber Heritage" style="width: 100%; height: 400px; object-fit: cover; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);">
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">1949</span>
              <span class="stat-label">Founded</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">11</span>
              <span class="stat-label">Locations</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">75+</span>
              <span class="stat-label">Years of Service</span>
            </div>
          </div>
        </div>
      </section>

      <section class="values-section">
        <div class="container">
          <h2 style="text-align: center; font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: var(--space-xl); color: var(--color-primary);">Our Core Values</h2>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-title">Integrity</div>
              <p>We believe in doing the right thing, always. Honesty and transparency are at the heart of our relationships.</p>
            </div>
            <div class="value-card">
              <div class="value-title">Quality</div>
              <p>We source only the best materials to ensuring your projects are built to last and stand the test of time.</p>
            </div>
            <div class="value-card">
              <div class="value-title">Service</div>
              <p>Our customers come first. We go above and beyond to provide the support and expertise you need to succeed.</p>
            </div>
            <div class="value-card">
              <div class="value-title">Community</div>
              <p>As a family-owned Florida business, we are deeply committed to supporting the communities where we live and work.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-page-about': PvPageAbout;
  }
}
