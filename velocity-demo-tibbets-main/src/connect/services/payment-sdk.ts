/**
 * PaymentSDKService - DEMO MODE
 * Mocks the Run Payments SDK tokenization flow
 * No external scripts loaded, no API calls made
 */
import type { CardTokenizeInput, ACHTokenizeInput, TokenResponse } from '../types/domain';

export const PaymentSDKService = {
    isReady: (): boolean => true,

    getPublicKey: (): string | null => 'demo_pk_test_mock_key_12345',

    initialize: (): Promise<void> => {
        console.log('[Demo Mode] PaymentSDK initialized (mock)');
        return Promise.resolve();
    },

    tokenizeCard: async (data: CardTokenizeInput): Promise<TokenResponse> => {
        // Simulate a brief delay like a real SDK call
        await new Promise(r => setTimeout(r, 600));

        const cardDigits = data.cardNumber.replace(/\D/g, '');
        return {
            token: `tok_demo_card_${Date.now()}`,
            last4: cardDigits.slice(-4),
            brand: cardDigits.startsWith('4') ? 'Visa'
                : cardDigits.startsWith('5') ? 'Mastercard'
                    : cardDigits.startsWith('3') ? 'Amex'
                        : 'Unknown',
            expMonth: data.expMonth,
            expYear: data.expYear
        };
    },

    tokenizeACH: async (data: ACHTokenizeInput): Promise<TokenResponse> => {
        await new Promise(r => setTimeout(r, 600));

        return {
            token: `tok_demo_ach_${Date.now()}`,
            last4: data.accountNumber.slice(-4)
        };
    },

    reset: (): void => {
        console.log('[Demo Mode] PaymentSDK reset (mock)');
    },
};
