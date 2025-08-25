import { test, expect } from '@playwright/test';

test.describe('Camera Page', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на страницу камеры
    await page.goto('/camera');
  });

  test('should display camera uploader', async ({ page }) => {
    // Проверяем заголовок
    await expect(page.getByRole('heading', { name: 'Анализ фото' })).toBeVisible();
    
    // Проверяем кнопку камеры
    await expect(page.getByRole('button', { name: 'Снять фото' })).toBeVisible();
    
    // Проверяем подпись
    await expect(page.getByText('HEIC, JPG, PNG до 5 МБ')).toBeVisible();
  });

  test('should handle image upload and analysis', async ({ page }) => {
    // Создаём тестовое изображение
    const testImage = Buffer.from('fake-image-data');
    
    // Мокаем File API
    await page.addInitScript(() => {
      // Создаём mock File объект
      const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
      
      // Мокаем input file
      Object.defineProperty(HTMLInputElement.prototype, 'files', {
        get: () => [mockFile]
      });
    });

    // Кликаем по кнопке камеры
    await page.getByRole('button', { name: 'Снять фото' }).click();
    
    // Ждём появления панели анализа
    await expect(page.getByText('Анализируем фото...')).toBeVisible();
    
    // Ждём завершения анализа
    await expect(page.getByText('Результат анализа')).toBeVisible();
    
    // Проверяем наличие лейблов
    await expect(page.getByText(/овсянка|куриная грудка|творожная запеканка/)).toBeVisible();
  });

  test('should allow editing meal data', async ({ page }) => {
    // Сначала загружаем фото (используем предыдущий тест)
    const testImage = Buffer.from('fake-image-data');
    
    await page.addInitScript(() => {
      const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(HTMLInputElement.prototype, 'files', {
        get: () => [mockFile]
      });
    });

    await page.getByRole('button', { name: 'Снять фото' }).click();
    
    // Ждём завершения анализа
    await expect(page.getByText('Результат анализа')).toBeVisible();
    
    // Проверяем наличие редактора
    await expect(page.getByText('Редактировать приём пищи')).toBeVisible();
    
    // Проверяем слайдер граммов
    const gramsSlider = page.locator('input[type="range"]');
    await expect(gramsSlider).toBeVisible();
    
    // Изменяем граммы
    await gramsSlider.fill('300');
    
    // Проверяем, что значение изменилось
    await expect(page.getByText('Граммы: 300г')).toBeVisible();
  });

  test('should save meal and redirect to diary', async ({ page }) => {
    // Загружаем фото и анализируем
    await page.addInitScript(() => {
      const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(HTMLInputElement.prototype, 'files', {
        get: () => [mockFile]
      });
    });

    await page.getByRole('button', { name: 'Снять фото' }).click();
    
    // Ждём завершения анализа
    await expect(page.getByText('Результат анализа')).toBeVisible();
    
    // Проверяем наличие кнопки сохранения
    await expect(page.getByRole('button', { name: 'Сохранить приём' })).toBeVisible();
    
    // Сохраняем приём
    await page.getByRole('button', { name: 'Сохранить приём' }).click();
    
    // Проверяем редирект на дневник
    await expect(page).toHaveURL('/diary');
  });

  test('should handle manual input when analysis fails', async ({ page }) => {
    // Мокаем ошибку анализа
    await page.addInitScript(() => {
      // Переопределяем fetch для /api/analyze
      const originalFetch = window.fetch;
      window.fetch = async (url: RequestInfo | URL, init?: RequestInit) => {
        if (typeof url === 'string' && url.includes('/api/analyze')) {
          return new Response(JSON.stringify({ error: 'Analysis failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return originalFetch(url, init);
      };
    });

    // Загружаем фото
    await page.addInitScript(() => {
      const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(HTMLInputElement.prototype, 'files', {
        get: () => [mockFile]
      });
    });

    await page.getByRole('button', { name: 'Снять фото' }).click();
    
    // Ждём ошибки анализа
    await expect(page.getByText('Не удалось распознать')).toBeVisible();
    
    // Проверяем наличие формы для ручного ввода
    await expect(page.getByText('Введите данные о приёме пищи вручную')).toBeVisible();
  });

  test('should show offline indicator when offline', async ({ page }) => {
    // Мокаем офлайн состояние
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'onLine', {
        get: () => false,
        configurable: true
      });
      
      // Эмулируем событие offline
      window.dispatchEvent(new Event('offline'));
    });

    // Перезагружаем страницу для применения офлайн состояния
    await page.reload();
    
    // Проверяем наличие офлайн индикатора
    await expect(page.getByText('Офлайн режим')).toBeVisible();
  });
});
