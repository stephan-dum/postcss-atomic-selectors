# webpack Example

This package demonstrates how to use `postcss-atomic-selectors` plugin with webpack.

Run the example by executing `pnpm run build:coverage` and `pnpm run test:e2e`.
Open `coverage-reports/index.html` in a browser to view the results.

## add environment variable

package.json

```json
{
  "build:coverage": "cross-env IS_COVERAGE_BUILD=true pnpm run build"
}
```

rspack.config.ts

```js
const isCoverageBuild = process.env.IS_COVERAGE_BUILD === 'true';
```

## enable source maps

```js
devtool: 'source-map';
```

## adopt optimizations

```js
optimization: {
  minimize: isProduction,
  minimizer: [
    new SwcJsMinimizerRspackPlugin(),
    !isCoverageBuild && new LightningCssMinimizerRspackPlugin(),
  ].filter(Boolean),
},
```

## add `postcss-atomic-selectors` plugin

```js
{
  test: /\.css$/,
  type: 'css/auto',
  use: [
    isCoverageBuild && {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [nesting, atomicSelectors],
        },
      },
    },
  ].filter(Boolean),
}
```
