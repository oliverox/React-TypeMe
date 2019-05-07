import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
// import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

const NODE_ENV = process.env.NODE_ENV || "development";

export default {
  input: pkg.main,
  output: {
    name: 'TypeAnim',
    file: pkg.browser,
    format: 'umd',
    globals: {
      react: 'React'
    }
  },
  external: ['react'],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    babel({
      exclude: ['node_modules/**']
    }),
    resolve(),
    commonjs(),
    filesize(),
    // terser({
    //   mangle: {
    //     toplevel: true
    //   }
    // })
  ]
};
