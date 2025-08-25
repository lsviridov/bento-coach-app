import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { QuizState, QuizAnswer, ProfileDraft, ResultId } from '../data/types';
import { calculateScores, determineResult } from '../data/scoring';

interface OnboardingSleepStore extends QuizState {
  // Actions
  startQuiz: () => void;
  answerQuestion: (questionId: string, optionId: string, extraToggle?: boolean) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToQuestion: (index: number) => void;
  completeQuiz: () => void;
  updateProfileDraft: (updates: Partial<ProfileDraft>) => void;
  resetQuiz: () => void;
  
  // Computed
  isComplete: boolean;
  currentQuestion: any;
  progress: number;
}

const initialState: QuizState = {
  answers: {},
  currentIndex: 0,
  scoreMap: {},
  resultId: null,
  profileDraft: null
};

export const useOnboardingSleepStore = create<OnboardingSleepStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      startQuiz: () => {
        set({ 
          answers: {}, 
          currentIndex: 0, 
          scoreMap: {}, 
          resultId: null, 
          profileDraft: null 
        });
      },
      
      answerQuestion: (questionId: string, optionId: string, extraToggle?: boolean) => {
        const { answers } = get();
        const newAnswers = {
          ...answers,
          [questionId]: { questionId, optionId, extraToggle }
        };
        
        set({ answers: newAnswers });
      },
      
      goToNext: () => {
        const { currentIndex } = get();
        if (currentIndex < 4) { // 5 questions, 0-4
          set({ currentIndex: currentIndex + 1 });
        }
      },
      
      goToPrevious: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
          set({ currentIndex: currentIndex - 1 });
        }
      },
      
      goToQuestion: (index: number) => {
        if (index >= 0 && index <= 4) {
          set({ currentIndex: index });
        }
      },
      
      completeQuiz: () => {
        const { answers } = get();
        const scoreMap = calculateScores(answers);
        const result = determineResult(scoreMap);
        
        set({ 
          scoreMap, 
          resultId: result.resultId,
          currentIndex: 5 // Move to profile form
        });
      },
      
      updateProfileDraft: (updates: Partial<ProfileDraft>) => {
        const { profileDraft } = get();
        set({ 
          profileDraft: { ...profileDraft, ...updates } as ProfileDraft 
        });
      },
      
      resetQuiz: () => {
        set(initialState);
      },
      
      // Computed properties
      get isComplete() {
        return get().resultId !== null;
      },
      
      get currentQuestion() {
        const { currentIndex } = get();
        const questions = require('../data/questions').questions;
        return questions[currentIndex];
      },
      
      get progress() {
        const { currentIndex } = get();
        return ((currentIndex + 1) / 5) * 100;
      }
    }),
    {
      name: 'onboarding-sleep-store'
    }
  )
);
