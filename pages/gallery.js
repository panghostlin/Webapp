/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 14:45:07
** @Filename:				albums.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 17:58:25
*******************************************************************************/

import	React, {useState, useEffect}		from	'react';
import	PictureList							from	'../components/PictureList';
import	useEffectOnce						from	'../hooks/useEffectOnce';
import	* as API							from	'../utils/API';
import	convertToMoment						from	'../utils/ConvertDate';
import	{PageContainer, Section, Container}	from	'../style/Frame';

const	Gallery = React.forwardRef((props, ref) => {
	React.useImperativeHandle(ref, () => ({
		pageInformations: {
			page: `gallery`
		},
		onUploaded(e) {
			set_pictureList(e);
		}
	}));

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
			<Section fluid>
				<Container>
					<PictureList
						pictureList={pictureList}
						set_pictureList={set_pictureList}
						albumList={albumList} />
					</Container>
				</Section>
		</PageContainer>
	);
});

export default Gallery;
