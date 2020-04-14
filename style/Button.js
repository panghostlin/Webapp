/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 16 March 2020 - 11:41:03
** @Filename:				Button.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 31 March 2020 - 13:21:04
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
		props.primary && props.theme.colors.primary ||
		props.secondary && props.theme.colors.white
	)};
	color: ${props => (
		props.primary && props.theme.colors.white ||
		props.secondary && props.theme.colors.neutral
	)};
	border: ${props => (
		props.primary && `1px solid ${props.primary && props.theme.colors.primary}` ||
		props.secondary && `1px solid ${props.theme.colors['neutral-20']}`
	)};

	&:hover {
		background-color: ${props => (
			props.primary && props.theme.colors['primary-80'] ||
			props.secondary && props.theme.colors.white
		)};
		color: ${props => (
			props.primary && props.theme.colors.white ||
			props.secondary && props.theme.colors.primary
		)};
		border: ${props => (
			props.primary && `1px solid ${props.primary && props.theme.colors['primary-80']}` ||
			props.secondary && `1px solid ${props.theme.colors.primary}`
		)};
	}
	&:focus {
		background-color: ${props => (
			props.primary && props.theme.colors.primary ||
			props.secondary && props.theme.colors.white
		)};
		color: ${props => (
			props.primary && props.theme.colors.white ||
			props.secondary && props.theme.colors.neutral
		)};
		border: ${props => (
			props.primary && `1px solid ${props.primary && props.theme.colors.primary}` ||
			props.secondary && `1px solid ${props.theme.colors['neutral-20']}`
		)};
	}
	&:disabled {
		background-color: ${props => (
			props.primary && props.theme.colors['neutral-disable'] ||
			props.secondary && props.theme.colors['neutral-40']
		)};
		border-color: ${props => (
			props.primary && props.theme.colors['neutral-disable'] ||
			props.secondary && props.theme.colors['neutral-40']
		)};
		color: ${props => (
			props.primary && props.theme.colors['white-40'] ||
			props.secondary && props.theme.colors['neutral-40']
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
		props.theme.colors[props.color] ||
		props.primary && props.theme.colors.white ||
		props.secondary && props.theme.colors['neutral-darker']
	)};

	&:hover {
		color: ${props => (
			props.primary && props.theme.colors.white ||
			props.secondary && props.theme.colors.white
		)};
	}
	&:focus {
		color: ${props => (
			props.theme.colors[props.color] ||
			props.primary && props.theme.colors.white ||
			props.secondary && props.theme.colors['neutral-darker']
		)};
	}
	&:disabled {
		color: ${props => (
			props.primary && props.theme.colors['neutral-40'] ||
			props.secondary && props.theme.colors['neutral-40']
		)};
	}
`);
