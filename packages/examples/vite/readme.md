# vite Example

This package demonstrates how to use `postcss-atomic-selectors` plugin with vite.

Run the example by executing `pnpm run test:e2e`.
Open `coverage-reports/index.html` in a browser to view the results.

_(Note: Vite currently only supports CSS source maps in development mode till this [PR](https://github.com/vitejs/vite/pull/23166) is merged.)_.

## add environment variable

```json
{
  "dev:coverage": "cross-env IS_COVERAGE_BUILD=true pnpm run dev"
}
```

vite.config.ts

```js
const isCoverageBuild = process.env.IS_COVERAGE_BUILD === 'true';
```

## enable sourcemaps

```js
css: {
  devSourcemap: true,
},
```

## add `postcss-atomic-selectors` plugin

```js
css: {
  ...(isCoverageBuild
    ? {
      postcss: {
        plugins: [nesting, atomicSelectors],
      },
    }
    : {}),
},
```
