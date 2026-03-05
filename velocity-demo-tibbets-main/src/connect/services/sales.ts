/**
 * SalesService - DEMO MODE
 * All methods return mock data from customer-mock.ts
 */
import {
    MOCK_BACKEND_ORDERS,
    MOCK_BACKEND_INVOICES,
    MOCK_BACKEND_QUOTES
} from '../../mock/customer-mock.js';

interface PagingOptions {
    limit?: number;
    offset?: number;
    accountId?: number;
    jobId?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

export const SalesService = {
    getOrders: ({ limit = 25, offset = 0, jobId }: PagingOptions = {}) => {
        let items = MOCK_BACKEND_ORDERS;
        if (jobId !== undefined) {
            items = items.filter(o => o.jobId === jobId);
        }
        const pagedItems = items.slice(offset, offset + limit);
        return Promise.resolve({ items: pagedItems, total: items.length });
    },

    getOrderDetails: (orderId: number) => {
        const order = MOCK_BACKEND_ORDERS.find(o => o.id === orderId);
        return Promise.resolve(order ?? MOCK_BACKEND_ORDERS[0]);
    },

    getInvoices: (limit = 1000, offset = 0, jobId?: number) => {
        let items = [...MOCK_BACKEND_INVOICES];
        if (jobId !== undefined) {
            items = items.filter(i => i.jobId === jobId);
        }

        // Sort: Outstanding (open/overdue) first, ordered by oldest due date
        items.sort((a, b) => {
            const isOutstandingA = ['open', 'overdue'].includes(a.status);
            const isOutstandingB = ['open', 'overdue'].includes(b.status);

            if (isOutstandingA && !isOutstandingB) return -1;
            if (!isOutstandingA && isOutstandingB) return 1;

            const dateA = new Date(a.dueDate || 0).getTime();
            const dateB = new Date(b.dueDate || 0).getTime();

            if (isOutstandingA) {
                // Oldest outstanding first
                return dateA - dateB;
            } else {
                // Newest paid/other first
                return dateB - dateA;
            }
        });

        const pagedItems = items.slice(offset, offset + limit);
        return Promise.resolve({ items: pagedItems, total: items.length });
    },

    getQuotes: ({ limit = 25, offset = 0, jobId }: PagingOptions = {}) => {
        let items = MOCK_BACKEND_QUOTES;
        if (jobId !== undefined) {
            items = items.filter(q => q.jobId === jobId);
        }
        const pagedItems = items.slice(offset, offset + limit);
        return Promise.resolve({ items: pagedItems, total: items.length });
    },

    getQuoteDetails: (quoteId: number) => {
        const quote = MOCK_BACKEND_QUOTES.find(q => q.id === quoteId);
        return Promise.resolve(quote ?? MOCK_BACKEND_QUOTES[0]);
    },

    getQuoteLines: (quoteId: number) => {
        const quote = MOCK_BACKEND_QUOTES.find(q => q.id === quoteId);
        return Promise.resolve(quote?.lines ?? []);
    },

    getOrderLines: (orderId: number) => {
        const order = MOCK_BACKEND_ORDERS.find(o => o.id === orderId);
        return Promise.resolve(order?.lines ?? []);
    },
};
