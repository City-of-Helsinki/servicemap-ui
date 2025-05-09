import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import { acceptCookieConcent } from '../utils';
import { buttonFocusTests } from '../utils/button-focus-test';

/**
 * Runs axe accessibility check on the given page.
 * @param {import('@playwright/test').Page} page - The Playwright page.
 */
async function axeCheckHandler(page, testInfo, disableRules = []) {
  await page.waitForLoadState('networkidle');

  const pageTitle = await page.title();
  const pageName = pageTitle.replace(/\s+/g, '-').toLowerCase();
  const browserName = testInfo.project.name;
  const reportFile = `${pageName}-${browserName}-axe-report.html`;

  // Run axe accessibility checks
  const accessibilityScanResults = await new AxeBuilder({ page })
    .disableRules(disableRules)
    .analyze();

  const fieldAccessibilityScanResults = await new AxeBuilder({ page })
    .include('.SMBackButton')
    .include('.SMButton')
    .include('main input:not([disabled]):not([tabindex="-1"])')
    .options({
      runOnly: {
        type: 'rule',
        values: ['color-contrast']
      }
    })
    .analyze();

  const combinedResults = {
    violations: [...accessibilityScanResults.violations, ...fieldAccessibilityScanResults.violations],
    passes: [...accessibilityScanResults.passes, ...fieldAccessibilityScanResults.passes],
    incomplete: [...accessibilityScanResults.incomplete, ...fieldAccessibilityScanResults.incomplete],
    inapplicable: [...accessibilityScanResults.inapplicable, ...fieldAccessibilityScanResults.inapplicable]
  };
  // Generate the HTML report
  createHtmlReport({
    results: combinedResults,
    options: {
      outputDir: './report/axe',
      reportFileName: reportFile,
    }
  });

  expect.soft(accessibilityScanResults.violations).toEqual([]);
}

const disabledRules = {
  frontpage: ['aria-required-attr', 'aria-hidden-focus', 'region'],
  search: ['aria-allowed-role', 'aria-hidden-focus', 'aria-required-attr', 'list', 'region'],
  unit: ['aria-allowed-role', 'aria-hidden-focus', 'aria-required-attr', 'list', 'region'],
  service: ['aria-allowed-role', 'aria-hidden-focus', 'aria-required-attr', 'list', 'region'],
  address: ['aria-hidden-focus', 'aria-required-attr', 'heading-order', 'region'],
  area: ['aria-hidden-focus', 'aria-required-attr', 'region'],
  services: ['aria-hidden-focus', 'region'],
  event: ['aria-allowed-role', 'aria-hidden-focus', 'aria-required-attr', 'list', 'region']
}

test.describe('Frontpage Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/`);
    await acceptCookieConcent(page);
  });

  test('Automated accessibility testing', async ({ page }, testInfo) => {
    await axeCheckHandler(page, testInfo, disabledRules.frontpage);
  });

  buttonFocusTests();
});

test.describe('Search Page Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/search?q=kirjasto`, { waitUntil: 'networkidle' });
    await acceptCookieConcent(page);
  });

  test('Automated accessibility testing', async ({ page }, testInfo) => {
    await axeCheckHandler(page, testInfo, disabledRules.search);
  });

  buttonFocusTests();
});

test.describe('Unit Page Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/unit/8215`);
    await acceptCookieConcent(page);
  });

  test('Automated accessibility testing', async ({ page }, testInfo) => {
    await axeCheckHandler(page, testInfo, disabledRules.unit);
  });

  buttonFocusTests();
});

test.describe('Service Page Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/service/813`);
    await acceptCookieConcent(page);
  });

  test('Automated accessibility testing', async ({ page }, testInfo) => {
    await axeCheckHandler(page, testInfo, disabledRules.service);
  });

  buttonFocusTests();
});

test.describe('Address Page Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/address/helsinki/Fleminginkatu 1`);
    await acceptCookieConcent(page);
  });

  test('Automated accessibility testing', async ({ page }, testInfo) => {
    await axeCheckHandler(page, testInfo, disabledRules.address);
  });

  buttonFocusTests();
});

test.describe('Area Page Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/area`);
    await acceptCookieConcent(page);
  });

  test('Automated accessibility testing', async ({ page }, testInfo) => {
    await axeCheckHandler(page, testInfo, disabledRules.area);
  });

  buttonFocusTests();
});

test.describe('Service Tree Page Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/services`);
    await acceptCookieConcent(page);
  });

  test('Automated accessibility testing', async ({ page }, testInfo) => {
    await axeCheckHandler(page, testInfo, disabledRules.services);
  });

  buttonFocusTests();
});

test.describe('Event Page Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fi/event/helmet:190724`);
    await acceptCookieConcent(page);
  });

  test('Automated accessibility testing', async ({ page }, testInfo) => {
    await axeCheckHandler(page, testInfo, disabledRules.event);
  });

  buttonFocusTests();
});
