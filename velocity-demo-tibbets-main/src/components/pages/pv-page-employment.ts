
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';

@customElement('pv-page-employment')
export class PvPageEmployment extends PvBase {
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

      .split-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-2xl);
        align-items: center;
      }

      .benefit-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--space-xl);
      }

      .benefit-card {
        padding: var(--space-xl);
        background: #f8fafc;
        border-radius: var(--radius-lg);
        text-align: center;
      }

      .benefit-icon {
        width: 48px;
        height: 48px;
        background: var(--color-primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--space-md);
      }

      .benefit-title {
        font-weight: 700;
        font-size: 1.25rem;
        margin-bottom: var(--space-sm);
        color: var(--color-primary);
      }

      .cta-box {
        background: var(--color-accent);
        color: white;
        padding: var(--space-2xl);
        border-radius: var(--radius-xl);
        text-align: center;
        margin-top: var(--space-3xl);
      }

      .btn-white {
        display: inline-block;
        background: white;
        color: var(--color-accent);
        padding: 1rem 2rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-top: var(--space-lg);
      }

      @media (max-width: 768px) {
        .split-layout { grid-template-columns: 1fr; }
        h1 { font-size: 2.5rem; }
      }
    `,
  ];

  render() {
    return html`
      <div class="hero-content">
        <div class="container">
          <h1>Careers at Tibbetts</h1>
          <p>Grow your career with Florida’s leading building material supplier</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="split-layout">
            <div class="text-content">
              <h2 style="font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: var(--space-lg); color: var(--color-primary);">Work With Us</h2>
              <p style="font-size: 1.125rem; line-height: 1.8; margin-bottom: var(--space-md); color: var(--color-text-light);">
                At Tibbetts Lumber, we are more than just a company; we are a family. 
                We believe that our people are our greatest asset and the foundation of our success. 
                Whether you're an experienced professional or just starting your career, 
                we offer a supportive environment where you can grow and excel.
              </p>
              <p style="font-size: 1.125rem; line-height: 1.8; color: var(--color-text-light);">
                We are always looking for dedicated, hardworking individuals to join our team in 
                sales, operations, logistics, production, and administration across our 11 Florida locations.
              </p>
            </div>
            <div class="image-container">
              <img src="/tibbetts-team.png" alt="Tibbetts Lumber Team" style="width: 100%; height: 350px; object-fit: cover; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);">
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="background: white;">
        <div class="container">
          <h2 style="text-align: center; font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: var(--space-2xl); color: var(--color-primary);">Employee Benefits</h2>
          <div class="benefit-grid">
            <div class="benefit-card">
              <div class="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div class="benefit-title">Insurance</div>
              <p>Comprehensive health, dental, and vision coverage for you and your family.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div class="benefit-title">Retirement</div>
              <p>Competitive 401(k) retirement plans with company matching contributions.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div class="benefit-title">Paid Time Off</div>
              <p>Generous vacation and sick leave policies to support work-life balance.</p>
            </div>
          </div>
          
          <div class="cta-box">
            <h3>Find Your Path with Tibbetts Lumber</h3>
            <p>View our current openings on our career portal.</p>
            <a href="https://workforcenow.adp.com" target="_blank" class="btn-white">Browse All Jobs</a>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-page-employment': PvPageEmployment;
  }
}
