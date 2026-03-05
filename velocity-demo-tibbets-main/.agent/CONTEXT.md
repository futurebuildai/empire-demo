# Project Context

## What is My Account Lite?

My Account Lite is a dedicated Pro customer portal for **LBM (Lumber & Building Materials)** dealers. It is designed to be a standalone widget or subdomain companion to a dealer's existing website. This session focused on refactoring the portal for **Empire Building Materials**. It provides:
- A "My Account" portal for Pro customers (contractors, builders) to manage their business
- Deep integration with dealer ERP systems for orders, billing, and projects

## Target Users

| User Type | Description | Key Needs |
|-----------|-------------|-----------|
| **Pro Customer** | Contractor, builder | Account management, credit status, reordering, team access |
| **Admin** | Lumber yard staff | Manage Pro accounts, invoices, and job sites |

## Business Goals

1. **Build Pro loyalty** — Premium account portal with self-service features
2. **Reduce friction** — Project organization, invoice payment, and estimate conversion
3. **Integrate with ERP** — Real-time access to business data (orders, invoices, balances)
4. **Standalone Portability** — Easily deployable as a subdomain or linked widget

## Design Language

- **Color Palette:** Slate (#1e293b) + Orange (#f97316)
- **Typography:** Space Grotesk (headings) + Inter (body)
- **Aesthetic:** Modern industrial, clean, professional
- **Logo:** Empire Building Materials
- **Tagline:** "Dealer-to-Distributor Customer Portal"

## Technical Context

- **Frontend:** Vanilla HTML/CSS/JS (Standalone Account Portal)
- **Scope:** **Frontend Only**. This repository contains the UI and client-side logic.
- **Backend Strategy:** Map out architecture and API schemas in documentation to ensure a seamless future handoff to a separate backend repository.
- **Architecture Docs:** [.system-docs/](../.system-docs/) (Source of Truth for mapping)
- **Handoff Target:** Go/Postgres backend (planned, but out of scope for this repo)
- **Deployment:** Subdomain widget model

## Current State (Phase 5: Empire Building Materials Refactor)
The project has successfully completed the refactor for **Empire Building Materials**. Key accomplishments include:
- **Rebranded Portal**: Updated all UI elements, support contact info, and landing page content to Empire branding.
- **Submit PO Workflow**: Transformed Quick Quote into a high-priority Purchase Order submission tool.
- **ACH-Only Logistics**: Restricted billing to industrial-grade ACH transactions, removing retail credit card options.
- **Distributor Logic**: Optimized Orders and Quotes tables for bulk dealer-to-distributor interactions with PO emphasis.
- **Navigation Pruning**: Removed Projects and Documents pages to streamline the Pro dealer experience.

**Next Priority**: Finalize order submission logic and connect with real ERP backend endpoints for live PO syncing.
