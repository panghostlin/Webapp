/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 18:18:09
** @Filename:				Albums.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 03 February 2020 - 18:28:30
*******************************************************************************/

import	styled							from	'styled-components';

const	GgAlbumSize = 2;
const	GgAlbum = styled.div`
    box-sizing: border-box;
	position: relative;
	display: block;
	width: calc(20px * ${GgAlbumSize});
	height: calc(16px * ${GgAlbumSize});
	border-left: calc(7px * ${GgAlbumSize}) solid transparent;
	border-right: calc(3px * ${GgAlbumSize}) solid transparent;
	border-bottom: calc(8px * ${GgAlbumSize}) solid transparent;
	box-shadow: 0 0 0 2px,
		inset 4px 2px 0 -2px,
		inset -4px 2px 0 -2px;
	border-radius: 2px;
	color: #FFFFFF;

	&::after, &::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 2px;
		height: 14px;
		background: currentColor;
		transform: rotate(46deg);
		top: 6px;
		right: 14px;
	}
	&::after {
		transform: rotate(-46deg);
   		right: 4px;
	}
`;

export default GgAlbum;
