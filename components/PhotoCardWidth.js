/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 15:40:21
** @Filename:				PhotoCard.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 14 April 2020 - 14:37:56
*******************************************************************************/

import	React, {useState, useEffect, useRef}	from	'react';
import	styled									from	'styled-components';
import	* as API								from	'../utils/API';
import	useEffectOnce							from	'../hooks/useEffectOnce';
import	useIntersectionObserver					from	'../hooks/useIntersectionObserver';
import { Blurhash } from "react-blurhash";

import { decode } from "blurhash";


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
	top: 0;
	width: 100%;
	height: 100%;
	transition: opacity 500ms ease 0ms;
	object-fit: cover;
	&::selection {background: transparent;}
`;
const	Preview = styled(Blurhash)`
	contain: strict;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	transition: opacity 500ms ease 0ms;
	object-fit: cover;
	&::selection {background: transparent;}
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

function	Picture(props) {
	const	[isLoaded, set_isLoaded] = useState(false);
	const	[pictureData, set_pictureData] = useState(null);
	const	[previewHash, set_previewHash] = useState('');
	const	pictureRef = useRef();

	useEffect(() => {
		if (props.visible && !pictureData) {
			fetchPicture()
		}
	}, [props.visible])

	async function	fetchPicture() {
		API.GetPreview(props.uri, props.signal, 'max500').then((preview) => {
			set_previewHash(preview);
		})
		const	[image, _] = await API.GetImage(props.uri, props.signal, 'max500')
		set_pictureData(image);
	}

	return (
		<>
			{previewHash && <Preview
				style={{opacity: !isLoaded ? 1 : 0, position: 'absolute'}}
				hash={previewHash}
				width={props.width}
				height={props.height}
				resolutionX={32}
				resolutionY={32}
				punch={1} />}

		{pictureData && <FullPicture
				ref={pictureRef}
				onLoad={(e) => {
					set_isLoaded(true);
					URL.revokeObjectURL(pictureData);
					URL.revokeObjectURL(e.target.src);
				}}
				style={{opacity: isLoaded ? 1 : 0}}
				alt={props.alt}
				src={pictureData} />}
		</>
	)
};

function	PhotoCardWidth(props) {
	const	imageRef = useRef();
	const	[shouldDisplay, set_shouldDisplay] = useState(false);
	const	[visible, set_visible] = useState(false);
	const	[height, set_height] = useState(props.height);
	const	[width, set_width] = useState(props.width);
	const	controller = new AbortController();
	const	signal = controller.signal;

	useEffectOnce(() => controller.abort())

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
		} else if (_height > 400) {
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
			if (isIntersecting && visible === false) {
				set_visible(true);
				set_shouldDisplay(true);
				// observerElement.unobserve(imageRef.current);
			} else if (!isIntersecting && visible === true) {
				controller.abort();
				set_visible(false);
			}
		}
	});

	return (
		<CardContainer
			key={props.uri}
			style={{width: width - 4, height: height - 4}}
			onClick={props.isSelectMode ? props.onToggle : props.onClick}>
			<Toggle
				isSelectMode={props.isSelectMode}
				onClick={(e) => {e.stopPropagation(); props.onToggle()}}
				isSelected={props.isSelected} />
			<PhotoContainer ref={imageRef} height={height}>
				{shouldDisplay && <Picture
					visible={visible}
					height={height}
					width={width}
					signal={signal} {...props} />}
			</PhotoContainer>
			<Background isSelectMode={props.isSelectMode} />
		</CardContainer>
	);
};

export default PhotoCardWidth;
