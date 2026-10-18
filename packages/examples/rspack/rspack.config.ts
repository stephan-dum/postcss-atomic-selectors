import {
  HtmlRspackPlugin,
  LightningCssMinimizerRspackPlugin,
  SwcJsMinimizerRspackPlugin,
} from '@rspack/core';
import { defineConfig } from '@rspack/cli';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import nesting from 'postcss-nesting';
import atomicSelectors from 'postcss-atomic-selectors';

const isProduction = process.env.NODE_ENV === 'production';
const isCoverageBuild = process.env.IS_COVERAGE_BUILD === 'true';

export default defineConfig({
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: './src/index.tsx',
  },
  output: {
    path: 'dist',
    clean: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new SwcJsMinimizerRspackPlugin(),
      !isCoverageBuild && new LightningCssMinimizerRspackPlugin(),
    ].filter(Boolean),
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: !isProduction,
                  refresh: !isProduction,
                },
              },
            },
          },
        },
      },
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
      },
    ],
  },
  plugins: [
    new HtmlRspackPlugin({ template: './index.html' }),
    !isProduction && new ReactRefreshRspackPlugin(),
  ].filter(Boolean),
  devServer: {
    hot: true,
    port: 3000,
  },
});
