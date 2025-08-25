import { createClient } from '@supabase/supabase-js';
import type { QuizAnswer, ProfileDraft, ResultId } from '../data/types';

// Lazy initialization of Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not found. Some features may not work properly.');
      // Return a mock client for development/testing
      return null;
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

// Database types
export interface QuizSubmission {
  id: string;
  user_id: string;
  answers: QuizAnswer[];
  score_map: Record<string, number>;
  top_axes: string[];
  created_at: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  result_id: ResultId;
  plan_json: Record<string, unknown>;
  valid_until: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  last_meal_time: string;
  dinner_heaviness: string;
  evening_sweets_freq: string;
  caffeine_after_14: string;
  nicotine_evening: boolean;
  alcohol_evening: string;
  late_hydration: boolean;
  nocturia: boolean;
  reflux_flag: boolean;
  veg_fiber_low: boolean;
  micros_gap_hint: boolean;
  created_at: string;
  updated_at: string;
}

// Service functions
export const onboardingService = {
  // Save quiz answers and scoring
  async saveQuiz(
    userId: string, 
    answers: Record<string, QuizAnswer>, 
    scoreMap: Record<string, number>, 
    topAxes: string[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        console.warn('Supabase not available, skipping save');
        return { success: true }; // Mock success for development
      }

      // Type assertion for development - in production, you'd have proper database types
      const { error } = await (supabase as any)
        .from('quiz_submissions')
        .insert({
          user_id: userId,
          answers: Object.values(answers),
          score_map: scoreMap,
          top_axes: topAxes
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error saving quiz:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Save user plan
  async savePlan(
    userId: string, 
    resultId: ResultId, 
    planJson: Record<string, unknown>, 
    validUntil: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        console.warn('Supabase not available, skipping save');
        return { success: true }; // Mock success for development
      }

      const { error } = await (supabase as any)
        .from('user_plans')
        .insert({
          user_id: userId,
          result_id: resultId,
          plan_json: planJson,
          valid_until: validUntil
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error saving plan:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Upsert user profile
  async upsertProfile(
    userId: string, 
    profileDraft: ProfileDraft
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        console.warn('Supabase not available, skipping save');
        return { success: true }; // Mock success for development
      }

      const { error } = await (supabase as any)
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileDraft,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error upserting profile:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Get user's current plan
  async getCurrentPlan(userId: string): Promise<{ data: UserPlan | null; error?: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        console.warn('Supabase not available, returning mock data');
        return { data: null }; // Mock empty data for development
      }

      const { data, error } = await (supabase as any)
        .from('user_plans')
        .select('*')
        .eq('user_id', userId)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return { data: data || null };
    } catch (error) {
      console.error('Error getting current plan:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};
