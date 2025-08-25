export interface Analytics {
  track(event: string, props?: Record<string, unknown>): void;
}

// Default analytics implementation
export const defaultAnalytics: Analytics = {
  track: (event: string, props?: Record<string, unknown>) => {
    // In production, this would send to your analytics service
    console.log(`[Analytics] ${event}`, props);
    
    // Example: Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, props);
    }
    
    // Example: Mixpanel
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(event, props);
    }
  }
};

// Quiz-specific analytics events
export const trackOnboardingEvent = (
  event: 
    | 'onboarding_start'
    | 'quiz_answered'
    | 'profile_completed'
    | 'result_shown'
    | 'plan_saved'
    | 'bundle_viewed'
    | 'bundle_saved'
    | 'reminder_set',
  props?: Record<string, unknown>
) => {
  defaultAnalytics.track(event, {
    feature: 'onboarding_sleep',
    timestamp: new Date().toISOString(),
    ...props
  });
};

// Helper functions for common events
export const trackQuizStart = () => trackOnboardingEvent('onboarding_start');
export const trackQuizAnswer = (questionId: string, optionId: string) => 
  trackOnboardingEvent('quiz_answered', { questionId, optionId });
export const trackProfileComplete = (profileData: Record<string, unknown>) => 
  trackOnboardingEvent('profile_completed', { profileData });
export const trackResultShown = (resultId: string) => 
  trackOnboardingEvent('result_shown', { resultId });
export const trackPlanSaved = (resultId: string) => 
  trackOnboardingEvent('plan_saved', { resultId });
export const trackBundleViewed = (bundleTags: string[]) => 
  trackOnboardingEvent('bundle_viewed', { bundleTags });
export const trackBundleSaved = (bundleId: string) => 
  trackOnboardingEvent('bundle_saved', { bundleId });
export const trackReminderSet = (reminderType: string) => 
  trackOnboardingEvent('reminder_set', { reminderType });
