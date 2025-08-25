import React, { useState, useEffect } from 'react';
import { useOnboardingSleepStore } from './store/useOnboardingSleepStore';
import { questions } from './data/questions';
import { plans } from './data/plans';
import { QuizStart } from './components/QuizStart';
import { QuizQuestion } from './components/QuizQuestion';
import { ProfileMiniForm } from './components/ProfileMiniForm';
import { ResultScreen } from './components/ResultScreen';
import { BundleShelf } from './components/BundleShelf';
import { persistenceService } from './services/persistence';
import { calculateScores, determineResult } from './data/scoring';
import { config } from './config';

export const OnboardingSleepQuiz: React.FC = () => {
  const {
    answers,
    currentIndex,
    scoreMap,
    resultId,
    profileDraft,
    startQuiz,
    answerQuestion,
    goToNext,
    goToPrevious,
    goToQuestion,
    completeQuiz,
    updateProfileDraft,
    resetQuiz
  } = useOnboardingSleepStore();

  const [showBundleShelf, setShowBundleShelf] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use mock user ID if Supabase is not configured
  const userId = config.supabase.isConfigured ? 'user-123' : config.dev.mockUserId;

  useEffect(() => {
    // Initialize quiz on mount
    startQuiz();
    
    // Log configuration status in development
    if (config.dev.debug) {
      console.log('Onboarding Sleep Quiz Config:', {
        supabase: config.supabase.isConfigured ? 'Configured' : 'Not configured - using mock mode',
        features: config.features,
        userId
      });
    }
  }, [startQuiz, userId]);

  const handleAnswer = (questionId: string, optionId: string, extraToggle?: boolean) => {
    answerQuestion(questionId, optionId, extraToggle);
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      // Last question - complete quiz
      completeQuiz();
    } else {
      goToNext();
    }
  };

  const handleProfileComplete = (profile: any) => {
    updateProfileDraft(profile);
    // Move to result screen
    // In a real app, you might save the profile here
  };

  const handleSavePlan = async () => {
    if (!resultId || !profileDraft) return;

    setIsLoading(true);
    try {
      // Ensure scoreMap has all required axes with default values
      const fullScoreMap: Record<string, number> = {
        D: scoreMap.D || 0,
        A: scoreMap.A || 0,
        P: scoreMap.P || 0,
        T: scoreMap.T || 0,
        O: scoreMap.O || 0
      };
      
      const topAxes = determineResult(fullScoreMap).axisOrder.slice(0, 2);
      const planJson = plans[resultId];
      
      if (config.features.persistence) {
        await persistenceService.saveCompleteOnboarding(
          userId,
          answers,
          fullScoreMap,
          topAxes,
          resultId,
          planJson,
          profileDraft
        );
      } else {
        console.log('Persistence disabled, plan would be saved:', { resultId, planJson });
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBundles = () => {
    setShowBundleShelf(true);
  };

  const handleCloseBundleShelf = () => {
    setShowBundleShelf(false);
  };

  // Determine current screen
  if (currentIndex === 0 && Object.keys(answers).length === 0) {
    return <QuizStart onStart={() => goToNext()} />;
  }

  if (currentIndex < questions.length) {
    const question = questions[currentIndex];
    const answer = answers[question.id];
    
    return (
      <QuizQuestion
        question={question}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        selectedOption={answer?.optionId}
        extraToggle={answer?.extraToggle}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={goToPrevious}
      />
    );
  }

  if (currentIndex === questions.length && !resultId) {
    return <ProfileMiniForm onComplete={handleProfileComplete} />;
  }

  if (resultId && plans[resultId]) {
    return (
      <>
        <ResultScreen
          plan={plans[resultId]}
          onSavePlan={handleSavePlan}
          onViewBundles={handleViewBundles}
        />
        {showBundleShelf && (
          <BundleShelf
            bundleTags={plans[resultId].bundleTags}
            onClose={handleCloseBundleShelf}
          />
        )}
      </>
    );
  }

  // Fallback - restart quiz
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <button
          onClick={resetQuiz}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
};
