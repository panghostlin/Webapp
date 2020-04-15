/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 17:34:00
** @Filename:				Add.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 18:33:08
*******************************************************************************/

import	styled							from	'styled-components';

const	GgTrash = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,1));
    width: 10px;
    height: 12px;
    border: 2px solid transparent;
    box-shadow:
        0 0 0 2px,
        inset -2px 0 0,
        inset 2px 0 0;
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    margin-top: 4px;
	color: ${props => props.theme.colors[props.theme.mode].secondary};
	&::after, &::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
	}
	&::after {
		background: currentColor;
		border-radius: 3px;
		width: 16px;
		height: 2px;
		top: -4px;
		left: -5px;
	}
	&::before {
		width: 10px;
		height: 4px;
		border: 2px solid;
		border-bottom: transparent;
		border-top-left-radius: 2px;
		border-top-right-radius: 2px;
		top: -7px;
		left: -2px
	}
`;

export default GgTrash;
