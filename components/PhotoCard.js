/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 15:40:21
** @Filename:				PhotoCard.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 05 March 2020 - 12:08:20
*******************************************************************************/

import	React, {useState, useEffect, useRef}	from	'react';
import	styled									from	'styled-components';
import	useIntersectionObserver					from	'../hooks/useIntersectionObserver';
import	ContentLoader							from	'react-content-loader'

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
	&:hover {
		background-color: ${props => props.isSelected ? '#FFFFFF90' : '#FFFFFF'};
	}
`;
const	CardContainer = styled.div`
	padding-bottom: 24px;
	width: 100%;
	height: ${props => `${props.height}px`};
	/* height: ${props => `calc(${props.height}px + 24px)`}; */
	cursor: pointer;
	position: relative;
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
		height: ${props => `${props.height - 24}px`};
		justify-content: center;
		align-items: center;
		background: #00000033;
		z-index: 100;
		cursor: pointer;
	}
	${props => props.isSelectMode === true && `
		& > ${Toggle} {
			display: flex;
		}
		&::after {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 24px;
			width: 100%;
			height: ${props => `${props.height - 28}px`};
			justify-content: center;
			align-items: center;
			background: #00000033;
			z-index: 100;
			cursor: pointer;
		}
	`}
`;
const	FullPicture = styled.img`
	position: absolute;
	left: 0;
	width: 100%;
	height: 100%;
	transition: opacity 300ms ease 0ms;
	object-fit: cover;
`;
const	PhotoContainer = styled.div`
	position: relative;
	opacity: ${props => `${props.opacity}`};
	height: -webkit-fill-available;
	overflow: hidden;
	border-radius: 4px;
`;

function	Picture(props) {
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
				loading={'lazy'}
				onLoad={() => set_isLoaded(true)}
				style={{opacity: isLoaded ? 1 : 0}}
				alt={props.alt}
				src={props.uri} />
		</React.Fragment>
	)
}

function	PhotoCard(props) {
	const	imageRef = useRef();
	const	[visible, set_visible] = useState(false);
	const	[height, set_height] = useState(() => {
		const	url = new URL(props.uri);
		const	urlSearchImage = new URLSearchParams(url.search);
		const	imageHeight = urlSearchImage.get('h');
		return	imageHeight	|| -1
	});

	useEffect(() => {
		const	url = new URL(props.uri);
		const	urlSearchImage = new URLSearchParams(url.search);
		const	imageHeight = urlSearchImage.get('h');
		set_height(imageHeight)

	}, [props.uri])

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
			isSelectMode={props.isSelectMode}
			height={height}
			onClick={props.isSelectMode ? props.onToggle : null}>
			<Toggle onClick={(e) => {e.stopPropagation(); props.onToggle()}} isSelected={props.isSelected} />
			<PhotoContainer ref={imageRef} height={height}>
				{visible && <Picture height={height} {...props} />}
			</PhotoContainer>
		</CardContainer>
	);
}

export default PhotoCard;
