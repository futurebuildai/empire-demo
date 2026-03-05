/**
 * BillingService - DEMO MODE
 * All methods return mock data from customer-mock.ts
 */
import {
    MOCK_PAYMENT_METHODS,
    MOCK_PAYMENT_HISTORY,
    MOCK_STATEMENTS,
    MOCK_PAYMENT_CONFIG,
    MOCK_BACKEND_INVOICES
} from '../../mock/customer-mock.js';
import type {
    PaymentMethod,
    PaymentMethodCreatePayload,
    PaymentConfig,
    PaymentTransaction,
    Statement,
    PaymentPayload,
    InvoiceLine
} from '../types/domain';

// Mutable copy for interactive add/remove in the demo
const paymentMethods = [...MOCK_PAYMENT_METHODS];
const paymentHistory = [...MOCK_PAYMENT_HISTORY];

export const BillingService = {
    getPaymentMethods: (): Promise<PaymentMethod[]> =>
        Promise.resolve([...paymentMethods]),

    removePaymentMethod: (paymentMethodId: number): Promise<void> => {
        const idx = paymentMethods.findIndex(m => m.id === paymentMethodId);
        if (idx !== -1) paymentMethods.splice(idx, 1);
        return Promise.resolve();
    },

    createPayment: (payload: PaymentPayload): Promise<PaymentTransaction> => {
        const txn: PaymentTransaction = {
            id: 5000 + paymentHistory.length + 1,
            accountId: 456,
            userId: 123,
            externalId: `txn_demo_${Date.now()}`,
            provider: 'run_payments',
            status: 'settled',
            currencyCode: payload.currency || 'USD',
            amount: payload.amount,
            convenienceFee: payload.convenienceFee ?? 0,
            totalCharged: payload.amount + (payload.convenienceFee ?? 0),
            paymentMethodType: 'card',
            submittedAt: new Date().toISOString(),
            settledAt: new Date().toISOString(),
            failureCode: null,
            failureMessage: null,
            referenceType: payload.type,
            referenceId: payload.referenceId
        };
        paymentHistory.unshift(txn);
        return Promise.resolve(txn);
    },

    getInvoiceLines: (invoiceId: number): Promise<InvoiceLine[]> => {
        const inv = MOCK_BACKEND_INVOICES.find(i => i.id === invoiceId);
        return Promise.resolve((inv?.lines ?? []) as unknown as InvoiceLine[]);
    },

    getPaymentConfig: (): Promise<PaymentConfig> =>
        Promise.resolve(MOCK_PAYMENT_CONFIG),

    createPaymentMethod: (data: PaymentMethodCreatePayload): Promise<PaymentMethod> => {
        const newMethod: PaymentMethod = {
            id: 1000 + paymentMethods.length + 1,
            accountId: 456,
            type: data.type ?? 'card',
            brand: data.brand ?? null,
            last4: data.last4 ?? null,
            expMonth: data.expMonth ?? null,
            expYear: data.expYear ?? null,
            isDefault: data.isDefault ?? false,
            createdAt: new Date().toISOString()
        };
        paymentMethods.push(newMethod);
        return Promise.resolve(newMethod);
    },

    getPaymentHistory: (): Promise<PaymentTransaction[]> =>
        Promise.resolve([...paymentHistory]),

    getStatements: (): Promise<Statement[]> =>
        Promise.resolve([...MOCK_STATEMENTS]),
};
