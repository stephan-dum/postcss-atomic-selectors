import { test as base } from '@playwright/test';
import { CDPClient } from 'monocart-coverage-reports';
import getReporter from './utils/getReporter';

export const test = base.extend({
  page: async ({ page }, use) => {
    const session = await page.context().newCDPSession(page);

    const client = await CDPClient({
      // @ts-expect-error type mismatch
      session,
    });

    if (!client) {
      throw new Error('CDPClient failed to initialize');
    }

    await client.startCoverage();

    await use(page);

    const coverageData = await client.stopCoverage();

    const mcr = await getReporter();
    await mcr.add(coverageData);
  },
});

export { expect, type Page, type Locator } from '@playwright/test';
