/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 09 February 2020 - 13:50:14
** @Filename:				Ratio.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Sunday 09 February 2020 - 13:54:20
*******************************************************************************/

import	styled							from	'styled-components';

const	GgRatioOut = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(${props => props.size || 1});
    width: 24px;
    height: 20px;
    border: 2px solid;
    border-radius: 4px;
	color: #FFFFFF;
	&::after, &::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 6px;
		height: 6px;
	}
	&::after {
		border-top: 2px solid;
		border-left: 2px solid;
		top: 2px;
		left: 2px;
	}
	&::before {
		border-bottom: 2px solid;
		border-right: 2px solid;
		top: 8px;
		left: 12px;
	}
`;

const	GgRatioIn = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(${props => props.size || 1});
    width: 24px;
    height: 20px;
    border: 2px solid;
    border-radius: 4px;
	color: #FFFFFF;
	&::after, &::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 6px;
		height: 6px;
	}
	&::before {
		border-top: 2px solid;
		border-left: 2px solid;
		top: 8px;
		left: 12px;
	}
	&::after {
		border-bottom: 2px solid;
		border-right: 2px solid;
		top: 2px;
		left: 2px;
	}
`;

export {GgRatioIn};
export default GgRatioOut;
