import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nesting from 'postcss-nesting';
import atomicSelectors from 'postcss-atomic-selectors';

const isCoverageBuild = process.env.IS_COVERAGE_BUILD === 'true';

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
    ...(isCoverageBuild
      ? {
          postcss: {
            plugins: [nesting, atomicSelectors],
          },
        }
      : {}),
  },
  build: {
    sourcemap: true,
  },
});
