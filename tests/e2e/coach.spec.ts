import { test, expect } from '@playwright/test';

test.describe('AI Coach', () => {
  test('should open coach page and send message', async ({ page }) => {
    await page.goto('/coach');
    
    // Проверяем, что страница загрузилась
    await expect(page.getByRole('heading', { name: 'Коуч' })).toBeVisible();
    
    // Отправляем сообщение
    await page.getByPlaceholder('Задайте вопрос коучу...').fill('Что мне есть на ужин?');
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Ждём ответа
    await expect(page.getByText(/Отличный вопрос/)).toBeVisible();
    
    // Проверяем наличие интентов
    await expect(page.getByRole('button', { name: 'Предложить блюдо' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Добавить приём пищи' })).toBeVisible();
  });

  test('should open coach widget on diary page', async ({ page }) => {
    await page.goto('/diary');
    
    // Открываем виджет коуча
    await page.getByRole('button', { name: 'Открыть чат с коучем' }).click();
    
    // Проверяем, что bottom-sheet открылся
    await expect(page.getByRole('heading', { name: 'Коуч' })).toBeVisible();
    
    // Отправляем сообщение
    await page.getByPlaceholder('Задайте вопрос коучу...').fill('Что на ужин?');
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Ждём ответа
    await expect(page.getByText(/Сегодня белок/)).toBeVisible();
    
    // Проверяем интенты
    await expect(page.getByRole('button', { name: 'Предложить блюдо' })).toBeVisible();
  });

  test('should open coach widget on product detail page', async ({ page }) => {
    await page.goto('/shop/resveratrol');
    
    // Открываем виджет коуча
    await page.getByRole('button', { name: 'Открыть чат с коучем' }).click();
    
    // Отправляем вопрос о продукте
    await page.getByPlaceholder('Задайте вопрос коучу...').fill('Подходит ли мне этот продукт?');
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Ждём ответа
    await expect(page.getByText(/отлично подходит/)).toBeVisible();
    
    // Проверяем интенты
    await expect(page.getByRole('button', { name: 'Рекомендовать товары' })).toBeVisible();
  });

  test('should handle coach widget on home page', async ({ page }) => {
    await page.goto('/');
    
    // Открываем виджет коуча
    await page.getByRole('button', { name: 'Открыть чат с коучом' }).click();
    
    // Отправляем общий вопрос
    await page.getByPlaceholder('Задайте вопрос коучу...').fill('Как мне улучшить питание?');
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Ждём ответа
    await expect(page.getByText(/Привет! Я твой персональный нутрициолог/)).toBeVisible();
  });
});
