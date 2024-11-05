// tests/OperatorMainMenuTest.spec.js
const { test, expect } = require('@playwright/test');

test('Create New Job & Delete New Job Test', async ({ page }) => {
    // Step 1: Go to the login page
    await page.goto('/login');

    // Step 2: Log in
    await page.fill('input[type="text"]', 'swegroupwork@gmail.com'); // Email input
    await page.waitForTimeout(250);
    await page.fill('input[type="password"]', 'Password123!'); // Password input
    await page.waitForTimeout(250);
    await page.click('button[type="submit"]'); // Submit login form 

    await page.waitForTimeout(500);

    // Step 3: Verify "Active Runners" section is present
    await expect(page.locator('h3')).toHaveText('Active Runners');
    await page.waitForTimeout(500);
    // Step 4: Click on the "Menu" icon
    await page.click('label.menu-icon');

    // Step 4: Click on the "Manage Jobs" item in the menu
    await page.click('li:has-text("Manage Jobs")'); // Clicks on the "Manage Jobs" menu item
    await page.waitForTimeout(500);

    // Step 5: Add verification if needed, e.g., verifying that the page or component for "Manage Jobs" is displayed
    await expect(page).toHaveURL(/\/mngjob/); // Replace with the expected URL or another assertion

    await page.waitForTimeout(1000);

    await page.click('label.menu-icon');

    // Step 6: Click on the "Create New Job" button
    await page.click('a[href="/createnewjob"]'); // Clicks on the "Create New Job" button

    await expect(page).toHaveURL(/\/createnewjob/); // Replace with the expected URL or another assertion

    await page.waitForTimeout(500);

    await expect(page.locator('h1')).toHaveText('Create New Job');

    // Step 7: Fill in the form fields
    await page.fill('input[placeholder="Enter postal code"]', '048582');

    await page.waitForTimeout(500);

    await page.click('button[type="submit"]');

    await page.waitForTimeout(500);

    await page.fill('input[placeholder="Enter unit number"]', '01-01');

    await page.waitForTimeout(500);

    await page.fill('input[placeholder="Enter note"]', 'Lau Pa Sat');
    
    await page.waitForTimeout(500);

    await page.click('button[type="button"]');

    await page.waitForTimeout(2000);

    await page.click('label.menu-icon');

    await page.waitForTimeout(500);

    await page.click('li:has-text("Manage Jobs")');

    await page.waitForTimeout(500);

    await page.click('label.menu-icon');

    await page.waitForTimeout(500);

    await page.click('a[href="/viewjobs/null"]');
});
