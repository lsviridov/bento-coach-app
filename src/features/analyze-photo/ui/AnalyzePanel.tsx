import { useEffect, useState } from 'react';
import { analyzePhoto } from '../model/useAnalyze';
import { AnalyzeResponseT } from '../model/schemas';

interface AnalyzePanelProps {
  imageFile: File;
  onComplete: (result: AnalyzeResponseT) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function AnalyzePanel({ 
  imageFile, 
  onComplete, 
  onError, 
  isLoading, 
  setIsLoading 
}: AnalyzePanelProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const analyzeImage = async () => {
      if (!imageFile) return;

      setIsLoading(true);
      setProgress(0);

      try {
        // Симуляция прогресса
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Конвертируем файл в data URL для анализа
        const dataUrl = await fileToDataUrl(imageFile);
        
        // Анализируем фото
        const result = await analyzePhoto(dataUrl);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        // Небольшая задержка для показа 100%
        setTimeout(() => {
          onComplete(result);
        }, 300);

      } catch (error) {
        console.error('Analysis failed:', error);
        onError('Не удалось проанализировать фото. Попробуйте ещё раз или введите данные вручную.');
      } finally {
        setIsLoading(false);
      }
    };

    analyzeImage();
  }, [imageFile, onComplete, onError, setIsLoading]);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl p-6 border shadow-neon dark:shadow-neon-dark">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-brand-50 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-brand rounded-full"
              style={{
                clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-brand">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              Анализируем фото...
            </h3>
            <p className="text-muted text-sm">
              Определяем продукты и рассчитываем калории
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
