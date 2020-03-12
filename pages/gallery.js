/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 14:45:07
** @Filename:				albums.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 12 March 2020 - 22:33:14
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	styled							from	'styled-components';
import	PictureList						from	'../components/PictureList';
import	useEffectOnce					from	'../hooks/useEffectOnce';
import	* as API						from	'../utils/API';
import	convertToMoment					from	'../utils/ConvertDate';

const	Container = styled.div`
	font-size: 10pt;
	flex-direction: column;
	display: flex;
	flex: 1;
	margin: 0 8.33%;
	margin-top: 32px;
`;

function Albums(props) {
	const	[pictureList, set_pictureList] = useState([]);
	const	[albumList, set_albumList] = useState([]);
	const	[isReady, set_isReady] = useState(false);

	useEffectOnce(() => {
		API.GetMemberPictures().then((e) => {
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
		set_isReady(true);
	});

	useEffect(() => set_isReady(true), [])

	if (!isReady)
		return (null);

	return (
		<Container>
			<PictureList
				memberPublicKey={props.memberPublicKey}
				isDragNDrop={props.isDragNDrop}
				set_isDragNDrop={props.set_isDragNDrop}
				pictureList={pictureList}
				set_pictureList={set_pictureList}
				albumList={albumList} />
		</Container>
	);
}

export default Albums;
