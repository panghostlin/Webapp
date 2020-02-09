/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 16:57:52
** @Filename:				Upload.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 03 February 2020 - 16:58:10
*******************************************************************************/

import	styled						from	'styled-components';

const	GgUpload = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 16px;
    height: 6px;
    border: 2px solid;
    border-top: 0;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    margin-top: 8px;
	color: #FFFFFF;

	&::after {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 8px;
		height: 8px;
		border-left: 2px solid;
		border-top: 2px solid;
		transform: rotate(45deg);
		left: 2px;
		bottom: 4px;
	}
	&::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		border-radius: 3px;
		width: 2px;
		height: 10px;
		background: currentColor;
		left: 5px;
		bottom: 3px;
	}
`;

export default GgUpload;
