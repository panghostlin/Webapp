/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 17:34:00
** @Filename:				Add.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Sunday 09 February 2020 - 14:05:08
*******************************************************************************/

import	styled							from	'styled-components';

const	GgInfo = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 20px;
    height: 20px;
    border: 2px solid;
    border-radius: 40px;
    transform: scale(${props => props.size || 1});
	color: ${props => props.color || '#FFFFFF'};
	&::after {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		border-radius: 3px;
		width: 2px;
		background: currentColor;
		left: 7px;
		bottom: 2px;
    	height: 8px;
	}
	&::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		border-radius: 3px;
		width: 2px;
		background: currentColor;
		left: 7px;
		height: 2px;
    	top: 2px;
	}
`;

export default GgInfo;
