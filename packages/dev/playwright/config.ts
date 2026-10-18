import { defineConfig, devices } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default ({ baseURL }: { baseURL: string }) =>
  defineConfig({
    globalSetup: require.resolve('./global.setup.ts'),
    globalTeardown: require.resolve('./global.teardown.ts'),
    fullyParallel: true,
    use: {
      ...devices['chromium'],
      baseURL,
    },
    testMatch: '**/*.e2e.ts',
    webServer: {
      command: 'pnpm start',
      url: baseURL,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  });
