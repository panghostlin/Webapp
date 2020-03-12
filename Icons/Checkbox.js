/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Thursday 12 March 2020 - 12:19:49
** @Filename:				Checkbox.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 12 March 2020 - 12:21:29
*******************************************************************************/

import	styled					from	'styled-components';

const	GgCheckbox = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 22px;
    height: 22px;
    border: 2px solid;
    transform: scale(${props => props.size || 1});
    border-radius: 4px;
	color: ${props => props.color || '#FFFFFF'};
	cursor: pointer;

	&::after {
		content: '';
		display: ${props => props.checked ? 'block' : 'none'};
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

export default GgCheckbox;
