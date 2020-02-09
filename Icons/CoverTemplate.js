/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 16:56:40
** @Filename:				Gallery.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 03 February 2020 - 18:39:17
*******************************************************************************/

import	styled					from	'styled-components';

const	GgCoverTemplateSize = 1;
const	GgCoverTemplate = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: calc(20px * ${GgCoverTemplateSize});
    height: calc(16px * ${GgCoverTemplateSize});
	color: ${props => props.color || '#FFFFFF'};
	cursor: pointer;

	&::after {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		height: calc(14px * ${GgCoverTemplateSize});
		background: currentColor;
		top: 0;
		left: 0;
    	width: calc(12px * ${GgCoverTemplateSize});
	}
	&::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		height: calc(6px * ${GgCoverTemplateSize});
		background: currentColor;
		box-shadow: 0 calc(8px * ${GgCoverTemplateSize}) 0;
		top: 0;
		right: 0;
    	width: calc(6px * ${GgCoverTemplateSize});
	}
`;

export default GgCoverTemplate;
