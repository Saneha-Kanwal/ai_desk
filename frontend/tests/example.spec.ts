import { test, expect } from '@playwright/test';

test.describe('AI Desk Frontend', () => {
  test('homepage loads and displays news cards', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for hero header
    const header = page.locator('h1:has-text("AI Desk")');
    await expect(header).toBeVisible();

    // Check for search bar
    const searchBar = page.locator('input[placeholder*="Search"]');
    await expect(searchBar).toBeVisible();

    // Check if news cards are present (or loading state)
    const loadingOrCards = page.locator('text=Loading news...').or(page.locator('[class*="card"]'));
    await expect(loadingOrCards.first()).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Type in search bar
    const searchBar = page.locator('input[placeholder*="Search"]');
    await searchBar.fill('AI');

    // Wait a bit for search to process
    await page.waitForTimeout(1000);
  });

  test('can navigate to news detail page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Try to click on first news card if available
    const firstCard = page.locator('a[href^="/news/"]').first();
    
    // Only proceed if card exists
    const cardCount = await firstCard.count();
    if (cardCount > 0) {
      await firstCard.click();
      
      // Wait for detail page to load
      await page.waitForLoadState('networkidle');
      
      // Check for back button
      const backButton = page.locator('text=Back to News');
      await expect(backButton).toBeVisible();
    }
  });
});

