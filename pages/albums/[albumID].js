/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Thursday 16 January 2020 - 19:21:18
** @Filename:				[albumID].js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 05 March 2020 - 13:57:46
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	Router							from	'next/router';
import	styled							from	'styled-components';
import	ToastSuccess					from	'../../components/ToastSuccess';
import	PictureList						from	'../../components/PictureList';
import	* as API						from	'../../utils/API';
import	GgCheck							from	'../../Icons/Check';

const	Container = styled.div`
	font-size: 10pt;
	flex-direction: column;
	display: flex;
	flex: 1;
	margin: 0 8.33%;
	margin-top: 32px;
`;

const	TitleEditor = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	position: relative;
	& > ${GgCheck} {
		position: absolute;
		right: 0;
	}
`;
const	Title = styled.input`
	color: #D0D7E3;
	font-size: 36px;
	text-transform: capitalize;
	padding-bottom: 4px;
	background: transparent;
	border: none;
	outline: none;
	border-bottom: solid 1px transparent;
	transition: 0.2s;
	width: 100%;
	padding-right: 44px;
	${props => props.isDifferent && 'border-bottom: solid 1px #D0D7E380'};

	&:hover {
		border-bottom: solid 1px #D0D7E380;
	}
	&:focus {
		border-bottom: solid 1px #FFA041;
	}
`;
const	SubTitle = styled.p`
	color: #858ea1;
	font-size: 16px;
	margin-top: 8px;
	margin-bottom: 16px;
	padding-left: 2px;
`;
const	TextButton = styled.p`
	color: #858ea180;
	font-size: 12px;
	margin-top: 8px;
	margin-bottom: 16px;
	margin-left: auto;
	transition: 0.2s;
	cursor: pointer;
	border-bottom: 1px solid transparent;
	&:hover {
		border-bottom: 1px solid #858ea180;
	}
`;

function	convertToMoment(each) {
	const	date = each ? new Date(each) : new Date();

	const	year = date.getFullYear();
	let		day = date.getDate();
	let		month = date.getMonth() + 1;
	if (month < 10) {
		month = `0${month}`
	}
	if (day < 10) {
		day = `0${day}`
	}

	return `${year}-${month}-${day}`;
}

function Album(props) {
	const	[update, set_update] = useState(0);
	const	[pictureList, set_pictureList] = useState([]);
	const	[albumList, set_albumList] = useState([]);
	const	[currentAlbum, set_currentAlbum] = useState({});
	const	[name, set_name] = useState('');
	const	[isReady, set_isReady] = useState(false);
	const	[successToast, set_successToast] = useState(null);
	const	[successToastMessage, set_successToastMessage] = useState(null);
	
	useEffect(() => {
		API.GetAlbumPictures({albumID: props.albumID}).then((e) => {
			if (!e) {
				set_pictureList([])
				return
			}
			const	_pictureList = e.map((each) => {
				each.dateAsKey = convertToMoment(each.originalTime)
				return each
			}) 
			set_pictureList(_pictureList || [])
		});
		
		API.ListAlbums().then(e => set_albumList(e || []))
		
		API.GetAlbum({albumID: props.albumID}).then((_currentAlbum) => {
			set_currentAlbum(_currentAlbum || {})
			if (_currentAlbum.name) {
				set_name(_currentAlbum.name)
			}
		})
	}, [])

	useEffect(() => set_isReady(true), [])

	if (!isReady)
		return (null);

	function	onSetAlbumName() {
		if (name === currentAlbum.name) {
			return;
		}
		API.SetAlbumName({albumID: props.albumID, name}).then(() => {
			const	_currentAlbum = currentAlbum;
			set_successToastMessage(`L\'album ${_currentAlbum.name || 'Sans Titre'} a été renommé en ${name}`);
			set_successToast(true);

			_currentAlbum.name = name;
			set_currentAlbum(_currentAlbum);
			set_update(update + 1);
		});
	}

	function	onDeleteAlbum() {
		API.DeleteAlbum({albumID: props.albumID}).then(() => {
			set_successToastMessage(`L\'album ${currentAlbum.name || 'Sans Titre'} a été correctement supprimé.`);
			set_successToast(true);
			setTimeout(() => Router.push('/albums'), 1000)
		});
	}

	return (
		<Container>
			<TitleEditor>
				<Title
					isDifferent={name !== currentAlbum.name}
					onChange={e => set_name(e.target.value)}
					value={name}
					onKeyPress={e => e.key === 'Enter' && onSetAlbumName()} />
				<GgCheck
					hoverColor={name !== currentAlbum.name ? '#FFA041' : 'transparent'}
					color={name !== currentAlbum.name ? '#D0D7E380' : 'transparent'}
					disable={name === currentAlbum.name}
					size={2}
					outline
					onClick={onSetAlbumName} />
			</TitleEditor>
			
			<TitleEditor>
				<SubTitle>{`Il y a ${pictureList.length} photos dans cet album`}</SubTitle>
				<TextButton onClick={onDeleteAlbum}>
					{`Supprimer album`}
				</TextButton>
			</TitleEditor>

			<PictureList
				memberPublicKey={props.memberPublicKey}
				albumID={props.albumID}
				isDragNDrop={props.isDragNDrop}
				set_isDragNDrop={props.set_isDragNDrop}
				pictureList={pictureList}
				set_pictureList={set_pictureList}
				albumList={albumList} />
			<ToastSuccess
				isOpen={successToast}
				onClose={() => set_successToast(false)}
				status={successToastMessage} />
		</Container>
	);
}


Album.getInitialProps = (all) => {
	return {albumID: all.query.albumID};
};

export default Album;

