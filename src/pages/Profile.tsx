import { useEffect } from 'react';
import { AppHeader } from '@/widgets/header';
import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileForm } from '@/features/profile-form';
import { ThemeToggle } from '@/features/theme-toggle';
import { PushToggle } from '@/features/push-subscribe';
import { DataPrivacyCard } from '@/features/data-privacy';
import { SectionCard } from '@/shared/ui/section-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOfflineFlag } from '@/shared/hooks/useOfflineFlag';
import { useMockProfile } from '@/shared/hooks/useMockProfile';
import { FileText, Shield, RefreshCw } from 'lucide-react';
import { PageLayout } from '@/shared';

export function Profile() {
  const { profile, isLoading, error, refetch, updateProfile, isUpdating } = useMockProfile();
  const { isOffline } = useOfflineFlag();

  // Analytics event
  useEffect(() => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as Record<string, unknown>).gtag;
      if (typeof gtag === 'function') {
        gtag('event', 'profile_opened');
      }
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <AppHeader title="Профиль" variant="profile" />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
              <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
            </div>
            <Skeleton className="h-8 sm:h-9 w-20 sm:w-24" />
          </div>

          {/* Form Skeleton */}
          {[1, 2, 3].map((i) => (
            <SectionCard key={i} variant="elevated" size="lg">
              <div className="space-y-4">
                <Skeleton className="h-5 sm:h-6 w-24 sm:w-32" />
                <div className="space-y-3">
                  <Skeleton className="h-3 sm:h-4 w-full" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                      <Skeleton className="h-8 sm:h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <AppHeader title="Профиль" variant="profile" />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <Alert variant="destructive">
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <span>Не удалось загрузить профиль</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="sm:ml-auto w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Повторить
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <AppHeader title="Профиль" variant="profile" />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <Alert>
            <AlertDescription>
              Профиль не найден. Попробуйте обновить страницу.
            </AlertDescription>
          </Alert>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <AppHeader title="Профиль" variant="profile" />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-hidden">
        {/* Offline Notice */}
        {isOffline && (
          <Alert className="bg-warning/10 border-warning/20 text-warning">
            <AlertDescription>
              Вы находитесь в офлайн-режиме. Некоторые функции могут быть недоступны.
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <ProfileHeader
          email={profile.email}
          fullName={profile.full_name}
        />

        {/* Profile Form */}
        <ProfileForm
          profile={profile}
          onUpdate={updateProfile}
          isUpdating={isUpdating}
        />

        {/* Theme Toggle */}
        <ThemeToggle
          initialTheme={profile.theme}
          profileId={profile.id}
        />

        {/* Push Notifications */}
        <PushToggle
          initialEnabled={profile.push_enabled}
          profileId={profile.id}
        />

        {/* Data Privacy */}
        <DataPrivacyCard />

        {/* Legal Documents */}
        <SectionCard variant="elevated" size="lg">
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-display font-semibold text-ink">
              Юридические документы
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Ознакомьтесь с нашими политиками и условиями использования
            </p>
            
            <div className="space-y-2 sm:space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto p-3 sm:p-4 text-sm"
                onClick={() => window.open('/legal/privacy', '_blank')}
              >
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 w-full">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-muted mt-0.5 sm:mt-0 flex-shrink-0" />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="font-medium text-ink text-sm break-words">Политика конфиденциальности</p>
                    <p className="text-xs text-muted leading-relaxed break-words">
                      Как мы собираем, используем и защищаем ваши данные
                    </p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto p-3 sm:p-4 text-sm"
                onClick={() => window.open('/legal/terms', '_blank')}
              >
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 w-full">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted mt-0.5 sm:mt-0 flex-shrink-0" />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="font-medium text-ink text-sm break-words">Пользовательское соглашение</p>
                    <p className="text-xs text-muted leading-relaxed break-words">
                      Условия использования сервиса и ваши права
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageLayout>
  );
}
