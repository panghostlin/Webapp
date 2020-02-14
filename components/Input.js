/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 07 January 2020 - 12:30:19
** @Filename:				Input.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Friday 14 February 2020 - 17:40:46
*******************************************************************************/

import styled from 'styled-components';

const	Input = styled.input`
	color: #FFFFFF;
	cursor: pointer;
	font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	font-size: 18px;
	width: 100%;
	margin-bottom: 16px;
	display: block;
	min-width: 0;
	outline: none;
	background: #00000030;
	border: none;
	box-shadow: unset;
	border-radius: 4px;
	padding: 12px;
	padding-right: ${props => (props.full && props.withIcon ? '56px' : 'unset')};
	min-height: unset;
	box-sizing: border-box;
`;
const	FakeInput = styled.div`
	color: #FFFFFF;
	cursor: pointer;
	font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	font-size: ${props => props.font || '18px'};
	width: 100%;
	margin-bottom: 16px;
	display: block;
	min-width: 0;
	outline: none;
	background: #00000030;
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
	color: ${props => props.isOk === false && props.value.length > 0 ? '#FE0000' : '#FFFFFF'};
	font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	font-size: 14px;
	margin-top: 0px;
	margin-bottom: 8px;
	padding-left: 3px;
`;

export {FakeInput, InputLabel};
export default Input;
