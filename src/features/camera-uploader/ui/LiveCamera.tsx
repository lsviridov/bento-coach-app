import { useEffect, useRef, useState, useCallback } from 'react';

interface LiveCameraProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export function LiveCamera({ onCapture, onClose }: LiveCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Запускаем камеру при монтировании
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

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

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

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
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  }, [isStreaming, onCapture]);

  const switchCamera = async () => {
    stopCamera();
    await startCamera();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-surface rounded-xl p-6 max-w-sm mx-4 text-center">
          <div className="text-danger mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink mb-2">Ошибка камеры</h3>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full bg-brand text-white rounded-lg py-3 px-6 font-medium hover:bg-brand/90 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Видео поток */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="flex-1 w-full object-cover"
      />

      {/* Скрытый canvas для захвата фото */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Панель управления */}
      <div className="bg-black/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="w-12 h-12 bg-surface/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-surface/30 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Кнопка съёмки */}
          <button
            onClick={capturePhoto}
            disabled={!isStreaming}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-full border-4 border-gray-300"></div>
          </button>

          {/* Кнопка переключения камеры */}
          <button
            onClick={switchCamera}
            className="w-12 h-12 bg-surface/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-surface/30 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Инструкции */}
      <div className="absolute top-4 left-4 right-4 text-center">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
          <p className="text-white text-sm">
            Наведите камеру на еду и нажмите кнопку съёмки
          </p>
        </div>
      </div>
    </div>
  );
}
