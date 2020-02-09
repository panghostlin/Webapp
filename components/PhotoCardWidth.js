/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 15:40:21
** @Filename:				PhotoCard.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Sunday 09 February 2020 - 18:19:30
*******************************************************************************/

import	React, {useState, useEffect, useRef}	from	'react';
import	styled									from	'styled-components';
import	useIntersectionObserver					from	'../hooks/useIntersectionObserver';
import ContentLoader from 'react-content-loader'

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
	margin: 4px;
	cursor: pointer;
	position: relative;
	display: block;
	overflow: hidden;
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
	height: -webkit-fill-available;
	overflow: hidden;
	border-radius: 4px;
`;

const	Picture = React.memo((props) => {
	const [isLoaded, set_isLoaded] = useState(false);

	return (
		<React.Fragment>
			<ContentLoader 
				speed={2}
				width={'100%'}
				height={props.height}
				backgroundColor="#2E3056"
				foregroundColor="#343660"
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
				onLoad={() => set_isLoaded(true)}
				style={{opacity: isLoaded ? 1 : 0}}
				alt={props.alt}
				src={props.uri} />
		</React.Fragment>
	)
});

// function	PhotoCardWidth(props) {
const PhotoCardWidth = React.memo((props) => {
	const	imageRef = useRef();
	const	[visible, set_visible] = useState(false);
	const	[height, set_height] = useState(props.height);
	const	[width, set_width] = useState(props.width);

	useEffect(() => {
		const	maxWidth = window.innerWidth * 80 / 100; //size of content : 80%
		if (props.width > maxWidth) {
			set_height(600 * props.height / props.width);
			set_width(600);
			return undefined;
		}
		if (props.height > 400) {
			set_height(300);
			set_width(300 * props.width / props.height);
		} else {
			set_height(props.height);
			set_width(props.width > 600 ? 600 : props.width);
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
