/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 17:34:00
** @Filename:				Add.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 18:29:50
*******************************************************************************/

import	styled							from	'styled-components';

const	GgAdd = styled.div`
    display: block;
    box-sizing: border-box;
    background: currentColor;
    border-radius: 10px;
	margin-top: -2px;
    position: relative;
    transform: scale(var(--ggs,1));
    width: 16px;
    height: 2px;
	color: ${props => props.theme.colors[props.theme.mode].neutral};

	&::after {
		display: block;
		box-sizing: border-box;
		background: currentColor;
		border-radius: 10px;
		content: "";
		position: absolute;
		width: 2px;
		height: 16px;
		top: -7px;
		left: 7px;
	}
`;

export default GgAdd;
