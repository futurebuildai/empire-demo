
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { RouterService } from '../../services/router.service.js';
import { AuthService } from '../../services/auth.service.js';
import '../organisms/pv-store-hero.js';

@customElement('pv-page-landing')
export class PvPageLanding extends PvBase {
  static styles = [
    ...PvBase.styles,
    css`
      :host {
        display: block;
        width: 100%;
        color: var(--color-text);
      }

      /* Animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-up {
        animation: fadeInUp 0.8s ease-out forwards;
        opacity: 0;
      }
      
      .stagger-1 { animation-delay: 0.1s; }
      .stagger-2 { animation-delay: 0.2s; }
      .stagger-3 { animation-delay: 0.3s; }

      /* Utility */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--space-xl);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition: all 0.2s;
        cursor: pointer;
        text-decoration: none;
      }
      
      .btn-primary {
        background: var(--color-primary);
        color: white;
        border: 2px solid var(--color-primary);
      }
      
      .btn-primary:hover {
        background: var(--color-primary-dark);
        border-color: var(--color-primary-dark);
      }

      .btn-outline {
        background: transparent;
        color: white;
        border: 2px solid white;
      }

      .btn-outline:hover {
        background: white;
        color: var(--color-primary);
      }

      /* Hero Section */
      .hero {
        position: relative;
        background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') no-repeat center center;
        background-size: cover;
        color: white;
        padding: 160px 0;
        overflow: hidden;
      }

      .hero-content {
        position: relative;
        z-index: 10;
        max-width: 800px;
        /* Align right like reference? Or center? Reference has text left/center. Image 4 is centered. */
        margin: 0 auto; 
        text-align: center;
      }

      h1 {
        font-family: var(--font-heading);
        font-size: 4.5rem;
        line-height: 1.1;
        font-weight: 600;
        margin-bottom: var(--space-lg);
        letter-spacing: 0.01em;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      }

      .hero-subtitle {
        font-size: 1.5rem;
        line-height: 1.6;
        color: rgba(255,255,255,0.95);
        margin-bottom: var(--space-xl);
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
      }

      /* Hero Search */
      .hero-search {
        max-width: 600px;
        margin: 0 auto var(--space-2xl);
        position: relative;
      }
      
      .hero-search .search-input-wrapper {
        position: relative;
        display: flex;
        background: white;
        border-radius: var(--radius-full);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        padding: 6px;
      }

      .hero-search input {
        flex: 1;
        border: none;
        padding: 16px 16px 16px 52px;
        font-size: 1.125rem;
        border-radius: var(--radius-full);
        outline: none;
        color: var(--color-text);
        min-width: 0; /* Flex fix */
      }

      .hero-search .search-icon {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-muted);
        width: 24px;
        height: 24px;
        pointer-events: none;
      }

      .hero-search .search-btn {
        background: var(--color-accent);
        color: white;
        border: none;
        padding: 0 32px;
        border-radius: var(--radius-full);
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;
      }

      .hero-search .search-btn:hover {
        background: var(--color-accent-dark);
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }

      /* Welcome Strip */
      .welcome-strip {
        background: #1e293b;
        color: white;
        padding: var(--space-lg) 0;
        text-align: center;
      }
      
      .welcome-text {
        font-size: 1.25rem;
        font-weight: 600;
      }
      
      .welcome-text span {
        color: var(--color-accent);
      }

      /* Departments strip */
      .departments {
        background: #f8fafc;
        padding: var(--space-3xl) 0;
      }

      .dept-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-lg);
      }

      .dept-card {
        aspect-ratio: 4/3;
        background-color: #e2e8f0;
        border-radius: var(--radius-lg);
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-decoration: none;
        display: block;
      }

      .dept-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
      }

      .dept-card:hover .dept-bg {
        transform: scale(1.05);
      }

      .dept-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        transition: transform 0.5s ease;
      }

      .dept-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: var(--space-lg);
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        color: white;
      }

      .dept-name {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: var(--space-xs);
      }
      
      .dept-link {
        font-size: 0.875rem;
        color: rgba(255,255,255,0.8);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
      }
      
      /* Pattern backgrounds for departments since we "don't need product images" */
      /* Velocity branded backgrounds - Now using high-quality images */
      .bg-lumber { background-image: url('/images/categories/lumber.png'); }
      .bg-windows { background-image: url('/images/categories/windows-doors.png'); }
      .bg-roofing { background-image: url('/images/categories/roofing-siding.png'); }
      .bg-tools { background-image: url('/images/categories/tools-hardware.png'); }
      .bg-decking { background-image: url('/images/categories/decking-railing.png'); }
      .bg-safety { background-image: url('/images/categories/safety-gear.png'); } 
      .bg-paint { background-image: url('/images/categories/paint-finish.png'); }
      .bg-kitchen { background-image: url('/images/categories/kitchen-bath.png'); }

      /* Add subtle accent borders to cards */
      .dept-card {
        border-top: 4px solid var(--color-accent);
      }

      /* Footer */
      .landing-footer {
        background: #0f172a;
        color: white;
        padding: var(--space-3xl) 0;
        text-align: center;
      }

      .footer-links {
        display: flex;
        justify-content: center;
        gap: var(--space-xl);
        margin-bottom: var(--space-xl);
      }

      .footer-link {
        color: #94a3b8;
        text-decoration: none;
        transition: color 0.2s;
      }

      .footer-link:hover {
        color: white;
      }

      .copyright {
        color: #64748b;
        font-size: 0.875rem;
      }

      @media (max-width: 768px) {
        h1 { font-size: 2.5rem; }
        .hero { padding: 80px 0 100px; }
      }

      /* Shared Section Headers */
      .section-header {
        text-align: center;
        margin-bottom: var(--space-2xl);
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }

      .section-title {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: var(--space-sm);
        color: var(--color-text);
      }

      .section-subtitle {
        font-size: 1.125rem;
        color: var(--color-text-muted);
        line-height: 1.6;
      }

      /* Services Section */
      .services {
        padding: var(--space-3xl) 0;
        background: white;
      }

      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--space-2xl);
        padding: var(--space-lg) 0;
      }

      .service-card {
        padding: var(--space-xl);
        border-radius: var(--radius-lg);
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .service-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
        border-color: var(--color-primary-light);
      }

      .service-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--color-primary) 10%, transparent);
        color: var(--color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--space-lg);
        transition: transform 0.3s ease;
      }

      .service-card:hover .service-icon {
        transform: scale(1.1);
        background: var(--color-primary);
        color: white;
      }

      .service-title {
        font-family: var(--font-heading);
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: var(--space-md);
        color: var(--color-text);
      }

      .service-desc {
        color: var(--color-text-muted);
        line-height: 1.6;
        font-size: 0.95rem;
      }

      /* Featured Brands */
      .brands-section {
        padding: var(--space-3xl) 0;
        background: white;
      }

      .brands-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--space-xl);
      }

      .brand-card {
        background: #f1f5f9;
        border-radius: var(--radius-lg);
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .brand-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
      }

      .brand-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        background-color: #cbd5e1;
      }

      .brand-content {
        padding: var(--space-lg);
      }

      .brand-logo {
        height: 48px;
        width: auto;
        margin-bottom: var(--space-md);
        /* Use a filter to make logos monochromatic if needed, or keep color */
        object-fit: contain;
        object-position: left;
      }

      .brand-title {
        font-family: var(--font-heading);
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: var(--space-xs);
        color: var(--color-text);
      }
      
      .brand-desc {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        margin-bottom: var(--space-md);
      }

      .brand-link {
        color: var(--color-accent);
        font-weight: 600;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* Trex specific styling for demo */
      .trex-card {
        background: linear-gradient(to right, #2c3e50, #4ca1af); 
        color: white;
      }
      .trex-card .brand-title, 
      .trex-card .brand-desc {
        color: white;
      }
      .trex-card .brand-link {
        color: #fb923c; /* lighter orange */
      }
    `,
  ];

  render() {
    return html`
      <!-- Hero -->
      <pv-store-hero 
        title="Florida’s Premier Provider of Construction Materials"
        subtitle="Established in 1949, Tibbetts Lumber Co. provides high-quality building materials and exceptional service across Florida and the Caribbean."
        background="/tibbetts-hero.jpg"
        .showSearch=${true}
        .isLoggedIn=${AuthService.isAuthenticated()}
        @search=${(e: CustomEvent) => RouterService.navigate('shop', { search: e.detail.query })}
      ></pv-store-hero>

      <!-- Welcome Strip -->
      <div class="welcome-strip">
        <div class="container">
          <div class="welcome-text">
            Providing Quality Building Materials <span>Since 1949</span>. Experience the Tibbetts Lumber difference today.
          </div>
        </div>
      </div>

      <!-- Shop Our Brands -->
      <section class="brands-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Shop Our Brands</h2>
            <p class="section-subtitle">Premium partners for premium projects.</p>
          </div>
          
          <div class="brands-grid">
            <!-- Trex Card -->
            <a href="#shop?brand=trex" @click=${() => RouterService.navigate('shop', { brand: 'trex' })} class="brand-card">
              <img src="/brands/trex-decking-ai.png" alt="Trex Decking" class="brand-image">
              <div class="brand-content">
                <div class="brand-title">Trex Decking</div>
                <div class="brand-desc">The world's #1 decking brand. High-performance composite decking that's durable and low-maintenance.</div>

                <div class="brand-link">
                  Shop Collection 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </a>

            <!-- Placeholder Brand 2 -->
             <a href="#shop?brand=milgard" @click=${() => RouterService.navigate('shop', { brand: 'milgard' })} class="brand-card">
              <img src="/brands/milgard-windows-ai.png" alt="Milgard Windows" class="brand-image">
              <div class="brand-content">
                <div class="brand-title">Milgard Windows</div>
                <div class="brand-desc">Beautiful, energy-efficient windows and patio doors to make your home comfortable.</div>
                <div class="brand-link">
                  View Products
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </a>

            <!-- Placeholder Brand 3 -->
            <a href="#shop?brand=simpson" @click=${() => RouterService.navigate('shop', { brand: 'simpson' })} class="brand-card">
              <img src="/brands/simpson-strongtie-ai.png" alt="Simpson Strong-Tie" class="brand-image">
              <div class="brand-content">
                <div class="brand-title">Simpson Strong-Tie</div>
                <div class="brand-desc">Structural connectors, fasteners, and anchoring systems for safer, stronger structures.</div>
                <div class="brand-link">
                  View Products
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- Departments -->
      <section class="departments">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Comprehensive Catalog</h2>
            <p class="section-subtitle">Everything you need for residential and commercial construction.</p>
          </div>
          <div class="dept-grid">
            ${[
        { name: 'Fir/Pressure Treated', bg: 'bg-lumber', params: { category: 'building-materials' } },
        { name: 'Windows & Doors', bg: 'bg-windows', params: { search: 'windows' } },
        { name: 'Roofing & Siding', bg: 'bg-roofing', params: { search: 'roofing' } },
        { name: 'Tools & Hardware', bg: 'bg-tools', params: { category: 'hardware' } },
        { name: 'Decking & Railing', bg: 'bg-decking', params: { category: 'building-materials' } },
        { name: 'Safety Gear', bg: 'bg-safety', params: { category: 'safety-gear' } },
        { name: 'Paint & Finish', bg: 'bg-paint', params: { search: 'paint' } },
        { name: 'Kitchen & Bath', bg: 'bg-kitchen', params: { search: 'kitchen' } }
      ].map(dept => {
        const params = new URLSearchParams();
        if (dept.params.category) params.append('category', dept.params.category);
        if (dept.params.search) params.append('search', dept.params.search);
        const href = `#shop?${params.toString()}`;

        return html`
              <a href="${href}" class="dept-card">
                <div class="dept-bg ${dept.bg}"></div>
                <div class="dept-overlay">
                  <div class="dept-name">${dept.name}</div>
                  <div class="dept-link">View Products</div>
                </div>
              </a>
            `;
      })}
          </div>
        </div>
      </section>

      <!-- Services -->
      <section class="services">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Professional Services</h2>
            <p class="section-subtitle">More than just a supplier. We are an extension of your team.</p>
          </div>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 class="service-title">Digital Takeoffs & Estimates</h3>
              <p class="service-desc">
                Upload your plans and get detailed, accurate material lists generated by our 
                proprietary estimation engine within 24 hours.
              </p>
            </div>

            <div class="service-card">
              <div class="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <h3 class="service-title">Precision Logistics</h3>
              <p class="service-desc">
                Real-time GPS tracking on all deliveries. Know exactly when your materials 
                will arrive with our "On-The-Dot" guarantee.
              </p>
            </div>

            <div class="service-card">
              <div class="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="service-title">Structural Solutions</div>
              <p class="service-desc">
                Our in-house engineering team provides rapid truss design, EWP sizing, 
                and load calculations to keep your project compliant and safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="container">
          <div class="footer-links">
            <a href="#about" class="footer-link">About Us</a>
            <a href="#employment" class="footer-link">Careers</a>
            <a href="#terms" class="footer-link">Terms</a>
            <a href="#privacy" class="footer-link">Privacy</a>
            <a href="#contact" class="footer-link">Contact</a>
          </div>
          <div class="copyright">
            &copy; 2026 Tibbetts Lumber Co. All rights reserved.
          </div>
        </div>
      </footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-page-landing': PvPageLanding;
  }
}
