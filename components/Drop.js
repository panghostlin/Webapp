/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 07 January 2020 - 15:06:36
** @Filename:				Drop.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 15:42:16
*******************************************************************************/

import styled from 'styled-components';

const	DropContainer = styled.div`
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	border-radius: 4px;
	cursor: pointer;
	box-sizing: border-box;
	padding: 16px 32px;
	position: relative;
	margin-top: 32px;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 120px;
	border: none;
	background-color: #8083FF;
	color: #FFFFFF;
	margin-bottom: 32px;

	&:hover {
		background-color: #8083FF80;
		color: #FFFFFF;
	}
`;

export default DropContainer;
