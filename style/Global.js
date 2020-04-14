/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 30 March 2020 - 13:11:35
** @Filename:				Global.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 14 April 2020 - 14:16:29
*******************************************************************************/

import	styled, {createGlobalStyle}		from	'styled-components';

export const GlobalStyle = createGlobalStyle`
	*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;font-family:Roboto,Helvetica,Arial,sans-serif;;font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;}
	::-webkit-scrollbar {width: 0 !important;}
	body{background-color: #242E42;box-sizing: content-box;height:100%;padding:0;margin:0;}
	#__next{height:100%;width:100%;padding:0;margin:0;};
	#__next{ overflow: -moz-scrollbars-none; }
	#__next { -ms-overflow-style: none; }

	h1,h2,h3,h4,h5,h6,p{margin:0;padding:0}
	a{text-decoration:none;color:#000}
	a:hover{text-decoration:none;cursor:pointer}
	button{background:0 0;color:inherit;border:none;padding:0;font:inherit;cursor:pointer;outline:inherit}
	nav{margin:0;padding:0}
	::placeholder{color:#000;opacity:.3}
	:-ms-input-placeholder{color:#000}
	::-ms-input-placeholder{color:#000}
`;

/* ****************************************************************************
**	Définission des règles communes aux composants.
**	Tous les composants qui partent de Default auront ces propriétés de base
**	tel que la gestion des marges
**	SMALL = 16 * 1 = 16px
**	MEDIUM = 16 * 2.5 = 40px
**	BIG = 16 * 6 = 96px
**************************************************************************** */
export const	Default = styled.div`
	/* ************************************************************************
	**	Gestion du Margin
	************************************************************************ */
	/* Style for the top margin */
	${props => props.marginTop && !isNaN(props.marginTop) && `margin-top: ${props.theme.defaultUnit * props.marginTop}px;`};
	${props => props.marginTop && props.marginTop === 'small' && `margin-top: ${props.theme.defaultUnit * 1}px;`};
	${props => props.marginTop && props.marginTop === 'medium' && `margin-top: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.marginTop && props.marginTop === 'big' && `margin-top: ${props.theme.defaultUnit * 6}px;`};
	${props => props.mt && !isNaN(props.mt) && `margin-top: ${props.theme.defaultUnit * props.mt}px;`};
	${props => props.mt && props.mt === 'small' && `margin-top: ${props.theme.defaultUnit * 1}px;`};
	${props => props.mt && props.mt === 'medium' && `margin-top: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.mt && props.mt === 'big' && `margin-top: ${props.theme.defaultUnit * 6}px;`};

	/* Style for the bottom margin */
	${props => props.marginBottom && !isNaN(props.marginBottom) && `margin-bottom: ${props.theme.defaultUnit * props.marginBottom}px;`};
	${props => props.marginBottom && props.marginBottom === 'small' && `margin-bottom: ${props.theme.defaultUnit * 1}px;`};
	${props => props.marginBottom && props.marginBottom === 'medium' && `margin-bottom: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.marginBottom && props.marginBottom === 'big' && `margin-bottom: ${props.theme.defaultUnit * 6}px;`};
	${props => props.mb && !isNaN(props.mb) && `margin-bottom: ${props.theme.defaultUnit * props.mb}px;`};
	${props => props.mb && props.mb === 'small' && `margin-bottom: ${props.theme.defaultUnit * 1}px;`};
	${props => props.mb && props.mb === 'medium' && `margin-bottom: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.mb && props.mb === 'big' && `margin-bottom: ${props.theme.defaultUnit * 6}px;`};

	/* Style for the whole margins */
	${props => props.marginLeft && !isNaN(props.marginLeft) && `margin-left: ${props.theme.defaultUnit * props.marginLeft}px;`};
	${props => props.marginLeft && props.marginLeft === 'small' && `margin-left: ${props.theme.defaultUnit * 1}px;`};
	${props => props.marginLeft && props.marginLeft === 'medium' && `margin-left: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.marginLeft && props.marginLeft === 'big' && `margin-left: ${props.theme.defaultUnit * 6}px;`};
	${props => props.ml && !isNaN(props.ml) && `margin-left: ${props.theme.defaultUnit * props.ml}px;`};
	${props => props.ml && props.ml === 'small' && `margin-left: ${props.theme.defaultUnit * 1}px;`};
	${props => props.ml && props.ml === 'medium' && `margin-left: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.ml && props.ml === 'big' && `margin-left: ${props.theme.defaultUnit * 6}px;`};

	/* Style for the whole margins */
	${props => props.marginRight && !isNaN(props.marginRight) && `margin-right: ${props.theme.defaultUnit * props.marginRight}px;`};
	${props => props.marginRight && props.marginRight === 'small' && `margin-right: ${props.theme.defaultUnit * 1}px;`};
	${props => props.marginRight && props.marginRight === 'medium' && `margin-right: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.marginRight && props.marginRight === 'big' && `margin-right: ${props.theme.defaultUnit * 6}px;`};
	${props => props.mr && !isNaN(props.mr) && `margin-right: ${props.theme.defaultUnit * props.mr}px;`};
	${props => props.mr && props.mr === 'small' && `margin-right: ${props.theme.defaultUnit * 1}px;`};
	${props => props.mr && props.mr === 'medium' && `margin-right: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.mr && props.mr === 'big' && `margin-right: ${props.theme.defaultUnit * 6}px;`};

	/* Style for the left - right margin */
	${props => props.marginHorizontal && !isNaN(props.marginHorizontal) && `
		margin-left: ${props.theme.defaultUnit * props.marginHorizontal}px;
		margin-right: ${props.theme.defaultUnit * props.marginHorizontal}px;
	`};
	${props => props.marginHorizontal && props.marginHorizontal === 'small' && `
		margin-left: ${props.theme.defaultUnit * 1}px;
		margin-right: ${props.theme.defaultUnit * 1}px;
	`};
	${props => props.marginHorizontal && props.marginHorizontal === 'medium' && `
		margin-left: ${props.theme.defaultUnit * 2.5}px;
		margin-right: ${props.theme.defaultUnit * 2.5}px;
	`};
	${props => props.marginHorizontal && props.marginHorizontal === 'big' && `
		margin-left: ${props.theme.defaultUnit * 6}px;
		margin-right: ${props.theme.defaultUnit * 6}px;
	`};

	/* Style for the top - bottom margin */
	${props => props.marginVertical && !isNaN(props.marginVertical) && `
		margin-top: ${props.theme.defaultUnit * props.marginVertical}px;
		margin-bottom: ${props.theme.defaultUnit * props.marginVertical}px;
	`};
	${props => props.marginVertical && props.marginVertical === 'small' && `
		margin-top: ${props.theme.defaultUnit * 1}px;
		margin-bottom: ${props.theme.defaultUnit * 1}px;
	`};
	${props => props.marginVertical && props.marginVertical === 'medium' && `
		margin-top: ${props.theme.defaultUnit * 2.5}px;
		margin-bottom: ${props.theme.defaultUnit * 2.5}px;
	`};
	${props => props.marginVertical && props.marginVertical === 'big' && `
		margin-top: ${props.theme.defaultUnit * 6}px;
		margin-bottom: ${props.theme.defaultUnit * 6}px;
	`};

	/* Style for the whole margins */
	${props => props.margin !== undefined && !isNaN(props.margin) && `margin: ${props.theme.defaultUnit * props.margin}px;`};
	${props => props.margin !== undefined && props.margin === 'small' && `margin: ${props.theme.defaultUnit * 1}px;`};
	${props => props.margin !== undefined && props.margin === 'medium' && `margin: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.margin !== undefined && props.margin === 'big' && `margin: ${props.theme.defaultUnit * 6}px;`};

	/* ************************************************************************
	**	Gestion du padding
	************************************************************************ */
	/* Style for the top padding */
	${props => props.paddingTop !== undefined && !isNaN(props.paddingTop) && `padding-top: ${props.theme.defaultUnit * props.paddingTop}px;`};
	${props => props.paddingTop !== undefined && props.paddingTop === 'small' && `padding-top: ${props.theme.defaultUnit * 1}px;`};
	${props => props.paddingTop !== undefined && props.paddingTop === 'medium' && `padding-top: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.paddingTop !== undefined && props.paddingTop === 'big' && `padding-top: ${props.theme.defaultUnit * 6}px;`};
	${props => props.pt !== undefined && !isNaN(props.pt) && `padding-top: ${props.theme.defaultUnit * props.pt}px;`};
	${props => props.pt !== undefined && props.pt === 'small' && `padding-top: ${props.theme.defaultUnit * 1}px;`};
	${props => props.pt !== undefined && props.pt === 'medium' && `padding-top: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.pt !== undefined && props.pt === 'big' && `padding-top: ${props.theme.defaultUnit * 6}px;`};

	/* Style for the bottom padding */
	${props => props.paddingBottom !== undefined && !isNaN(props.paddingBottom) && `padding-bottom: ${props.theme.defaultUnit * props.paddingBottom}px;`};
	${props => props.paddingBottom !== undefined && props.paddingBottom === 'small' && `padding-bottom: ${props.theme.defaultUnit * 1}px;`};
	${props => props.paddingBottom !== undefined && props.paddingBottom === 'medium' && `padding-bottom: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.paddingBottom !== undefined && props.paddingBottom === 'big' && `padding-bottom: ${props.theme.defaultUnit * 6}px;`};
	${props => props.pb !== undefined && !isNaN(props.pb) && `padding-bottom: ${props.theme.defaultUnit * props.pb}px;`};
	${props => props.pb !== undefined && props.pb === 'small' && `padding-bottom: ${props.theme.defaultUnit * 1}px;`};
	${props => props.pb !== undefined && props.pb === 'medium' && `padding-bottom: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.pb !== undefined && props.pb === 'big' && `padding-bottom: ${props.theme.defaultUnit * 6}px;`};

	/* Style for the whole paddings */
	${props => props.paddingLeft !== undefined && !isNaN(props.paddingLeft) && `padding-left: ${props.theme.defaultUnit * props.paddingLeft}px;`};
	${props => props.paddingLeft !== undefined && props.paddingLeft === 'small' && `padding-left: ${props.theme.defaultUnit * 1}px;`};
	${props => props.paddingLeft !== undefined && props.paddingLeft === 'medium' && `padding-left: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.paddingLeft !== undefined && props.paddingLeft === 'big' && `padding-left: ${props.theme.defaultUnit * 6}px;`};
	${props => props.pl !== undefined && !isNaN(props.pl) && `padding-left: ${props.theme.defaultUnit * props.pl}px;`};
	${props => props.pl !== undefined && props.pl === 'small' && `padding-left: ${props.theme.defaultUnit * 1}px;`};
	${props => props.pl !== undefined && props.pl === 'medium' && `padding-left: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.pl !== undefined && props.pl === 'big' && `padding-left: ${props.theme.defaultUnit * 6}px;`};

	/* Style for the whole paddings */
	${props => props.paddingRight !== undefined && !isNaN(props.paddingRight) && `padding-right: ${props.theme.defaultUnit * props.paddingRight}px;`};
	${props => props.paddingRight !== undefined && props.paddingRight === 'small' && `padding-right: ${props.theme.defaultUnit * 1}px;`};
	${props => props.paddingRight !== undefined && props.paddingRight === 'medium' && `padding-right: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.paddingRight !== undefined && props.paddingRight === 'big' && `padding-right: ${props.theme.defaultUnit * 6}px;`};
	${props => props.pr !== undefined && !isNaN(props.pr) && `padding-right: ${props.theme.defaultUnit * props.pr}px;`};
	${props => props.pr !== undefined && props.pr === 'small' && `padding-right: ${props.theme.defaultUnit * 1}px;`};
	${props => props.pr !== undefined && props.pr === 'medium' && `padding-right: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.pr !== undefined && props.pr === 'big' && `padding-right: ${props.theme.defaultUnit * 6}px;`};

	/* Style for the left - right padding */
	${props => props.paddingHorizontal !== undefined && !isNaN(props.paddingHorizontal) && `
		padding-left: ${props.theme.defaultUnit * props.paddingHorizontal}px;
		padding-right: ${props.theme.defaultUnit * props.paddingHorizontal}px;
	`};
	${props => props.paddingHorizontal !== undefined && props.paddingHorizontal === 'small' && `
		padding-left: ${props.theme.defaultUnit * 1}px;
		padding-right: ${props.theme.defaultUnit * 1}px;
	`};
	${props => props.paddingHorizontal !== undefined && props.paddingHorizontal === 'medium' && `
		padding-left: ${props.theme.defaultUnit * 2.5}px;
		padding-right: ${props.theme.defaultUnit * 2.5}px;
	`};
	${props => props.paddingHorizontal !== undefined && props.paddingHorizontal === 'big' && `
		padding-left: ${props.theme.defaultUnit * 6}px;
		padding-right: ${props.theme.defaultUnit * 6}px;
	`};

	/* Style for the top - bottom padding */
	${props => props.paddingVertical !== undefined && !isNaN(props.paddingVertical) && `
		padding-top: ${props.theme.defaultUnit * props.paddingVertical}px;
		padding-bottom: ${props.theme.defaultUnit * props.paddingVertical}px;
	`};
	${props => props.paddingVertical !== undefined && props.paddingVertical === 'small' && `
		padding-top: ${props.theme.defaultUnit * 1}px;
		padding-bottom: ${props.theme.defaultUnit * 1}px;
	`};
	${props => props.paddingVertical !== undefined && props.paddingVertical === 'medium' && `
		padding-top: ${props.theme.defaultUnit * 2.5}px;
		padding-bottom: ${props.theme.defaultUnit * 2.5}px;
	`};
	${props => props.paddingVertical !== undefined && props.paddingVertical === 'big' && `
		padding-top: ${props.theme.defaultUnit * 6}px;
		padding-bottom: ${props.theme.defaultUnit * 6}px;
	`};

	/* Style for the whole paddings */
	${props => props.padding !== undefined && !isNaN(props.padding) && `padding: ${props.theme.defaultUnit * props.padding}px;`};
	${props => props.padding !== undefined && props.padding === 'small' && `padding: ${props.theme.defaultUnit * 1}px;`};
	${props => props.padding !== undefined && props.padding === 'medium' && `padding: ${props.theme.defaultUnit * 2.5}px;`};
	${props => props.padding !== undefined && props.padding === 'big' && `padding: ${props.theme.defaultUnit * 6}px;`};

	${props => props.noHorizontalMargin && `margin-left: 0 !important; margin-right: 0 !important;`};
`;
