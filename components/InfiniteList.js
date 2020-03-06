/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Saturday 18 January 2020 - 18:45:38
** @Filename:				InfiniteList.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 05 March 2020 - 15:05:21
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	Gallery							from 	'react-photo-gallery';

function	InfiniteList(props) {
	const	[picturesByDay, set_picturesByDay] = useState({});

	useEffect(() => {
		const	_picturesByDay = {};

		props.pictureList.forEach((each, index) => {
			if (!_picturesByDay[each.dateAsKey]) {
				_picturesByDay[each.dateAsKey] = []
			}
			each.originalIndex = index;
			_picturesByDay[each.dateAsKey].push(each)
		});
		set_picturesByDay(_picturesByDay)

	}, [props.pictureList])

	function	renderChildrens() {
		const	dayToRender = [];

		Object.entries(picturesByDay).map(([day, pictures]) => {
			const	pictureForThisDay = pictures
			.map(e => ({
				src: e.uri, //Used by package -> Need to fork package to remvoe
				uri: e.uri,
				width: e.width,
				height: e.height,
				originalWidth: e.width,
				originalHeight: e.height,
				originalIndex: e.originalIndex,
				day
			}));

			dayToRender.push(
				<div key={day} style={{marginBottom: 32}}>
					{props.renderDaySeparator(day)}
					<Gallery
						margin={8}
						renderImage={e => props.renderChildren(e.photo, e.photo.originalIndex)}
						photos={pictureForThisDay} />
				</div>
			);
		})

		return dayToRender
	}

	return (
		<div style={{width: 'calc(100% + 7px)', contain: 'layout'}}>
			{renderChildrens()}
		</div>
	);
}

export default InfiniteList;
