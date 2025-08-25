import { useState, useRef, useCallback } from 'react';
import { resizeImage } from '../lib/imageResize';

interface CameraUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
}

export function CameraUploader({ onImageSelect }: CameraUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    setIsProcessing(true);
    try {
      // Сжимаем изображение
      const { blob, dataUrl } = await resizeImage(file);
      
      // Создаём новый файл из сжатого blob
      const compressedFile = new File([blob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      onImageSelect(compressedFile, dataUrl);
    } catch (error) {
      console.error('Failed to process image:', error);
      alert('Ошибка при обработке изображения. Попробуйте ещё раз.');
    } finally {
      setIsProcessing(false);
    }
  }, [onImageSelect]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleGalleryClick = () => {
    // Открываем галерею для выбора существующих фото
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Кнопки для загрузки фото */}
      <div className="space-y-3">
        {/* Кнопка галереи */}
        <button
          onClick={handleGalleryClick}
          disabled={isProcessing}
          className="w-full bg-surface border border-muted/30 text-ink rounded-lg py-3 px-6 font-medium hover:bg-muted/10 active:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Выбрать из галереи
          </div>
        </button>
      </div>

      {/* Скрытый input для файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Подпись */}
      <p className="text-center text-muted text-sm">
        HEIC, JPG, PNG до 5 МБ
      </p>

      {/* Drag & Drop зона (только на desktop) */}
      <div
        className={`hidden md:block border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-150 ${
          isDragOver 
            ? 'border-brand bg-brand-50/50' 
            : 'border-muted/30 hover:border-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg className="w-12 h-12 mx-auto mb-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-ink font-medium mb-2">
          Перетащите изображение сюда
        </p>
        <p className="text-muted text-sm">
          или используйте кнопку выше
        </p>
      </div>
    </div>
  );
}
