/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 17:34:00
** @Filename:				Add.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Sunday 09 February 2020 - 11:45:10
*******************************************************************************/

import	styled							from	'styled-components';

const	GgArrowRight = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 22px;
    height: 22px;
    border: 2px solid;
    transform: scale(${props => props.size || 1});
	color: ${props => props.color || '#FFFFFF'};
    border-radius: 20px;
	&::after {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		right: 4px;
		width: 6px;
		height: 6px;
		border-top: 2px solid;
		border-right: 2px solid;
		transform: rotate(45deg);
		bottom: 6px;
	}
	&::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		right: 4px;
		width: 10px;
		height: 2px;
		bottom: 8px;
		background: currentColor;
	}
`;

export default GgArrowRight;
