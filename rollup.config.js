import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

const extensions = ['.ts', '.tsx', '.js', '.json'];

export default {
  input: 'src/index',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    // sourcemap: true,
  },
  plugins: [
    babel({
      extensions,
      exclude: 'node_modules/**',
    }),
    resolve({ extensions }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
  external: ['react', 'react-dom'],
};
