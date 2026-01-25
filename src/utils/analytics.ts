/**
 * Analytics Utility for Beta Testing
 * Tracks beta-specific events for monitoring and debugging
 */

interface BetaEventData {
    [key: string]: any;
}

/**
 * Track beta testing events
 * @param event - Event name
 * @param data - Optional event data
 */
export const trackBetaEvent = (event: string, data?: BetaEventData): void => {
    if (process.env.NEXT_PUBLIC_IS_BETA === 'true') {
        console.log(`[BETA EVENT]: ${event}`, data || {});

        // Optional: Send to analytics service
        // Example integrations (uncomment when ready):

        // PostHog
        // if (typeof window !== 'undefined' && window.posthog) {
        //     window.posthog.capture(event, data);
        // }

        // Mixpanel
        // if (typeof window !== 'undefined' && window.mixpanel) {
        //     window.mixpanel.track(event, data);
        // }

        // Google Analytics
        // if (typeof window !== 'undefined' && window.gtag) {
        //     window.gtag('event', event, data);
        // }
    }
};

/**
 * Track beta user action
 * @param action - Action name
 * @param category - Action category
 * @param label - Optional label
 */
export const trackBetaAction = (
    action: string,
    category: string,
    label?: string
): void => {
    trackBetaEvent('beta_action', {
        action,
        category,
        label,
        timestamp: new Date().toISOString(),
    });
};
