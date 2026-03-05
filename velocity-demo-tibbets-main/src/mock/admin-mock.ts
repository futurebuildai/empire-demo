import type { AdminAccount, AdminDashboardSummary, AdminUser, AdminInvoice, AdminQuote } from '../admin/services/admin-data.service';

export const MOCK_ADMIN_DASHBOARD: AdminDashboardSummary = {
    totalAccounts: 124,
    activeOrders: 45,
    pendingEstimates: 12,
    totalCreditExtended: 1250000,
    totalReceivables: 450000,
    accountsAtRisk: 3
};

export const MOCK_ADMIN_ACCOUNTS: AdminAccount[] = [
    {
        id: 456,
        name: "Home Pros USA",
        email: "bob@homeprousa.com",
        phone: "(555) 123-4567",
        status: "Active",
        creditLimit: 50000,
        balance: 15300,
        availableCredit: 34700,
        pastDueBalance: 0,
        aging: "Current",
        openInvoicesCount: 1,
        primaryContact: "Bob the Builder"
    },
    {
        id: 457,
        name: "Elite Construction",
        email: "alice@elite.com",
        phone: "(555) 987-6543",
        status: "Overdue",
        creditLimit: 100000,
        balance: 85000,
        availableCredit: 15000,
        pastDueBalance: 12000,
        aging: "30",
        openInvoicesCount: 4,
        primaryContact: "Alice Smith"
    },
    {
        id: 458,
        name: "Quick Fix Repairs",
        email: "joe@quickfix.io",
        phone: "(555) 444-5555",
        status: "Hold",
        creditLimit: 10000,
        balance: 9500,
        availableCredit: 500,
        pastDueBalance: 5000,
        aging: "90+",
        openInvoicesCount: 2,
        primaryContact: "Joe Fixit"
    }
];

export const MOCK_ADMIN_USERS: AdminUser[] = [
    { id: 1, email: "admin@velocity.com", name: "Velocity Admin", role: "tenant_owner", isActive: true },
    { id: 2, email: "staff@velocity.com", name: "Velocity Staff", role: "tenant_staff", isActive: true },
    { id: 3, email: "demo@velocity.com", name: "Demo Rep", role: "account_manager", isActive: true }
];

export const MOCK_INVOICES: AdminInvoice[] = [
    {
        id: "INV-2024-001",
        internalId: 1001,
        date: "2024-01-15T00:00:00Z",
        dueDate: "2024-02-14T00:00:00Z",
        total: 1250.00,
        balance: 1250.00,
        status: "Open",
        accountId: 456,
        accountName: "Home Pros USA"
    },
    {
        id: "INV-2024-002",
        internalId: 1002,
        date: "2023-12-10T00:00:00Z",
        dueDate: "2024-01-09T00:00:00Z",
        total: 3400.50,
        balance: 3400.50,
        status: "Past Due",
        accountId: 457,
        accountName: "Elite Construction"
    },
    {
        id: "INV-2024-003",
        internalId: 1003,
        date: "2024-02-01T00:00:00Z",
        dueDate: "2024-03-02T00:00:00Z",
        total: 750.00,
        balance: 0,
        status: "Paid",
        accountId: 458,
        accountName: "Quick Fix Repairs"
    },
    {
        id: "INV-2024-004",
        internalId: 1004,
        date: "2024-02-05T00:00:00Z",
        dueDate: "2024-03-06T00:00:00Z",
        total: 4200.00,
        balance: 2000.00,
        status: "Open",
        accountId: 457,
        accountName: "Elite Construction"
    },
    {
        id: "INV-2024-005",
        internalId: 1005,
        date: "2024-02-12T00:00:00Z",
        dueDate: "2024-03-13T00:00:00Z",
        total: 6200.00,
        balance: 6200.00,
        status: "Open",
        accountId: 456,
        accountName: "Home Pros USA"
    },
    {
        id: "INV-2024-006",
        internalId: 1006,
        date: "2024-01-20T00:00:00Z",
        dueDate: "2024-02-19T00:00:00Z",
        total: 1100.00,
        balance: 900.00,
        status: "Open",
        accountId: 458,
        accountName: "Quick Fix Repairs"
    }
];

export const MOCK_QUOTES: AdminQuote[] = [
    {
        id: "EST-2024-001",
        date: "2024-02-08T00:00:00Z",
        expiryDate: "2024-03-09T00:00:00Z",
        total: 5600.00,
        status: "Draft",
        name: "Kitchen Remodel",
        accountId: 456,
        accountName: "Home Pros USA"
    },
    {
        id: "EST-2024-002",
        date: "2024-02-01T00:00:00Z",
        expiryDate: "2024-03-02T00:00:00Z",
        total: 1200.00,
        status: "Sent",
        name: "Bathroom Fixtures",
        accountId: 457,
        accountName: "Elite Construction"
    },
    {
        id: "EST-2023-099",
        date: "2023-12-15T00:00:00Z",
        expiryDate: "2024-01-14T00:00:00Z",
        total: 8900.00,
        status: "Expired",
        name: "Deck Material",
        accountId: 456,
        accountName: "Home Pros USA"
    },
    {
        id: "EST-2024-003",
        date: "2024-02-10T00:00:00Z",
        expiryDate: "2024-03-10T00:00:00Z",
        total: 25000.00,
        status: "Draft",
        name: "Whole House Reno",
        accountId: 457,
        accountName: "Elite Construction"
    }
];

export const MOCK_PAYMENT_REQUESTS: AdminInvoice[] = [
    ...MOCK_INVOICES,
    {
        id: "INV-2023-098",
        internalId: 998,
        date: "2023-11-20T00:00:00Z",
        dueDate: "2023-12-20T00:00:00Z",
        total: 15400.00,
        balance: 15400.00,
        status: "Past Due",
        accountId: 456,
        accountName: "Home Pros USA"
    },
    {
        id: "INV-2023-099",
        internalId: 999,
        date: "2023-11-25T00:00:00Z",
        dueDate: "2023-12-25T00:00:00Z",
        total: 2300.75,
        balance: 2300.75,
        status: "Past Due",
        accountId: 458,
        accountName: "Quick Fix Repairs"
    }
];
