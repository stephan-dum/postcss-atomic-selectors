# rollup Example

This package demonstrates how to use `postcss-atomic-selectors` plugin with rollup.

Run the example by executing `pnpm run build:coverage` and `pnpm run test:e2e`.
Open `coverage-reports/index.html` in a browser to view the results.

## add environment variable

package.json

```json
{
  "build:coverage": "cross-env IS_COVERAGE_BUILD=true pnpm run build"
}
```

rollup.config.js

```js
const isCoverageBuild = process.env.IS_COVERAGE_BUILD === 'true';
```

## enable source maps

```js
output: {
  sourcemap: true,
},
```

## add `postcss-atomic-selectors` plugin

```js
import styles from 'rollup-plugin-styles';

styles({
  mode: 'extract',
  sourceMap: true,
  plugins: [
    isCoverageBuild && nesting,
    isCoverageBuild && atomicSelectors,
  ].filter(Boolean),
});
```
