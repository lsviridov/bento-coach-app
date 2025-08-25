import { onboardingService } from './supabaseClient';
import type { QuizAnswer, ProfileDraft, ResultId } from '../data/types';
import { trackPlanSaved, trackProfileComplete } from './analytics';

export const persistenceService = {
  // Save complete quiz data
  async saveQuizData(
    userId: string,
    answers: Record<string, QuizAnswer>,
    scoreMap: Record<string, number>,
    topAxes: string[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await onboardingService.saveQuiz(userId, answers, scoreMap, topAxes);
      return result;
    } catch (error) {
      console.error('Error in saveQuizData:', error);
      return { success: false, error: 'Failed to save quiz data' };
    }
  },

  // Save user plan
  async savePlan(
    userId: string,
    resultId: ResultId,
    planJson: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Set plan validity to 30 days from now
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      
      const result = await onboardingService.savePlan(
        userId, 
        resultId, 
        planJson, 
        validUntil.toISOString()
      );

      if (result.success) {
        trackPlanSaved(resultId);
      }

      return result;
    } catch (error) {
      console.error('Error in savePlan:', error);
      return { success: false, error: 'Failed to save plan' };
    }
  },

  // Save profile data
  async saveProfile(
    userId: string,
    profileDraft: ProfileDraft
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await onboardingService.upsertProfile(userId, profileDraft);
      
      if (result.success) {
        trackProfileComplete(profileDraft);
      }

      return result;
    } catch (error) {
      console.error('Error in saveProfile:', error);
      return { success: false, error: 'Failed to save profile' };
    }
  },

  // Save everything at once (quiz + profile + plan)
  async saveCompleteOnboarding(
    userId: string,
    answers: Record<string, QuizAnswer>,
    scoreMap: Record<string, number>,
    topAxes: string[],
    resultId: ResultId,
    planJson: Record<string, unknown>,
    profileDraft: ProfileDraft
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Save quiz data
      const quizResult = await this.saveQuizData(userId, answers, scoreMap, topAxes);
      if (!quizResult.success) {
        return quizResult;
      }

      // Save profile
      const profileResult = await this.saveProfile(userId, profileDraft);
      if (!profileResult.success) {
        return profileResult;
      }

      // Save plan
      const planResult = await this.savePlan(userId, resultId, planJson);
      if (!planResult.success) {
        return planResult;
      }

      return { success: true };
    } catch (error) {
      console.error('Error in saveCompleteOnboarding:', error);
      return { success: false, error: 'Failed to save complete onboarding data' };
    }
  },

  // Get user's current plan
  async getCurrentPlan(userId: string) {
    try {
      return await onboardingService.getCurrentPlan(userId);
    } catch (error) {
      console.error('Error in getCurrentPlan:', error);
      return { data: null, error: 'Failed to get current plan' };
    }
  }
};
