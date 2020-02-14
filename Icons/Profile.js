/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 14 February 2020 - 16:08:03
** @Filename:				Profile.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Friday 14 February 2020 - 16:09:50
*******************************************************************************/

import	styled							from	'styled-components';

const	GgProfile = styled.div`
    display: block;
    box-sizing: border-box;
    border: 2px solid;
    border-radius: 100px;
	overflow: hidden;
    width: 22px;
    height: 22px;
    position: relative;
    transform: scale(${props => props.size || 1});
	color: ${props => props.color || '#FFFFFF'};
	&::after {
		content: "";
		position: absolute;
		top: 2px;
		left: 5px;
		width: 8px;
		height: 8px;
		display: block;
		box-sizing: border-box;
		border: 2px solid;
		border-radius: 100px;
		border-radius: 200px;
		top: 12px;
		left: -2px;
		width: 22px;
		height: 22px;
	}
	&::before {
		content: "";
		position: absolute;
		top: 2px;
		left: 5px;
		width: 8px;
		height: 8px;
		display: block;
		box-sizing: border-box;
		border: 2px solid;
		border-radius: 100px;
	}
`;

export default GgProfile;
