/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 17:28:38
** @Filename:				Cross.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Sunday 09 February 2020 - 13:49:30
*******************************************************************************/

import	styled							from	'styled-components';

const	GgClose = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(${props => props.size || 1});
    width: 22px;
    height: 22px;
    border: 2px solid transparent;
    border-radius: 40px;
	color: #FFFFFF;
	&::after, &::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 16px;
		height: 2px;
		background: currentColor;
		transform: rotate(45deg);
		border-radius: 5px;
		top: 8px;
		left: 1px;
	}
	&::after {
    	transform: rotate(-45deg)
	}
`;

export default GgClose;
