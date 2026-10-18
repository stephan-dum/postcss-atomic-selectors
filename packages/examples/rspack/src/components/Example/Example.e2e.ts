import { test } from '@dev/playwright/test';

test('home', async ({ page }) => {
  await page.goto('/');
});
