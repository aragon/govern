import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

const esmConfig = {
  input: 'dist/esm/public/index.js',
  output: {
    file: `./dist/esm/public/govern-esm.js`,
    format: 'esm'
  },
  context: "window",
  plugins: [
    resolve({
       browser: true
    }),
    commonjs(),
    injectProcessEnv({
      NODE_ENV: 'production'
    })
  ]
}

const umdConfig = {
  input: 'dist/cjs/public/index.js',
  output: {
    file: `./dist/umd/public/govern-umd.js`,
    format: 'umd',
    name: 'govern'
  },
  context: "window",
  plugins: [
    resolve({
       browser: true
    }),
    commonjs(),
    injectProcessEnv({
      NODE_ENV: 'production'
    })
  ]
}

const configs = [
  esmConfig,
  umdConfig
]

export default configs

