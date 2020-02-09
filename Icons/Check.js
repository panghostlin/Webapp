/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 19:27:54
** @Filename:				Check.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 04 February 2020 - 18:29:19
*******************************************************************************/

import	styled							from	'styled-components';

const	GgCheck = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(${props => props.size || 1});
    width: 22px;
    height: 22px;
    border: ${props => props.outline ? '2px solid transparent' : '2px solid'};
    border-radius: 100px;
	color: ${props => props.color || '#FFFFFF'};
	cursor: ${props => props.disable ? 'default' : 'pointer'};

	&:hover {
		color: ${props => props.hoverColor || '#FFFFFF'};
	}

	&::after {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		left: 3px;
		top: -1px;
		width: 6px;
		height: 10px;
		border-width: 0 2px 2px 0;
		border-style: solid;
		transform-origin: bottom left;
		transform: rotate(45deg);
	}
`;

export default GgCheck;
