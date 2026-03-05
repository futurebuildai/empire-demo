
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';

@customElement('pv-page-contact')
export class PvPageContact extends PvBase {
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

      .location-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--space-xl);
        margin-top: var(--space-2xl);
      }

      .location-card {
        background: white;
        padding: var(--space-xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--color-border);
      }

      .location-name {
        font-weight: 700;
        font-size: 1.25rem;
        margin-bottom: var(--space-md);
        color: var(--color-primary);
        border-bottom: 2px solid var(--color-accent);
        display: inline-block;
        padding-bottom: 4px;
      }

      .location-info {
        list-style: none;
        padding: 0;
        margin: var(--space-md) 0;
      }

      .info-item {
        display: flex;
        gap: 12px;
        margin-bottom: var(--space-sm);
        font-size: 0.9375rem;
        color: var(--color-text-light);
      }

      .info-icon {
        color: var(--color-accent);
        flex-shrink: 0;
        margin-top: 3px;
      }

      .corporate-header {
        background: #f8fafc;
        border-radius: var(--radius-xl);
        padding: var(--space-2xl);
        margin-bottom: var(--space-3xl);
        text-align: center;
      }

      @media (max-width: 768px) {
        h1 { font-size: 2.5rem; }
      }
    `,
    ];

    private locations = [
        { name: 'Tampa', address: '9602 N. Hwy 301, Tampa, FL 33619', phone: '(800) 283-3254' },
        { name: 'Pensacola', address: '6960 N. Ninth Ave., Pensacola, FL 32504', phone: '(850) 474-1221' },
        { name: 'Ft. Myers', address: '8501 Alico Rd., Ft. Myers, FL 33912', phone: '(239) 433-4100' },
        { name: 'Melbourne', address: '2280 W. Eau Gallie Blvd., Melbourne, FL 32935', phone: '(321) 259-3333' },
        { name: 'Ocala', address: '1803 NE 12th Ter., Ocala, FL 34470', phone: '(352) 622-4221' },
        { name: 'Crystal River', address: '7840 W. Gulf-To-Lake Hwy., Crystal River, FL 34429', phone: '(352) 795-4221' },
        { name: 'Lecanto', address: '2800 W. Gulf-To-Lake Hwy., Lecanto, FL 34461', phone: '(352) 746-4221' },
        { name: 'Englewood', address: '150 N. Indiana Ave., Englewood, FL 34223', phone: '(941) 474-3221' },
        { name: 'Largo Truss', address: '13300 Belcher Rd. S., Largo, FL 33773', phone: '(727) 535-4600' },
        { name: 'Pensacola Millwork', address: '2900 N. Palafox St., Pensacola, FL 32501', phone: '(850) 438-1600' },
        { name: 'St. Augustine', address: '3505 US Highway 1 South, St. Augustine, FL 32086', phone: '(904) 794-5500' },
    ];

    render() {
        return html`
      <div class="hero-content">
        <div class="container">
          <h1>Contact Us</h1>
          <p>We're here to help at any of our 11 locations</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="corporate-header">
            <h2 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: var(--space-md); color: var(--color-primary);">Corporate Headquarters</h2>
             <p style="font-size: 1.125rem; font-weight: 500;">9602 N. Hwy 301, Tampa, FL 33619</p>
             <p style="font-size: 1.125rem;">Phone: (800) 283-3254 | Email: info@empireinc.com</p>
          </div>

          <h2 style="text-align: center; font-family: var(--font-heading); font-size: 2.5rem; color: var(--color-primary);">Our Locations</h2>
          
          <div class="location-grid">
            ${this.locations.map(loc => html`
              <div class="location-card">
                <div class="location-name">${loc.name}</div>
                <ul class="location-info">
                  <li class="info-item">
                    <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${loc.address}</span>
                  </li>
                  <li class="info-item">
                    <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>${loc.phone}</span>
                  </li>
                  <li class="info-item">
                    <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Mon - Fri: 7:00 AM - 4:30 PM</span>
                  </li>
                </ul>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pv-page-contact': PvPageContact;
    }
}
