/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 30 March 2020 - 13:09:49
** @Filename:				References.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 18:34:07
*******************************************************************************/

const	default_unit = 16;
const	pixel_rem_ratio = 1 / default_unit;

/* ****************************************************************************
**	Définission des couleurs de base.
**	Références selon Figma.
**	Accès par `props.theme.colors[props.theme.mode].XXXX` ou `props.theme.colors[props.theme.mode]['XXXX']`
**************************************************************************** */
const	colors = {
	white: '#FFFFFF',
	dark: {
		neutral: '#242E42',
		'neutral-lighter': '#2F3B52',
		'neutral-darker': '#20293C',
		'neutral-disable': '#44556B',
		'neutral-90': 'rgba(36, 46, 66, 0.9)',
		'neutral-80': 'rgba(36, 46, 66, 0.8)',
		'neutral-60': 'rgba(36, 46, 66, 0.6)',
		'neutral-40': 'rgba(36, 46, 66, 0.4)',
		'neutral-20': 'rgba(36, 46, 66, 0.2)',
		'neutral-15': 'rgba(36, 46, 66, 0.15)',
		'neutral-10': 'rgba(36, 46, 66, 0.1)',
		'neutral-5': 'rgba(36, 46, 66, 0.05)',

		// accent: '#EC407A',
		// 'accent-80': 'rgba(236, 64, 122, 0.8)',
		// 'accent-60': 'rgba(236, 64, 122, 0.6)',
		// 'accent-40': 'rgba(236, 64, 122, 0.4)',
		// 'accent-20': 'rgba(236, 64, 122, 0.2)',
		// 'accent-15': 'rgba(236, 64, 122, 0.15)',
		// 'accent-10': 'rgba(236, 64, 122, 0.1)',
		// 'accent-5': 'rgba(236, 64, 122, 0.05)',

		accent: '#FFB74A',
		'accent-darker': '#FFFFFF80',
		'accent-80': 'rgba(255, 183, 74, 0.8)',
		'accent-60': 'rgba(255, 183, 74, 0.6)',
		'accent-40': 'rgba(255, 183, 74, 0.4)',
		'accent-20': 'rgba(255, 183, 74, 0.2)',
		'accent-15': 'rgba(255, 183, 74, 0.15)',
		'accent-10': 'rgba(255, 183, 74, 0.1)',
		'accent-5': 'rgba(255, 183, 74, 0.05)',
		
		secondary: '#FFFFFF',
		'secondary-80': 'rgba(255, 255, 255, 0.8)',
		'secondary-60': 'rgba(255, 255, 255, 0.6)',
		'secondary-40': 'rgba(255, 255, 255, 0.4)',
		'secondary-20': 'rgba(255, 255, 255, 0.2)',
		'secondary-15': 'rgba(255, 255, 255, 0.15)',
		'secondary-10': 'rgba(255, 255, 255, 0.1)',
		'secondary-5': 'rgba(255, 255, 255, 0.05)',

		white: '#FFFFFF',
		'white-80': 'rgba(255, 255, 255, 0.8)',
		'white-60': 'rgba(255, 255, 255, 0.6)',
		'white-40': 'rgba(255, 255, 255, 0.4)',
		'white-20': 'rgba(255, 255, 255, 0.2)',
		'white-15': 'rgba(255, 255, 255, 0.15)',
		'white-10': 'rgba(255, 255, 255, 0.1)',
		'white-5': 'rgba(255, 255, 255, 0.05)',
	},
	light: {
		// neutral: '#ECEEF5',
		neutral: '#FFFFFF',
		'neutral-lighter': '#F5F6FA',
		'neutral-darker': '#BCC2D4',
		'neutral-disable': '#C4C9DD',
		'neutral-90': 'rgba(255, 255, 255, 0.9)',
		'neutral-80': 'rgba(255, 255, 255, 0.8)',
		'neutral-60': 'rgba(255, 255, 255, 0.6)',
		'neutral-40': 'rgba(255, 255, 255, 0.4)',
		'neutral-20': 'rgba(255, 255, 255, 0.2)',
		'neutral-15': 'rgba(255, 255, 255, 0.15)',
		'neutral-10': 'rgba(255, 255, 255, 0.1)',
		'neutral-5': 'rgba(255, 255, 255, 0.05)',

		accent: '#FFB74A',
		'accent-darker': '#FFFFFF80',
		'accent-80': 'rgba(255, 183, 74, 0.8)',
		'accent-60': 'rgba(255, 183, 74, 0.6)',
		'accent-40': 'rgba(255, 183, 74, 0.4)',
		'accent-20': 'rgba(255, 183, 74, 0.2)',
		'accent-15': 'rgba(255, 183, 74, 0.15)',
		'accent-10': 'rgba(255, 183, 74, 0.1)',
		'accent-5': 'rgba(255, 183, 74, 0.05)',

		secondary: '#3A4975',
		'secondary-90': 'rgba(58, 73, 117, 0.9)',
		'secondary-80': 'rgba(58, 73, 117, 0.8)',
		'secondary-60': 'rgba(58, 73, 117, 0.6)',
		'secondary-40': 'rgba(58, 73, 117, 0.4)',
		'secondary-20': 'rgba(58, 73, 117, 0.2)',
		'secondary-15': 'rgba(58, 73, 117, 0.15)',
		'secondary-10': 'rgba(58, 73, 117, 0.1)',
		'secondary-5': 'rgba(58, 73, 117, 0.05)',

		white: '#FFFFFF',
		'white-80': 'rgba(255, 255, 255, 0.8)',
		'white-60': 'rgba(255, 255, 255, 0.6)',
		'white-40': 'rgba(255, 255, 255, 0.4)',
		'white-20': 'rgba(255, 255, 255, 0.2)',
		'white-15': 'rgba(255, 255, 255, 0.15)',
		'white-10': 'rgba(255, 255, 255, 0.1)',
		'white-5': 'rgba(255, 255, 255, 0.05)',

	}
}

/* ****************************************************************************
**	Awesome-styled-grid default props
**	Configuration du composant awesome-styled-grid pour overwrite les 
**	configurations de bases.
**	Les configurations initiales peuvent être trouvées ici :
**	https://awesome-styled-grid.netlify.com/custom#default-values
**	Les configurations initiale sont copiées dans la configuration custom.
**************************************************************************** */
const	CustomAwesomeGrid = {
    mediaQuery: 'only screen',
    columns: {
		xs: 4,
		sm: 8,
		md: 12,
		lg: 12,
		xl: 12,
    },
    gutterWidth: {
		xs: 2,// default = 1,
		sm: 2,// default = 1,
		md: 2,// default = 1.5,
		lg: 2,// default = 1.5,
		xl: 2,// default = 1.5, SAME AS LG
    },
    paddingWidth: {
		xs: 1, // default = 1,
		sm: 1, // default = 1,
		md: 1, // default = 1.5,
		lg: 1, // default = 1.5,
		xl: 1, // default = 1.5, SAME AS LG
    },
    container: {
		xs: 'full',
		sm: 'full',
		md: 43,
		lg: 60,
		xl: 71.25, 
    },
    breakpoints: {
		xs: 1,
		sm: 33.75,
		md: 45,
		lg: 60,
		xl: 71.25,
		// xl: 69, SAME AS LG
	},
};

/* ****************************************************************************
**	Exportation du thème par defaut en reprenant les informations au dessus.
**	En d'autre terme, assemblage du thème
**************************************************************************** */
const	DefaultTheme = {
	defaultUnit: default_unit,
	pixelRemRatio: pixel_rem_ratio,
	mode: 'dark',
	colors,
}

export {CustomAwesomeGrid, DefaultTheme};
