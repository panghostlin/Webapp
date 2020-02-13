/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 14:45:07
** @Filename:				albums.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 13 February 2020 - 18:39:30
*******************************************************************************/

import	React, {useState}					from	'react';
import	styled								from	'styled-components';
import	AlbumSelectionModal					from	'../../components/AlbumSelectionModal';
import	AlbumCard, {AlbumsCardPreviewFake}	from	'../../components/AlbumCard';
import	useEffectOnce						from	'../../hooks/useEffectOnce';
import	* as API							from	'../../utils/API';

const	AlbumsContainer = styled.div`
	font-size: 10pt;
	width: 80%;
	margin: 0 auto;
	border-radius: 4px;
	padding: 32px 16px;

	display: grid;
    grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 16px;
    justify-items: center;
`;

function AlbumList() {
	const	[albumList, set_albumList] = useState([]);
	const	[isReady, set_isReady] = useState(false);
	const	[albumSelectionModal, set_albumSelectionModal] = useState(false);

	useEffectOnce(() => {
		API.ListAlbums().then(e => set_albumList(e || []))
		set_isReady(true)
	})

	if (!isReady)
		return (null);

	return (
		<AlbumsContainer>
			{albumList.map(e => <AlbumCard key={e.albumID} album={e} />)}
			<AlbumsCardPreviewFake onClick={() => set_albumSelectionModal(true)} />
			<AlbumSelectionModal
				isOpen={albumSelectionModal}
				onCloseSuccess={(name, albumID) => {
					set_albumList(_prev => [..._prev, {albumID, name}])
					set_albumSelectionModal(false)
				}}
				onClose={() => set_albumSelectionModal(false)}
				content={'albumCreation'} />
		</AlbumsContainer>
	);
}

export default AlbumList;
