/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 16:55:44
** @Filename:				Image.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 03 February 2020 - 18:39:10
*******************************************************************************/

import	styled					from	'styled-components';

const	GgImageSize = 2;
const	GgImage = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: calc(20px * ${GgImageSize});
    height: calc(16px * ${GgImageSize});
    overflow: hidden;
	box-shadow: 0 0 0 2px;
	border-radius: 2px;
	color: #FFFFFF;
	cursor: pointer;
	
	&::after {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		border: 2px solid;
		transform: rotate(45deg);
		border-radius: calc(3px * ${GgImageSize});
		width: calc(16px * ${GgImageSize});
		height: calc(16px * ${GgImageSize});
		top: calc(9px * ${GgImageSize});
		left: calc(6px * ${GgImageSize});
	}

	&::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		border: 2px solid;
		width: calc(6px * ${GgImageSize});
		height: calc(6px * ${GgImageSize});
		border-radius: 100%;
		top: calc(2px * ${GgImageSize});
		left: calc(2px * ${GgImageSize});
	}
`;

export default GgImage;
