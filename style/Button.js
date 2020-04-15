/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 16 March 2020 - 11:41:03
** @Filename:				Button.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 15:55:48
*******************************************************************************/

import	styled					from	'styled-components';
import	{Default}				from	'./Global';

export const	Button = Default.withComponent(styled.button`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: ${props => props.fluid ? '100%' : 'fit-content'};
	padding-top: ${props => `${props.large ? 16 : 12}px`};
	padding-bottom: ${props => `${props.large ? 16 : 12}px`};
	padding-left: ${props => `${props.large ? 20 : 16}px`};
	padding-right: ${props => `${props.large ? 20 : 16}px`};
	font-size: ${props => `${props.large ? props.theme.pixelRemRatio * 18 : props.theme.pixelRemRatio * 16}rem`};
	transition: 0.1s;
	outline: none;
	cursor: pointer;
	font-weight: 600;
	border-radius: 4px;
	font-variant: all-small-caps;
	letter-spacing: 1.1px;
	
	background-color: ${props => (
		props.primary && props.theme.colors[props.theme.mode].accent ||
		props.secondary && props.theme.colors[props.theme.mode].secondary
	)};
	color: ${props => (
		props.primary && props.theme.colors[props.theme.mode].white ||
		props.secondary && props.theme.colors[props.theme.mode].neutral
	)};
	border: ${props => (
		props.primary && `1px solid ${props.primary && props.theme.colors[props.theme.mode].accent}` ||
		props.secondary && `1px solid ${props.theme.colors[props.theme.mode]['neutral-20']}`
	)};

	&:hover {
		background-color: ${props => (
			props.primary && props.theme.colors[props.theme.mode]['accent-80'] ||
			props.secondary && props.theme.colors[props.theme.mode].secondary
		)};
		color: ${props => (
			props.primary && props.theme.colors[props.theme.mode].secondary ||
			props.secondary && props.theme.colors[props.theme.mode].accent
		)};
		border: ${props => (
			props.primary && `1px solid ${props.primary && props.theme.colors[props.theme.mode]['accent-80']}` ||
			props.secondary && `1px solid ${props.theme.colors[props.theme.mode].accent}`
		)};
	}
	&:focus {
		background-color: ${props => (
			props.primary && props.theme.colors[props.theme.mode].accent ||
			props.secondary && props.theme.colors[props.theme.mode].secondary
		)};
		color: ${props => (
			props.primary && props.theme.colors[props.theme.mode].secondary ||
			props.secondary && props.theme.colors[props.theme.mode].neutral
		)};
		border: ${props => (
			props.primary && `1px solid ${props.primary && props.theme.colors[props.theme.mode].accent}` ||
			props.secondary && `1px solid ${props.theme.colors[props.theme.mode]['neutral-20']}`
		)};
	}
	&:disabled {
		background-color: ${props => (
			props.primary && props.theme.colors[props.theme.mode]['accent-40'] ||
			props.secondary && props.theme.colors[props.theme.mode]['neutral-40']
		)};
		border-color: ${props => (
			props.primary && 'transparent' ||
			props.secondary && props.theme.colors[props.theme.mode]['neutral-40']
		)};
		color: ${props => (
			props.primary && props.theme.colors[props.theme.mode]['white-80'] ||
			props.secondary && props.theme.colors[props.theme.mode]['neutral-40']
		)};
	}
`);

export const	TextButton  = Default.withComponent(styled.button`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: fit-content;
	padding-top: ${props => `${props.large ? 16 : 12}px`};
	padding-bottom: ${props => `${props.large ? 16 : 12}px`};
	padding-left: ${props => `${props.large ? 20 : 16}px`};
	padding-right: ${props => `${props.large ? 20 : 16}px`};
	font-size: ${props => `${props.large ? props.theme.pixelRemRatio * 18 : props.theme.pixelRemRatio * 16}rem`};
	transition: 0.1s;
	outline: none;
	cursor: pointer;
	font-weight: 600;
	font-variant: all-small-caps;

	color: ${props => (
		props.theme.colors[props.theme.mode][props.color] ||
		props.primary && props.theme.colors[props.theme.mode].secondary ||
		props.secondary && props.theme.colors[props.theme.mode]['neutral-darker']
	)};

	&:hover {
		color: ${props => (
			props.primary && props.theme.colors[props.theme.mode].secondary ||
			props.secondary && props.theme.colors[props.theme.mode].secondary
		)};
	}
	&:focus {
		color: ${props => (
			props.theme.colors[props.theme.mode][props.color] ||
			props.primary && props.theme.colors[props.theme.mode].secondary ||
			props.secondary && props.theme.colors[props.theme.mode]['neutral-darker']
		)};
	}
	&:disabled {
		color: ${props => (
			props.primary && props.theme.colors[props.theme.mode]['neutral-40'] ||
			props.secondary && props.theme.colors[props.theme.mode]['neutral-40']
		)};
	}
`);
