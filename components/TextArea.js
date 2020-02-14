/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 07 January 2020 - 12:30:19
** @Filename:				Input.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Friday 14 February 2020 - 17:31:35
*******************************************************************************/

import styled from 'styled-components';

const	TextArea = styled.textarea`
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

export default TextArea;
