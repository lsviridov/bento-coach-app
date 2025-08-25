interface ResizeResult {
  blob: Blob;
  dataUrl: string;
}

export async function resizeImage(
  file: File, 
  maxWidth: number = 1600
): Promise<ResizeResult> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        // Рассчитываем новые размеры с сохранением пропорций
        const { width, height } = calculateDimensions(img.width, img.height, maxWidth);
        
        canvas.width = width;
        canvas.height = height;
        
        // Рисуем изображение с новыми размерами
        ctx.drawImage(img, 0, 0, width, height);
        
        // Конвертируем в blob с JPEG качеством 0.86
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Создаём data URL для превью
              const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
              resolve({ blob, dataUrl });
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.86
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    
    // Создаём URL для изображения
    const url = URL.createObjectURL(file);
    img.src = url;
    
    // Очищаем URL после загрузки
    img.onload = () => {
      URL.revokeObjectURL(url);
    };
  });
}

export function calculateDimensions(
  originalWidth: number, 
  originalHeight: number, 
  maxWidth: number
): { width: number; height: number } {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const ratio = maxWidth / originalWidth;
  return {
    width: maxWidth,
    height: Math.round(originalHeight * ratio)
  };
}

// TODO: Добавить поддержку EXIF ориентации
// Для MVP используем базовую обработку
export function fixImageOrientation(file: File): Promise<File> {
  return new Promise((resolve) => {
    // Пока возвращаем файл как есть
    // В будущем добавим поворот по EXIF
    resolve(file);
  });
}
