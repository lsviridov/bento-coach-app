// Configuration for onboarding sleep quiz feature
export const config = {
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    // Check if Supabase is properly configured
    isConfigured: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  },
  
  // Feature flags
  features: {
    // Enable mock mode when Supabase is not configured
    mockMode: !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY,
    // Enable analytics (default: true)
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
    // Enable persistence (default: true)
    persistence: import.meta.env.VITE_ENABLE_PERSISTENCE !== 'false'
  },
  
  // Development settings
  dev: {
    // Mock user ID for development
    mockUserId: 'dev-user-123',
    // Enable debug logging
    debug: import.meta.env.DEV
  }
};

// Helper function to check if feature is available
export const isFeatureAvailable = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

// Helper function to get Supabase status
export const getSupabaseStatus = () => {
  return {
    configured: config.supabase.isConfigured,
    url: config.supabase.url,
    hasKey: !!config.supabase.anonKey
  };
};
