/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 16 March 2020 - 11:41:03
** @Filename:				Button.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 30 March 2020 - 14:53:52
*******************************************************************************/

import	styled					from	'styled-components';
import	{Default}				from	'./Global';

export const	Button = Default.withComponent(styled.button`
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
			props.primary && props.theme.colors['primary-darker'] ||
			props.secondary && props.theme.colors['primary-5']
		)};
		color: ${props => (
			props.primary && props.theme.colors.neutral ||
			props.secondary && props.theme.colors.primary
		)};
		border: ${props => (
			props.primary && 'none' ||
			props.secondary && `1px solid ${props.theme.colors.primary}`
		)};
	}
	&:disabled {
		color: ${props => (
			props.primary && props.theme.colors['neutral-40'] ||
			props.secondary && props.theme.colors['neutral-40']
		)};
		background-color: ${props => (
			props.primary && props.theme.colors['neutral-15'] ||
			props.secondary && props.theme.colors['neutral-15']
		)};
		&::after {
			content: none;
		}
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
		props.primary && props.theme.colors.white ||
		props.secondary && props.theme.colors['neutral-darker']
	)};

	&:hover {
		color: ${props => (
			props.primary && props.theme.colors.white ||
			props.secondary && props.theme.colors.primary
		)};
	}
	&:focus {
		color: ${props => (
			props.primary && props.theme.colors.neutral ||
			props.secondary && props.theme.colors.primary
		)};
	}
	&:disabled {
		color: ${props => (
			props.primary && props.theme.colors['neutral-40'] ||
			props.secondary && props.theme.colors['neutral-40']
		)};
	}
`);
