/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 14 January 2020 - 20:49:04
** @Filename:				AlbumCard.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 14 April 2020 - 14:46:26
*******************************************************************************/


import	React, {useState, useEffect, useRef}	from	'react';
import	Link							from	'next/link';
import	styled							from	'styled-components';
import	* as API						from	'../utils/API'

const	FullPicture = styled.img`
	contain: layout;
	width: 100%;
	height: 100%;
	transition: opacity 500ms ease 0ms;
	object-fit: cover;
`;
const	AlbumFake = styled.div`
	position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
	object-fit: cover;
	color: #FFFFFF;
	font-size: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: 0.2s;
	&:hover {
		background-color: ${props => props.theme.colors['neutral-darker']};
		cursor: pointer;
	}

`;
const	AlbumTitle = styled.p``;
const	AlbumDescription = styled.p``;
const	AlbumContainer = styled.div`
	width: calc(20.1vw);
	height: calc(20.1vw);
	margin: 0.6vw;
	border-radius: 4px;
	max-width: ${props => props.isPreview ? 'unset' : '100%'};
	min-width: ${props => props.isPreview ? 'unset' : '300px'};
	cursor: ${props => props.isPreview ? 'default' : 'pointer'};
	/* margin-bottom: 32px; */

	& ${FullPicture}.last {
		filter: ${props => (props.isPreview ? 'brightness(0.5)' : 'unset')};
	}

	& > ${AlbumTitle} {
		font-style: normal;
		font-weight: 600;
		font-size: 18px;
		color: #FFFFFF;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-transform: capitalize;
	}
	& > ${AlbumDescription} {
		font-size: 14px;
    	color: #767676;
		margin-top: 8px;
		overflow: hidden;
    	text-overflow: ellipsis;
    	white-space: nowrap;
	}
`;
const	AlbumImages = styled.div`
	position: relative;
    margin-bottom: 8px;
    padding-bottom: 70%;
	&:hover {
		& ${FullPicture} {
			opacity: ${props => (props.isPreview ? 1 : 0.85)};
		}
	}
`;
const	AlbumInner = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	border-radius: 6px;
	overflow: hidden;
	transition: all .1s ease-in-out;
	background: ${props => props.theme.colors.neutral};
	border: 2px solid ${props => props.theme.colors['neutral-darker']};

`;

function	Picture(props) {
	const	[isLoaded, set_isLoaded] = useState(false);
	const	[pictureData, set_pictureData] = useState(null);
	const	pictureRef = useRef();

	useEffect(() => {
		fetchPicture()
	}, [])

	async function	fetchPicture() {
		const	image = await API.GetImage(props.uri, null, 'max500')
		set_pictureData(image);
	}

	return (
		<FullPicture
			ref={pictureRef}
			alt={'coverPicture'}
			onLoad={(e) => {
				set_isLoaded(true);
				URL.revokeObjectURL(pictureData);
				URL.revokeObjectURL(e.target.src);
			}}
			style={{opacity: isLoaded ? 1 : 0}}
			src={pictureData} />
	);
};

function	AlbumsCard(props) {
	function	convertToMoment(toConvert) {
		const	date = toConvert ? new Date(toConvert) : new Date();
		const	months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

		const	day = date.getDate();
		const	month = months[date.getMonth()];
		const	year = date.getFullYear();
		return (`${day} ${month} ${year}`);
	}

	function	rendeCover() {
		if (props.album.coverPicture === undefined) {
			return (<AlbumInner />);
		}
		return (
			<AlbumInner>
				<Picture uri={props.album.coverPicture} />
			</AlbumInner>
		);
	}

	if (!props.album.NumberOfPictures || props.album.NumberOfPictures === 0) {
		return (
			<Link href={'/albums/[album]'} as={`/albums/${props.album.albumID}`}>
				<AlbumContainer>
					<AlbumImages>
						{rendeCover()}
					</AlbumImages>
					<AlbumTitle>{props.album.name}</AlbumTitle>
					<AlbumDescription>{`No picture - ${convertToMoment(props.album.creationTime)}`}</AlbumDescription>
				</AlbumContainer>
			</Link>
		);
	}
	else if (props.album.NumberOfPictures === 1) {
		return (
			<Link href={'/albums/[album]'} as={`/albums/${props.album.albumID}`}>
				<AlbumContainer>
					<AlbumImages>
						{rendeCover()}
					</AlbumImages>
					<AlbumTitle>{props.album.name}</AlbumTitle>
					<AlbumDescription>{`1 picture - ${convertToMoment(props.album.creationTime)}`}</AlbumDescription>
				</AlbumContainer>
			</Link>
		);
	}
	return (
		<Link href={'/albums/[album]'} as={`/albums/${props.album.albumID}`}>
			<AlbumContainer>
				<AlbumImages>
					{rendeCover()}
				</AlbumImages>
				<AlbumTitle>{props.album.name}</AlbumTitle>
				<AlbumDescription>{`${props.album.NumberOfPictures} pictures - ${convertToMoment(props.album.creationTime)}`}</AlbumDescription>
			</AlbumContainer>
		</Link>
	);
}
function	AlbumsCardPreviewFake(props) {
	return (
		<AlbumContainer onClick={props.onClick}>
			<AlbumImages>
				<AlbumInner>
					<AlbumFake>
						{'Create new album'}
					</AlbumFake>
				</AlbumInner>
			</AlbumImages>
		</AlbumContainer>
	);
}

function	AlbumsCardPreview(props) {
	const	album = props.album;

	function	rendeCover() {
		return (
			<AlbumInner>
				<FullPicture
					alt={`${album.name} image 1`}
					src={`${API}/downloadPicture/max500/${album.coverPicture}`} />
			</AlbumInner>
		);
	}

	return (
		<AlbumContainer isPreview>
			<AlbumImages>
				{rendeCover()}
			</AlbumImages>
		</AlbumContainer>
	);
}

export {AlbumsCardPreview, AlbumsCardPreviewFake};
export default AlbumsCard;
