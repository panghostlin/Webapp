/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 07 January 2020 - 12:21:12
** @Filename:				next.config.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 16:06:43
*******************************************************************************/

const	{PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD} = require('next/constants')
const	withCSS = require('@zeit/next-css');
const	UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const	withOptimizedImages = require('next-optimized-images');
module.exports = phase => withCSS(withOptimizedImages({
	test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
	loader: 'file-loader',
	optimizeImagesInDev: true,
	enableSvg: true,
	target: 'serverless',
	optimization: {
		minimizer: [new UglifyJsPlugin()]
	},
	env: {
		BACKEND: process.env.BACKEND,
		isDev: phase === PHASE_DEVELOPMENT_SERVER,
		isProd: phase === PHASE_PRODUCTION_BUILD
	},
	webpackDevMiddleware: config => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 300,
		}
		return config
	},
	webpack(config, options) {
		return config;
	}
}));

