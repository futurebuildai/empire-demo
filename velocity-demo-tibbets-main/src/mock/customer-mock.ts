import type { AccountData, Order, Invoice, Quote, DashboardSummary } from '../types/index';

export const MOCK_ACCOUNT: AccountData = {
    user: {
        id: "u123",
        firstName: "John",
        lastName: "Dealer",
        fullName: "John Dealer",
        initials: "JD",
        email: "j.dealer@qualitylumber.com",
        phone: "(555) 987-6543"
    },
    company: {
        id: "c456",
        name: "Quality Lumber & Supply",
        limit: 250000,
        available: 185000,
        balance: 65000
    },
    support: {
        phone: "(800) 255-0311",
        email: "support@empireinc.com"
    },
    team: [
        { name: "John Dealer", email: "john@qualitylumber.com", role: "Owner", initials: "JD" },
        { name: "Sarah Smith", email: "sarah@qualitylumber.com", role: "Purchaser", initials: "SS" }
    ],
    location: "Houston, TX"
};

export const MOCK_ORDERS: Order[] = [
    {
        id: 101,
        orderNumber: "EMP-9921",
        userId: "u123",
        status: "shipped",
        subtotal: 12450.00,
        tax: 1027.12,
        total: 13477.12,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        poNumber: "PO-88721",
        lines: [
            { id: "l1", productId: "p1", name: "Premium 2x4x8 SPF Studs (Units)", quantity: 5, unitPrice: 1200, lineTotal: 6000 },
            { id: "l2", productId: "p2", name: "Fiber Cement Siding - Arctic White", quantity: 150, unitPrice: 43.00, lineTotal: 6450.00 }
        ]
    },
    {
        id: 102,
        orderNumber: "EMP-9922",
        userId: "u123",
        status: "pending",
        subtotal: 8200.00,
        tax: 676.50,
        total: 8876.50,
        createdAt: new Date().toISOString(),
        poNumber: "PO-88725"
    }
];

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 201,
        invoiceNumber: "INV-EMP-8801",
        status: "open",
        dueDate: "2026-03-20",
        total: 45000.00,
        amountDue: 45000.00,
        createdAt: "2026-02-20"
    },
    {
        id: 202,
        invoiceNumber: "INV-EMP-8750",
        status: "paid",
        dueDate: "2026-02-15",
        total: 20000.00,
        amountDue: 0,
        createdAt: "2026-01-15"
    }
];

export const MOCK_QUOTES: Quote[] = [
    {
        id: 301,
        quoteNumber: "QUO-EMP-4410",
        status: "sent",
        validUntil: "2026-04-01",
        subtotal: 35000.00,
        tax: 2887.50,
        total: 37887.50,
        createdAt: "2026-03-01",
        lines: [
            { id: "ql1", productId: "p10", name: "Bulk Insulation Rolls R-19", quantity: 50, unitPrice: 450, lineTotal: 22500 },
            { id: "ql2", productId: "p11", name: "Roofing Shingles - Charcoal Grey (Pallets)", quantity: 10, unitPrice: 1250, lineTotal: 12500 }
        ]
    }
];

export const MOCK_DASHBOARD: DashboardSummary = {
    accountId: 456,
    accountName: "Quality Lumber & Supply",
    creditLimit: 250000,
    currentBalance: 65000,
    pastDueInvoicesCount: 0,
    openInvoicesCount: 1,
    overdueInvoicesCount: 0,
    activeOrdersCount: 2,
    pendingQuotesCount: 1,
    recentInvoices: MOCK_INVOICES,
    recentOrders: MOCK_ORDERS,
    recentQuotes: MOCK_QUOTES
};

// ─── Payment Methods (Wallet page) ───────────────────────────────
import type { PaymentMethod, PaymentTransaction, Statement, PaymentConfig } from '../connect/types/domain';

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 1003,
        accountId: 456,
        type: 'ach',
        brand: null,
        last4: '9876',
        expMonth: null,
        expYear: null,
        isDefault: true,
        createdAt: '2025-11-01T09:00:00Z'
    }
];

// ─── Payment History (Billing → Payment History tab) ─────────────
export const MOCK_PAYMENT_HISTORY: PaymentTransaction[] = [
    {
        id: 5001,
        accountId: 456,
        userId: 123,
        externalId: 'txn_emp_abc123',
        provider: 'run_payments',
        status: 'settled',
        currencyCode: 'USD',
        amount: 20000.00,
        convenienceFee: 0,
        totalCharged: 20000.00,
        paymentMethodType: 'ach',
        submittedAt: '2026-02-14T14:30:00Z',
        settledAt: '2026-02-15T08:00:00Z',
        failureCode: null,
        failureMessage: null,
        referenceType: 'invoice',
        referenceId: 202
    }
];

// ─── Statements (Billing → Statements tab) ──────────────────────
export const MOCK_STATEMENTS: Statement[] = [
    {
        id: 3001,
        accountId: 456,
        statementNumber: 'STMT-EMP-2026-02',
        periodStart: '2026-02-01',
        periodEnd: '2026-02-28',
        statementDate: '2026-03-01',
        currencyCode: 'USD',
        openingBalance: 85000.00,
        closingBalance: 65000.00,
        documentId: 8001,
        createdAt: '2026-03-01T00:00:00Z'
    }
];

// ─── Job Summaries (Projects page stats) ─────────────────────────
import type { JobSummary } from '../connect/types/domain';

export const MOCK_JOB_SUMMARIES: JobSummary[] = [
    { jobId: 1, orderCount: 1, totalOrdered: 13477.12, openInvoicesCount: 1 }
];

// ─── Backend-format Invoices (for SalesService.getInvoices) ──────
export const MOCK_BACKEND_INVOICES = [
    {
        id: 201,
        invoiceNumber: 'INV-EMP-8801',
        accountId: 456,
        jobId: 1,
        status: 'open',
        currencyCode: 'USD',
        subtotal: 42000.00,
        taxAmount: 3000.00,
        total: 45000.00,
        balanceDue: 45000.00,
        dueDate: '2026-03-20',
        invoiceDate: '2026-02-20',
        pdfUrl: null,
        lines: [
            { id: 1, invoiceId: 201, itemCode: 'LUM-SPF-STUD', description: 'Premium 2x4x8 SPF Studs (Units)', quantityBilled: 5, unitPrice: 1200, extendedPrice: 6000.00 },
            { id: 2, invoiceId: 201, itemCode: 'SID-FC-WHITE', description: 'Fiber Cement Siding - Arctic White', quantityBilled: 150, unitPrice: 43.00, extendedPrice: 6450.00 }
        ],
        createdAt: '2026-02-20T00:00:00Z'
    }
];

// ─── Backend-format Orders (for SalesService.getOrders) ──────────
export const MOCK_BACKEND_ORDERS = [
    {
        id: 101,
        orderNumber: 'EMP-9921',
        accountId: 456,
        jobId: 1,
        status: 'shipped',
        currencyCode: 'USD',
        subtotal: 12450.00,
        taxAmount: 1027.12,
        total: 13477.12,
        poNumber: 'PO-88721',
        orderDate: '2026-03-03',
        createdAt: '2026-03-03T00:00:00Z',
        lines: [
            { id: 1, orderId: 101, itemCode: 'LUM-SPF-STUD', description: 'Premium 2x4x8 SPF Studs (Units)', quantityOrdered: 5, unitPrice: 1200.00, extendedPrice: 6000.00 },
            { id: 2, orderId: 101, itemCode: 'SID-FC-WHITE', description: 'Fiber Cement Siding - Arctic White', quantityOrdered: 150, unitPrice: 43.00, extendedPrice: 6450.00 }
        ]
    }
];

// ─── Backend-format Quotes (for SalesService.getQuotes) ──────────
export const MOCK_BACKEND_QUOTES = [
    {
        id: 301,
        quoteNumber: 'QUO-EMP-4410',
        accountId: 456,
        jobId: 1,
        status: 'sent',
        currencyCode: 'USD',
        subtotal: 35000.00,
        taxAmount: 2887.50,
        total: 37887.50,
        validUntil: '2026-04-01',
        createdAt: '2026-03-01T00:00:00Z',
        lines: [
            { id: 1, quoteId: 301, itemCode: 'INS-R19-BULK', description: 'Bulk Insulation Rolls R-19', quantity: 50, unitPrice: 450.00, extendedPrice: 22500.00 },
            { id: 2, quoteId: 301, itemCode: 'ROOF-SHING-CH', description: 'Roofing Shingles - Charcoal Grey (Pallets)', quantity: 10, unitPrice: 1250.00, extendedPrice: 12500.00 }
        ]
    }
];

// ─── Payment Config ──────────────────────────────────────────────
export const MOCK_PAYMENT_CONFIG: PaymentConfig = {
    publicKey: 'demo_pk_test_mock_key_12345'
};
