export { OnboardingSleepQuiz } from './index.tsx';
export type { 
  Axis, 
  Weights, 
  Option, 
  Question, 
  ResultId, 
  Plan, 
  QuizAnswer, 
  QuizState, 
  ProfileDraft, 
  ScoringResult 
} from './data/types';
export { questions } from './data/questions';
export { plans } from './data/plans';
export { calculateScores, determineResult } from './data/scoring';
export { useOnboardingSleepStore } from './store/useOnboardingSleepStore';
export { onboardingService } from './services/supabaseClient';
export { persistenceService } from './services/persistence';
export { defaultAnalytics, trackOnboardingEvent } from './services/analytics';
export { config, isFeatureAvailable, getSupabaseStatus } from './config';
