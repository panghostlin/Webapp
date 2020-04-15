/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 17:06:02
** @Filename:				ToastUpload.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 15:42:25
*******************************************************************************/

import	react, {useEffect, useState}	from	'react';
import	styled, {css, keyframes}		from	'styled-components';
import	GgCheck							from	'../Icons/Check';

const	animation = keyframes`
	0% {bottom: -120px;}
	100 {bottom: 0;}
`
const	animationRule = css`${animation} 0.6s;`

const	ToastUploadContainer = styled.div`
	position: fixed;
    overflow: visible;
    bottom: 0;
    left: 0;
    z-index: ${props => props.zIndex};
    min-width: 288px;
    max-width: 568px;
    right: auto;
	padding: 16px;
	animation: ${props => props.animated ? animationRule : 'none'};
	${props => props.closing && 'animation-direction: reverse'};
	${props => props.closing && 'animation-play-state: running'};
`;

const	ToastUploadElement = styled.div`
	background-color: #FFFFFF;
    box-shadow: 0 8px 10px -5px rgba(0,0,0,0.2), 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12);
    display: flex;
    min-height: 96px;
    overflow: hidden;
    width: 328px;
	border-radius: 8px;
`;

const	ToastLeftPart = styled.div`
    border-radius: 3px 0 0 3px;
    height: 96px;
    width: 96px;
    min-width: 96px;
	background: #388B89;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const	ToastUploadMeta = styled.div`
    padding: 8px 16px;
	font-size: 14px;
	color: #3C4043;
	position: relative;
	width: 100%;
`;
const	UploadStatus = styled.p`
	padding: 0;
	margin: 0;
	font-size: 14px;
	color: #3C4043;
	font-weight: 700;
	width: 100%;
`;


let		isAnimatedTimeout = null;
let		isDisplayedTimeout = null;
let		isMountedTimeout = null;
let		zIndex = 500;
function	ToastSuccess(props) {

	const	[isMounted, set_isMounted] = useState(false);
	const	[isDisplayed, set_isDisplayed] = useState(false);
	const	[isAnimated, set_isAnimated] = useState(true);
	const	[currentZIndex, set_currentZIndex] = useState(zIndex);

	useEffect(() => {
		if (props.isOpen === true) {
			set_currentZIndex(++zIndex);
			set_isMounted(true);
			set_isDisplayed(true);
			isAnimatedTimeout = setTimeout(() => set_isAnimated(false), 1000);
			isDisplayedTimeout = setTimeout(() => {
				set_isDisplayed(false);
				set_isAnimated(true);
			}, 3000);
			isMountedTimeout = setTimeout(() => {
				set_isMounted(false);
				props.onClose();
			}, 3600);
		}
		return () => {
			clearTimeout(isAnimatedTimeout);
			clearTimeout(isDisplayedTimeout);
			clearTimeout(isMountedTimeout);
		}
	}, [props.isOpen]);

	useEffect(() => {
		clearTimeout(isAnimatedTimeout);
		clearTimeout(isDisplayedTimeout);
		clearTimeout(isMountedTimeout);
		isAnimatedTimeout = setTimeout(() => set_isAnimated(false), 1000);
		isDisplayedTimeout = setTimeout(() => {
			set_isDisplayed(false);
			set_isAnimated(true);
		}, 3000);
		isMountedTimeout = setTimeout(() => {
			set_isMounted(false);
			props.onClose();
		}, 3600);
		return () => {
			clearTimeout(isAnimatedTimeout);
			clearTimeout(isDisplayedTimeout);
			clearTimeout(isMountedTimeout);
		}
	}, [props.status]);

	if (!isMounted)
		return (null);

	return (
		<ToastUploadContainer
			zIndex={currentZIndex}
			animated={isAnimated}
			closing={!isDisplayed}>
			<ToastUploadElement>
				<ToastLeftPart>
					<GgCheck color={'#FFFFFF'} size={3} />
				</ToastLeftPart>
				<ToastUploadMeta>
					<UploadStatus>{props.status}</UploadStatus>
				</ToastUploadMeta>
			</ToastUploadElement>
		</ToastUploadContainer>
	)
}

export default ToastSuccess;
