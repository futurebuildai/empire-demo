import type {
    User,
    Account,
    AccountFinancials,
    Order,
    Invoice,
    Quote,
    Job, // Project
    DashboardSummary,
    AccountAddress,
    PaymentMethod
} from './types/domain.js';

export const MOCK_USER: User = {
    id: 1,
    email: 'demo@whiteslumber.com',
    name: 'Demo User',
    phone: '(555) 123-4567',
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    role: 'account_admin'
};

export const MOCK_ACCOUNT: Account = {
    id: 101,
    name: "White's Lumber Demo Account",
    number: "WL-1001",
    email: "accounts@whiteslumber.com",
    phone: "(315) 788-6200",
    active: true,
    currencyCode: "USD",
    creditLimit: 50000,
    balance: 12450.50,
    availableCredit: 37549.50,
    paymentTermsCode: "NET30"
};

export const MOCK_FINANCIALS: AccountFinancials = {
    accountId: MOCK_ACCOUNT.id,
    accountNumber: MOCK_ACCOUNT.number || '',
    accountName: MOCK_ACCOUNT.name || '',
    currencyCode: MOCK_ACCOUNT.currencyCode,
    creditLimit: MOCK_ACCOUNT.creditLimit,
    totalBalance: MOCK_ACCOUNT.balance,
    availableCredit: MOCK_ACCOUNT.availableCredit,
    aging30: 5000,
    aging60: 2500,
    aging90: 1000,
    aging90Plus: 500,
    aging: '30',
    pastDueBalance: 9000,
    lastSyncAt: new Date().toISOString()
};

export const MOCK_ADDRESSES: AccountAddress[] = [
    {
        addressId: 1,
        accountId: 101,
        line1: "231 N. Rutland St.",
        city: "Watertown",
        state: "NY",
        zip: "13601",
        isDefault: true,
        addressType: "billing"
    },
    {
        addressId: 2,
        accountId: 101,
        line1: "123 Construction Way",
        city: "Syracuse",
        state: "NY",
        zip: "13202",
        isDefault: false,
        addressType: "shipping"
    }
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 1001,
        orderNumber: "ORD-2024-001",
        orderDate: "2024-01-28T10:00:00Z",
        subtotal: 1250.00,
        taxTotal: 100.00,
        total: 1350.00,
        status: "confirmed",
        poNumber: "PO-998877"
    },
    {
        id: 1002,
        orderNumber: "ORD-2024-002",
        orderDate: "2024-01-25T14:30:00Z",
        subtotal: 4500.50,
        taxTotal: 360.04,
        total: 4860.54,
        status: "shipped",
        poNumber: "JOB-55-Framing"
    },
    {
        id: 1003,
        orderNumber: "ORD-2024-003",
        orderDate: "2024-01-20T09:15:00Z",
        subtotal: 215.00,
        taxTotal: 17.20,
        total: 232.20,
        status: "delivered",
        poNumber: "Maint-supplies"
    }
];

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 5001,
        invoiceNumber: "INV-5001",
        invoiceDate: "2024-01-28",
        dueDate: "2024-02-28",
        total: 1350.00,
        balanceDue: 1350.00,
        status: "open"
    },
    {
        id: 5002,
        invoiceNumber: "INV-5002",
        invoiceDate: "2024-01-15",
        dueDate: "2024-02-15",
        total: 4860.54,
        balanceDue: 0,
        status: "paid"
    },
    {
        id: 5003,
        invoiceNumber: "INV-4990",
        invoiceDate: "2023-12-20",
        dueDate: "2024-01-20",
        total: 2500.00,
        balanceDue: 2500.00,
        status: "past_due"
    }
];

export const MOCK_QUOTES: Quote[] = [
    {
        id: 7001,
        quoteNumber: "Q-2024-101",
        quoteDate: "2024-01-29",
        expiresOn: "2024-02-29",
        total: 15400.00,
        status: "sent"
    },
    {
        id: 7002,
        quoteNumber: "Q-2024-098",
        quoteDate: "2024-01-10",
        expiresOn: "2024-02-10",
        total: 3200.50,
        status: "accepted"
    }
];

// Extended Project Interface for Demo
export interface MockProject extends Job {
    orderCount: number;
    totalSpent: string;
    openInvoices: number;
}

export const MOCK_PROJECTS: MockProject[] = [
    {
        id: 9001,
        accountId: 101,
        jobNumber: "JOB-2024-A (Downtown)",
        name: "Downtown Renovation",
        poNumber: "PO-DT-001",
        isActive: true,
        address: {
            id: 1,
            jobId: 9001,
            addressRole: "primary_site",
            addressLine1: "100 Main St",
            city: "Watertown",
            state: "NY",
            postalCode: "13601",
            country: "USA"
        },
        orderCount: 12,
        totalSpent: '$45,230.50',
        openInvoices: 3
    },
    {
        id: 9002,
        accountId: 101,
        jobNumber: "JOB-2024-B (LakeHouse)",
        name: "Lake House Build",
        poNumber: "PO-LH-002",
        isActive: true,
        address: {
            id: 2,
            jobId: 9002,
            addressRole: "primary_site",
            addressLine1: "500 Lakeview Dr",
            city: "Sackets Harbor",
            state: "NY",
            postalCode: "13685",
            country: "USA"
        },
        orderCount: 5,
        totalSpent: '$12,450.00',
        openInvoices: 1
    },
    {
        id: 9003,
        accountId: 101,
        jobNumber: "JOB-2023-C (Mall)",
        name: "Salmon Run Mall Expansion",
        poNumber: "PO-MALL-003",
        isActive: true,
        address: {
            id: 3,
            jobId: 9003,
            addressRole: "primary_site",
            addressLine1: "21182 Salmon Run Mall Loop",
            city: "Watertown",
            state: "NY",
            postalCode: "13601",
            country: "USA"
        },
        orderCount: 42,
        totalSpent: '$128,940.25',
        openInvoices: 0
    }
];

export const MOCK_DASHBOARD: DashboardSummary = {
    accountId: 101,
    accountName: MOCK_ACCOUNT.name || "Demo Account",
    creditLimit: MOCK_ACCOUNT.creditLimit,
    currentBalance: MOCK_ACCOUNT.balance,
    pastDueInvoicesCount: 1,
    openInvoicesCount: 2,
    overdueInvoicesCount: 1,
    activeOrdersCount: 2,
    pendingQuotesCount: 1,
    recentInvoices: MOCK_INVOICES.slice(0, 3),
    recentOrders: MOCK_ORDERS.slice(0, 3),
    recentQuotes: MOCK_QUOTES.slice(0, 3)
};

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 1,
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025,
        isDefault: true,
        createdAt: '2023-01-15T00:00:00Z'
    }
];

export const MOCK_STATEMENTS = [
    { id: 1, month: 'January 2024', total: 4520.50, status: 'Paid', date: '2024-02-01' },
    { id: 2, month: 'December 2023', total: 3100.00, status: 'Paid', date: '2024-01-01' },
    { id: 3, month: 'November 2023', total: 6800.75, status: 'Paid', date: '2023-12-01' },
];

export const MOCK_PAYMENTS = [
    { id: 101, date: '2024-01-28', amount: 4520.50, method: 'Visa ending 4242', reference: 'PAY-8832' },
    { id: 102, date: '2024-01-15', amount: 1250.00, method: 'Check #1001', reference: 'PAY-8801' },
    { id: 103, date: '2023-12-20', amount: 3100.00, method: 'Visa ending 4242', reference: 'PAY-8755' },
];
