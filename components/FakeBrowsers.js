/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 17 February 2020 - 15:46:38
** @Filename:				FakeBrowsers.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 18:37:45
*******************************************************************************/

import	React			from	'react';
import	styled			from	'styled-components';

const	backgroundPatterns = [
	require(`../static/images/fakePicture01.svg`),
	require(`../static/images/fakePicture02.svg`),
	require(`../static/images/fakePicture03.svg`),
	require(`../static/images/fakePicture06.svg`),
	require(`../static/images/fakePicture07.svg`),
	require(`../static/images/fakePicture08.svg`),
];

const	FakeBrowser = styled.div`
    width: 80%;
    margin: 0 auto;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
	flex-wrap: wrap;
    position: relative;
    -webkit-box-shadow: 0 80px 100px -24px rgba(0,0,0,0.45);
    box-shadow: 0 80px 100px -24px rgba(0,0,0,0.45);
	background: ${props => props.theme.colors[props.theme.mode]['neutral-lighter']};
	padding: 32px;
	padding-bottom: 50%;
	overflow: hidden;
	contain: strict;

	&::before {
		content: "";
		display: block;
		width: 8px;
		height: 8px;
		border-radius: 40px;
		position: absolute;
		top: 16px;
		left: 32px;
		background: #ff5f56;
		box-shadow: 16px 0px 0px #ffbd2e, 32px 0px 0px #27c93f;
		z-index: 2;
	}
	&::after {
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 36px;
		z-index: 1;
		background: ${props => props.theme.colors[props.theme.mode]['neutral']};
	}
`;
const	FakeBrowserPicture = styled.div`
    width: 100%;
	padding-bottom: 75%;
    border-radius: 4px;
	background-image: ${props => `url(${props.background})`};
	background-size: 120%;
	background-position-x: center;
	background-position-y: ${props => props.position || `0%`};
	background-repeat: none;
	cursor: pointer;
	display: flex;
	z-index: 1;
`;
const	FakeBrowserAlbum = styled.div`
    width: 30%;
    border-radius: 4px;
	& > p {
		color: ${props => props.theme.colors[props.theme.mode]['secondary']};
		font-size: 12px;
		margin-left: 4px;
		margin-top: 8px;
		border-radius: 4px;
	}
	& > span {
		color: #767676;
		font-size: 10px;
		margin-left: 4px;
		border-radius: 4px;
	}
`;
const	FakeBrowserFlyingButton = styled.div`
	position: absolute;
	right: 32px;
	bottom: 16px;
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background: ${props => props.theme.colors[props.theme.mode].accent};
	color: ${props => props.theme.colors[props.theme.mode].white};
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 3;
`;

function	FakeBrowserPictureWrapper(props) {
	return (
		<span>
			<FakeBrowserPicture {...props} />
		</span>
	)
}

function	GalleryFakeBrowser() {
	function	renderAlbums() {
		return (
			<>
				<FakeBrowserAlbum>
					<FakeBrowserPictureWrapper background={backgroundPatterns[0]} position={'bottom'} />
					<p>{'Japan 2020'}</p>
					<span>{'6 pictures - 20/01/2020'}</span>
				</FakeBrowserAlbum>

				<FakeBrowserAlbum>
					<FakeBrowserPictureWrapper background={backgroundPatterns[1]} position={'50%'} />
					<p>{'Islande 2019'}</p>
					<span>{'107 pictures - 07/07/2019'}</span>
				</FakeBrowserAlbum>

				<FakeBrowserAlbum>
					<FakeBrowserPictureWrapper background={backgroundPatterns[2]} position={'50%'} />
					<p>{'Desert pictures'}</p>
					<span>{'24 pictures - 06/04/2019'}</span>
				</FakeBrowserAlbum>

				<FakeBrowserAlbum>
					<FakeBrowserPictureWrapper background={backgroundPatterns[3]} position={'bottom'} />
					<p>{'Camping'}</p>
					<span>{'89 pictures - 15/02/2019'}</span>
				</FakeBrowserAlbum>

				<FakeBrowserAlbum>
					<FakeBrowserPictureWrapper background={backgroundPatterns[4]} position={'center'} />
					<p>{'Amazonian Jungle'}</p>
					<span>{'7 pictures - 27/08/2018'}</span>
				</FakeBrowserAlbum>

				<FakeBrowserAlbum>
					<FakeBrowserPictureWrapper background={backgroundPatterns[5]} position={'50%'} />
					<p>{'Tram'}</p>
					<span>{'245 pictures - 30/05/2016'}</span>
				</FakeBrowserAlbum>
			</>
		)
	}

	return (
		<FakeBrowser>
			{renderAlbums()}			
			<FakeBrowserFlyingButton>{'+'}</FakeBrowserFlyingButton>
		</FakeBrowser>
	);
}

export {GalleryFakeBrowser};
export default GalleryFakeBrowser;
