import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to profile page
    await page.goto('/profile');
  });

  test('should display profile page with all sections', async ({ page }) => {
    // Check if profile header is visible
    await expect(page.getByText('Профиль')).toBeVisible();
    
    // Check if profile form sections are visible
    await expect(page.getByText('Личные данные')).toBeVisible();
    await expect(page.getByText('Цели')).toBeVisible();
    await expect(page.getByText('Аллергии и ограничения')).toBeVisible();
    
    // Check if theme toggle is visible
    await expect(page.getByText('Тема оформления')).toBeVisible();
    
    // Check if push notifications section is visible
    await expect(page.getByText('Уведомления')).toBeVisible();
    
    // Check if data privacy section is visible
    await expect(page.getByText('Данные и приватность')).toBeVisible();
    
    // Check if legal documents section is visible
    await expect(page.getByText('Юридические документы')).toBeVisible();
  });

  test('should edit profile information successfully', async ({ page }) => {
    // Wait for profile to load
    await page.waitForSelector('input[name="full_name"]');
    
    // Edit name
    const nameInput = page.getByLabel('Имя');
    await nameInput.clear();
    await nameInput.fill('Новое Имя');
    
    // Edit height
    const heightInput = page.getByLabel('Рост (см)');
    await heightInput.clear();
    await heightInput.fill('180');
    
    // Edit weight
    const weightInput = page.getByLabel('Вес (кг)');
    await weightInput.clear();
    await weightInput.fill('75.0');
    
    // Save changes
    await page.getByRole('button', { name: 'Сохранить изменения' }).click();
    
    // Wait for success message
    await expect(page.getByText('Профиль успешно обновлен')).toBeVisible();
  });

  test('should toggle theme without flicker', async ({ page }) => {
    // Wait for theme toggle to load
    await page.waitForSelector('input[value="auto"]');
    
    // Change theme to dark
    await page.getByLabel('Тёмная').click();
    
    // Check if theme changed
    await expect(page.getByLabel('Тёмная')).toBeChecked();
    
    // Reload page to check persistence
    await page.reload();
    
    // Wait for page to load
    await page.waitForSelector('input[value="dark"]');
    
    // Check if theme is still dark
    await expect(page.getByLabel('Тёмная')).toBeChecked();
  });

  test('should enable push notifications', async ({ page }) => {
    // Wait for push toggle to load
    await page.waitForSelector('#push-toggle');
    
    // Enable push notifications
    await page.getByRole('switch', { name: 'Push-уведомления' }).click();
    
    // Check if push is enabled
    await expect(page.getByRole('switch', { name: 'Push-уведомления' })).toBeChecked();
    
    // Check success message
    await expect(page.getByText('Push-уведомления включены')).toBeVisible();
  });

  test('should disable push notifications', async ({ page }) => {
    // Wait for push toggle to load
    await page.waitForSelector('#push-toggle');
    
    // First enable push notifications
    await page.getByRole('switch', { name: 'Push-уведомления' }).click();
    await expect(page.getByText('Push-уведомления включены')).toBeVisible();
    
    // Then disable them
    await page.getByRole('switch', { name: 'Push-уведомления' }).click();
    
    // Check if push is disabled
    await expect(page.getByRole('switch', { name: 'Push-уведомления' })).not.toBeChecked();
    
    // Check success message
    await expect(page.getByText('Push-уведомления отключены')).toBeVisible();
  });

  test('should request data export', async ({ page }) => {
    // Wait for data privacy section to load
    await page.waitForSelector('text=Экспорт данных');
    
    // Click export button
    await page.getByRole('button', { name: 'Экспорт' }).click();
    
    // Wait for ticket creation
    await expect(page.getByText(/Тикет создан/)).toBeVisible();
    await expect(page.getByText(/TCK\d+/)).toBeVisible();
    await expect(page.getByText('Мы свяжемся с вами в ближайшее время для обработки запроса.')).toBeVisible();
  });

  test('should request data deletion', async ({ page }) => {
    // Wait for data privacy section to load
    await page.waitForSelector('text=Удаление данных');
    
    // Click delete button
    await page.getByRole('button', { name: 'Удалить' }).click();
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Wait for ticket creation
    await expect(page.getByText(/Тикет создан/)).toBeVisible();
    await expect(page.getByText(/TCK\d+/)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Wait for logout button to load
    await page.waitForSelector('text=Выйти');
    
    // Click logout button
    await page.getByRole('button', { name: 'Выйти' }).click();
    
    // Check success message
    await expect(page.getByText('Выход выполнен успешно')).toBeVisible();
  });

  test('should handle offline state gracefully', async ({ page }) => {
    // Simulate offline state
    await page.route('**/*', route => route.abort());
    
    // Reload page
    await page.reload();
    
    // Check if offline notice is displayed
    await expect(page.getByText('Вы находитесь в офлайн-режиме')).toBeVisible();
  });

  test('should display loading states correctly', async ({ page }) => {
    // Navigate to profile page (should show loading initially)
    await page.goto('/profile');
    
    // Check if loading skeletons are visible
    await expect(page.locator('.animate-pulse')).toBeVisible();
    
    // Wait for content to load
    await page.waitForSelector('text=Личные данные');
    
    // Check if loading skeletons are gone
    await expect(page.locator('.animate-pulse')).not.toBeVisible();
  });

  test('should handle form validation errors', async ({ page }) => {
    // Wait for profile form to load
    await page.waitForSelector('input[name="height_cm"]');
    
    // Enter invalid height
    const heightInput = page.getByLabel('Рост (см)');
    await heightInput.clear();
    await heightInput.fill('300'); // Invalid: too high
    
    // Enter invalid weight
    const weightInput = page.getByLabel('Вес (кг)');
    await weightInput.clear();
    await weightInput.fill('10'); // Invalid: too low
    
    // Try to save
    await page.getByRole('button', { name: 'Сохранить изменения' }).click();
    
    // Check for validation errors
    await expect(page.getByText('Рост не может превышать 250 см')).toBeVisible();
    await expect(page.getByText('Вес должен быть не менее 20 кг')).toBeVisible();
  });
});
