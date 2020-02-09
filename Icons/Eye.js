/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 09 February 2020 - 14:05:01
** @Filename:				Eye.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Sunday 09 February 2020 - 15:14:38
*******************************************************************************/

import	React				from	'react';
import	styled				from	'styled-components';

const	GgEye = styled.div`
    position: relative;
    display: block;
    transform: scale(${props => props.size || 1});
    width: 24px;
    height: 18px;
    border-bottom-right-radius: 100px;
    border-bottom-left-radius: 100px;
    overflow: hidden;
    box-sizing: border-box;
	color: #FFFFFF;
	&::after, &::before {
		content: "";
		display: block;
		border-radius: 100px;
		position: absolute;
		box-sizing: border-box;
	}
	&::after {
		top: 2px;
		box-shadow:
			inset 0 -8px 0 2px,
			inset 0 0 0 2px;
		width: 24px;
		height: 24px;
	}
	&::before {
		width: 8px;
		height: 8px;
		border: 2px solid;
		bottom: 4px;
		left: 8px;
	}
`;

function	EyeClose(props) {
	const	GgEyeCloseContainer = styled.div`
		position: relative;
		&::after {
			content: '';
			box-sizing: border-box;
			position: relative;
			display: block;
    		transform: rotate(25deg) scale(${props => props.size || 1});
			width: 2px;
			height: 22px;
			background: #FFFFFF;
			border-radius: 3px;
			position: absolute;
			bottom: 0;
			top: 0;
			left: 11px;
		}
	`;
	return (
		<GgEyeCloseContainer>
			<GgEye {...props} />
		</GgEyeCloseContainer>
	)
}

export {EyeClose};
export default GgEye;
