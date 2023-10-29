import { test, expect, Page } from '@playwright/test';

const AxeBuilder = require('@axe-core/playwright').default;

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:4400/iframe.html?args=&id=planitbutton--default&viewMode=story');
});

/* const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
]; */

test.describe('New Todo', () => {
  test('should eun a11y testing', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    console.log(results.violations);
    expect(results.violations.length).toEqual(0);
  });

  /* test('should allow me to add todo items', async ({ page }) => {
    // Create 1st todo.
    await page.locator('.new-todo').fill(TODO_ITEMS[0]);
    await page.locator('.new-todo').press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.locator('.view label')).toHaveText([
      TODO_ITEMS[0]
    ]);

    // Create 2nd todo.
    await page.locator('.new-todo').fill(TODO_ITEMS[1]);
    await page.locator('.new-todo').press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.locator('.view label')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);

    await checkNumberOfTodosInLocalStorage(page, 2);
  }); */
});

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).length === e;
  }, expected);
}
