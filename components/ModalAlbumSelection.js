/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Wednesday 15 January 2020 - 10:46:09
** @Filename:				ModalAlbumSelection.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 15:32:07
*******************************************************************************/

import	React, {useState}				from	'react';
import	styled							from	'styled-components';
import	* as API						from	'../utils/API';
import	useLockBodyScroll				from	'../hooks/useLockBodyScroll';
import	Input, {InputLabel}				from	'./Input';
import	{AlbumsCardPreview}				from	'./AlbumCard';
import	GgClose							from	'../Icons/Cross';
import	{H4, P, PSmall, Blockquote}		from	'../style/Typo';
import	{Container, Row, Col}			from	'../style/Frame';
import	{Button, TextButton}			from	'../style/Button';

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
	min-height: 80px;
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
const	ModalContainer = styled.div`
	height: ${props => props.adapt ? 'auto' : '620px'};
	width: 100%;
	max-width: 560px;
	pointer-events: auto;
	border-radius: 4px;
	box-shadow: 0 8px 16px rgba(0,0,0,.15);
	min-width: 0;
	margin: auto;
	position: relative;
	pointer-events: default;
`;
const	ModalContent = styled(Container)`
	width: auto;
	height: 100%;
	border-radius: 4px;
`;
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
	}
`;

function ModalAlbumSelection(props) {
	useLockBodyScroll()

	const	[content, set_content] = useState(props.content || 'selection')
	const	[newAlbumName, set_newAlbumName] = useState('')

	function	renderAlbumNameInput() {
		return (
			<>
				<InputLabel>{'Album name'}</InputLabel>
				<Input
					autoFocus
					value={newAlbumName}
					onChange={e => set_newAlbumName(e.target.value)} />
			</>
		);
	}

	function	renderAlbums() {
		return (
			props.albumList.map((album, index) => {
				return (
					<AlbumButton
						key={`${album.albumID}_${index}`}
						onClick={() => props.onConfirm(`appendToAlbum`, {albumID: album.albumID})}>
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
				<ModalContainer adapt onClick={e => {e.preventDefault(); e.stopPropagation();}}>
					<ModalContent background={'neutral-lighter'} padding={2}>
						<Row justify={'space-between'} align={'center'}>
							<Col xs={2} sm={4} md={8} lg={8}>
								<H4 color={'secondary'}>{'Add to album'}</H4>
							</Col>
							<Col xs={2} sm={4} md={2} lg={2} align={'flex-end'} style={{cursor: 'pointer'}}>
								<GgClose onClick={() => props.onClose()} />
							</Col>
						</Row>

						<Row marginTop={1} paddingVertical={2} background={'neutral-darker'}>
							<Col xs={2} sm={4} md={12} lg={12}>
								<PSmall color={'secondary-80'}>{'How does this work ?'}</PSmall>
								<Blockquote color={'secondary-60'}>{'Since all your data and photos are encrypted by your secret key, we cannot modify them directly. Your browser will download each photo, make the changes, and send an encrypted version back to our servers in a secure manner. This process takes longer, but ensures the security of each of your photos.'}</Blockquote>
							</Col>
						</Row>


						<Row marginTop={1}>
							<Col xs={2} sm={4} md={12} lg={12} style={{maxHeight: 400, overflow: 'scroll'}}>
								<NewAlbumButton
									onClick={() => set_content('albumCreationWithPict')}>
									{'Créer un album'}
								</NewAlbumButton>
								{renderAlbums()}
							</Col>
						</Row>
					</ModalContent>
				</ModalContainer>
			);
		}
		else if (content === 'albumCreationWithPict') {
			return (
				<ModalContainer adapt onClick={e => {e.preventDefault(); e.stopPropagation();}}>
					<ModalContent background={'neutral-lighter'} padding={2}>
						<Row justify={'space-between'} align={'center'}>
							<Col xs={2} sm={4} md={8} lg={8}>
								<H4 color={'secondary'}>{'Create album'}</H4>
							</Col>
							<Col xs={2} sm={4} md={2} lg={2} align={'flex-end'} style={{cursor: 'pointer'}}>
								<GgClose onClick={() => props.onClose()} />
							</Col>
						</Row>

						<Row marginTop={1}>
							<Col xs={2} sm={4} md={12} lg={12} style={{maxHeight: 400, overflow: 'scroll'}}>
								{renderAlbumNameInput()}
							</Col>
						</Row>

						<Row marginTop={1}>
							<Col xs={2} sm={4} md={12} lg={12} justify={'center'}>
								<AlbumsCardPreview
									album={{
										albumID: undefined,
										title: newAlbumName,
										coverPicture: props.selectedObject[0],
										selectedCount: props.selectedObject.length
									}} />
							</Col>
						</Row>


						<Row marginTop={1}>
							<Col xs={2} sm={4} md={12} lg={12} justify={'flex-end'} style={{flexDirection: 'row'}}>
								<TextButton
									secondary
									marginRight={0.5}
									onClick={() => props.onCancel()}>
									{'Cancel'}
								</TextButton>

								<Button
									primary
									marginLeft={0.5}
									onClick={() => props.onConfirm(`createAlbum`, {albumName: newAlbumName})}>
									{'Create album'}
								</Button>
							</Col>
						</Row>
					</ModalContent>
				</ModalContainer>
			);
		}
		
		return (
			<ModalContainer adapt onClick={e => {e.preventDefault(); e.stopPropagation();}}>
				<ModalContent background={'neutral-lighter'} padding={2}>
					<Row justify={'space-between'} align={'center'}>
						<Col xs={2} sm={4} md={8} lg={8}>
							<H4 color={'white'}>{'Create a new album'}</H4>
						</Col>
						<Col xs={2} sm={4} md={2} lg={2} align={'flex-end'} style={{cursor: 'pointer'}}>
							<GgClose onClick={() => props.onClose()} />
						</Col>
					</Row>


					<Row marginTop={1}>
						<Col xs={2} sm={4} md={12} lg={12} style={{maxHeight: 400, overflow: 'scroll'}}>
							{renderAlbumNameInput()}
						</Col>
					</Row>


					<Row marginTop={1}>
						<Col xs={2} sm={4} md={12} lg={12} justify={'flex-end'} style={{flexDirection: 'row'}}>
							<TextButton
								secondary
								marginRight={0.5}
								onClick={() => props.onCancel()}>
								{'Cancel'}
							</TextButton>

							<Button
								primary
								marginLeft={0.5}
								onClick={() => {
									API.CreateAlbum({name: newAlbumName}).then((newAlbum) => {
										props.onCloseSuccess(newAlbum.name, newAlbum.albumID);
										set_content('selection')
										set_newAlbumName('')
									});
								}}>
								{'Create album'}
							</Button>
						</Col>
					</Row>

				</ModalContent>
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
