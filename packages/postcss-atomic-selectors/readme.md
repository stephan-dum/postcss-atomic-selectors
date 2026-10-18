# postcss-atomic-selectors

To fix V8's block blindness, this package provides a PostCSS plugin to explode nested structures into atomized, discrete CSS structures.

## 💡 Motivation – V8 Block-Granularity Problem

V8 tracks CSS coverage solely based on the root-level tokens it executes.
This means if a root selector (for example, a media query or nested selector) is matched, V8 marks the entire character range of that block as 100% covered.

Consider a nesting CSS component:

```scss
/* USED in browser */
.button {
  display: flex;

  /* NEVER used in browser */
  .unused {
    color: red;
  }
}
```

When v8 evaluates the styles and matches `.button`, V8 registers the byte boundaries of the entire execution stream. It returns a range indicating that the entire block is 100% covered—falsely reporting the uncovered `.unused` selector code as active.

## ⚠️ Production Warning

The atomization expands the size of the final CSS output!

- **Testing & CI/CD Only:** This tool is strictly designed to be used in testing, staging, or CI/CD pipelines to gather precise code coverage metrics.
- **Do Not Deploy to Production:** Atomized CSS bundles must never be deployed to live production environments.

## 🚀 Usage

Add `postcss-atomic-selectors` along `postcss-nesting` to the build pipeline and enable source maps for the CSS compiler.
Some minifiers like lightningCSS undo the atomization process or might even break the sourcemap, resulting in incorrect coverage ranges.
Make sure to **turn off minification** in coverage builds.

```js
import atomicSelectors from 'postcss-atomic-selectors';
import nesting from 'postcss-nesting';

const isCoverageBuild = process.env['COVERAGE_BUILD'];

postcss(
  [isCoverageBuild && nesting, isCoverageBuild && atomicSelectors()].filter(
    Boolean,
  ),
);
```

For more detailed examples see:

- [rollup Example](../examples/rollup/readme.md)
- [pspack Example](../examples/rspack/readme.md)
- [Vite Example](../examples/vite/readme.md)
- [webpack Example](../examples/webpack/readme.md)

Due to their internal optimization architecture, which reverts the selector explosion with no way to disable it, the following bundlers are not supported:

- esbuild
- parcel
