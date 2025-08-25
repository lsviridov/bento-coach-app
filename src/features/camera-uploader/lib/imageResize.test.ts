import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resizeImage, calculateDimensions } from './imageResize';

// Мокаем canvas API
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => ({
    drawImage: vi.fn(),
  })),
  toBlob: vi.fn((callback) => callback(new Blob(['fake-image']))),
  toDataURL: vi.fn(() => 'data:image/jpeg;base64,fake-data'),
};

const mockImage = {
  width: 2000,
  height: 1500,
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
  src: '',
};

// Мокаем глобальные объекты
global.HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCanvas.getContext());
global.HTMLCanvasElement.prototype.toBlob = vi.fn(mockCanvas.toBlob);
global.HTMLCanvasElement.prototype.toDataURL = vi.fn(mockCanvas.toDataURL);

global.Image = vi.fn(() => mockImage);
global.URL.createObjectURL = vi.fn(() => 'blob:fake-url');
global.URL.revokeObjectURL = vi.fn();

describe('imageResize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateDimensions', () => {
    it('should return original dimensions if width is within limit', () => {
      const result = calculateDimensions(800, 600, 1600);
      expect(result).toEqual({ width: 800, height: 600 });
    });

    it('should scale down dimensions proportionally if width exceeds limit', () => {
      const result = calculateDimensions(2000, 1500, 1600);
      expect(result.width).toBe(1600);
      expect(result.height).toBe(1200);
    });

    it('should handle edge case with exact width match', () => {
      const result = calculateDimensions(1600, 1200, 1600);
      expect(result).toEqual({ width: 1600, height: 1200 });
    });
  });

  describe('resizeImage', () => {
    it('should resize image and return blob and dataUrl', async () => {
      const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
      
      // Симулируем успешную загрузку изображения
      setTimeout(() => {
        if (mockImage.onload) mockImage.onload();
      }, 0);

      const result = await resizeImage(mockFile, 1600);

      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.dataUrl).toBe('data:image/jpeg;base64,fake-data');
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(mockCanvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.86);
    });

    it('should handle canvas context error', async () => {
      const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
      
      // Мокаем ошибку получения контекста
      global.HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

      await expect(resizeImage(mockFile, 1600)).rejects.toThrow('Canvas context not available');
    });

    it('should handle image load error', async () => {
      const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
      
      // Симулируем ошибку загрузки изображения
      setTimeout(() => {
        if (mockImage.onerror) mockImage.onerror();
      }, 0);

      await expect(resizeImage(mockFile, 1600)).rejects.toThrow('Failed to load image');
    });

    it('should handle blob creation error', async () => {
      const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
      
      // Мокаем ошибку создания blob
      global.HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => callback(null));

      setTimeout(() => {
        if (mockImage.onload) mockImage.onload();
      }, 0);

      await expect(resizeImage(mockFile, 1600)).rejects.toThrow('Failed to create blob');
    });
  });
});
