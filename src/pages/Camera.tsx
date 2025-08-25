import { useState } from 'react';
import { AppHeader } from '@/widgets/header';
import { CameraUploader, CameraPreview } from '@/features/camera-uploader';
import { AnalyzePanel } from '@/features/analyze-photo';
import { MealEditor, SaveBar } from '@/features/add-meal';
import { useOfflineFlag } from '@/shared/hooks/useOfflineFlag';
import { AnalyzeResponseT } from '@/features/analyze-photo';
import { CreateMealT } from '@/entities/meal';
import { createMeal } from '@/entities/meal';
import { offlineQueue } from '@/shared/lib/idbQueue';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared';

export default function Camera() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponseT | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [mealData, setMealData] = useState<CreateMealT | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { isOffline } = useOfflineFlag();
  const navigate = useNavigate();

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file);
    setImagePreview(preview);
    setAnalysisResult(null);
    setAnalysisError(null);
    setMealData(null);
  };

  const handleCameraCapture = async (blob: Blob) => {
    // Конвертируем blob в File
    const file = new File([blob], 'camera-photo.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now()
    });
    
    // Создаём preview URL
    const preview = URL.createObjectURL(blob);
    handleImageSelect(file, preview);
  };

  const handleAnalysisComplete = (result: AnalyzeResponseT) => {
    setAnalysisResult(result);
    setAnalysisError(null);
    
    // Инициализируем данные приёма пищи
    setMealData({
      title: result.labels.join(', ') || 'Приём пищи',
      grams: result.defaultGrams,
      calories: result.calories,
      protein_g: result.protein_g,
      fat_g: result.fat_g,
      carbs_g: result.carbs_g,
      takenAt: new Date().toISOString(),
      photoUrl: imagePreview || undefined
    });
  };

  const handleAnalysisError = (error: string) => {
    setAnalysisError(error);
    setAnalysisResult(null);
    
    // Показываем форму для ручного ввода
    setMealData({
      title: '',
      grams: 250,
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
      takenAt: new Date().toISOString(),
      photoUrl: imagePreview || undefined
    });
  };

  const handleMealDataChange = (data: CreateMealT) => {
    setMealData(data);
  };

  const handleSave = async () => {
    if (!mealData) return;
    
    setIsSaving(true);
    try {
      if (isOffline) {
        // Сохраняем в офлайн-очередь
        await offlineQueue.saveDraft('meal', {
          ...mealData,
          imageBlob: selectedImage
        });
        console.log('Meal draft saved offline');
        navigate('/diary');
      } else {
        // Сохраняем через API
        const savedMeal = await createMeal(mealData);
        console.log('Meal saved:', savedMeal);
        navigate('/diary');
      }
    } catch (error) {
      console.error('Failed to save meal:', error);
      alert('Ошибка при сохранении. Попробуйте ещё раз.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetake = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setMealData(null);
  };

  return (
    <PageLayout>
      <AppHeader title="Анализ фото" />
      {/* Область камеры - всегда видна как "окошко" */}
      {!selectedImage && (
        <CameraPreview 
          onCapture={handleCameraCapture}
          isActive={true}
        />
      )}

      {/* Альтернативные способы загрузки фото */}
      {!selectedImage && (
        <div className="bg-surface rounded-xl p-4 border shadow-neon dark:shadow-neon-dark">
          <h3 className="text-sm font-medium text-ink mb-3">Или выберите фото другим способом</h3>
          <CameraUploader onImageSelect={handleImageSelect} />
        </div>
      )}

      {/* Превью фото */}
      {selectedImage && imagePreview && (
        <div className="bg-surface rounded-xl p-4 border shadow-neon dark:shadow-neon-dark">
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Предварительный просмотр" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 space-x-2">
              <button
                onClick={handleRetake}
                className="px-3 py-1 bg-surface/80 backdrop-blur-sm text-ink rounded-full text-sm border"
              >
                Переснять
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Панель анализа */}
      {selectedImage && !analysisResult && !analysisError && (
        <AnalyzePanel
          imageFile={selectedImage}
          onComplete={handleAnalysisComplete}
          onError={handleAnalysisError}
          isLoading={isAnalyzing}
          setIsLoading={setIsAnalyzing}
        />
      )}

      {/* Результат анализа */}
      {analysisResult && (
        <div className="bg-surface rounded-xl p-4 border shadow-neon dark:shadow-neon-dark">
          <h3 className="text-lg font-semibold text-ink mb-3">Результат анализа</h3>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {analysisResult.labels.map((label, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-brand-50 text-brand rounded-full text-sm"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="text-sm text-muted">
              Уверенность: {Math.round(analysisResult.confidence.reduce((a, b) => a + b, 0) / analysisResult.confidence.length * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Ошибка анализа */}
      {analysisError && (
        <div className="bg-surface rounded-xl p-4 border border-warning/20 shadow-neon dark:shadow-neon-dark">
          <div className="flex items-center gap-2 text-warning mb-2">
            <span className="text-lg">⚠️</span>
            <span className="font-medium">Не удалось распознать</span>
          </div>
          <p className="text-muted text-sm mb-3">
            {analysisError}
          </p>
          <p className="text-ink text-sm">
            Введите данные о приёме пищи вручную
          </p>
        </div>
      )}

      {/* Редактор приёма пищи */}
      {mealData && (
        <MealEditor
          data={mealData}
          onChange={handleMealDataChange}
          isOffline={isOffline}
        />
      )}

      {/* Панель сохранения */}
      {mealData && (
        <SaveBar
          onSave={handleSave}
          isSaving={isSaving}
          isOffline={isOffline}
        />
      )}

      {/* Альтернативные действия */}
      <div className="text-center space-y-3">
        <button className="text-brand hover:text-brand/80 text-sm">
          Добавить вручную
        </button>
        <div className="text-muted text-xs">
          или
        </div>
        <button className="text-muted hover:text-ink text-sm">
          Ввести без фото
        </button>
      </div>
    </PageLayout>
  );
}
