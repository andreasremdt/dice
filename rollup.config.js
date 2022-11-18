import typescript from '@rollup/plugin-typescript';

const COMPONENTS = ['dialog', 'dropdown', 'select', 'tabs', 'textarea', 'tooltip'];

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  ...COMPONENTS.map((component) => ({
    input: `src/${component}/${component}.ts`,
    output: {
      dir: 'lib',
      sourcemap: true,
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
  })),
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib',
      sourcemap: true,
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
  },
];
