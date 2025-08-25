import { test, expect } from '@playwright/test';

test.describe('Diary Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to diary page
    await page.goto('/diary');
  });

  test('should display diary page with day switcher and totals', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: 'Дневник' })).toBeVisible();
    
    // Check day switcher is visible
    await expect(page.getByText(/Сегодня|Вчера|Завтра/)).toBeVisible();
    
    // Check navigation arrows
    await expect(page.getByLabel('Предыдущий день')).toBeVisible();
    await expect(page.getByLabel('Следующий день')).toBeVisible();
    
    // Check day totals are displayed
    await expect(page.getByText('Калории')).toBeVisible();
    await expect(page.getByText('Вода')).toBeVisible();
    await expect(page.getByText('Белки')).toBeVisible();
    await expect(page.getByText('Жиры')).toBeVisible();
    await expect(page.getByText('Углеводы')).toBeVisible();
  });

  test('should navigate between days', async ({ page }) => {
    // Get current date display
    const currentDateText = await page.locator('text=/Сегодня|Вчера|Завтра|Понедельник|Вторник|Среда|Четверг|Пятница|Суббота|Воскресенье/').textContent();
    
    // Go to previous day
    await page.getByLabel('Предыдущий день').click();
    await expect(page.locator('text=/Сегодня|Вчера|Завтра|Понедельник|Вторник|Среда|Четверг|Пятница|Суббота|Воскресенье/')).not.toHaveText(currentDateText!);
    
    // Go to next day
    await page.getByLabel('Следующий день').click();
    await expect(page.locator('text=/Сегодня|Вчера|Завтра|Понедельник|Вторник|Среда|Четверг|Пятница|Суббота|Воскресенье/')).toHaveText(currentDateText!);
  });

  test('should add a new meal', async ({ page }) => {
    // Click add meal FAB
    await page.getByLabel('Добавить приём пищи').click();
    
    // Check modal is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Добавить приём пищи' })).toBeVisible();
    
    // Fill in meal details
    await page.getByLabel('Название *').fill('Тестовый приём пищи');
    await page.getByLabel('Граммы: 100г').click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.getByLabel('Белки (г)').fill('25');
    await page.getByLabel('Жиры (г)').fill('15');
    await page.getByLabel('Углеводы (г)').fill('30');
    
    // Submit form
    await page.getByRole('button', { name: 'Добавить' }).click();
    
    // Check modal is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Check meal appears in list
    await expect(page.getByText('Тестовый приём пищи')).toBeVisible();
  });

  test('should edit an existing meal', async ({ page }) => {
    // Wait for meals to load
    await page.waitForSelector('[data-testid="meal-card"]', { timeout: 10000 });
    
    // Click edit button on first meal
    await page.locator('[data-testid="meal-card"]').first().getByLabel('Редактировать').click();
    
    // Check modal is open with edit title
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Редактировать приём пищи' })).toBeVisible();
    
    // Change grams
    await page.getByLabel(/Граммы:/).click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    
    // Submit form
    await page.getByRole('button', { name: 'Сохранить' }).click();
    
    // Check modal is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should delete a meal', async ({ page }) => {
    // Wait for meals to load
    await page.waitForSelector('[data-testid="meal-card"]', { timeout: 10000 });
    
    // Click delete button on first meal
    await page.locator('[data-testid="meal-card"]').first().getByLabel('Удалить').click();
    
    // Check confirmation dialog
    await expect(page.getByText('Удалить приём пищи?')).toBeVisible();
    await expect(page.getByText('Это действие нельзя отменить')).toBeVisible();
    
    // Confirm deletion
    await page.getByRole('button', { name: 'Удалить' }).click();
    
    // Check confirmation dialog is closed
    await expect(page.getByText('Удалить приём пищи?')).not.toBeVisible();
  });

  test('should show empty state when no meals', async ({ page }) => {
    // Navigate to a date that might not have meals (future date)
    await page.getByLabel('Следующий день').click();
    await page.getByLabel('Следующий день').click();
    await page.getByLabel('Следующий день').click();
    
    // Check empty state
    await expect(page.getByText('Нет приёмов пищи')).toBeVisible();
    await expect(page.getByText('Добавьте первый приём пищи за этот день')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Добавить приём' })).toBeVisible();
  });

  test('should handle offline mode', async ({ page }) => {
    // Set offline mode
    await page.context().setOffline(true);
    
    // Reload page
    await page.reload();
    
    // Check offline badge is visible
    await expect(page.getByText('Офлайн. Показаны кэшированные данные')).toBeVisible();
    
    // Set back to online
    await page.context().setOffline(false);
  });
});
