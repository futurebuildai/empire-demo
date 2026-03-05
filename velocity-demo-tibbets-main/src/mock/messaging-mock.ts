
export interface MockMessage {
    id: string;
    threadId: string;
    senderId: string; // 'admin' or 'customer' or userId
    senderName: string;
    content: string;
    timestamp: string;
    read: boolean;
}

export interface MockThread {
    id: string;
    accountId: number;
    accountName: string;
    type: 'email' | 'text';
    participants: string[]; // Names or Emails/Phones
    subject?: string; // For emails
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    status: 'open' | 'closed' | 'archived';
    assignee?: string; // Employee Name
}

export const MOCK_THREADS: MockThread[] = [
    {
        id: 't1',
        accountId: 1,
        accountName: 'Acme Corp',
        type: 'text',
        participants: ['John Doe', 'Demo Rep'],
        lastMessage: 'When will my order arrive?',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        unreadCount: 1,
        status: 'open',
        assignee: 'Demo Rep'
    },
    {
        id: 't2',
        accountId: 1,
        accountName: 'Acme Corp',
        type: 'email',
        participants: ['John Doe', 'Support Team'],
        subject: 'Invoice Question',
        lastMessage: 'Please see the attached invoice regarding...',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        unreadCount: 0,
        status: 'open'
    },
    {
        id: 't3',
        accountId: 2,
        accountName: 'Globex Inc',
        type: 'text',
        participants: ['Jane Smith', 'Sales Team'],
        lastMessage: 'Thanks for the update!',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        unreadCount: 0,
        status: 'closed',
        assignee: 'Demo Rep'
    }
];

export const MOCK_MESSAGES: MockMessage[] = [
    {
        id: 'm1',
        threadId: 't1',
        senderId: 'customer',
        senderName: 'John Doe',
        content: 'Hi, I was wondering about the status of my order #12345.',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        read: true
    },
    {
        id: 'm2',
        threadId: 't1',
        senderId: 'admin',
        senderName: 'Demo Rep',
        content: 'Hi John, let me check that for you.',
        timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
        read: true
    },
    {
        id: 'm3',
        threadId: 't1',
        senderId: 'customer',
        senderName: 'John Doe',
        content: 'When will my order arrive?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false
    },
    {
        id: 'm4',
        threadId: 't2',
        senderId: 'customer',
        senderName: 'John Doe',
        content: 'I have a question about invoice #INV-001.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        read: true
    },
    {
        id: 'm5',
        threadId: 't2',
        senderId: 'admin',
        senderName: 'Support Team',
        content: 'Please see the attached invoice regarding...',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true
    }
];
