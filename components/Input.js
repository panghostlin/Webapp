/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 07 January 2020 - 12:30:19
** @Filename:				Input.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 17:08:58
*******************************************************************************/

import styled from 'styled-components';

const	Input = styled.input`
	color: ${props => (props.theme.colors[props.theme.mode].secondary)};
	cursor: pointer;
	font-size: 18px;
	width: 100%;
	margin-bottom: 16px;
	display: block;
	min-width: 0;
	outline: none;
	background: ${props => props.theme.mode === 'dark' ? props.theme.colors.dark['neutral-darker'] : props.theme.colors[props.theme.mode]['white']};
	border: none;
	border: 1px solid ${props => props.theme.colors[props.theme.mode]['neutral-darker']};
	box-shadow: unset;
	border-radius: 4px;
	padding: 12px;
	padding-right: ${props => (props.full && props.withIcon ? '56px' : 'unset')};
	min-height: unset;
	box-sizing: border-box;
`;
const	FakeInput = styled.div`
	color: ${props => (props.theme.colors[props.theme.mode].secondary)};
	cursor: pointer;
	font-size: ${props => props.font || '18px'};
	width: 100%;
	margin-bottom: 16px;
	display: block;
	min-width: 0;
	outline: none;
	background: ${props => props.theme.mode === 'dark' ? props.theme.colors.dark['neutral-darker'] : props.theme.colors.light['white']};
	border: none;
	box-shadow: unset;
	border-radius: 4px;
	padding: 12px;
	padding-right: ${props => (props.full && props.withIcon ? '56px' : 'unset')};
	min-height: unset;
	box-sizing: border-box;
	word-break: break-word;
`;
const	InputLabel = styled.p`
	color: ${props => (
		(props.isOk === false && props.value.length > 0) && '#EF5350' ||
		(props.theme.mode === 'light' && props.theme.colors.light['neutral']) ||
		(props.theme.mode === 'dark' && props.theme.colors.dark['secondary-40'])
	)};
	font-size: 14px;
	margin-top: 0px;
	margin-bottom: 8px;
	padding-left: 3px;
`;

export {FakeInput, InputLabel};
export default Input;
