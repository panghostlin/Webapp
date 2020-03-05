/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 15:40:21
** @Filename:				PhotoCard.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 04 March 2020 - 23:12:30
*******************************************************************************/

import	React, {useState, useEffect, useRef}	from	'react';
import	styled									from	'styled-components';
import	ContentLoader							from	'react-content-loader'
import	* as API								from	'../utils/API';
import	useIntersectionObserver					from	'../hooks/useIntersectionObserver';

const	Toggle = styled.div`
	cursor: pointer;
	mask: ${props => props.isSelected ? `url('/static/icons/checked.svg')` : `url('/static/icons/unchecked.svg')`};
	width: 30px;
	height: 30px;
	background-color: ${props => props.isSelected ? '#FFFFFF' : '#FFFFFF90'};
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
	position: absolute;
	z-index: 101;
   	top: 15px;
	left: 15px;
	display: none;
	${props => props.isSelectMode === true && `display: flex;`};

	&:hover {
		background-color: ${props => props.isSelected ? '#FFFFFF' : '#FFFFFF'};
	}
`;
const	Background = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	justify-content: center;
	align-items: center;
	background: #00000033;
	z-index: ${props => props.isSelectMode ? 100 : -1};
	cursor: pointer;
`;
const	CardContainer = styled.div`
	contain: layout;
	width: ${props => `${props.width - 4}px`};
	height: ${props => `${props.height - 4}px`};
	margin: 8px;
	cursor: pointer;
	position: relative;
	display: block;
	overflow: hidden;
	border-radius: 4px;
	&:hover > ${Toggle} {
		display: flex;
	}
	&:hover::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: ${props => `${props.height - 4}px`};
		justify-content: center;
		align-items: center;
		background: #00000033;
		z-index: 100;
		cursor: pointer;
	}
	
`;
const	FullPicture = styled.img`
	contain: strict;
	position: absolute;
	left: 0;
	width: 100%;
	height: 100%;
	transition: opacity 300ms ease 0ms;
	object-fit: cover;
	&::selection {background:transparent;}
`;
const	PhotoContainer = styled.div`
	contain: strict;
	position: relative;
	opacity: ${props => `${props.opacity}`};
	height: 100%;
	height: -webkit-fill-available;
	overflow: hidden;
	border-radius: 4px;
`;

const	Picture = React.memo((props) => {
	const	[isLoaded, set_isLoaded] = useState(false);
	const	[pictureData, set_pictureData] = useState({});

	useEffect(() => {fetchPicture()}, [])

	async function	fetchPicture() {
		const	image = await API.GetImage(props.uri)
		set_pictureData(image);
	}

	return (
		<React.Fragment>
			<ContentLoader 
				speed={2}
				width={'100%'}
				height={props.height}
				backgroundColor="#242a3b"
				foregroundColor="#191c28"
				preserveAspectRatio="none"
				style={{visibility: isLoaded ? "hidden" : "visible"}}> 
				<rect
					x={'0'}
					y={'0'}
					rx={'2'}
					ry={'2'}
					width={'100%'}
					height={props.height}
					preserveAspectRatio={'none'} />
			</ContentLoader>
			<FullPicture
				onLoad={(e) => {
					set_isLoaded(true);
					URL.revokeObjectURL(e.target.src);
					URL.revokeObjectURL(pictureData.src);
				}}
				style={{opacity: isLoaded ? 1 : 0}}
				alt={props.alt}
				src={pictureData.src} />
		</React.Fragment>
	)
});

const PhotoCardWidth = React.memo((props) => {
	const	imageRef = useRef();
	const	[visible, set_visible] = useState(false);
	const	[height, set_height] = useState(props.height);
	const	[width, set_width] = useState(props.width);

	useEffect(() => {
		let	_width = props.width;
		let	_height = props.height;

		if (props.width > props.originalWidth)
			_width = props.originalWidth
		if (props.height > props.originalHeight)
			_height = props.originalHeight

		const	maxWidth = window.innerWidth * 80 / 100; //size of content : 80%
		if (_width > maxWidth) {
			set_height(600 * _height / _width);
			set_width(600);
			return undefined;
		}
		if (_height > 400) {
			set_height(300);
			set_width(300 * _width / _height);
		} else {
			set_height(_height);
			set_width(_width > 600 ? 600 : _width);
		}
	}, [props.width])

	useIntersectionObserver({
		target: imageRef,
		onIntersect: ([{isIntersecting}], observerElement) => {
			if (isIntersecting) {
				set_visible(true);
				observerElement.unobserve(imageRef.current);
			}
		}
	});

	return (
		<CardContainer
			key={props.uri}
			height={height}
			width={width}
			onClick={props.isSelectMode ? props.onToggle : props.onClick}>
			<Toggle
				isSelectMode={props.isSelectMode}
				onClick={(e) => {e.stopPropagation(); props.onToggle()}}
				isSelected={props.isSelected} />
			<PhotoContainer ref={imageRef} height={height}>
				{visible && <Picture height={height} {...props} />}
			</PhotoContainer>
			<Background isSelectMode={props.isSelectMode} />
		</CardContainer>
	);
});

export default PhotoCardWidth;
