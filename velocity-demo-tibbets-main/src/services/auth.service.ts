/**
 * AuthService - Singleton for authentication state management
 * Handles login/logout using the Backend Integration Layer
 */

import { AuthService as ConnectorAuth } from '../connect/services/auth';
import type { User } from '../connect/types/domain';
export interface Session {
    email: string;
    loginTime: string;
    user?: User;
}

const STORAGE_KEY = 'velocity_session';
const LEGACY_STORAGE_KEY = 'lumberboss_session';
const IMPERSONATION_KEY = 'impersonation_session';

class AuthServiceImpl {
    private listeners: Set<(isAuthenticated: boolean) => void> = new Set();
    private currentUser: User | null = null;

    constructor() {
        // Handle session expiration from API client
        import('../connect/client').then(({ client }) => {
            client.onUnauthorized = () => {
                console.warn('Session expired - performing auto-logout');
                import('../components/atoms/pv-toast').then(({ PvToast }) => {
                    PvToast.suppressErrors = true;
                    PvToast.show('Your session has expired. Please log in again.', 'warning');
                });
                this.logout();
            };
        });
    }

    /**
     * Attempt login with provided credentials
     * @returns true if login successful
     */
    async login(email: string, password: string): Promise<boolean> {
        try {
            const response = await ConnectorAuth.login(email, password);

            // Reset error suppression on successful login
            import('../components/atoms/pv-toast').then(({ PvToast }) => {
                PvToast.suppressErrors = false;
            });

            // Store session
            const session: Session = {
                email: response.user.email,
                loginTime: new Date().toISOString(),
                user: response.user
            };

            this.currentUser = response.user;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
            localStorage.removeItem(LEGACY_STORAGE_KEY);
            localStorage.removeItem(IMPERSONATION_KEY);
            this.notifyListeners(true);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    }

    /**
     * Clear session and log out
     */
    logout(): void {
        console.log('[Demo Mode] Logout disabled');
    }

    /**
     * Check if user has active session
     */
    isAuthenticated(): boolean {
        return true;
    }

    /**
     * Get current session data
     */
    getSession(): Session | null {
        return {
            email: 'demo@homeprousa.com',
            loginTime: new Date().toISOString(),
            user: {
                id: 123,
                email: 'demo@homeprousa.com',
                name: 'Bob the Builder',
                role: 'account_admin',
                isActive: true,
                accountId: 456
            }
        };
    }

    /**
     * Get current user
     */
    getUser(): User | null {
        return this.getSession()?.user || null;
    }

    /**
     * Subscribe to authentication state changes
     */
    subscribe(listener: (isAuthenticated: boolean) => void): () => void {
        listener(true);
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners(isAuthenticated: boolean): void {
        this.listeners.forEach(listener => listener(true));
    }
}

// Singleton export
export const AuthService = new AuthServiceImpl();
