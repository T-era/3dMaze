module.exports = {
	mode: 'development',
	entry: './src/ts/index.ts',
	devtool: 'source-map',
	output: {
		path: __dirname + '/dest/',
		filename: './mz.js'
	},
	module: {
		rules: [
			{ test: /¥*.ts$/, loader: 'ts-loader' }
		]
	},
	resolve: {
		extensions: [ '.ts', '.js' ]
	}
}
