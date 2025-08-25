import { useEffect, useRef, useState, useCallback } from 'react';

interface CameraPreviewProps {
  onCapture: (blob: Blob) => void;
  isActive?: boolean;
}

export function CameraPreview({ onCapture, isActive = true }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Запускаем камеру при монтировании и когда isActive = true
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [isActive]);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Задняя камера
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Failed to start camera:', err);
      setError('Не удалось запустить камеру. Проверьте разрешения.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming || isCapturing) return;

    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      // Устанавливаем размеры canvas равными размерам видео
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Рисуем текущий кадр на canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Конвертируем в blob
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
        }
        setIsCapturing(false);
      }, 'image/jpeg', 0.9);
    } catch (err) {
      console.error('Failed to capture photo:', err);
      setIsCapturing(false);
    }
  }, [isStreaming, onCapture, isCapturing]);

  const switchCamera = async () => {
    stopCamera();
    await startCamera();
  };

  if (error) {
    return (
      <div className="bg-surface rounded-xl p-6 border shadow-neon dark:shadow-neon-dark">
        <div className="text-center">
          <div className="text-danger mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink mb-2">Ошибка камеры</h3>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={startCamera}
            className="bg-brand text-white rounded-lg py-3 px-6 font-medium hover:bg-brand/90 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border shadow-neon dark:shadow-neon-dark overflow-hidden">
      {/* Заголовок области камеры */}
      <div className="bg-gradient-to-r from-brand-50 to-brand/10 px-4 py-4 border-b border-muted/20">
        <h3 className="text-base font-semibold text-brand mb-1">Живая камера</h3>
        <p className="text-sm text-muted">Наведите на еду и нажмите кнопку съёмки</p>
      </div>

      {/* Видео поток */}
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-80 object-cover"
        />
        
        {/* Скрытый canvas для захвата фото */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Индикатор активности */}
        {isStreaming && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-lg"></div>
            <span className="text-xs text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md font-medium shadow-lg">
              Камера активна
            </span>
          </div>
        )}

        {/* Кнопка переключения камеры */}
        {isStreaming && (
          <button
            onClick={switchCamera}
            className="absolute top-3 right-3 w-10 h-10 bg-surface/90 backdrop-blur-md rounded-full flex items-center justify-center text-ink hover:bg-surface hover:scale-110 active:scale-95 transition-all shadow-lg border border-muted/20"
            title="Переключить камеру"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Панель управления */}
      <div className="p-6 bg-gradient-to-t from-surface to-surface/95">
        <div className="flex items-center justify-center">
          {/* Кнопка съёмки */}
          <button
            onClick={capturePhoto}
            disabled={!isStreaming || isCapturing}
            className="w-20 h-20 bg-gradient-to-r from-brand to-brand/80 text-white rounded-full flex items-center justify-center hover:from-brand/90 hover:to-brand/70 active:from-brand/80 active:to-brand/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            title="Снять фото"
          >
            {isCapturing ? (
              <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <div className="w-12 h-12 bg-white rounded-full border-3 border-brand shadow-inner"></div>
            )}
          </button>
        </div>
        
        {/* Статус */}
        <div className="text-center mt-4">
          {!isStreaming && (
            <div className="flex items-center justify-center gap-2 text-muted">
              <div className="w-3 h-3 bg-muted rounded-full animate-pulse"></div>
              <p className="text-sm">Запуск камеры...</p>
            </div>
          )}
          {isStreaming && !isCapturing && (
            <div className="flex items-center justify-center gap-2 text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <p className="text-sm font-medium">Готов к съёмке</p>
            </div>
          )}
          {isCapturing && (
            <div className="flex items-center justify-center gap-2 text-brand">
              <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Обработка фото...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
