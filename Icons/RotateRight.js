/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Saturday 14 March 2020 - 12:40:11
** @Filename:				RotateRight.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 18:33:13
*******************************************************************************/

import	styled							from	'styled-components';

const	GgRotateRight = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 14px;
    height: 14px;
    border: 2px solid;
    border-right-color: transparent;
    border-radius: 100px;
    transform: scale(${props => props.size || 1});
	color: ${props => props.theme.colors[props.theme.mode].secondary};
	&::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 6px;
		height: 6px;
		border-top: 2px solid;
		border-right: 2px solid;
		top: -3px;
		right: -1px;
		transform: rotate(68deg);
	}
`;

export default GgRotateRight;
