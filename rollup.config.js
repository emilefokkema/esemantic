import babel from '@rollup/plugin-babel';

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/index.js',
		format: 'umd',
		name: 'Esemantic'
	},
	plugins: [babel({ presets: ['@babel/preset-env'], babelHelpers: 'bundled' })]
}