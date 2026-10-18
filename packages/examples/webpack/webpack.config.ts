import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import nesting from 'postcss-nesting';
import atomicSelectors from 'postcss-atomic-selectors';
import type { DefineConfigInput } from 'webpack';

const isCoverageBuild = process.env.IS_COVERAGE_BUILD === 'true';

const webpackConfig: DefineConfigInput = (_, { mode }) => {
  const isProduction = mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      main: './src/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    experiments: {
      css: true,
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin(),
        !isCoverageBuild && new CssMinimizerPlugin(),
      ].filter(Boolean),
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'swc-loader',
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
      new HtmlWebpackPlugin({ template: './index.html' }),
      !isProduction && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    devServer: {
      hot: true,
      port: 3000,
    },
  };
};

export default webpackConfig;
