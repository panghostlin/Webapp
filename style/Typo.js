/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 30 March 2020 - 13:37:32
** @Filename:				Typo.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 30 March 2020 - 14:44:15
*******************************************************************************/

import	styled					from	'styled-components';
import	{Default}				from	'./Global';

const	DefaultTypo = Default.withComponent(styled.p`
	color: ${props => props.theme.colors[props.color] || props.color || props.theme.colors.neutral};
	text-align: ${props => props.align || 'inherit'};
	text-decoration: ${props => props.as === 'a' ? 'underline' : 'unset'};
	cursor: ${props => props.as === 'a' ? 'pointer' : 'unset'};
`);

export const	H1 = styled(DefaultTypo).attrs(props => ({as: props.as || 'h1'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 48}rem;`};
	font-weight: bold;
	line-height: 125%;
	letter-spacing: -1.5px;
`;
export const	H2 = styled(DefaultTypo).attrs(props => ({as: props.as || 'h2'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 36}rem;`};
	line-height: 125%;
	font-weight: bold;
`;
export const	H3 = styled(DefaultTypo).attrs(props => ({as: props.as || 'h3'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 24}rem;`};
	line-height: 150%;
	font-weight: bold;
`;
export const	H4 = styled(DefaultTypo).attrs(props => ({as: props.as || 'h4'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 21}rem;`};
	line-height: 150%;
	font-weight: bold;
`;
export const	H5 = styled(DefaultTypo).attrs(props => ({as: props.as || 'h5'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 15}rem;`};
	line-height: 150%;
	font-weight: bold;
	letter-spacing: 1px;
	text-transform: uppercase;
`;
export const	H6 = styled(DefaultTypo).attrs(props => ({as: props.as || 'h6'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 20}rem;`};
	font-weight: 175%;
	font-weight: bold;
`;

export const	P = styled(DefaultTypo).attrs(props => ({as: props.as || 'p'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 16}rem;`};
	font-weight: normal;
	line-height: 175%
`;

export const	PSmall = styled(DefaultTypo).attrs(props => ({as: props.as || 'p'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 14}rem;`};
	font-weight: normal;
	line-height: 160%;
`;
export const	Blockquote = styled(DefaultTypo).attrs(props => ({as: props.as || 'p'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 14}rem;`};
	font-style: italic;
	font-weight: normal;
	line-height: 160%;
`;

export const	FooterH5 = styled(DefaultTypo).attrs(props => ({as: props.as || 'h5'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 14}rem;`};
	font-weight: bold;
	line-height: 150%;
	letter-spacing: 1px;
	text-transform: uppercase;
`;
export const	FooterPSmall = styled(DefaultTypo).attrs(props => ({as: props.as || 'p'}))`
	font-size: ${props => `${props.theme.pixelRemRatio * 16}rem;`};
	color: ${props => props.theme.colors[props.color] || props.color || props.theme.colors['neutral-80']};
`;