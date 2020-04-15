/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Thursday 12 March 2020 - 13:08:21
** @Filename:				Time.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 18:33:10
*******************************************************************************/

import	styled							from	'styled-components';

const	GgTime = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(${props => props.size || 1});
    width: 18px;
    height: 18px;
    border-radius: 100%;
    border: 2px solid transparent;
    box-shadow: 0 0 0 2px currentColor;
	color: ${props => props.theme.colors[props.theme.mode].secondary};

	&::after {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 7px;
		height: 7px;
		border-left: 2px solid;
		border-bottom: 2px solid;
		top: 1px;
		left: 5px;
	}
`;

export default GgTime;
