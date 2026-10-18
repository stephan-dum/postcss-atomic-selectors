import styles from 'rollup-plugin-styles';
import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import html from '@rollup/plugin-html';
import { terser } from 'rollup-plugin-terser';
import nesting from 'postcss-nesting';
import atomicSelectors from 'postcss-atomic-selectors';
import { readFileSync } from 'node:fs';

const isProduction = process.env.NODE_ENV === 'production';
const isCoverageBuild = process.env.IS_COVERAGE_BUILD === 'true';

export default {
  input: 'src/index.tsx',
  context: 'window',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
      preventAssignment: true,
    }),
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    }),
    commonjs(),
    swc({
      include: /\.[jt]sx?$/,
      swc: {
        sourceMaps: true,
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: {
            react: {
              runtime: 'automatic',
              development: !isProduction,
              refresh: false,
            },
          },
        },
      },
    }),

    styles({
      mode: 'extract',
      sourceMap: true,

      namedExports: true,
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      plugins: [
        isCoverageBuild && nesting,
        isCoverageBuild && atomicSelectors,
      ].filter(Boolean),
    }),

    html({
      fileName: 'index.html',
      template: ({ files, publicPath }) => {
        const rawTemplate = readFileSync('./index.html', 'utf8');

        const links = (files.css || [])
          .map(
            (file) =>
              `<link rel="stylesheet" href="${publicPath || ''}${file.fileName}">`,
          )
          .join('\n  ');

        const scripts = (files.js || [])
          .filter((file) => file.isEntry)
          .map(
            (file) =>
              `<script type="module" src="${publicPath || ''}${file.fileName}"></script>`,
          )
          .join('\n  ');

        return rawTemplate
          .replace('<!--{links}-->', links)
          .replace('<!--{scripts}-->', scripts);
      },
    }),

    isProduction && terser(),
  ],
};
