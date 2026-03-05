
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';

@customElement('pv-page-showrooms')
export class PvPageShowrooms extends PvBase {
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

      .text-center {
        text-align: center;
        max-width: 800px;
        margin: 0 auto var(--space-2xl);
      }

      .showroom-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: var(--space-2xl);
      }

      .showroom-card {
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        overflow: hidden;
        transition: transform 0.3s ease;
      }

      .showroom-card:hover {
        transform: translateY(-5px);
      }

      .showroom-image {
        height: 250px;
        background: #cbd5e1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        font-weight: 600;
      }

      .showroom-body {
        padding: var(--space-xl);
      }

      .showroom-title {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        margin-bottom: var(--space-sm);
        color: var(--color-primary);
      }

      .showroom-desc {
        color: var(--color-text-light);
        line-height: 1.6;
        margin-bottom: var(--space-lg);
      }

      .btn-outline {
        display: inline-block;
        border: 2px solid var(--color-primary);
        color: var(--color-primary);
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition: all 0.2s;
      }

      .btn-outline:hover {
        background: var(--color-primary);
        color: white;
      }

      @media (max-width: 768px) {
        h1 { font-size: 2.5rem; }
      }
    `,
    ];

    render() {
        return html`
      <div class="hero-content">
        <div class="container">
          <h1>Experience Our Showrooms</h1>
          <p>Touch, feel, and visualize your next project</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="text-center">
            <h2 style="font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: var(--space-lg); color: var(--color-primary);">Inspiring Spaces</h2>
            <p style="font-size: 1.125rem; line-height: 1.8; color: var(--color-text-light);">
              Our world-class showrooms feature full-size displays of windows, doors, 
              columns, and moulding. Meet with our design consultants to find the perfect 
              match for your architectural style.
            </p>
          </div>

          <div class="showroom-grid">
            <div class="showroom-card">
              <div class="showroom-image">[Window & Door Gallery]</div>
              <div class="showroom-body">
                <h3 class="showroom-title">Window & Door Center</h3>
                <p class="showroom-desc">
                  Explore the latest energy-efficient windows and stunning entry door 
                  systems from top brands like Milgard, Andersen, and PGT.
                </p>
                <a href="#contact" class="btn-outline">Plan Your Visit</a>
              </div>
            </div>

            <div class="showroom-card">
              <div class="showroom-image">[Millwork Showcase]</div>
              <div class="showroom-body">
                <h3 class="showroom-title">Millwork & Trim Gallery</h3>
                <p class="showroom-desc">
                  From classic crown moulding to modern architectural trim, see how the 
                  right details can transform any room in your home.
                </p>
                <a href="#contact" class="btn-outline">Plan Your Visit</a>
              </div>
            </div>

            <div class="showroom-card">
              <div class="showroom-image">[Interior Design Studio]</div>
              <div class="showroom-body">
                <h3 class="showroom-title">Kitchen & Bath Studio</h3>
                <p class="showroom-desc">
                  Discover premium cabinetry, countertops, and hardware options in our 
                  curated kitchen and bath environments.
                </p>
                <a href="#contact" class="btn-outline">Plan Your Visit</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pv-page-showrooms': PvPageShowrooms;
    }
}
