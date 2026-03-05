/**
 * RouterService - Singleton for hash-based routing
 * Listens to hashchange events and provides navigation API
 */

import type { RouteId } from '../types/index.js';

const VALID_ROUTES: RouteId[] = [
    'overview',
    'billing',
    'orders',
    'quotes',
    'wallet',
    'team',
    'settings',
    'shop',
    'checkout',
    'login',
    'home',
    'product-details',
    'showrooms',
    'services',
    'about',
    'employment',
    'brand-partners',
    'contact',
    'terms',
    'privacy',
];

const DEFAULT_ROUTE: RouteId = 'overview';

class RouterServiceImpl {
    private currentRoute: RouteId = DEFAULT_ROUTE;
    private listeners: Set<(route: RouteId) => void> = new Set();
    private initialized = false;

    /**
     * Initialize router and start listening to hash changes
     */
    init(): void {
        if (this.initialized) return;

        window.addEventListener('hashchange', () => this.handleHashChange());
        this.handleHashChange(); // Process initial hash
        this.initialized = true;
    }

    /**
     * Get current active route
     */
    getCurrentRoute(): RouteId {
        return this.currentRoute;
    }

    /**
     * Get current route parameters
     */
    getParams(): URLSearchParams {
        const hash = window.location.hash.substring(1);
        const queryIndex = hash.indexOf('?');
        if (queryIndex === -1) return new URLSearchParams();
        return new URLSearchParams(hash.substring(queryIndex));
    }

    /**
     * Navigate to a new route
     */
    navigate(route: RouteId, params?: Record<string, string | number>): void {
        let hash = route;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                hash = `${route}?${queryString}` as RouteId;
            }
        }

        if (window.location.hash !== `#${hash}`) {
            window.location.hash = hash;
        }
    }

    /**
     * Subscribe to route changes
     */
    subscribe(listener: (route: RouteId) => void): () => void {
        this.listeners.add(listener);
        // Immediately notify of current route
        listener(this.currentRoute);
        return () => this.listeners.delete(listener);
    }

    /**
     * Parse hash and update current route
     */
    private handleHashChange(): void {
        const hash = window.location.hash.substring(1) || DEFAULT_ROUTE;
        const route = this.parseRoute(hash);

        // Always notify if hash changed, even if route ID is same (params might have changed)
        // But for getting current route ID, we check equality
        this.currentRoute = route;
        this.notifyListeners(); // Notify listeners of potential updates
        this.dispatchEvent(route);
    }

    /**
     * Validate and parse route from hash
     */
    private parseRoute(hash: string): RouteId {
        // Strip query params
        const queryIndex = hash.indexOf('?');
        const routeBase = queryIndex === -1 ? hash : hash.substring(0, queryIndex);

        const route = routeBase as RouteId;
        return VALID_ROUTES.includes(route) ? route : DEFAULT_ROUTE;
    }

    /**
     * Notify all subscribed listeners
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.currentRoute));
    }

    /**
     * Dispatch custom event for route changes
     */
    private dispatchEvent(route: RouteId): void {
        window.dispatchEvent(
            new CustomEvent('route-changed', {
                detail: { route, params: this.getParams() },
                bubbles: true,
                composed: true,
            })
        );
    }
}

// Singleton export
export const RouterService = new RouterServiceImpl();
