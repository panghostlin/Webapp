/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 07 January 2020 - 12:19:28
** @Filename:				_document.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Friday 14 February 2020 - 18:38:04
*******************************************************************************/


import	React								from	'react';
import	Document, {Head, Main, NextScript}	from	'next/document';
import	{ServerStyleSheet}					from	'styled-components';

export default class MyDocument extends Document
{
	static async getInitialProps(ctx) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
				});

			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				)
			};
		} finally {
			sheet.seal();
		}
	}

	render()
	{
		return (
			<html lang={'fr'}>
				<title>{'Panghostlin'}</title>
				<Head>
					<link rel={'shortcut icon'} type={'image/x-icon'} href={'/static/images/favicon.ico'} />
					<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
					<meta property='og:title' content='Panghostlin' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
