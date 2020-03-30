/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Saturday 14 March 2020 - 12:40:11
** @Filename:				RotateLeft.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Saturday 14 March 2020 - 12:45:37
*******************************************************************************/

import	styled							from	'styled-components';

const	GgRotateLeft = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 14px;
    height: 14px;
    border: 2px solid;
    border-left-color: transparent;
    border-radius: 100px;
    transform: scale(${props => props.size || 1});
	color: #FFFFFF;
	&::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 6px;
		height: 6px;
		border-top: 2px solid;
		border-left: 2px solid;
		top: -3px;
		left: -1px;
		transform: rotate(-68deg);
	}
`;

export default GgRotateLeft;
