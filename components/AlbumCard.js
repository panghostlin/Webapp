/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 14 January 2020 - 20:49:04
** @Filename:				AlbumCard.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 09 March 2020 - 10:57:17
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
	border: 2px dashed #B5B7DF;
	color: #FFFFFF;
	font-size: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: 0.2s;
	&:hover {
		background-color: #B5B7DF80;
		cursor: pointer;
		border: 2px dashed transparent;
	}

`;
const	AlbumTitle = styled.p``;
const	AlbumDescription = styled.p``;
const	AlbumContainer = styled.div`
	width: 20vw;
	height: 20vw;
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
	background: #242a3b;
`;

function	Picture(props) {
	const	[isLoaded, set_isLoaded] = useState(false);
	const	[pictureData, set_pictureData] = useState(null);
	const	pictureRef = useRef();

	useEffect(() => {
		fetchPicture()
	}, [])

	async function	fetchPicture() {
		const	image = await API.GetImage(props.uri)
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
		return (
			<AlbumInner>
				<Picture uri={props.album.coverPicture} />
			</AlbumInner>
		);
	}


	return (
		<Link href={'/Albums/[album]'} as={`/Albums/${props.album.albumID}`}>
			<AlbumContainer>
				<AlbumImages>
					{rendeCover()}
				</AlbumImages>
				<AlbumTitle>{props.album.name}</AlbumTitle>
				<AlbumDescription>{`${props.album.NumberOfPictures || 0} photos - ${convertToMoment(props.album.creationTime)}`}</AlbumDescription>
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
						{'Créer un album +'}
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
