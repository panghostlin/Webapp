/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 30 March 2020 - 13:09:49
** @Filename:				References.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 30 March 2020 - 14:47:45
*******************************************************************************/

const	default_unit = 16;
const	pixel_rem_ratio = 1 / default_unit;

/* ****************************************************************************
**	Définission des couleurs de base.
**	Références selon Figma.
**	Accès par `props.theme.colors.XXXX` ou `props.theme.colors['XXXX']`
**************************************************************************** */
const	colors = {

	neutral: '#242E42',
	'neutral-lighter': '#2F3B52',
	'neutral-darker': '#20293C',
	

	primary: '#EC407A',
	'primary-80': 'rgba(236, 64, 122, 0.8)',
	'primary-60': 'rgba(236, 64, 122, 0.6)',
	'primary-40': 'rgba(236, 64, 122, 0.4)',
	'primary-20': 'rgba(236, 64, 122, 0.2)',
	'primary-15': 'rgba(236, 64, 122, 0.15)',
	'primary-10': 'rgba(236, 64, 122, 0.1)',
	'primary-5': 'rgba(236, 64, 122, 0.05)',
	
	secondary: '#F9CB40',
	'secondary-lighter': '#FFDF6B',
	'secondary-darker': '#D4A42C',
	'neutral-80': 'rgba(0, 53, 67, 0.8)',
	'neutral-60': 'rgba(0, 53, 67, 0.6)',
	'neutral-40': 'rgba(0, 53, 67, 0.4)',
	'neutral-20': 'rgba(0, 53, 67, 0.2)',
	'neutral-15': 'rgba(0, 53, 67, 0.15)',
	'neutral-10': 'rgba(0, 53, 67, 0.1)',
	'neutral-5': 'rgba(0, 53, 67, 0.05)',
	white: '#FFFFFF',
	'white-80': 'rgba(255, 255, 255, 0.8)',
	'white-60': 'rgba(255, 255, 255, 0.6)',
	'white-40': 'rgba(255, 255, 255, 0.4)',
	'white-20': 'rgba(255, 255, 255, 0.2)',
	'white-15': 'rgba(255, 255, 255, 0.15)',
	'white-10': 'rgba(255, 255, 255, 0.1)',
	'white-5': 'rgba(255, 255, 255, 0.05)',
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
	colors,
}

export {CustomAwesomeGrid, DefaultTheme};
