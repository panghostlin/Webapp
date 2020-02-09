/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 16:54:01
** @Filename:				Heart.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 03 February 2020 - 17:01:49
*******************************************************************************/

import	styled					from	'styled-components';

const	GgHeart = styled.div`
    border: 2px solid;
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    width: 10px;
    height: 8px;
    border-bottom: 0;
    box-sizing: border-box;
    position: relative;
    transform: translate(calc(-10px / 2 * 2), calc(-6px / 2 * 2)) rotate(-45deg) scale(2);
    display: block;
	color: #2E3056;

	&::after {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		border: 2px solid;
		border-top-left-radius: 100px;
		border-top-right-radius: 100px;
		width: 10px;
		height: 8px;
		border-bottom: 0;
		right: -9px;
		transform: rotate(90deg);
		top: 5px;
	}
	&::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 11px;
		height: 11px;
		border-left: 2px solid;
		border-bottom: 2px solid;
		left: -2px;
		top: 3px;
	}
`;

export default GgHeart;