/**
 * DataService - Singleton for fetching and caching data
 * Provides typed access to account data, orders, invoices, and estimates
 * Uses AccountService for real API data with mapping to legacy types
 */

import type {
    AccountData,
    Order,  // Legacy types
    Invoice,
    Estimate,
    Project,
    DashboardSummary,
    OrderLine,
    InvoiceLine
} from '../types/index.js';

import { SalesService } from '../connect/services/sales.js';
import { JobsService } from '../connect/services/jobs.js';
import { DashboardService } from '../connect/services/dashboard.js';
import { AccountService, type AccountFinancials } from '../connect/services/account.js';
import { BillingService } from '../connect/services/billing.js';
import { BrandingService } from './branding.service.js';
import { AuthService } from './auth.service.js';
import type { Account, JobSummary } from '../connect/types/domain.js';
import { mapQuoteToEstimate, mapJobToProject, mapOrderToLegacy, mapInvoiceToLegacy, mapOrderLineToLegacy, mapInvoiceLineToLegacy } from '../connect/mappers.js';

/**
 * Maps backend Account + AccountFinancials to legacy AccountData format
 * Provides backward compatibility for existing UI components
 * Support info now comes from BrandingService instead of hardcoded defaults
 */
function mapAccountToLegacy(account: Account, financials: AccountFinancials): AccountData {
    // Parse name into first/last (backend may provide just 'name')
    const nameParts = (account.name ?? 'User').split(' ');
    const firstName = nameParts[0] ?? 'User';
    const lastName = nameParts.slice(1).join(' ') || '';
    const fullName = account.name ?? 'User';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0) || firstName.charAt(1) || ''}`.toUpperCase();

    // Get support info from branding service (will be the cached sync value or defaults)
    const branding = BrandingService.getBrandingSync();

    return {
        user: {
            id: String(account.id),
            firstName,
            lastName,
            fullName,
            initials,
            email: account.email ?? '',
            phone: account.phone ?? '',
        },
        company: {
            id: String(account.id),
            name: account.name ?? 'Company',
            limit: financials.creditLimit,
            available: financials.availableCredit,
            balance: financials.balance,
        },
        support: {
            phone: branding.contactPhone,
            email: branding.contactEmail,
        },
        team: [],  // Team data fetched separately if needed
        location: '',  // Location can be derived from addresses if needed
    };
}

import {
    MOCK_ACCOUNT,
    MOCK_ORDERS,
    MOCK_INVOICES,
    MOCK_ESTIMATES,
    MOCK_PROJECTS,
    MOCK_DASHBOARD,
    MOCK_JOB_SUMMARIES
} from '../mock/customer-mock.js';

class DataServiceImpl {
    private accountData: AccountData | null = null;
    private dashboardSummary: DashboardSummary | null = null;

    /**
     * Fetch account data from mock
     */
    async getAccountData(): Promise<AccountData> {
        return MOCK_ACCOUNT;
    }

    /**
     * Get the current account ID (mocked)
     */
    getCurrentAccountId(): number | null {
        return 456;
    }

    /**
     * Get orders via mock
     */
    async getOrders(limit = 25, offset = 0, _accountId?: number, jobId?: number): Promise<{ items: Order[]; total: number }> {
        let items = MOCK_ORDERS;
        if (jobId !== undefined) {
            // @ts-ignore - jobId exists on mock data but might not be in legacy Order type
            items = items.filter(o => o.jobId === jobId);
        }
        return { items, total: items.length };
    }

    /**
     * Get a single order by ID (mocked)
     */
    async getOrderById(orderId: number): Promise<Order | undefined> {
        return MOCK_ORDERS.find(o => o.id === orderId);
    }

    /**
     * Get invoices via mock
     */
    async getInvoices(): Promise<Invoice[]> {
        return MOCK_INVOICES;
    }

    /**
     * Get a single invoice by ID (mocked)
     */
    async getInvoiceById(invoiceId: string | number): Promise<Invoice | undefined> {
        const id = typeof invoiceId === 'number' ? invoiceId : parseInt(invoiceId, 10);
        return MOCK_INVOICES.find(i => i.id === id || i.invoiceNumber === String(invoiceId));
    }

    /**
     * Get estimates via mock
     */
    async getEstimates(limit = 25, offset = 0, _accountId?: number, jobId?: number): Promise<{ items: Estimate[]; total: number }> {
        let items = MOCK_ESTIMATES;
        if (jobId !== undefined) {
            // @ts-ignore - jobId exists on mock data but might not be in legacy Estimate type
            items = items.filter(e => e.jobId === jobId);
        }
        return { items, total: items.length };
    }

    /**
     * Get line items (mocked)
     */
    async getQuoteLines(quoteId: number): Promise<OrderLine[]> {
        const { MOCK_BACKEND_QUOTES } = await import('../mock/customer-mock.js');
        const { mapOrderLineToLegacy } = await import('../connect/mappers.js');
        const quote = MOCK_BACKEND_QUOTES.find(q => q.id === quoteId);
        return (quote?.lines as any[])?.map(mapOrderLineToLegacy) || [];
    }

    async getOrderLines(orderId: number): Promise<OrderLine[]> {
        const { MOCK_BACKEND_ORDERS } = await import('../mock/customer-mock.js');
        const { mapOrderLineToLegacy } = await import('../connect/mappers.js');
        const order = MOCK_BACKEND_ORDERS.find(o => o.id === orderId);
        return (order?.lines as any[])?.map(mapOrderLineToLegacy) || [];
    }

    async getInvoiceLines(invoiceId: number): Promise<InvoiceLine[]> {
        const { MOCK_BACKEND_INVOICES } = await import('../mock/customer-mock.js');
        const { mapInvoiceLineToLegacy } = await import('../connect/mappers.js');
        const invoice = MOCK_BACKEND_INVOICES.find(i => i.id === invoiceId);
        return (invoice?.lines as any[])?.map(mapInvoiceLineToLegacy) || [];
    }

    /**
     * Get Projects via mock
     */
    async getProjects(): Promise<Project[]> {
        return MOCK_PROJECTS;
    }

    /**
     * Get Job Summaries via mock
     */
    async getJobSummaries(): Promise<JobSummary[]> {
        return MOCK_JOB_SUMMARIES;
    }

    /**
     * Get Dashboard Summary (mocked)
     */
    async getDashboardSummary(): Promise<DashboardSummary> {
        return MOCK_DASHBOARD;
    }

    /**
     * Clear all cached data (mocked)
     */
    clearCache(): void {
        console.log('[Demo Mode] Cache clear suppressed');
    }
}

// Singleton export
export const DataService = new DataServiceImpl();
