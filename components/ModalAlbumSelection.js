/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Wednesday 15 January 2020 - 10:46:09
** @Filename:				ModalAlbumSelection.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 12 March 2020 - 13:34:04
*******************************************************************************/

import	React, {useState}				from	'react';
import	styled							from	'styled-components';
import	* as API						from	'../utils/API';
import	useLockBodyScroll				from	'../hooks/useLockBodyScroll';
import	Input, {InputLabel}				from	'./Input';
import	{AlbumsCardPreview}				from	'./AlbumCard';
import	{PrimaryButton}					from	'./Buttons';
import	GgClose							from	'../Icons/Cross';

const	ModalContent = styled.div`overflow: ${props => props.noOverflow ? 'hidden' : 'overlay'};`;
const	ModalContainer = styled.div`height: ${props => props.adapt ? 'auto' : '620px'};`;
const	Modal = styled.div`
	background-color: rgba(0,0,0,.6);
    cursor: zoom-out;
	position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 700;
	& > div {
		height: 100%;
		padding: 64px 120px 100px;
		outline: none;
		pointer-events: none;
		cursor: default;
		display: flex;
		& > ${ModalContainer} {
			width: 100%;
			max-width: 560px;
			pointer-events: auto;
			border-radius: 4px;
			box-shadow: 0 8px 16px rgba(0,0,0,.15);
			min-width: 0;
			margin: auto;
			position: relative;
			pointer-events: default;
			& > ${ModalContent} {
				background-color: #2A2B41;
				position: relative;
				padding: 0;
				width: auto;
				height: 100%;
				padding: 0 40px 40px;
				border-radius: 4px;
				box-sizing: border-box;
				& > h1 {
					font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
					font-size: 32px;
					color: #FFFFFF;
					margin-top: 32px;
					margin-bottom: 32px;
					background: transparent;
				}
			}
			& > ${GgClose} {
				position: absolute;
				top: 16px;
				right: 0;
				cursor: pointer;
				padding: 16px;
				/* margin: 16px; */
			}
		}
	}
`;
const	ModalShadow = styled.div`
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 80px;
	margin: 0 auto;
	pointer-events: none;
	box-shadow: inset 0 -40px 40px -30px #2A2B41;
	z-index: 4;
	border-radius: 0 0 4px 4px;
`;
const	NewAlbumButton = styled.button`
	padding: 26px 19px;
	border: 2px dashed #B5B7DF;
	font-size: 21px;
	line-height: 22px;
	color: #FFFFFF;
	transition: all .1s ease-in-out;
	width: 100%;
	display: block;
    height: 80px;
    margin-bottom: 12px;
    border-radius: 5px;
	font-weight: 500;
	transition: 0.2s;
	&:hover {
		background-color: #B5B7DF80;
		cursor: pointer;
		border: 2px dashed transparent;
	}
`;
const	AlbumButton = styled.button`
    display: block;
    width: 100%;
    height: 80px;
    border-radius: 5px;
    background-color: #f5f5f5;
    overflow: hidden;
	font-size: 21px;
	line-height: 22px;
	color: #767676;
	transition: all .1s ease-in-out;
	margin-bottom: 12px;
	font-weight: 500;
	position: relative;
	& > img {
		object-fit: cover;
		object-position: center;
		width: 100%;
		height: 100%;
	}
	& > div {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,.04);
		transition: all .1s ease-in-out;
		padding: 17px 20px;

		display: flex;
		align-items: center;

		font-size: 21px;
		line-height: 1.3;
		color: #FFFFFF;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-shadow: 0 1px 1px rgba(0,0,0, 0.15);
		font-weight: 500;
		text-transform: capitalize;

		&:hover {
			background-color: #2A2B41AA;
			cursor: pointer;
			&::after {
				content: "";
				mask: url('/static/icons/add.svg');
				width: 34px;
				height: 34px;
				background-color: #FFFFFF;
				mask-size: contain;
				mask-repeat: no-repeat;
				mask-position: center;
				display: block;
				position: absolute;
				right: 16px;
				top: calc(50% - 17px);
			}
		}
	}
`;

function ModalAlbumSelection(props) {
	useLockBodyScroll()

	const	[content, set_content] = useState(props.content || 'selection')
	const	[newAlbumName, set_newAlbumName] = useState('')

	function	renderAlbums() {
		return (
			props.albumList.map((album, index) => {
				return (
					<AlbumButton
						key={`${album.albumID}_${index}`}
						onClick={() => {
							API.SetPicturesAlbum({
								albumID: album.albumID,
								groupIDs: props.selected,
							}).then(() => {
								props.onClose();
							});
						}}>
						<img src={`${API.API}/downloadPicture/max500/${album.coverPicture}`} alt={album.name} />
						<div>{album.name}</div>
					</AlbumButton>
				);
			})
		);
	}
	function	renderContent() {
		if (content === 'selection') {
			return (
				<ModalContainer onClick={e => {e.preventDefault(); e.stopPropagation();}}>
					<ModalShadow />
					<ModalContent>
						<h1>{'Ajouter à un album'}</h1>
						<NewAlbumButton
							onClick={() => set_content('albumCreationWithPict')}>
							{'Créer un album'}
						</NewAlbumButton>
						{renderAlbums()}
					</ModalContent>
					<GgClose onClick={() => {
						props.onClose();
						set_content('selection');
						set_newAlbumName('');
					}} />
				</ModalContainer>
			)
		}
		else if (content === 'albumCreationWithPict') {
			return (
				<ModalContainer onClick={e => {e.preventDefault(); e.stopPropagation();}}>
					<ModalContent noOverflow>
						<h1>{'Création d\'un album'}</h1>
						<InputLabel value={newAlbumName}>{'Nom de l\'album'}</InputLabel>
						<Input
							value={newAlbumName}
							onChange={e => set_newAlbumName(e.target.value)} />

						<AlbumsCardPreview
							album={{
								albumID: undefined,
								title: newAlbumName,
								coverPicture: props.selected[0],
								selectedCount: props.selected.length
							}} />
						<PrimaryButton
							onClick={() => {
								API.CreateAlbum({
									name: newAlbumName,
									coverPicture: props.selected[0],
									pictures: props.selected,
								}).then(() => {
									props.onClose();
									set_content('selection')
									set_newAlbumName('')
								});
							}}
							disabled={!newAlbumName}
							style={{width: 'auto', marginTop: 0, marginLeft: 'auto', display: 'flex'}}>
							{'Créer l\'album'}
						</PrimaryButton>
					</ModalContent>
					<GgClose onClick={() => {
						props.onClose();
						set_content('selection');
						set_newAlbumName('');
					}} />
				</ModalContainer>
			);
		}
		return (
				<ModalContainer adapt onClick={e => {e.preventDefault(); e.stopPropagation();}}>
					<ModalContent noOverflow>
						<h1>{'Création d\'un album'}</h1>
						<InputLabel value={newAlbumName}>
							{'Nom de l\'album'}
						</InputLabel>
						<Input
							autoFocus
							value={newAlbumName}
							onChange={e => set_newAlbumName(e.target.value)} />
						<PrimaryButton
							onClick={() => {
								API.CreateAlbum({name: newAlbumName}).then((newAlbum) => {
									props.onCloseSuccess(newAlbum.name, newAlbum.albumID);
									set_content('selection')
									set_newAlbumName('')
								});
							}}
							disabled={!newAlbumName}
							style={{width: 'auto', marginTop: 0, marginLeft: 'auto', display: 'flex'}}>
							{'Créer l\'album'}
						</PrimaryButton>
					</ModalContent>
					<GgClose onClick={() => {
						props.onClose();
						set_content('selection');
						set_newAlbumName('');
					}} />
				</ModalContainer>
			);
	}

	if (!props.isOpen)
		return (null);
	
	return (
		<Modal
			onClick={() => {
				props.onClose();
				set_content('selection')
			}}>
			<div>
				{renderContent()}
			</div>
		</Modal>
	)
}

function rolerAlbumSelectionModalCont(props) {
	if (!props.isOpen)
		return (null);
	return <ModalAlbumSelection {...props} />
}

export default rolerAlbumSelectionModalCont;
