
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';

@customElement('pv-page-services')
export class PvPageServices extends PvBase {
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

      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: var(--space-2xl);
      }

      .service-card {
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        overflow: hidden;
        border-top: 5px solid var(--color-accent);
        transition: transform 0.3s ease;
      }

      .service-card:hover {
        transform: translateY(-10px);
      }

      .service-body {
        padding: var(--space-xl);
      }

      .service-title {
        font-family: var(--font-heading);
        font-size: 1.75rem;
        margin-bottom: var(--space-md);
        color: var(--color-primary);
      }

      .service-desc {
        font-size: 1.125rem;
        line-height: 1.7;
        color: var(--color-text-light);
        margin-bottom: var(--space-lg);
      }

      .feature-list {
        list-style: none;
        padding: 0;
      }

      .feature-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: var(--space-sm);
        font-weight: 500;
      }

      .feature-icon {
        color: var(--color-accent);
        flex-shrink: 0;
      }

      .cta-section {
        background: #f1f5f9;
        text-align: center;
        padding: var(--space-3xl) 0;
      }

      .btn {
        display: inline-block;
        background: var(--color-accent);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-top: var(--space-xl);
        transition: background 0.2s;
      }

      .btn:hover {
        background: var(--color-accent-dark);
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
          <h1>Professional Services</h1>
          <p>Expertise that drives your project forward</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="services-grid">
            <!-- Digital Takeoffs -->
            <div class="service-card">
              <div class="service-body">
                <h2 class="service-title">Digital Takeoffs & Estimates</h2>
                <p class="service-desc">
                  Our professional estimating team uses state-of-the-art software to provide 
                  precise material takeoffs from your digital blueprints.
                </p>
                <ul class="feature-list">
                  <li class="feature-item">
                    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    24-Hour quick turnaround for standard projects
                  </li>
                  <li class="feature-item">
                    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Comprehensive lumber and hardware lists
                  </li>
                  <li class="feature-item">
                    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Direct integration with our inventory systems
                  </li>
                </ul>
              </div>
            </div>

            <!-- Precision Logistics -->
            <div class="service-card">
              <div class="service-body">
                <h2 class="service-title">Precision Logistics</h2>
                <p class="service-desc">
                  Reliable delivery is the backbone of any successful construction project. 
                  Our fleet is equipped with real-time GPS tracking.
                </p>
                <ul class="feature-list">
                  <li class="feature-item">
                    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    "On-The-Dot" delivery guarantee
                  </li>
                  <li class="feature-item">
                    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Boom truck and Moffett-equipped delivery
                  </li>
                  <li class="feature-item">
                    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Jobsite progress photos upon delivery
                  </li>
                </ul>
              </div>
            </div>

            <!-- Structural Solutions -->
            <div class="service-card">
              <div class="service-body">
                <h2 class="service-title">Structural Solutions</h2>
                <p class="service-desc">
                  Our in-house engineering and design teams specialize in complex 
                  structural components and engineered wood products.
                </p>
                <ul class="feature-list">
                  <li class="feature-item">
                    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                   Custom Roof and Floor Truss Design
                  </li>
                  <li class="feature-item">
                    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    EWP / I-Joist Layout and Sizing
                  </li>
                  <li class="feature-item">
                    <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Professional Engineering (PE) Sealed Plans
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="cta-section">
        <div class="container">
          <h2>Ready to get started?</h2>
          <p>Contact your local Tibbetts Lumber representative to discuss your next project.</p>
          <a href="#contact" class="btn">Find a Location</a>
        </div>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pv-page-services': PvPageServices;
    }
}
