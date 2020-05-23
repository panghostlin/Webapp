/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 09 February 2020 - 13:42:24
** @Filename:				PictureLightroom.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 10 March 2020 - 11:04:00
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	styled, {css, keyframes}		from	'styled-components';
import	* as API						from	'../utils/API';
import	useLockBodyScroll				from	'../hooks/useLockBodyScroll';
import	usePrevious						from	'../hooks/usePrevious';
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
const	hideFromSideRule = css`${hideFromSide} 0.4s;`;

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
const	FrontPicture = styled(LightroomImage)`
	animation: ${props => props.isSide ? hideFromSideRule : 'none'};
	opacity: ${props => props.isSide ? 0 : 1};
`;
const	NextPicture = styled(LightroomImage)`
	animation: ${props => props.isLoaded ? slideFromRightRule : 'none'};
	left: ${props => props.isLoaded ? 0 : `100%`};
`;
const	PreviousPicture = styled(LightroomImage)`
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
	const	[isReady, set_isReady] = useState(false);
	const	[index, set_index] = useState(props.originalIndex);
	const	[isLoaded, set_isLoaded] = useState(false);
	const	[shouldPushSideRight, set_shouldPushSideRight] = useState(false);
	const	[shouldPushSideLeft, set_shouldPushSideLeft] = useState(false);
	const	[optionRatio, set_optionRatio] = useState('contain');
	const	[optionVisible, set_optionVisible] = useState('visible');

	const	[currentPicture, set_currentPicture] = useState({});
	const	[previousPicture, set_previousPicture] = useState({});
	const	[nextPicture, set_nextPicture] = useState({});

	const	previousIndex = usePrevious(index)

	const	mapping = [];
	useEffect(() => {
		fetchPicture()
		return (() => {
			mapping.forEach(e => URL.revokeObjectURL(e))
		})
	}, [])

	useEffect(() => {
		if (previousIndex > index) { //the previous button was pressed, only no need for next (is current)
			fetchPrevious();
		} else if (previousIndex < index) {
			fetchNext();
		}
	}, [index])
	//create mapping with blobs uri

	async function	fetchPicture() {
		const	[_currentPicture, _currentPreview] = await API.GetImage(props.list[index].uri, null, 'original')
		set_currentPicture(_currentPicture);
		mapping.push(_currentPicture);

		if (hasNext()) {
			const	[_nextPicture, _nextPreview] = await API.GetImage(props.list[index + 1].uri, null, 'original')
			set_nextPicture(_nextPicture);
			mapping.push(_nextPicture);
		}

		if (hasPrevious()) {
			const	[_previousPicture, _previousPreview] = await API.GetImage(props.list[index - 1].uri, null, 'original')
			set_previousPicture(_previousPicture);
			mapping.push(_previousPicture);
		}
		set_isReady(true)
	}
	async function	fetchPrevious() {
		if (hasPrevious()) {
			const	[_previousPicture, _previousPreview] = await API.GetImage(props.list[index - 1].uri, null, 'original')
			set_previousPicture(_previousPicture);
			mapping.push(_previousPicture);
		}
	}
	async function	fetchNext() {
		if (hasNext()) {
			const	[_nextPicture, _nextPreview] = await API.GetImage(props.list[index + 1].uri, null, 'original')
			set_nextPicture(_nextPicture);
			mapping.push(_nextPicture);
		}
	}

	const		hasPrevious = () => index - 1 >= 0;
	function	onClickPrevious() {
		if (hasPrevious()) {
			set_shouldPushSideLeft(true);
			setTimeout(() => {
				set_shouldPushSideLeft(false);
				set_nextPicture(currentPicture);
				set_currentPicture(previousPicture);
				set_index(index - 1);
			}, 400);
		}
	}
	const		hasNext = () => index + 1 < props.list.length;
	function	onClickNext() {
		if (hasNext()) {
			set_shouldPushSideRight(true);
			setTimeout(() => {
				set_shouldPushSideRight(false);
				set_previousPicture(currentPicture);
				set_currentPicture(nextPicture);
				set_index(index + 1);
			}, 400);
		}
	}

	function	renderImages() {
		if (!isReady)
			return null

		return (<>
			<FrontPicture
				key={index}
				ratio={optionRatio}
				visible={optionVisible}
				isLoaded={isLoaded}
				isSide={shouldPushSideRight || shouldPushSideLeft}
				onLoad={(e) => {
					if (!isLoaded)
						set_isLoaded(true);
				}}
				src={currentPicture} />

			{hasPrevious() && previousPicture && <PreviousPicture
				key={`${previousPicture}_${index}`}
				ratio={optionRatio}
				visible={optionVisible}
				isLoaded={shouldPushSideLeft}
				src={previousPicture} />}
			{hasNext() && nextPicture && <NextPicture
				key={`${nextPicture}_${index}`}
				ratio={optionRatio}
				visible={optionVisible}
				isLoaded={shouldPushSideRight}
				src={nextPicture} />}
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
				<GgTrash onClick={() => props.onDeletePicture(props.list[index])} />
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
