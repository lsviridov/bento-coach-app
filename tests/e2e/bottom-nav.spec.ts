import { test, expect } from '@playwright/test';

test.describe('Bottom Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('отображает только подпись активной вкладки', async ({ page }) => {
    // Проверяем, что на главной странице активна вкладка "Главная"
    const homeTab = page.getByRole('tab', { name: /главная/i });
    await expect(homeTab).toBeVisible();
    
    // Проверяем, что у других вкладок нет подписей
    const cameraTab = page.getByRole('tab', { name: /камера/i });
    const diaryTab = page.getByRole('tab', { name: /дневник/i });
    
    // Подписи должны быть скрыты у неактивных вкладок
    await expect(cameraTab.getByText('Камера')).not.toBeVisible();
    await expect(diaryTab.getByText('Дневник')).not.toBeVisible();
  });

  test('активная пилюля плавно перемещается между вкладками', async ({ page }) => {
    // Проверяем наличие layoutId для активной пилюли
    const activePill = page.locator('[layoutId="bottom-nav-active-pill"]');
    await expect(activePill).toBeVisible();
    
    // Переходим на страницу камеры
    await page.getByRole('tab', { name: /камера/i }).click();
    await page.waitForURL('/camera');
    
    // Проверяем, что пилюля переместилась и активна вкладка "Камера"
    await expect(page.getByRole('tab', { name: /камера/i })).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('tab', { name: /главная/i })).not.toHaveAttribute('aria-current', 'page');
    
    // Переходим на страницу дневника
    await page.getByRole('tab', { name: /дневник/i }).click();
    await page.waitForURL('/diary');
    
    // Проверяем, что пилюля снова переместилась
    await expect(page.getByRole('tab', { name: /дневник/i })).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('tab', { name: /камера/i })).not.toHaveAttribute('aria-current', 'page');
  });

  test('подпись появляется только у активной вкладки', async ({ page }) => {
    // На главной странице активна вкладка "Главная"
    await expect(page.getByRole('tab', { name: /главная/i }).getByText('Главная')).toBeVisible();
    
    // Переходим на камеру
    await page.getByRole('tab', { name: /камера/i }).click();
    await page.waitForURL('/camera');
    
    // Теперь активна вкладка "Камера" с подписью
    await expect(page.getByRole('tab', { name: /камера/i }).getByText('Камера')).toBeVisible();
    await expect(page.getByRole('tab', { name: /главная/i }).getByText('Главная')).not.toBeVisible();
    
    // Переходим на дневник
    await page.getByRole('tab', { name: /дневник/i }).click();
    await page.waitForURL('/diary');
    
    // Теперь активна вкладка "Дневник" с подписью
    await expect(page.getByRole('tab', { name: /дневник/i }).getByText('Дневник')).toBeVisible();
    await expect(page.getByRole('tab', { name: /камера/i }).getByText('Камера')).not.toBeVisible();
  });

  test('навигация стрелками работает корректно', async ({ page }) => {
    // Фокусируемся на вкладке "Главная"
    const homeTab = page.getByRole('tab', { name: /главная/i });
    await homeTab.focus();
    
    // Нажимаем стрелку вправо - должна перейти на "Камера"
    await homeTab.press('ArrowRight');
    await page.waitForURL('/camera');
    await expect(page.getByRole('tab', { name: /камера/i })).toHaveAttribute('aria-current', 'page');
    
    // Нажимаем стрелку влево - должна вернуться на "Главная"
    const cameraTab = page.getByRole('tab', { name: /камера/i });
    await cameraTab.press('ArrowLeft');
    await page.waitForURL('/');
    await expect(page.getByRole('tab', { name: /главная/i })).toHaveAttribute('aria-current', 'page');
  });

  test('иконка масштабируется у активной вкладки', async ({ page }) => {
    // Проверяем, что у активной вкладки "Главная" иконка масштабирована
    const homeIcon = page.getByRole('tab', { name: /главная/i }).locator('svg');
    await expect(homeIcon).toHaveClass(/scale-110/);
    
    // Переходим на камеру
    await page.getByRole('tab', { name: /камера/i }).click();
    await page.waitForURL('/camera');
    
    // Теперь иконка камеры должна быть масштабирована
    const cameraIcon = page.getByRole('tab', { name: /камера/i }).locator('svg');
    await expect(cameraIcon).toHaveClass(/scale-110/);
    
    // А иконка главной должна вернуться к нормальному размеру
    await expect(homeIcon).toHaveClass(/scale-100/);
  });
});
