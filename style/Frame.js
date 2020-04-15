/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 30 March 2020 - 13:21:47
** @Filename:				Frame.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 17:57:45
*******************************************************************************/

import	styled					from	'styled-components';
import  {Container as DefaultContainer, Row as DefaultRow, Col as DefaultCol}	from	'react-awesome-styled-grid'
import	{Default}				from	'./Global';

export const	Col = Default.withComponent(styled(DefaultCol)`
	background-color: ${props => props.theme.colors[props.theme.mode][props.background] || props.background || 'unset'};
`);
export const	Row = Default.withComponent(styled(DefaultRow)`
	background-color: ${props => props.theme.colors[props.theme.mode][props.background] || props.background || 'unset'};
`);
export const	Container = Default.withComponent(styled(DefaultContainer)`
	background-color: ${props => props.theme.colors[props.theme.mode][props.background] || props.background || 'unset'};
`);
export const	Section = Default.withComponent(styled(DefaultContainer).attrs({as: 'section'})`
	background-color: ${props => props.theme.colors[props.theme.mode][props.background] || props.background || 'unset'};
`);
export const	PageContainer = Default.withComponent(styled(DefaultContainer).attrs({as: 'main'})`
	padding-left: 0 !important;
	padding-right: 0 !important;
	overflow: hidden;
`);

export const	Div = Default.withComponent(styled(DefaultContainer)`
	background-color: ${props => props.theme.colors[props.theme.mode][props.background] || props.background || 'unset'};
`);
