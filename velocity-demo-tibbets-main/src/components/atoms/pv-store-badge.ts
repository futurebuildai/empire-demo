
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pv-store-badge')
export class PvStoreBadge extends LitElement {
    @property({ type: String }) type: 'new' | 'sale' | 'bestseller' = 'new';
    @property({ type: String }) label = '';

    static styles = css`
        :host {
            display: inline-block;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            line-height: 1.25;
        }

        .badge.new {
            background-color: #E0F2FE;
            color: #0369A1;
        }

        .badge.sale {
            background-color: #FEF2F2;
            color: #B91C1C;
        }

        .badge.bestseller {
            background-color: #FFF7ED;
            color: #C2410C;
        }
    `;

    render() {
        const displayText = this.label || this.type;
        return html`
            <span class="badge ${this.type}">${displayText}</span>
        `;
    }
}
