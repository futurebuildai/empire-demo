/**
 * Admin Data Service
 * Provides account and dashboard data for the Admin Portal.
 * Uses adminClient for real API calls and maps strict domain types to UI view models.
 *
 * Endpoint mapping (frontend path → backend path):
 *   /accounts                      → GET /v1/accounts
 *   /accounts/{id}                 → GET /v1/accounts/{id}
 *   /accounts/{id}/addresses       → GET /v1/accounts/{id}/addresses
 *   /orders?account_id={id}        → GET /v1/orders?account_id={id}
 *   /invoices?account_id={id}      → GET /v1/invoices?account_id={id}
 *   /quotes?account_id={id}        → GET /v1/quotes?account_id={id}
 *   /dashboard/summary?account_id= → GET /v1/dashboard/summary?account_id={id}
 */

import { adminClient } from './admin-client.js';
import type {
    Account,
    AccountAddress,
    AccountFinancials,
    DashboardSummary,
    Order,
    Invoice,
    InvoiceLine,
    Quote,
    User,
    UserRole,
} from '../../connect/types/domain.js';

// --- UI View Models ---

export type AccountStatus = 'Active' | 'Hold' | 'Overdue';

export interface AdminAccount {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: AccountStatus;
    creditLimit: number;
    balance: number;
    availableCredit: number;
    pastDueBalance: number;
    aging: 'Current' | '30' | '60' | '90' | '90+';
    openInvoicesCount: number;
    primaryContact: string;
}

export interface AdminDashboardSummary {
    totalAccounts: number;
    activeOrders: number;
    pendingEstimates: number;
    totalCreditExtended: number;
    totalReceivables: number;
    accountsAtRisk: number;
}

export interface AdminAccountAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface AdminOrder {
    id: string;
    date: string;
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped';
    itemsCount: number;
}

export interface AdminInvoice {
    id: string; // Display ID (invoice number)
    internalId: number; // Database ID for API calls
    date: string;
    dueDate: string;
    total: number;
    balance: number;
    status: 'Open' | 'Past Due' | 'Paid' | 'past_due';
    accountId?: number;
    accountName?: string;
}

export interface AdminInvoiceDetails extends AdminInvoice {
    lines: AdminInvoiceLine[];
    pdfUrl?: string;
}

export interface AdminInvoiceLine {
    id: number;
    description: string;
    itemCode: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface AdminQuote {
    id: string;
    date: string;
    expiryDate: string;
    total: number;
    status: 'Draft' | 'Sent' | 'Expired';
    name: string;
    accountId?: number;
    accountName?: string;
}

export interface AdminAccountDetails extends AdminAccount {
    address: AdminAccountAddress;
    salesRep: string;
    paymentTerms: string;
    memberSince: string;
    taxId: string;
    openOrders: AdminOrder[];
    openInvoices?: AdminInvoice[]; // Now loaded async
    openQuotes: AdminQuote[];
}

export interface AdminUser {
    id: number;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    accountId?: number;
    phone?: string;
    accountAssignments?: AdminAccountAssignment[];
}

export interface CreateAdminUserInput {
    name: string;
    email: string;
    role: UserRole;
    password: string;
    isActive: boolean;
    phone?: string;
    accountAssignments?: AdminAccountAssignmentInput[];
}

export interface UpdateAdminUserInput {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    phone?: string;
    accountAssignments?: AdminAccountAssignmentInput[];
}

export interface AdminAccountAssignment {
    id: number;
    accountId: number;
    assignmentType: string;
    isPrimary: boolean;
    createdAt: string;
}

export interface AdminAccountAssignmentInput {
    accountId: number;
    assignmentType: string;
    isPrimary: boolean;
}

export type AdminAccountSort = 'name' | 'balance-desc' | 'past-due-desc' | 'age-desc';

interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

// --- Helpers ---

const isPastDue = (inv: Invoice): boolean => inv.status === 'past_due';

/** Format an ISO date string to "Jan 15, 2026" style. */
function formatDate(iso: string | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// --- Mappers ---

const mapStatus = (active: boolean, invoices?: Invoice[]): AccountStatus => {
    if (!active) return 'Hold';
    if (invoices?.some(isPastDue)) return 'Overdue';
    return 'Active';
};

const mapAccount = (raw: Account, invoices?: Invoice[], financials?: AccountFinancials): AdminAccount => ({
    id: raw.id,
    name: raw.name || 'Unknown',
    email: raw.email || '',
    phone: raw.phone || '',
    status: raw.active ? ((financials?.pastDueBalance ?? 0) > 0 ? 'Overdue' : 'Active') : 'Hold',
    creditLimit: financials?.creditLimit ?? raw.creditLimit ?? 0,
    balance: financials?.totalBalance ?? raw.balance ?? 0,
    availableCredit: financials?.availableCredit ?? raw.availableCredit ?? 0,
    pastDueBalance: financials?.pastDueBalance ?? 0,
    aging: financials?.aging ?? 'Current',
    openInvoicesCount: invoices
        ? invoices.filter(inv => inv.status === 'open' || isPastDue(inv)).length
        : 0,
    primaryContact: raw.name || 'Unknown',
});

const mapOrder = (raw: Order): AdminOrder => {
    let status: AdminOrder['status'];
    switch (raw.status) {
        case 'pending':
            status = 'Pending';
            break;
        case 'shipped':
        case 'delivered':
            status = 'Shipped';
            break;
        default:
            status = 'Processing';
    }
    return {
        id: raw.orderNumber || String(raw.id),
        date: formatDate(raw.orderDate),
        total: raw.total,
        status,
        itemsCount: 0,
    };
};

const mapInvoice = (raw: Invoice): AdminInvoice => ({
    id: raw.invoiceNumber || String(raw.id),
    internalId: raw.id,
    date: formatDate(raw.invoiceDate),
    dueDate: formatDate(raw.dueDate),
    total: raw.total,
    balance: raw.balanceDue,
    status: raw.status === 'open' ? 'Open' : isPastDue(raw) ? 'Past Due' : 'Paid',
});

const mapInvoiceLine = (raw: InvoiceLine): AdminInvoiceLine => ({
    id: raw.id,
    description: raw.description || raw.itemCode,
    itemCode: raw.itemCode,
    quantity: raw.quantityBilled,
    unitPrice: raw.unitPrice,
    total: raw.extendedPrice,
});

const mapQuote = (raw: Quote): AdminQuote => ({
    id: raw.quoteNumber || String(raw.id),
    date: formatDate(raw.quoteDate),
    expiryDate: formatDate(raw.expiresOn),
    total: raw.total,
    status: (raw.status === 'sent' || raw.status === 'viewed') ? 'Sent'
        : raw.status === 'expired' ? 'Expired'
            : 'Draft',
    name: raw.quoteNumber,
});

const mapAdminUser = (u: User): AdminUser => ({
    id: u.id,
    email: u.email,
    name: u.name || '(No Name)',
    role: u.role,
    isActive: u.isActive,
    accountId: u.accountId,
    phone: u.phone || undefined,
    accountAssignments: u.accountAssignments?.map((a) => ({
        id: a.id,
        accountId: a.accountId,
        assignmentType: a.assignmentType,
        isPrimary: a.isPrimary,
        createdAt: a.createdAt,
    })),
});

export interface AdminThread {
    id: string;
    accountId: number;
    accountName: string;
    type: 'email' | 'text';
    participants: string[];
    subject?: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    status: 'open' | 'closed' | 'archived';
    assignee?: string;
}

export interface AdminMessage {
    id: string;
    threadId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    read: boolean;
    isOwn?: boolean; // Helper for UI
}


// --- Service ---

import {
    MOCK_ADMIN_DASHBOARD,
    MOCK_ADMIN_ACCOUNTS,
    MOCK_ADMIN_USERS,
    MOCK_INVOICES,
    MOCK_QUOTES
} from '../../mock/admin-mock.js';
import {
    MOCK_THREADS,
    MOCK_MESSAGES,
    MockThread,
    MockMessage
} from '../../mock/messaging-mock.js';

class AdminDataServiceImpl {
    async getAccounts(limit = 10, offset = 0, pastDueOnly = false, sort: AdminAccountSort = 'name'): Promise<{ items: AdminAccount[], total: number }> {
        let items = [...MOCK_ADMIN_ACCOUNTS];
        if (pastDueOnly) {
            items = items.filter(a => a.pastDueBalance > 0);
        }
        // Simplified sort
        if (sort === 'balance-desc') {
            items.sort((a, b) => b.balance - a.balance);
        } else if (sort === 'past-due-desc') {
            items.sort((a, b) => b.pastDueBalance - a.pastDueBalance);
        }

        return {
            items: items.slice(offset, offset + limit),
            total: items.length
        };
    }

    async getInvoices(accountId?: number, limit = 10, offset = 0): Promise<{ items: AdminInvoice[]; total: number }> {
        let items = [...MOCK_INVOICES];
        if (accountId) {
            items = items.filter(inv => inv.accountId === accountId);
        }
        return {
            items: items.slice(offset, offset + limit),
            total: items.length
        };
    }

    async getQuotes(accountId?: number, limit = 10, offset = 0): Promise<{ items: AdminQuote[]; total: number }> {
        let items = [...MOCK_QUOTES];
        if (accountId) {
            items = items.filter(q => q.accountId === accountId);
        }
        return {
            items: items.slice(offset, offset + limit),
            total: items.length
        };
    }

    async getInvoice(id: number): Promise<AdminInvoiceDetails | null> {
        const inv = MOCK_INVOICES.find(i => i.internalId === id);
        if (!inv) return null;

        // Generate realistic line items
        const materials = [
            { code: "LUM-2x4-8", desc: "2x4x8 SPF Kiln Dried Stud", price: 4.58 },
            { code: "DRY-12-4x8", desc: "1/2 in. x 4 ft. x 8 ft. UltraLight Drywall", price: 14.85 },
            { code: "PLY-34-4x8", desc: "23/32 in. x 4 ft. x 8 ft. RTD Sheathing Plywood", price: 45.20 },
            { code: "CON-80LB", desc: "80 lb. Concrete Mix", price: 6.85 },
            { code: "FAS-SCR-3", desc: "#9 x 3 in. Deck Screws (5 lb.)", price: 28.47 },
            { code: "INS-R13", desc: "R-13 Kraft Faced Fiberglass Insulation", price: 58.00 },
            { code: "RFG-SHN-BLK", desc: "3-Tab Black Asphalt Shingles", price: 32.50 },
            { code: "PAI-INT-WHT", desc: "Interior Flat White Paint (5 Gal)", price: 125.00 }
        ];

        // Deterministic seeding based on ID so it's consistent across reloads
        const seed = id;
        const numItems = (seed % 4) + 3; // 3 to 6 items
        const lines: AdminInvoiceLine[] = [];
        let runningTotal = 0;

        for (let i = 0; i < numItems; i++) {
            const itemIndex = (seed + i * 3) % materials.length; // varying index
            const item = materials[itemIndex];
            const qty = ((seed * (i + 1)) % 25) + 1; // 1 to 25
            const lineTotal = qty * item.price;

            lines.push({
                id: i + 1,
                description: item.desc,
                itemCode: item.code,
                quantity: qty,
                unitPrice: item.price,
                total: lineTotal
            });
            runningTotal += lineTotal;
        }

        return {
            ...inv,
            total: runningTotal, // Update total to match lines
            balance: runningTotal, // Assuming fully unpaid for simplicity
            lines: lines,
            pdfUrl: "#"
        };
    }

    async getQuote(id: string): Promise<AdminQuote | null> {
        const q = MOCK_QUOTES.find(q => q.id === id);
        return q || null;
    }

    async getDashboardSummary(): Promise<AdminDashboardSummary> {
        return MOCK_ADMIN_DASHBOARD;
    }

    async getUsers(limit = 25, offset = 0, search = ''): Promise<{ items: AdminUser[]; total: number }> {
        let items = [...MOCK_ADMIN_USERS];
        if (search) {
            items = items.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
        }
        return {
            items: items.slice(offset, offset + limit),
            total: items.length
        };
    }

    async createUser(input: CreateAdminUserInput): Promise<AdminUser> {
        const newUser: AdminUser = {
            id: Math.floor(Math.random() * 1000),
            name: input.name,
            email: input.email,
            role: input.role,
            isActive: input.isActive,
            phone: input.phone
        };
        MOCK_ADMIN_USERS.push(newUser);
        return newUser;
    }

    async getUser(id: number): Promise<AdminUser> {
        const user = MOCK_ADMIN_USERS.find(u => u.id === id);
        if (!user) throw new Error('User not found');
        return user;
    }

    async updateUser(input: UpdateAdminUserInput): Promise<AdminUser> {
        const index = MOCK_ADMIN_USERS.findIndex(u => u.id === input.id);
        if (index === -1) throw new Error('User not found');
        const updated = { ...MOCK_ADMIN_USERS[index], ...input };
        MOCK_ADMIN_USERS[index] = updated as any;
        return updated as any;
    }

    async getAccountDetails(id: number): Promise<AdminAccountDetails | null> {
        const account = MOCK_ADMIN_ACCOUNTS.find(a => a.id === id);
        if (!account) return null;

        return {
            ...account,
            address: {
                street: '123 Fake St',
                city: 'Springfield',
                state: 'IL',
                zip: '62704',
                country: 'USA'
            },
            salesRep: 'Demo Rep',
            paymentTerms: 'Net 30',
            memberSince: '2020-01-01',
            taxId: 'XX-XXXXXXX',
            openOrders: [],
            openQuotes: MOCK_QUOTES.filter(q => q.accountId === id),
            openInvoices: MOCK_INVOICES.filter(i => i.accountId === id)
        };
    }

    async inviteTeamMember(email: string, name: string, role: string): Promise<void> {
        console.log('[Demo Mode] Invite suppressed', { email, name, role });
    }

    // --- Messaging ---

    async getThreads(filter: { accountId?: number, type?: 'email' | 'text', status?: 'open' | 'closed' | 'archived' } = {}): Promise<AdminThread[]> {
        let threads = [...MOCK_THREADS];

        if (filter.accountId) {
            threads = threads.filter(t => t.accountId === filter.accountId);
        }
        if (filter.type) {
            threads = threads.filter(t => t.type === filter.type);
        }
        if (filter.status) {
            threads = threads.filter(t => t.status === filter.status);
        }

        // Sort by last message (desc)
        return threads.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    }

    async getThreadMessages(threadId: string): Promise<AdminMessage[]> {
        const messages = MOCK_MESSAGES.filter(m => m.threadId === threadId);
        return messages.map(m => ({
            ...m,
            isOwn: m.senderId === 'admin' // In a real app, check against current user ID
        })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    async createThread(accountId: number, type: 'email' | 'text', participants: string[], subject?: string): Promise<AdminThread> {
        const account = MOCK_ADMIN_ACCOUNTS.find(a => a.id === accountId);
        const newThread: MockThread = {
            id: 't' + (MOCK_THREADS.length + 1),
            accountId,
            accountName: account?.name || 'Unknown',
            type,
            participants,
            subject,
            lastMessage: 'New coreversation started',
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
            status: 'open',
            assignee: 'Unassigned'
        };
        MOCK_THREADS.unshift(newThread);
        return newThread;
    }

    async sendMessage(threadId: string, content: string): Promise<AdminMessage> {
        const thread = MOCK_THREADS.find(t => t.id === threadId);
        if (!thread) throw new Error('Thread not found');

        const newMessage: MockMessage = {
            id: 'm' + (MOCK_MESSAGES.length + 1),
            threadId,
            senderId: 'admin',
            senderName: 'You', // Current user
            content,
            timestamp: new Date().toISOString(),
            read: true
        };

        MOCK_MESSAGES.push(newMessage);

        // Update thread
        thread.lastMessage = content;
        thread.lastMessageAt = newMessage.timestamp;

        return { ...newMessage, isOwn: true };
    }

    async updateThreadAssignee(threadId: string, assignee: string): Promise<void> {
        const thread = MOCK_THREADS.find(t => t.id === threadId);
        if (thread) {
            thread.assignee = assignee;
        }
    }

}

export const AdminDataService = new AdminDataServiceImpl();
