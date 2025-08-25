import { useState, useEffect } from 'react';
import { AppHeader, DailySummary } from '@/widgets';
import { CoachTip } from '@/widgets/coach-tip';
import { WeekStrip } from '@/widgets/week-strip';
import { TrendsMini } from '@/widgets/trends-mini';
import { NextProtocol } from '@/widgets/next-protocol';
import { ShopRecos } from '@/widgets/shop-recos';
import { PhotoActions } from '@/features';
import { InstallPrompt, PageLayout } from '@/shared';
import { ActionFab } from '@/widgets/coach-entry';
import { fetchDailySummary } from '@/shared/api/mock-api';
import type { DailySummaryData } from '@/shared/api/mock-api';

const Index = () => {
  const [dailyData, setDailyData] = useState<DailySummaryData>();

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
          
          {/* Enhanced Home Widgets */}
          <section className="space-y-6">
            <CoachTip />
            <WeekStrip />
            <TrendsMini />
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