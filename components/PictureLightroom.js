/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 09 February 2020 - 13:42:24
** @Filename:				PictureLightroom.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Sunday 09 February 2020 - 15:16:54
*******************************************************************************/

import	React, {useState}				from	'react';
import	styled, {css, keyframes}		from	'styled-components';
import	* as API						from	'../utils/API';
import	useLockBodyScroll				from	'../hooks/useLockBodyScroll';
import	ArrowRight						from	'../Icons/ArrowRight';
import	ArrowLeft						from	'../Icons/ArrowLeft';
import	GgClose							from	'../Icons/Cross';
import	GgRatioOut, {GgRatioIn}			from	'../Icons/Ratio';
import	GgTrash							from	'../Icons/Trash';
import	EyeOpen, {EyeClose}				from	'../Icons/Eye';

const	slideFromRight = keyframes`0% {opacity: 0;left: 100%;} 100 {opacity: 1;left: 0;}`;
const	slideFromRightRule = css`${slideFromRight} 0.4s;`
const	slideFromLeft = keyframes`0% {opacity: 0;right: 100%;} 100 {opacity: 1;right: 0;}`;
const	slideFromLeftRule = css`${slideFromLeft} 0.4s;`

const	hideFromSide = keyframes`0% {opacity: 1;} 100 {opacity: 0;}`;
const	hideFromSideRule = css`${hideFromSide} 0.4s;`

const	RightPart = styled.div``;
const	LeftPart = styled.div``;
const	ViewContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #000000;
	z-index: 501;
	display: flex;
	justify-content: center;
	align-items: center;
	& > ${RightPart} {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		cursor: pointer;
		padding-right: 4.165%;
		&:hover {& > ${ArrowRight} {color: #FFFFFF;}}
		& > ${ArrowRight} {transition: 0.2s;}
	}
	& > ${LeftPart} {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		cursor: pointer;
		padding-left: 4.165%;
		&:hover {& > ${ArrowLeft} {color: #FFFFFF;}}
		& > ${ArrowLeft} {transition: 0.2s;}
	}
`;
const	LightroomImage = styled.img`
	contain: layout;
	object-fit: ${props => props.ratio || 'contain'};
	filter: ${props => props.visible === 'invisible' && 'blur(100px)'};
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	bottom: 0;
`;
const	FrontImage = styled(LightroomImage)`
	animation: ${props => props.isSide ? hideFromSideRule : 'none'};
	opacity: ${props => props.isSide ? 0 : 1};
`;
const	SideRightImage = styled(LightroomImage)`
	animation: ${props => props.isLoaded ? slideFromRightRule : 'none'};
	left: ${props => props.isLoaded ? 0 : `100%`};
`;
const	SideLeftImage = styled(LightroomImage)`
	animation: ${props => props.isLoaded ? slideFromLeftRule : 'none'};
	right: ${props => props.isLoaded ? 0 : `100%`};
`;
const	MenuContainer = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	height: 4.165%;
	padding-left: 16px;
	padding-right: 16px;
	display: flex;
	align-items: center;
	& > ${GgClose} {
		margin-right: auto;
	}
	& > div {
		cursor: pointer;
		margin: 0px 16px;
		transition: 0.2s;
		color: #FFFFFF80;
		&:hover {
			color: #FFFFFF;
			fill: #FFFFFF;
		}
	}
`;

function	PictureLightroom(props) {
	useLockBodyScroll();
	const	[index, set_index] = useState(props.originalIndex);
	const	[isLoaded, set_isLoaded] = useState(false);
	const	[shouldPushSideRight, set_shouldPushSideRight] = useState(false);
	const	[shouldPushSideLeft, set_shouldPushSideLeft] = useState(false);

	const	[optionRatio, set_optionRatio] = useState('contain');
	const	[optionVisible, set_optionVisible] = useState('visible');

	const		hasPrevious = () => index - 1 >= 0;
	function	onClickPrevious() {
		if (hasPrevious()) {
			set_shouldPushSideLeft(true);
			setTimeout(() => {
				set_index(index - 1);
				set_shouldPushSideLeft(false);
			}, 400);
		}
	}
	const		hasNext = () => index + 1 <= props.list.length;
	function	onClickNext() {
		if (hasNext()) {
			set_shouldPushSideRight(true);
			setTimeout(() => {
				set_index(index + 1);
				set_shouldPushSideRight(false);
			}, 400);
		}
	}

	function	renderImages() {
		return (<>
			<FrontImage
				key={index}
				
				ratio={optionRatio}
				visible={optionVisible}

				isLoaded={isLoaded}
				isSide={shouldPushSideRight || shouldPushSideLeft}
				onLoad={() => !isLoaded && set_isLoaded(true)}
				src={`${API.API}/downloadPicture/original/${props.list[index].uri}`} />

			{hasPrevious() && <SideLeftImage
				key={index - 1}
				
				ratio={optionRatio}
				visible={optionVisible}

				isLoaded={shouldPushSideLeft}
				src={`${API.API}/downloadPicture/original/${props.list[index - 1].uri}`} />}
			{hasNext() && <SideRightImage
				key={index + 1}
				
				ratio={optionRatio}
				visible={optionVisible}

				isLoaded={shouldPushSideRight}
				src={`${API.API}/downloadPicture/original/${props.list[index + 1].uri}`} />}
		</>);
	}
	function	renderNavigation() {
		return (<>
			<LeftPart onClick={onClickPrevious}>
				{hasPrevious() && <ArrowLeft size={2} color={'transparent'} />}
			</LeftPart>
			<RightPart onClick={onClickNext}>
				{hasNext() && <ArrowRight size={2} color={'transparent'} />}
			</RightPart>
		</>)
	}

	function	renderMenu() {
		return (
			<MenuContainer>
				<GgClose onClick={props.onClose} />
				{optionVisible === 'visible' ?
					<EyeOpen onClick={() => set_optionVisible('invisible')} /> :
					<EyeClose onClick={() => set_optionVisible('visible')} />
				}
				{optionRatio === 'contain' ?
					<GgRatioOut onClick={() => set_optionRatio('cover')} /> :
					<GgRatioIn onClick={() => set_optionRatio('contain')} />
				}
				<GgTrash onClick={() => props.onDeletePicture(props.list[index])}/>
			</MenuContainer>
		)
	}

	if (!props.list || !props.list[index])
		return (null);

		return (
		<ViewContainer>
			{renderImages()}
			{renderNavigation()}
			{renderMenu()}
		</ViewContainer>
	)
}
export default PictureLightroom;
