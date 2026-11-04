import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

const panel = {
  input: 'src/alarm-panel.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: false,
  },
  plugins: [
    resolve({ browser: true }),
    typescript(),
    json(),
    //visualizer({ open: true }),
    terser()
  ],
  context: 'window'
};

// ext: the House Modes & Alarm Center dashboard card (served by the integration)
const card = {
  input: 'card/src/card.ts',
  output: {
    file: 'dist/house-modes-alarm-center-card.js',
    format: 'esm',
    sourcemap: false,
    inlineDynamicImports: true,
  },
  plugins: [resolve({ browser: true }), typescript(), json(), terser()],
  context: 'window',
};

export default [panel, card];
