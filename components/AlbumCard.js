/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 14 January 2020 - 20:49:04
** @Filename:				AlbumCard.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 18 February 2020 - 16:36:00
*******************************************************************************/


import	React							from	'react';
import	Link							from	'next/link';
import	styled							from	'styled-components';
import	Img								from	'./Img';
import	{API}							from	'../utils/API'

const	Image = styled(Img)`
	position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
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

	& ${Image}.last {
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
    box-shadow: 0 8px 10px -2px rgba(0,0,0,.45);
	&:hover {
		& ${Image} {
			opacity: ${props => (props.isPreview ? 1 : 0.85)};
		}
	}
`;

const	LeftImage = styled.div``;
const	RightImages = styled.div``;
const	AlbumInner = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	border-radius: 6px;
	perspective: 1px;
	overflow: hidden;
	transition: all .1s ease-in-out;

	& > ${LeftImage} {
		width: 70%;
		background: #f5f5f5;
		position: relative;
	}
	& > ${RightImages} {
		display: flex;
		flex-direction: column;
		width: 30%;
		margin-left: 2px;
		position: relative;
		& > div:first-child {
			margin-bottom: 2px;
		}
		& > div {
			flex-grow: 1;
			background: #f5f5f5;
			position: relative;
		}
	}
`;
const	MoreCounter = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
	text-shadow: 0 1px 1px rgba(0,0,0, 0.15);
`;

function	AlbumsCard(props) {
	const	album = props.album;

	function	convertToMoment(toConvert) {
		const	date = toConvert ? new Date(toConvert) : new Date();
		const	months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

		const	day = date.getDate();
		const	month = months[date.getMonth()];
		const	year = date.getFullYear();
		return (`${day} ${month} ${year}`);
	}

	function	rendeCover() {
		if (album.coverPicture0ID && album.coverPicture1ID && album.coverPicture2ID) {
			return (
				<AlbumInner>
					<LeftImage>
						<Image
							alt={`${album.name} image 1`}
							src={`${API}/downloadPicture/500x500/${album.coverPicture0ID}`} />
					</LeftImage>
					<RightImages>
						<div>
							<Image
								alt={`${album.name} image 2`}
								src={`${API}/downloadPicture/500x500/${album.coverPicture1ID}`} />
						</div>
						<div>
							<Image
								alt={`${album.name} image 3`}
								src={`${API}/downloadPicture/500x500/${album.coverPicture2ID}`} />
						</div>
					</RightImages>
				</AlbumInner>
			);
		}
		return (
			<AlbumInner>
				<Image
					alt={`${album.name} image 1`}
					srcErr={`https://source.unsplash.com/500x500/?${album.name}`}
					src={`${API}/downloadPicture/500x500/${album.coverPicture0ID}`} />
			</AlbumInner>
		);
	}


	return (
		<Link href={'/Albums/[album]'} as={`/Albums/${album.albumID}`}>
			<AlbumContainer>
				<AlbumImages>
					{rendeCover()}
				</AlbumImages>
				<AlbumTitle>{album.name}</AlbumTitle>
				<AlbumDescription>{`${album.NumberOfPictures || 0} photos - ${convertToMoment(album.creationTime)}`}</AlbumDescription>
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
		if (album.coverPicture0ID && album.coverPicture1ID && album.coverPicture2ID) {
			return (
				<AlbumInner>
					<LeftImage>
						<Image alt={`${album.name} image 1`} src={`${API}/downloadPicture/500x500/${album.coverPicture0ID}`} />
					</LeftImage>
					<RightImages>
						<div>
							<Image alt={`${album.name} image 2`} src={`${API}/downloadPicture/500x500/${album.coverPicture1ID}`} />
						</div>
						<div>
							<Image className={album.selectedCount > 3 && 'last'} alt={`${album.name} image 3`} src={`${API}/downloadPicture/500x500/${album.coverPicture2ID}`} />
							<MoreCounter>{album.selectedCount > 3 ? `+ ${album.selectedCount - 3}` : ''}</MoreCounter>
						</div>
					</RightImages>
				</AlbumInner>
			);
		}
		return (
			<AlbumInner>
				<Image
					alt={`${album.name} image 1`}
					src={`${API}/downloadPicture/500x500/${album.coverPicture0ID}`} />
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
