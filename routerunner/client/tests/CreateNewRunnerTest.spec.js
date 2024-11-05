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

    await page.click('label.menu-icon');

    // Step 4: Click on the "Manage Jobs" item in the menu
    await page.click('li:has-text("Manage Runners")'); // Clicks on the "Manage Jobs" menu item
    await page.waitForTimeout(500);

    await page.click('a[href="/createnewrunner"]');

    await page.waitForTimeout(500);

    await page.fill('input[type="text"]', 'testrunner');

    await page.waitForTimeout(500);

    await page.fill('input[type="password"]', 'Password123!');

    await page.waitForTimeout(500);

    await page.fill('input[type="email"]', 'gaymingkaismite@gmail.com');

    await page.waitForTimeout(500);

    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);
});