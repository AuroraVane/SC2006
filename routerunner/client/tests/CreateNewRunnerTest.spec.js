const { test, expect } = require('@playwright/test');

test('Create New Runner & Delete New Runner Test', async ({ page }) => {
    // Step 1: Go to the login page
    await page.goto('/login');

    // Step 2: Log in
    await page.fill('input[type="text"]', 'swegroupwork@gmail.com'); // Email input
    await page.waitForTimeout(250);
    await page.fill('input[type="password"]', 'Password123!'); // Password input
    await page.waitForTimeout(250);
    await page.click('button[type="submit"]'); // Submit login form 

    await page.waitForTimeout(500);
});