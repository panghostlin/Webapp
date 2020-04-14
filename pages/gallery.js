/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 14:45:07
** @Filename:				albums.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 01 April 2020 - 12:15:54
*******************************************************************************/

import	React, {useState, useEffect}		from	'react';
import	PictureList							from	'../components/PictureList';
import	useEffectOnce						from	'../hooks/useEffectOnce';
import	* as API							from	'../utils/API';
import	convertToMoment						from	'../utils/ConvertDate';
import	{PageContainer, Section, Container}	from	'../style/Frame';

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
		set_isReady(true);
		API.ListAlbums().then(e => set_albumList(e || []))
	});

	useEffect(() => set_isReady(true), [])

	if (!isReady)
		return (null);

	return (
		<PageContainer fluid>
			<Section fluid background={'neutral'} paddingBottom={2}>
				<Container>
					<PictureList
						memberPublicKey={props.memberPublicKey}
						isDragNDrop={props.isDragNDrop}
						set_isDragNDrop={props.set_isDragNDrop}
						pictureList={pictureList}
						set_pictureList={set_pictureList}
						albumList={albumList} />
					</Container>
				</Section>
		</PageContainer>
	);
}

export default Albums;
