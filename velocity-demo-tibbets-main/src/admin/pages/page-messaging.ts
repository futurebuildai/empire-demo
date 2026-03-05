
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AdminDataService } from '../services/admin-data.service.js';
import type { AdminThread, AdminMessage, AdminUser } from '../services/admin-data.service.js';

@customElement('admin-page-messaging')
export class PageMessaging extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: calc(100vh - 64px); 
            overflow: hidden;
            font-family: var(--font-body, 'Inter', sans-serif);
        }

        .layout {
            display: flex;
            height: 100%;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
        }

        /* Thread Column */
        .thread-column {
            width: 380px;
            border-right: 1px solid #f1f5f9;
            display: flex;
            flex-direction: column;
            background: #fff;
            flex-shrink: 0;
        }

        .thread-search-area {
            padding: 1rem;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .search-wrapper {
            position: relative;
        }

        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            pointer-events: none;
        }

        .search-input {
            width: 100%;
            padding: 0.625rem 1rem 0.625rem 2.25rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s;
            box-sizing: border-box;
            background: #f8fafc;
        }

        .search-input:focus {
            background: #fff;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .tabs-row {
            display: flex;
            gap: 1.5rem;
            border-bottom: 1px solid transparent;
            padding-bottom: 0.5rem; 
        }

        .tab-btn {
            background: none;
            border: none;
            padding: 0.5rem 0;
            font-size: 0.875rem;
            font-weight: 500;
            color: #64748b;
            cursor: pointer;
            position: relative;
            transition: color 0.2s;
        }

        .tab-btn:hover {
            color: #1e293b;
        }

        .tab-btn.active {
            color: #3b82f6;
            font-weight: 600;
        }

        .tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -9px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #3b82f6;
        }

        .threads-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 0.5rem;
        }

        .thread-item {
            padding: 1rem;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            gap: 1rem;
            border: 1px solid transparent;
            margin-bottom: 0.25rem;
            transition: all 0.2s;
        }

        .thread-item:hover {
            background: #f8fafc;
        }

        .thread-item.selected {
            background: #eff6ff;
            border-color: transparent;
        }

        .thread-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
            font-weight: 600;
            font-size: 1rem;
            flex-shrink: 0;
        }

        .selected .thread-avatar {
            background: #fff;
            color: #3b82f6;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
        }

        .thread-content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .thread-top {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }

        .thread-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 0.9375rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .thread-time {
            font-size: 0.75rem;
            color: #94a3b8;
            flex-shrink: 0;
        }

        .thread-preview {
            font-size: 0.875rem;
            color: #64748b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
        }

        .thread-icons {
             display: flex;
             gap: 0.5rem;
             margin-top: 0.25rem;
             align-items: center;
        }

        .badge {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            height: 20px;
        }

        .badge-email { background: #fee2e2; color: #991b1b; }
        .badge-text { background: #dcfce7; color: #166534; }

        /* Detail View */
        .detail-view {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #f8fafc;
            min-width: 0;
        }

        .view-header {
            padding: 0 1.5rem;
            background: #fff;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 72px;
            flex-shrink: 0;
        }

        .header-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 0;
        }

        .header-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #eff6ff;
            color: #3b82f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.9375rem;
            flex-shrink: 0;
        }

        .header-info {
            min-width: 0;
        }

        .header-info h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
            color: #0f172a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .header-sub {
            font-size: 0.8125rem;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 2px;
        }

        .header-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
            flex-shrink: 0;
        }

        .assign-select {
            padding: 0.375rem;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-size: 0.875rem;
            color: #334155;
            cursor: pointer;
        }

        .messages-area {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .message-group {
            display: flex;
            gap: 0.75rem;
            max-width: 75%;
            width: fit-content;
        }

        .message-group.own {
            align-self: flex-end;
            flex-direction: row-reverse;
        }

        .msg-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #e2e8f0;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            color: #64748b;
            font-weight: 600;
            margin-top: auto; 
        }
        
        .message-group.own .msg-avatar {
            background: #eff6ff;
            color: #3b82f6;
        }

        .message-bubble {
            padding: 1rem 1.25rem;
            border-radius: 12px 12px 12px 2px;
            font-size: 0.9375rem;
            line-height: 1.5;
            position: relative;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            background: #fff;
            color: #1e293b;
            border: 1px solid #e2e8f0;
        }

        .message-group.own .message-bubble {
            background: #3b82f6;
            color: white;
            border: 1px solid #3b82f6;
            border-radius: 12px 12px 2px 12px;
            box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2);
        }
        
        .message-meta {
            font-size: 0.6875rem;
            color: #94a3b8;
            margin-top: 0.25rem;
            margin-left: 0.25rem;
        }
        
        .message-group.own .message-meta {
            text-align: right;
            margin-right: 0.25rem;
        }

        .input-area {
            padding: 1.5rem;
            background: #fff;
            border-top: 1px solid #f1f5f9;
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-shrink: 0;
        }
        
        .icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: transparent;
            color: #94a3b8;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .icon-btn:hover {
            background: #f1f5f9;
            color: #475569;
        }

        .msg-input {
            flex: 1;
            padding: 0.875rem 1.25rem;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            font-size: 0.9375rem;
            outline: none;
            transition: all 0.2s;
            background: #f8fafc;
            color: #0f172a;
        }

        .msg-input:focus {
            background: #fff;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .send-btn {
            background: #3b82f6;
            color: white;
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .send-btn:hover {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }
        
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #94a3b8;
            gap: 1rem;
        }
    `;

    @state() private activeFilter: 'my' | 'all' = 'my';
    @state() private searchQuery = '';
    @state() private threads: AdminThread[] = [];
    @state() private selectedThreadId: string | null = null;
    @state() private messages: AdminMessage[] = [];
    @state() private loading = true;
    @state() private newMessage = '';
    @state() private employees: AdminUser[] = [];

    async connectedCallback() {
        super.connectedCallback();
        await this.loadData();

        // Check URL for initial thread
        const params = new URLSearchParams(window.location.search);
        const initialThreadId = params.get('threadId');
        if (initialThreadId) {
            this.selectThread(initialThreadId);
        }
    }

    private async loadData() {
        this.loading = true;
        try {
            const [threadsData, usersData] = await Promise.all([
                AdminDataService.getThreads({}),
                AdminDataService.getUsers(100)
            ]);
            this.threads = threadsData;
            this.employees = usersData.items.filter(u => u.role !== 'account_user'); // Only internal
        } catch (e) {
            console.error('Failed to load data', e);
        } finally {
            this.loading = false;
        }
    }

    private get filteredThreads() {
        let filtered = this.threads;

        // Filter by Tab
        if (this.activeFilter === 'my') {
            filtered = filtered.filter(t => t.assignee === 'Demo Rep' || t.participants.includes('Demo Rep'));
        }

        // Filter by Search
        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.participants.some(p => p.toLowerCase().includes(q)) ||
                t.accountName.toLowerCase().includes(q) ||
                t.subject?.toLowerCase().includes(q)
            );
        }

        return filtered;
    }

    private async selectThread(id: string) {
        this.selectedThreadId = id;
        this.messages = [];
        try {
            this.messages = await AdminDataService.getThreadMessages(id);
            await this.updateUrl(id);
            this.requestUpdate();

            // Scroll to bottom
            setTimeout(() => {
                const area = this.shadowRoot?.querySelector('.messages-area');
                if (area) area.scrollTop = area.scrollHeight;
            }, 50);
        } catch (e) {
            console.error(e);
        }
    }

    private updateUrl(threadId: string) {
        const url = new URL(window.location.href);
        url.searchParams.set('threadId', threadId);
        window.history.replaceState({}, '', url);
    }

    private async handleSend() {
        if (!this.newMessage.trim() || !this.selectedThreadId) return;

        try {
            const msg = await AdminDataService.sendMessage(this.selectedThreadId, this.newMessage);
            this.messages = [...this.messages, msg];
            this.newMessage = '';

            // Update thread list preview
            const threadIndex = this.threads.findIndex(t => t.id === this.selectedThreadId);
            if (threadIndex !== -1) {
                const updatedThread = { ...this.threads[threadIndex], lastMessage: msg.content, lastMessageAt: msg.timestamp };
                // Move to top
                this.threads = [updatedThread, ...this.threads.filter((_, i) => i !== threadIndex)];
            }

            setTimeout(() => {
                const area = this.shadowRoot?.querySelector('.messages-area');
                if (area) area.scrollTop = area.scrollHeight;
            }, 50);
        } catch (e) {
            console.error(e);
        }
    }

    private async handleAssigneeChange(e: Event) {
        if (!this.selectedThreadId) return;
        const select = e.target as HTMLSelectElement;
        const newAssignee = select.value;

        try {
            await AdminDataService.updateThreadAssignee(this.selectedThreadId, newAssignee);
            // Update local state
            const thread = this.threads.find(t => t.id === this.selectedThreadId);
            if (thread) {
                thread.assignee = newAssignee;
                this.requestUpdate();
            }
        } catch (e) {
            console.error(e);
        }
    }

    private getInitials(name: string) {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    private formatDate(iso: string) {
        const d = new Date(iso);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        return isToday
            ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    render() {
        const selectedThread = this.threads.find(t => t.id === this.selectedThreadId);

        return html`
            <div class="layout">
                <!-- Thread Column (Search + List) -->
                <div class="thread-column">
                    <div class="thread-search-area">
                        <div class="search-wrapper">
                            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input 
                                class="search-input" 
                                type="text" 
                                placeholder="Search by name..." 
                                .value=${this.searchQuery}
                                @input=${(e: Event) => this.searchQuery = (e.target as HTMLInputElement).value}
                            >
                        </div>
                        <div class="tabs-row">
                            <button 
                                class="tab-btn ${this.activeFilter === 'my' ? 'active' : ''}" 
                                @click=${() => this.activeFilter = 'my'}>
                                My Threads
                            </button>
                            <button 
                                class="tab-btn ${this.activeFilter === 'all' ? 'active' : ''}" 
                                @click=${() => this.activeFilter = 'all'}>
                                All Threads
                            </button>
                        </div>
                    </div>

                    <div class="threads-scroll">
                        ${this.filteredThreads.map(thread => html`
                            <div class="thread-item ${this.selectedThreadId === thread.id ? 'selected' : ''}" 
                                 @click=${() => this.selectThread(thread.id)}>
                                <div class="thread-avatar">
                                    ${this.getInitials(thread.participants[0] || '?')}
                                </div>
                                <div class="thread-content">
                                    <div class="thread-top">
                                        <div class="thread-name">${thread.participants.join(', ')}</div>
                                        <div class="thread-time">${this.formatDate(thread.lastMessageAt)}</div>
                                    </div>
                                    <div class="thread-preview">${thread.lastMessage}</div>
                                    <div class="thread-icons">
                                        <span class="badge ${thread.type === 'email' ? 'badge-email' : 'badge-text'}">
                                            ${thread.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>
                </div>

                <!-- Main View -->
                <div class="detail-view">
                    ${selectedThread ? html`
                        <div class="view-header">
                            <div class="header-content">
                                <div class="header-avatar" style="width: 48px; height: 48px; font-size: 1.125rem;">
                                    ${this.getInitials(selectedThread.participants[0] || '?')}
                                </div>
                                <div class="header-info">
                                    <h3 style="font-size: 1.25rem;">${selectedThread.participants.join(', ')}</h3>
                                    <div class="header-sub">
                                        <span style="background: #f1f5f9; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; color: #475569; font-weight: 500;">
                                            ${selectedThread.accountName}
                                        </span>
                                        <span style="color: #cbd5e1">•</span>
                                        <span>${selectedThread.type === 'email' ? selectedThread.subject || 'No Subject' : 'Text Conversation'}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="header-actions">
                                <button class="icon-btn" title="More Options">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                </button>
                                <div style="position: relative; display: flex; align-items: center; gap: 8px;">
                                    <select 
                                        class="assign-select" 
                                        @change=${this.handleAssigneeChange} 
                                        .value=${selectedThread.assignee || ''} 
                                        style="appearance: none; background: white; padding: 8px 16px; padding-right: 32px; border: 1px solid #e2e8f0; border-radius: 99px; font-weight: 500; cursor: pointer; color: #0f172a;"
                                    >
                                        <option value="Unassigned">Assign Team</option>
                                        ${this.employees.map(emp => html`
                                            <option value="${emp.name}">${emp.name}</option>
                                        `)}
                                    </select>
                                    <svg style="position: absolute; right: 12px; pointer-events: none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>

                        <div class="messages-area">
                            ${this.messages.map(msg => html`
                                <div class="message-group ${msg.isOwn ? 'own' : ''}">
                                    ${!msg.isOwn ? html`
                                        <div class="msg-avatar">${this.getInitials(msg.senderName)}</div>
                                    ` : ''}
                                    <div class="message-content">
                                        <div class="message-bubble">
                                            ${msg.content}
                                        </div>
                                        <div class="message-meta">
                                            ${this.formatDate(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>

                        <div class="input-area">
                            <button class="icon-btn" title="Attach File">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            </button>
                            <input 
                                class="msg-input" 
                                type="text" 
                                placeholder="Type your message..."
                                .value=${this.newMessage}
                                @input=${(e: Event) => this.newMessage = (e.target as HTMLInputElement).value}
                                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.handleSend()}
                            >
                            <button class="send-btn" @click=${this.handleSend}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    ` : html`
                        <div class="empty-state">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <h3>Select a conversation</h3>
                            <p>Choose a thread from the list to view and reply</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
}
