/**
 * AuthService (connect layer) - DEMO MODE
 * Mocks profile updates, password changes, and notification preferences
 */
import type { User, NotificationPreferences, UpdateProfilePayload, ChangePasswordPayload } from '../types/domain';

interface LoginResponse {
    token: string;
    user: User;
}

const mockUser: User = {
    id: 123,
    email: 'demo@homeprousa.com',
    name: 'Bob the Builder',
    role: 'account_admin',
    isActive: true,
    accountId: 456,
    phone: '(555) 123-4567'
};

const mockNotifications: NotificationPreferences = {
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true
};

export const AuthService = {
    login: async (_email: string, _password: string): Promise<LoginResponse> => {
        return { token: 'demo_token_mock', user: mockUser };
    },

    getProfile: () => Promise.resolve(mockUser),

    logout: () => {
        console.log('[Demo Mode] Connect AuthService logout suppressed');
    },

    updateProfile: (_userId: number, payload: UpdateProfilePayload): Promise<User> => {
        if (payload.phone) mockUser.phone = payload.phone;
        return Promise.resolve({ ...mockUser });
    },

    changePassword: (_payload: ChangePasswordPayload): Promise<void> => {
        console.log('[Demo Mode] Password change simulated');
        return Promise.resolve();
    },

    updateNotifications: (_userId: number, prefs: NotificationPreferences): Promise<NotificationPreferences> => {
        Object.assign(mockNotifications, prefs);
        return Promise.resolve({ ...mockNotifications });
    },
};
