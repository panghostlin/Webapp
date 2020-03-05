/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Saturday 18 January 2020 - 18:45:38
** @Filename:				InfiniteList.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 04 March 2020 - 15:56:30
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	Gallery							from 	'react-photo-gallery';
import	useInfiniteScroll				from	'../hooks/useInfiniteScroll';

function	PerDayInfiniteList(props) {
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

const		InfiniteList = React.memo((props) => {
	const	[_, set_isFetching] = useInfiniteScroll(fetchMoreListItems);
	const	[pictureList, set_pictureList] = useState([]);
	const	[numberOfLines, set_numberOfLines] = useState(3);

	useEffect(() => {
		set_pictureList(props.pictureList)
	}, [props.pictureList])

	function fetchMoreListItems() {
		set_numberOfLines(_prev => _prev + 3)
		set_isFetching(false)
	}

	function	renderChildrens() {
		const	data0 = pictureList.filter((d, i) => i % 3 === 0).slice(0, numberOfLines);
		const	data1 = pictureList.filter((d, i) => i % 3 === 1).slice(0, numberOfLines);
		const	data2 = pictureList.filter((d, i) => i % 3 === 2).slice(0, numberOfLines);

		return (
			<div style={props.childrenContainer}>
				<div style={{width: '32%'}}>{data0.map((e, k) => props.renderChildren(e, k))}</div>
				<div style={{width: '32%'}}>{data1.map((e, k) => props.renderChildren(e, k))}</div>
				<div style={{width: '32%'}}>{data2.map((e, k) => props.renderChildren(e, k))}</div>
			</div>
		);
	}
	return (
		<div style={{width: '100%'}}>
			{renderChildrens()}
		</div>
	);
});

export {PerDayInfiniteList};
export default InfiniteList;
