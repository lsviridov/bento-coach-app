import { useState, useEffect, lazy, Suspense } from 'react';
import { AppHeader, DailySummary } from '@/widgets';
import { CoachTip } from '@/widgets/coach-tip';
import { WeekStrip } from '@/widgets/week-strip';
import { TrendsWeek } from '@/widgets/trends-week-v2';
import { NextProtocol } from '@/widgets/next-protocol';
import { ShopRecos } from '@/widgets/shop-recos';
import { PhotoActions } from '@/features';
import { InstallPrompt, PageLayout } from '@/shared';
import { ActionFab } from '@/widgets/coach-entry';
import { fetchDailySummary } from '@/shared/api/mock-api';
import type { DailySummaryData } from '@/shared/api/mock-api';

// Lazy load the onboarding quiz component
const OnboardingSleepQuiz = lazy(() => import('@/features/onboarding-sleep').then(module => ({ default: module.OnboardingSleepQuiz })));

const Index = () => {
  const [dailyData, setDailyData] = useState<DailySummaryData>();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Load daily summary data
    fetchDailySummary().then(setDailyData);
  }, []);

  const handlePhotoAnalyze = () => {
    console.log('Opening camera for photo analysis');
    // TODO: Navigate to camera screen
  };

  const handleManualAdd = () => {
    console.log('Opening manual entry form');
    // TODO: Navigate to manual entry screen
  };

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  // Show onboarding quiz if requested
  if (showOnboarding) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Загрузка квиза...</div>}>
        <OnboardingSleepQuiz />
      </Suspense>
    );
  }

  return (
    <PageLayout>
      <AppHeader title="ADAPTO" />
      
      <main className="pt-4">
        <div className="container max-w-md mx-auto px-4 space-y-6">
          {/* Bento Grid Layout */}
          
          {/* Daily Summary - 3 columns */}
          <DailySummary data={dailyData} />
          
          {/* Photo Actions */}
          <PhotoActions 
            onPhotoAnalyze={handlePhotoAnalyze}
            onManualAdd={handleManualAdd}
          />
          
          {/* Onboarding Quiz Button */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Новичок в ADAPTO?</h3>
            <p className="text-gray-600 mb-4">Пройдите наш быстрый квиз о сне и питании для получения персональных рекомендаций</p>
            <button onClick={handleStartOnboarding} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300">
              Начать квиз о сне
            </button>
          </div>
          
          {/* Enhanced Home Widgets */}
          <section className="space-y-6">
            <CoachTip />
            <WeekStrip />
            <TrendsWeek />
            <NextProtocol />
            <ShopRecos />
          </section>
        </div>
      </main>
      
      <InstallPrompt />
      
      <ActionFab onAddMeal={() => console.log('Navigate to add meal')} />
    </PageLayout>
  );
};

export default Index;