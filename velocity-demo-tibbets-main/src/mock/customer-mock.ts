import type { AccountData, Order, Invoice, Estimate, Project, DashboardSummary } from '../types/index';

export const MOCK_ACCOUNT: AccountData = {
    user: {
        id: "u123",
        firstName: "Bob",
        lastName: "the Builder",
        fullName: "Bob the Builder",
        initials: "BB",
        email: "demo@homeprousa.com",
        phone: "(555) 123-4567"
    },
    company: {
        id: "c456",
        name: "Home Pros USA",
        limit: 50000,
        available: 34700,
        balance: 15300
    },
    support: {
        phone: "(555) 123-4567",
        email: "support@velocity.com"
    },
    team: [
        { name: "Bob the Builder", email: "bob@homeprousa.com", role: "Owner", initials: "BB" },
        { name: "Wendy Worker", email: "wendy@homeprousa.com", role: "Admin", initials: "WW" }
    ],
    location: "Oakdale, TX"
};

export const MOCK_ORDERS: (Order & { jobId: number })[] = [
    {
        id: 101,
        jobId: 1,
        orderNumber: "ORD-7521",
        userId: "u123",
        status: "shipped",
        subtotal: 1150.50,
        tax: 100.00,
        total: 1250.50,
        createdAt: new Date().toISOString(),
        poNumber: "PO-9981",
        lines: [
            { id: "l1", productId: "p1", name: "Premium Lumber 2x4", quantity: 100, unitPrice: 10, lineTotal: 1000 },
            { id: "l2", productId: "p2", name: "Deck Screws 5lb", quantity: 5, unitPrice: 50.10, lineTotal: 250.50 }
        ]
    },
    {
        id: 102,
        jobId: 2,
        orderNumber: "ORD-7522",
        userId: "u123",
        status: "pending",
        subtotal: 420.00,
        tax: 30.00,
        total: 450.00,
        createdAt: new Date().toISOString()
    }
];

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 201,
        invoiceNumber: "INV-8801",
        status: "open",
        dueDate: "2026-03-01",
        total: 15300.00,
        amountDue: 15300.00,
        createdAt: "2026-02-01"
    },
    {
        id: 202,
        invoiceNumber: "INV-8750",
        status: "paid",
        dueDate: "2026-01-15",
        total: 4200.00,
        amountDue: 0,
        createdAt: "2025-12-15"
    }
];

export const MOCK_ESTIMATES: (Estimate & { jobId: number })[] = [
    {
        id: 301,
        jobId: 1,
        estimateNumber: "EST-4410",
        status: "sent",
        validUntil: "2026-03-15",
        subtotal: 8500.00,
        tax: 400.00,
        total: 8900.00,
        createdAt: "2026-02-05"
    }
];

export const MOCK_PROJECTS: Project[] = [
    { id: "1", userId: "u123", name: "Main Street Renovation", status: "active", color: "#3B82F6", address: { street: '742 Main St', city: 'Austin', state: 'TX', zip: '78701' } },
    { id: "2", userId: "u123", name: "Oakwood Deck Build", status: "active", color: "#10B981", address: { street: '155 Oakwood Dr', city: 'Round Rock', state: 'TX', zip: '78664' } }
];

export const MOCK_DASHBOARD: DashboardSummary = {
    accountId: 456,
    accountName: "Home Pros USA",
    creditLimit: 50000,
    currentBalance: 15300,
    pastDueInvoicesCount: 0,
    openInvoicesCount: 1,
    overdueInvoicesCount: 0,
    activeOrdersCount: 2,
    pendingQuotesCount: 1,
    recentInvoices: MOCK_INVOICES,
    recentOrders: MOCK_ORDERS,
    recentQuotes: MOCK_ESTIMATES
};

// ─── Payment Methods (Wallet page) ───────────────────────────────
import type { PaymentMethod, PaymentTransaction, Statement, PaymentConfig } from '../connect/types/domain';

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 1001,
        accountId: 456,
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2027,
        isDefault: true,
        createdAt: '2025-06-15T10:30:00Z'
    },
    {
        id: 1002,
        accountId: 456,
        type: 'card',
        brand: 'Mastercard',
        last4: '8888',
        expMonth: 3,
        expYear: 2028,
        isDefault: false,
        createdAt: '2025-09-20T14:15:00Z'
    },
    {
        id: 1003,
        accountId: 456,
        type: 'ach',
        brand: null,
        last4: '6789',
        expMonth: null,
        expYear: null,
        isDefault: false,
        createdAt: '2025-11-01T09:00:00Z'
    }
];

// ─── Payment History (Billing → Payment History tab) ─────────────
export const MOCK_PAYMENT_HISTORY: PaymentTransaction[] = [
    {
        id: 5001,
        accountId: 456,
        userId: 123,
        externalId: 'txn_abc123',
        provider: 'run_payments',
        status: 'settled',
        currencyCode: 'USD',
        amount: 4200.00,
        convenienceFee: 0,
        totalCharged: 4200.00,
        paymentMethodType: 'card',
        submittedAt: '2026-01-15T14:30:00Z',
        settledAt: '2026-01-16T08:00:00Z',
        failureCode: null,
        failureMessage: null,
        referenceType: 'invoice',
        referenceId: 202
    },
    {
        id: 5002,
        accountId: 456,
        userId: 123,
        externalId: 'txn_def456',
        provider: 'run_payments',
        status: 'settled',
        currencyCode: 'USD',
        amount: 2750.00,
        convenienceFee: 25.00,
        totalCharged: 2775.00,
        paymentMethodType: 'card',
        submittedAt: '2026-01-28T10:15:00Z',
        settledAt: '2026-01-29T08:00:00Z',
        failureCode: null,
        failureMessage: null,
        referenceType: 'invoice',
        referenceId: 203
    },
    {
        id: 5003,
        accountId: 456,
        userId: 123,
        externalId: 'txn_ghi789',
        provider: 'run_payments',
        status: 'processing',
        currencyCode: 'USD',
        amount: 850.00,
        convenienceFee: 0,
        totalCharged: 850.00,
        paymentMethodType: 'ach',
        submittedAt: '2026-02-08T16:45:00Z',
        settledAt: null,
        failureCode: null,
        failureMessage: null,
        referenceType: 'balance',
        referenceId: undefined
    },
    {
        id: 5004,
        accountId: 456,
        userId: 123,
        externalId: 'txn_jkl012',
        provider: 'run_payments',
        status: 'refunded',
        currencyCode: 'USD',
        amount: 320.00,
        convenienceFee: 0,
        totalCharged: 320.00,
        paymentMethodType: 'card',
        submittedAt: '2025-12-20T09:00:00Z',
        settledAt: '2025-12-21T08:00:00Z',
        failureCode: null,
        failureMessage: null,
        referenceType: 'invoice',
        referenceId: 204
    }
];

// ─── Statements (Billing → Statements tab) ──────────────────────
export const MOCK_STATEMENTS: Statement[] = [
    {
        id: 3001,
        accountId: 456,
        statementNumber: 'STMT-2026-01',
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
        statementDate: '2026-02-01',
        currencyCode: 'USD',
        openingBalance: 19500.00,
        closingBalance: 15300.00,
        documentId: 8001,
        createdAt: '2026-02-01T00:00:00Z'
    },
    {
        id: 3002,
        accountId: 456,
        statementNumber: 'STMT-2025-12',
        periodStart: '2025-12-01',
        periodEnd: '2025-12-31',
        statementDate: '2026-01-01',
        currencyCode: 'USD',
        openingBalance: 23700.00,
        closingBalance: 19500.00,
        documentId: 8002,
        createdAt: '2026-01-01T00:00:00Z'
    },
    {
        id: 3003,
        accountId: 456,
        statementNumber: 'STMT-2025-11',
        periodStart: '2025-11-01',
        periodEnd: '2025-11-30',
        statementDate: '2025-12-01',
        currencyCode: 'USD',
        openingBalance: 18200.00,
        closingBalance: 23700.00,
        documentId: 8003,
        createdAt: '2025-12-01T00:00:00Z'
    }
];

// ─── Job Summaries (Projects page stats) ─────────────────────────
import type { JobSummary } from '../connect/types/domain';

export const MOCK_JOB_SUMMARIES: JobSummary[] = [
    { jobId: 1, orderCount: 5, totalOrdered: 12500.00, openInvoicesCount: 2 },
    { jobId: 2, orderCount: 3, totalOrdered: 8750.00, openInvoicesCount: 1 }
];

// ─── Backend-format Invoices (for SalesService.getInvoices) ──────
// The Billing page calls SalesService.getInvoices directly (not DataService)
// and expects backend Invoice type, which gets mapped via mapInvoiceToLegacy

export const MOCK_BACKEND_INVOICES = [
    {
        id: 201,
        invoiceNumber: 'INV-8801',
        accountId: 456,
        jobId: 1,
        status: 'open',
        currencyCode: 'USD',
        subtotal: 14500.00,
        taxAmount: 800.00,
        total: 15300.00,
        balanceDue: 15300.00,
        dueDate: '2026-03-01',
        invoiceDate: '2026-02-01',
        pdfUrl: null,
        lines: [
            { id: 1, invoiceId: 201, itemCode: 'LUM-2X4-PREM', description: 'Premium Lumber 2x4', quantityBilled: 200, unitPrice: 52.50, extendedPrice: 10500.00 },
            { id: 2, invoiceId: 201, itemCode: 'CON-MIX-80', description: 'Concrete Mix 80lb', quantityBilled: 40, unitPrice: 100.00, extendedPrice: 4000.00 },
            { id: 3, invoiceId: 201, itemCode: 'TAX-SALES', description: 'Sales Tax', quantityBilled: 1, unitPrice: 800.00, extendedPrice: 800.00 }
        ],
        createdAt: '2026-02-01T00:00:00Z'
    },
    {
        id: 202,
        invoiceNumber: 'INV-8750',
        accountId: 456,
        jobId: 1,
        status: 'paid',
        currencyCode: 'USD',
        subtotal: 4000.00,
        taxAmount: 200.00,
        total: 4200.00,
        balanceDue: 0,
        dueDate: '2026-01-15',
        invoiceDate: '2025-12-15',
        pdfUrl: null,
        lines: [
            { id: 4, invoiceId: 202, itemCode: 'SCR-DECK-5LB', description: 'Deck Screws 5lb Box', quantityBilled: 20, unitPrice: 45.00, extendedPrice: 900.00 },
            { id: 5, invoiceId: 202, itemCode: 'LUM-DECK-COMP', description: 'Composite Decking 16ft', quantityBilled: 50, unitPrice: 62.00, extendedPrice: 3100.00 },
            { id: 6, invoiceId: 202, itemCode: 'TAX-SALES', description: 'Sales Tax', quantityBilled: 1, unitPrice: 200.00, extendedPrice: 200.00 }
        ],
        createdAt: '2025-12-15T00:00:00Z'
    },
    {
        id: 205,
        invoiceNumber: 'INV-8802',
        accountId: 456,
        jobId: 2,
        status: 'open',
        currencyCode: 'USD',
        subtotal: 6200.00,
        taxAmount: 310.00,
        total: 6510.00,
        balanceDue: 6510.00,
        dueDate: '2026-03-15',
        invoiceDate: '2026-02-05',
        pdfUrl: null,
        lines: [
            { id: 7, invoiceId: 205, itemCode: 'LUM-4X4-PT', description: 'Pressure Treated 4x4', quantityBilled: 24, unitPrice: 85.00, extendedPrice: 2040.00 },
            { id: 8, invoiceId: 205, itemCode: 'HW-JOIST', description: 'Joist Hangers', quantityBilled: 48, unitPrice: 12.50, extendedPrice: 600.00 },
            { id: 9, invoiceId: 205, itemCode: 'RAIL-ALUM', description: 'Railing Kit', quantityBilled: 4, unitPrice: 890.00, extendedPrice: 3560.00 },
            { id: 10, invoiceId: 205, itemCode: 'TAX-SALES', description: 'Sales Tax', quantityBilled: 1, unitPrice: 310.00, extendedPrice: 310.00 }
        ],
        createdAt: '2026-02-05T00:00:00Z'
    }
];

// ─── Backend-format Orders (for SalesService.getOrders) ──────────
export const MOCK_BACKEND_ORDERS = [
    {
        id: 101,
        orderNumber: 'ORD-7521',
        accountId: 456,
        jobId: 1,
        status: 'shipped',
        currencyCode: 'USD',
        subtotal: 1150.50,
        taxAmount: 100.00,
        total: 1250.50,
        poNumber: 'PO-9981',
        orderDate: '2026-02-01',
        createdAt: '2026-02-01T00:00:00Z',
        lines: [
            { id: 1, orderId: 101, itemCode: 'LUM-2X4-PREM', description: 'Premium Lumber 2x4', quantityOrdered: 100, unitPrice: 10.00, extendedPrice: 1000.00 },
            { id: 2, orderId: 101, itemCode: 'SCR-DECK-5LB', description: 'Deck Screws 5lb', quantityOrdered: 5, unitPrice: 50.10, extendedPrice: 250.50 }
        ]
    },
    {
        id: 102,
        orderNumber: 'ORD-7522',
        accountId: 456,
        jobId: 2,
        status: 'pending',
        currencyCode: 'USD',
        subtotal: 420.00,
        taxAmount: 30.00,
        total: 450.00,
        poNumber: 'PO-9982',
        orderDate: '2026-02-05',
        createdAt: '2026-02-05T00:00:00Z',
        lines: [
            { id: 3, orderId: 102, itemCode: 'CON-MIX-80', description: 'Concrete Mix 80lb', quantityOrdered: 10, unitPrice: 42.00, extendedPrice: 420.00 }
        ]
    }
];

// ─── Backend-format Quotes (for SalesService.getQuotes) ──────────
export const MOCK_BACKEND_QUOTES = [
    {
        id: 301,
        quoteNumber: 'EST-4410',
        accountId: 456,
        jobId: 1,
        status: 'sent',
        currencyCode: 'USD',
        subtotal: 8500.00,
        taxAmount: 400.00,
        total: 8900.00,
        validUntil: '2026-03-15',
        createdAt: '2026-02-05T00:00:00Z',
        lines: [
            { id: 1, quoteId: 301, itemCode: 'FLR-HW-OAK', description: 'Hardwood Flooring', quantity: 500, unitPrice: 14.00, extendedPrice: 7000.00 },
            { id: 2, quoteId: 301, itemCode: 'FLR-UNDER', description: 'Underlayment Roll', quantity: 10, unitPrice: 150.00, extendedPrice: 1500.00 }
        ]
    }
];

// ─── Payment Config ──────────────────────────────────────────────
export const MOCK_PAYMENT_CONFIG: PaymentConfig = {
    publicKey: 'demo_pk_test_mock_key_12345'
};
