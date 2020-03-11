/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 17 January 2020 - 15:15:55
** @Filename:				PictureList.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 11 March 2020 - 14:27:25
*******************************************************************************/

import	React, {useState, useEffect, useLayoutEffect}	from	'react';
import	styled							from	'styled-components';
import	PhotoCardWidth					from	'./PhotoCardWidth';
import	InfiniteList					from	'./InfiniteList';
import	AlbumSelectionModal				from	'./AlbumSelectionModal';
import	ToastUpload						from	'./ToastUpload';
import	ToastSuccess					from	'./ToastSuccess';
import	PictureLightroom				from	'./PictureLightroom';
import	DragNDrop						from	'./DragNDrop';
import	* as API						from	'../utils/API';
import	{ActionBar}						from	'./Navbar';
import	useKeyPress						from	'../hooks/useKeyPress';
import	useEffectOnce					from	'../hooks/useEffectOnce';
import	convertToMoment					from	'../utils/ConvertDate';
import	* as Worker						from	'../utils/Worker';

const	Toggle = styled.div`
	cursor: pointer;
	width: 24px;
	height: 24px;
	margin-right: 8px;
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
	transition: 0.3s;
`;
const	StyledDate = styled.div`
	font-size: 14px;
	color: #B5B7DF;
	margin-top: 8px;
	margin-bottom: 8px;
	display: flex;
    align-items: center;
	height: 24px;
	width: 100%;
	position: relative;
	cursor: pointer;
	& > p {
		margin-left: -32px;
		transition: 0.2s;
	}


	${props => props.isToggleSome && '& > p {margin-left: 0; transition: 0.2s;}'};
	${props => props.isToggleSelected && '& > p {margin-left: 0; transition: 0.2s;}'};
	& > ${Toggle} {
		${props => props.isToggleSome && `background-color: #FFFFFF`};
		${props => props.isToggleSome && `opacity: 1`};
		${props => props.isToggleSome && `z-index: 1`};

		${props => props.isToggleSelected ? `mask: url('/static/icons/checked.svg')` : `mask: url('/static/icons/unchecked.svg')`};
		${props => props.isToggleSelected && `background-color: #FFFFFF`};
		${props => props.isToggleSelected && `opacity: 1`};
		${props => props.isToggleSelected && `z-index: 1`};
	}

	&:hover {
		& > p {
			margin-left: 0;
			transition: 0.2s;
		}
		& > ${Toggle} {
			opacity: 1;
			z-index: 1;
			background-color: #FFFFFF;
		}
	}

`;

function	Uploader(props) {
	let		cryptoPrivateKey = null;
	let		cryptoPublicKey = null;
	const	[uploader, set_uploader] = useState(false);
	const	[uploaderUpdate, set_uploaderUpdate] = useState(0);
	const	[uploaderLength, set_uploaderLength] = useState(0);
	const	[uploaderCurrentIndex, set_uploaderCurrentIndex] = useState(0);
	const	[uploaderCurrentStep, set_uploaderCurrentStep] = useState(0);
	const	[uploaderCurrentBlobURL, set_uploaderCurrentBlobURL] = useState(null);
	const	imgref = React.useRef(null);

	/**************************************************************************
	**	The pictureCompress function takes an image as a file and resize it
	**	to the max size of 16 mega pixels
	**************************************************************************/
	function	PictureCompress(file, callback) {
		const fileName = file.name;
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onload = event => {
			const img = new Image();
			img.src = event.target.result;
			img.name = fileName;
			img.onload = (e) => {
				if (e.target.width * e.target.height > 16000000) {
					const	imageOriginalWidth = e.target.width
					const	imageOriginalHeight = e.target.height

					const	hvRatio = imageOriginalWidth / imageOriginalHeight
					const	vhRatio = imageOriginalHeight / imageOriginalWidth

					const	imageHvRatio = 16000000 * hvRatio
					const	imageVhRatio = 16000000 * vhRatio

					const	newWidth = Math.sqrt(imageHvRatio)
					const	newHeight = Math.sqrt(imageVhRatio)

					const canvas = document.createElement('canvas');
					canvas.width = newWidth;
					canvas.height = newHeight;

					const ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0, newWidth, newHeight);
					canvas.toBlob(blob => callback(blob), file.type, 0.85);
				} else {
					callback(file, event.target.result);
				}
			}
		};
	}

	function	CreateOriginalImage(objectURL) {
		return new Promise((resolve) => {
			const img = imgref.current;

			img.onload = function(e) {
				resolve(img);
			}
			img.src = objectURL
		});
	};
	function	CreateThumbnailImage(image, target) {
		return new Promise((resolve) => {
			const	ratio = Math.min(target / image.width, target / image.height);
			const	rWidth = Math.round(image.width * ratio);
			const	rHeight = Math.round(image.height * ratio);
			const	canvas = new OffscreenCanvas(rWidth, rHeight);
			const	c = canvas.getContext('2d');

			c.drawImage(image, 0, 0, image.width, image.height, 0, 0, rWidth, rHeight);
			canvas.convertToBlob({type: 'image/jpeg', quality: 0.8}).then((blob) => {
				blob.arrayBuffer().then((arrayBuffer) => {
					resolve({data: arrayBuffer, width: rWidth, height: rHeight});
				})
			})
		});
	}
	function	Create16mpxImage(image) {
		return new Promise((resolve) => {
			const	imageOriginalWidth = image.width
			const	imageOriginalHeight = image.height
			const	hvRatio = imageOriginalWidth / imageOriginalHeight
			const	vhRatio = imageOriginalHeight / imageOriginalWidth
			const	imageHvRatio = 16000000 * hvRatio
			const	imageVhRatio = 16000000 * vhRatio
			const	newWidth = Math.sqrt(imageHvRatio)
			const	newHeight = Math.sqrt(imageVhRatio)
			const	canvas = new OffscreenCanvas(newWidth, newHeight);
			const	c = canvas.getContext('2d');

			c.drawImage(image, 0, 0, image.width, image.height, 0, 0, newWidth, newHeight);
			canvas.convertToBlob({type: 'image/jpeg', quality: 0.8}).then((blob) => {
				blob.arrayBuffer().then((arrayBuffer) => {
					resolve({data: arrayBuffer, width: newWidth, height: newHeight});
				})
			})
		});
	}

	async function	recursiveWorkerUpload(currentWorker, toProcess, index, options, versions) {
		const	isLast = index === (toProcess.length - 1);
		const	target = toProcess[index];
		const	thumbnail = await CreateThumbnailImage(versions.image, target);
		
		await Worker.postMessage(currentWorker, {
			type: 'uploadPicture',
			file: thumbnail.data,
			options: {
				width: thumbnail.width,
				height: thumbnail.height,
				targetSize: target,
				isLast,
				...options
			}
		});
		if (isLast)
			return
		recursiveWorkerUpload(currentWorker, toProcess, index + 1, options, versions)
	}
	async function	performWorkerUpload(currentWorker, options, versions) {
		if (true || 'user is not premium') {
			const	original = await Create16mpxImage(versions.image);
			
			await Worker.postMessage(currentWorker, {
				type: 'uploadPicture',
				file: original.data,
				options: {
					width: original.width,
					height: original.height,
					targetSize: 'original',
					isLast: false,
					...options
				}
			});
		} else {
			await Worker.postMessage(currentWorker, {
				type: 'uploadPicture',
				file: versions.arrayBuffer,
				options: {
					width: versions.image.width,
					height: versions.image.height,
					targetSize: 'original',
					isLast: false,
					...options
				}
			});
		}
		recursiveWorkerUpload(currentWorker, [1000, 500], 0, options, versions);
	}
	async function	onDropFile(oldWorker, index, files) {
		Worker.terminate(oldWorker)

		if (index >= files.length) {
			set_uploader(false);
			set_uploaderLength(0);
			set_uploaderCurrentIndex(0);
			set_uploaderCurrentStep(0);
			set_uploaderCurrentBlobURL(null);
			return;
		}
		const	currentWorker = Worker.register();
		const	file = files[index];

		/* ********************************************************************
		**	Let's get the keys if we do not have them
		******************************************************************** */
		if (cryptoPublicKey === null) {
			const	publicKey = JSON.parse(sessionStorage.getItem(`Pub`))
			cryptoPublicKey = await window.crypto.subtle.importKey("jwk", publicKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["encrypt"])
		}
		if (cryptoPrivateKey === null) {
			const	privateKey = JSON.parse(sessionStorage.getItem(`Priv`))
			cryptoPrivateKey = await window.crypto.subtle.importKey("jwk", privateKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["decrypt"])
		}
		
		/* ********************************************************************
		**	Now, for each image, we need to :
		**	- Generate a secret key
		**	- Generate an IV
		**	- Encrypt the image
		******************************************************************** */
		const	fileAsArrayBuffer = await Worker.postMessage(currentWorker, {file, type: 'file'})
		const	imgObject = URL.createObjectURL(new Blob([file], {type: file.type}));
		const	fileAsImg = await CreateOriginalImage(imgObject);
		set_uploader(true);
		set_uploaderCurrentBlobURL(imgObject)

		API.WSCreateChunkPicture(
			(UUID) => {
				const	options = {
					fileUUID: UUID,
					fileAlbumID: props.albumID,
					cryptoPublicKey,
					name: file.name,
					lastModified: file.lastModified,
					type: file.type
				};
				const	versions = {file, arrayBuffer: fileAsArrayBuffer, image: fileAsImg};
				performWorkerUpload(currentWorker, options, versions)
			},
			(response) => {
				if (response.Step === 4) {
					if (response.Picture && response.Picture.uri !== '' && response.IsSuccess === true) {
						response.Picture.dateAsKey = convertToMoment(response.Picture.originalTime)

						props.set_pictureList(_prev => [..._prev, response.Picture])
						set_uploaderCurrentIndex(index => index + 1);
						set_uploaderCurrentStep(0);
						set_uploaderUpdate(_prev => _prev + 1);
						onDropFile(currentWorker, index + 1, files);
					} else {
						console.error(`ERROR WITH ${index}`);
						onDropFile(currentWorker, index + 1, files) //SKIP THE FAILURE
					}
				} else {
					set_uploaderCurrentStep(response.Step)
				}	
			}
		);
	}

	return (
		<>
			<img id={'image'} ref={imgref} style={{opacity: 0, pointerEvent: 'none'}} />
			<DragNDrop
				isOpen={props.isDragNDrop}
				onDragLeave={() => props.set_isDragNDrop(false)}
				onDrop={(event) => {
					const	currentWorker = Worker.register();
					props.set_isDragNDrop(false);
					set_uploaderLength(event.dataTransfer.files.length)
					onDropFile(currentWorker, 0, event.dataTransfer.files)
				}} />
			<ToastUpload
				open={uploader}
				fileAsBlobURL={uploaderCurrentBlobURL}
				total={uploaderLength}
				current={uploaderCurrentIndex}
				step={uploaderCurrentStep} />
		</>
	);
}

const	StyledCursorIndicator = styled.div`
	height: 2px;
	z-index: 1;
	background: #FFFFFF;
	pointer-events: none;
	position: absolute;
	right: 0;
	width: 72px;
	will-change: transform;
	opacity: 0;
	& > p {
		position: absolute;
		pointer-events: none;
		color: #FFFFFF;
		font-size: 1.1em;
		white-space: nowrap;
		top: -1.2em;
		right: 8px;
	}
`;
const	StyledTimeline = styled.div`
	position: fixed;
	top: 92px;
	right: 0;
	bottom: 32px;
	width: 120px;
	opacity: 0; //TODO: change ;
	transition: 0.2s;
	cursor: pointer;
	overflow: auto;
	z-index: 10;
	will-change: opacity;
	&:hover {
		opacity: 1;
		& > ${StyledCursorIndicator} {
			opacity: 1
		}
	}
`;
const	StyledSeparatorDate = styled.div`
	position: absolute;
	right: 8px;
	white-space: nowrap;
	top: ${props => props.top}%;
	color: #FFFFFF;
	pointer-events: none;
`;
const	StyledScrollIndicator = styled.div`
	height: 1px;
	z-index: 1;
	background: #FFFFFF;
	pointer-events: none;
	position: absolute;
	right: 0;
	width: 52px;
	will-change: transform;
	& > p {
		position: absolute;
		pointer-events: none;
		color: #FFFFFF;
		font-size: 1.1em;
		white-space: nowrap;
		top: -1.2em;
		right: 8px;
	}
`;

const		Timeline = React.memo((props) => {
	let		timer = null;
	const	timelineContainer = React.useRef();
	const	cursor = React.useRef();
	const	scrollCursor = React.useRef();
	const	[ranges, _set_ranges] = useState(null)
	const	rangesRef = React.useRef(ranges);
	const	set_ranges = x => {rangesRef.current = x; _set_ranges(x);};

	/**************************************************************************
	**	Setup the ranges and get the current scroll position when the data is
	**	updated
	**************************************************************************/
	useEffect(() => {
		set_ranges(props.data.map((each, index, data) => {
			return ([index === 0 ? -10 : each[2], data[index + 1] ? data[index + 1][2] : 100, each[1]])
		}));

		const [scrollPosition, label] = getScrollPosition()
		if (scrollCursor.current)
			scrollCursor.current.children[0].innerHTML = label
		requestAnimationFrame(() => {
			if (scrollCursor.current) {
				scrollCursor.current.style.transform = `translateY(${scrollPosition}px)`;
			}
		})
	}, [props.data])

	/**************************************************************************
	**	Register the mousemove behaviour
	**************************************************************************/
	useEffectOnce(() => {
		const	moveHandler = (e) => {
			e.preventDefault();
			const label = getCursorLabelPosition(e.clientY - 95)
			if (cursor.current && getComputedStyle(cursor.current).opacity === '1') {
				cursor.current.children[0].innerHTML = label;
				if (scrollCursor.current)
					scrollCursor.current.children[0].innerHTML = '';
			}
			requestAnimationFrame(() => cursor.current && (cursor.current.style.transform = `translateY(${e.clientY - 95}px)`));
		};
		document.addEventListener('mousemove', moveHandler);
		return () => document.removeEventListener('mousemove', moveHandler);
	});

	/**************************************************************************
	**	Register the on scroll behaviour
	**************************************************************************/
	useEffectOnce(() => {
		const	scrollHandler = (e) => {
			e.preventDefault();
			const [scrollPosition, label] = getScrollPosition()

			if (cursor.current && getComputedStyle(cursor.current).opacity === '1' && scrollCursor.current)
				scrollCursor.current.children[0].innerHTML = '';
			else if (scrollCursor.current)
				scrollCursor.current.children[0].innerHTML = label;

			if (timelineContainer.current)
				timelineContainer.current.style.opacity = 1;
			requestAnimationFrame(() => {
				if (scrollCursor.current)
					scrollCursor.current.style.transform = `translateY(${scrollPosition}px)`;
			});
			if (timer !== null)
				clearTimeout(timer);
			timer = setTimeout(() => {
				if (timelineContainer.current)
					timelineContainer.current.style.opacity = null;
		  	}, 1000);
		};

		document.addEventListener('scroll', scrollHandler);
		return () => {
			document.removeEventListener('scroll', scrollHandler)
			clearTimeout(timer);
		};
	});

	/**************************************************************************
	**	Register the drag behaviour
	**************************************************************************/
	useEffectOnce(() => {
		const	mousedown = () => {
			timelineContainer.current.addEventListener('mousemove', mousemove);
		};

		const	mousemove = (e) => {
			const	timelineClickPosition = e.clientY - 93;
			const	timelineHeight = timelineContainer.current?.offsetHeight;
			const	totalHeight = window.document.body.offsetHeight - window.innerHeight;
			const	percentToScroll = timelineClickPosition / timelineHeight;
			const	distanceToScroll = (totalHeight * percentToScroll);
			window.scrollTo({top: distanceToScroll, left: 0, behavior: 'auto'})
		};

		const	mouseup = () => {
			timelineContainer.current.removeEventListener('mousemove', mousemove)
		};

		timelineContainer.current.addEventListener('mousedown', mousedown);
		timelineContainer.current.addEventListener('mouseup', mouseup);
		return () => {
			timelineContainer.current.removeEventListener('mousedown', mousedown)
			timelineContainer.current.removeEventListener('mouseup', mouseup)
			timelineContainer.current.removeEventListener('mousemove', mousemove)
		};
	});

	function	getScrollPosition() {
		const	totalHeight = window.document.body.offsetHeight - window.innerHeight;
		const	distanceFromTop = window.pageYOffset;
		const	timelineHeight = timelineContainer.current?.offsetHeight;
		const	scrollPosition = ((distanceFromTop * timelineHeight) / totalHeight);
		const	relativePosition = scrollPosition / timelineHeight * 100;
		const	find = rangesRef.current.find(e => relativePosition > e[0] && relativePosition < e[1]);

		return	[scrollPosition - 1, find ? find[2] : ''];
	}

	function	getCursorLabelPosition(position) {
		const	timelineHeight = timelineContainer.current?.offsetHeight;
		const	relativePosition = position / timelineHeight * 100;
		const	find = rangesRef.current.find(e => relativePosition > e[0] && relativePosition < e[1]);

		return	find ? find[2] : '';
	}

	function	scrollOnClick(e) {
		const	timelineClickPosition = e.clientY - 93;
		const	timelineHeight = timelineContainer.current?.offsetHeight;
		const	totalHeight = window.document.body.offsetHeight - window.innerHeight;
		const	percentToScroll = timelineClickPosition / timelineHeight;
		const	distanceFromPageTop = window.document.body.getBoundingClientRect().top;
		const	distanceToScroll = (totalHeight * percentToScroll);
		const	distanceSinceLastPosition = distanceToScroll + distanceFromPageTop;

		window.scrollTo({top: distanceToScroll, left: 0, behavior: distanceSinceLastPosition < 2000 && distanceSinceLastPosition > -2000 ? 'smooth' : 'auto'})
	}

	return (
		<StyledTimeline ref={timelineContainer} onClick={scrollOnClick}>
			{
				props.data.map((eachPeriod) => {
					return (
						<StyledSeparatorDate key={eachPeriod} top={eachPeriod[2]}>{eachPeriod[0]}</StyledSeparatorDate>
					)
				})
			}
			<StyledCursorIndicator ref={cursor}><p></p></StyledCursorIndicator>
			<StyledScrollIndicator ref={scrollCursor}><p></p></StyledScrollIndicator>
		</StyledTimeline>
	)
})

function	PictureList(props) {
	const	[update, set_update] = useState(0);
	const	[isReady, set_isReady] = useState(false);

	const	[pictureList, set_pictureList] = useState(props.pictureList);
	const	[timelineData, set_timelineData] = useState([]);
	
	const	[selectMode, set_selectMode] = useState(false);
	const	[selectedPictures, set_selectedPictures] = useState([]);
	const	[selectedDays, set_selectedDays] = useState({});
	const	[albumSelectionModal, set_albumSelectionModal] = useState(false);
	const	[successToast, set_successToast] = useState(false);
	
	const	[lightRoom, set_lightRoom] = useState(false);
	const	[lightRoomIndex, set_lightRoomIndex] = useState(0);
	
	const	isShift = useKeyPress('Shift');
	const	[lastCheck, set_lastCheck] = useState(-1);
	const	[infiniteListHeight, set_infiniteListHeight] = useState(0);

	const	domElements = [];

	useEffect(() => {
		const	arrayDay = [];
		props.pictureList.forEach((each) => {
			if (!arrayDay[each.dateAsKey])
				arrayDay[each.dateAsKey] = [];
			arrayDay[each.dateAsKey].push(each)
		})

		set_pictureList(props.pictureList);
		set_update(prev => prev + 1);
		set_isReady(true);
	}, [props.pictureList])

	useEffect(() => {setTimelineData()}, [infiniteListHeight])

	function	setTimelineData() {
		const	pageSize = infiniteListHeight;
		const	timelineScrollerData = [];
		const	exists = []

		domElements.forEach((e) => {
			const	element = document.getElementById(e);
			const	relativeFromTop = element?.offsetTop / pageSize * 100;
			if (!exists[getMonthYear(e)]) {
				exists[getMonthYear(e)] = true
				timelineScrollerData.push([getMonthYear(e), getMonthYear(e), relativeFromTop])
			} else {
				timelineScrollerData.push(['•', getMonthYear(e), relativeFromTop])

			}
		})
		set_timelineData(timelineScrollerData)
	}

	if (!isReady)
		return (null);

	function	onDeletePicture(_selectedPictures = selectedPictures) {
		API.DeletePictures({picturesID: _selectedPictures}).then(() => {
			const	_pictureList = pictureList.filter(item => _selectedPictures.findIndex(elem => elem === item.uri) == -1)
			props.set_pictureList(_pictureList);
			set_selectedPictures([]);
			set_selectedDays({});
			set_selectMode(false);
		});
	}
	function	onSetAlbumCover() {
		API.SetAlbumCover({
			albumID: props.albumID,
			coverPicture: selectedPictures[0] || '',
		}).then((e) => {
			set_successToast(true);
			set_selectedPictures([]);
			set_selectedDays({});
			set_selectMode(false);
		})
	}

	function	getMonthYear(day) {
		const	months = [`Janvier`, `Février`, `Mars`, `Avril`, `Mai`, `Juin`, `Juillet`, `Août`, `Septembre`, `Octobre`, `Novembre`, `Décembre`];
		const	fullDate = new Date(day);

		return (`${months[fullDate.getMonth()]} ${fullDate.getFullYear()}`)
	}

	/**************************************************************************
	**	On select an image, we need to update the list of selected images
	**	and the selected days to update the checkboxes
	**************************************************************************/
	function	updateSelectedPicture(element) {
		const	_selectedPictures = selectedPictures;
		const	pictureSelected = _selectedPictures.indexOf(element.uri);
		const	daysToRecheck = {};

		if (pictureSelected >= 0)
			_selectedPictures.splice(pictureSelected, 1);
		else
			_selectedPictures.push(element.uri);

		daysToRecheck[element.day] = true;
		updateDaysCheckBox(daysToRecheck, _selectedPictures);
		set_selectedPictures(_selectedPictures);
		set_selectMode(_selectedPictures.length > 0);
		set_update(prev => prev + 1);
	}
	function	batchUpdateSelectedPictures(element, elemIndex) {
		const	_selectedPictures = selectedPictures;
		const	pictureSelected = _selectedPictures.indexOf(element.uri);
		const	daysToRecheck = {};
		const	batchFirst = lastCheck > elemIndex ? elemIndex : lastCheck;
		const	batchLast = lastCheck > elemIndex ? lastCheck : elemIndex;

		for (let i = batchFirst; i <= batchLast; i++) {
			if (pictureSelected >= 0) {
				//BATCH UNSELECT
				const	toUnselectIndex = _selectedPictures.indexOf(pictureList[i].uri);
				if (toUnselectIndex >= 0) {
					_selectedPictures.splice(toUnselectIndex, 1);
					daysToRecheck[pictureList[i].dateAsKey] = true
				}
			} else {
				//BATCH SELECT
				const	toSelectIndex = _selectedPictures.indexOf(pictureList[i].uri);
				if (toSelectIndex === -1) {
					_selectedPictures.push(pictureList[i].uri);
					daysToRecheck[pictureList[i].dateAsKey] = true
				}
			}
		}
		updateDaysCheckBox(daysToRecheck, _selectedPictures)
		set_selectedPictures(_selectedPictures);
		set_selectMode(_selectedPictures.length > 0);
		set_update(prev => prev + 1);
	}
	function	updateDaysCheckBox(daysToCheck, _selectedPictures) {
		const	_selectedDays = selectedDays;

		Object.keys(daysToCheck).map((eachDay) => {
			const	dayPictures = pictureList.filter(elem => elem.dateAsKey === eachDay).map(e => e.uri);
			const	selectedDayPictures = _selectedPictures.filter(elem => dayPictures.indexOf(elem) > -1);

			if (selectedDayPictures.length === 0) {
				_selectedDays[eachDay] = `NONE`;
			} else if (selectedDayPictures.length === dayPictures.length) {
				_selectedDays[eachDay] = `FULL`;
			} else {
				_selectedDays[eachDay] = `SOME`;
			}
		})
		set_selectedDays(_selectedDays);
	}
	function	onDayToggleClick(day) {
		const	dayPictures = pictureList.filter(elem => elem.dateAsKey === day).map(e => e.uri);
		const	selectedDayPictures = selectedPictures.filter(elem => dayPictures.indexOf(elem) > -1);
		
		if (selectedDayPictures.length === 0) {
			/* SHOULD SELECT ALL */
			const	_selectedPictures = [...selectedPictures, ...dayPictures];
			const	_selectedDays = selectedDays;
			_selectedDays[day] = `FULL`

			// console.log(pictureList.find(e => e.uri === dayPictures[dayPictures.length - 1]).originalIndex)
			set_selectedPictures(_selectedPictures);
			set_selectedDays(_selectedDays);
			set_selectMode(true);
			set_update(prev => prev + 1);
			set_lastCheck(pictureList.find(e => e.uri === dayPictures[dayPictures.length - 1]).originalIndex)
		} else if (selectedDayPictures.length === dayPictures.length) {
			/* SHOULD UNSELECT ALL */
			const	_selectedPictures = selectedPictures.filter(elem => dayPictures.indexOf(elem) === -1);
			const	_selectedDays = selectedDays;

			_selectedDays[day] = `NONE`
			
			set_lastCheck(-1);
			set_selectedPictures(_selectedPictures);
			set_selectedDays(_selectedDays);
			set_selectMode(_selectedPictures.length > 0);
			set_update(prev => prev + 1);
		} else {
			/* SHOULD SELECT SOME */
			const	toSelect = dayPictures.filter(elem => selectedDayPictures.indexOf(elem) === -1);
			const	_selectedPictures = [...selectedPictures, ...toSelect];
			const	_selectedDays = selectedDays;
			
			_selectedDays[day] = `FULL`

			set_lastCheck(pictureList.find(e => e.uri === dayPictures[dayPictures.length - 1]).originalIndex)
			set_selectedPictures(_selectedPictures);
			set_selectedDays(_selectedDays);
			set_selectMode(true);
			set_update(prev => prev + 1);
		}
	}

	function	renderImage(element, elemIndex) {
		return (
			<PhotoCardWidth
				key={`${element.uri}_${elemIndex}`}
				uri={element.uri}
				width={element.width}
				height={element.height}
				originalWidth={element.originalWidth}
				originalHeight={element.originalHeight}
				isSelectMode={selectMode}
				isSelected={selectedPictures.indexOf(element.uri) > -1}
				onToggle={() => {
					if (isShift && lastCheck > -1)
						batchUpdateSelectedPictures(element, elemIndex);
					else
						updateSelectedPicture(element);
					set_lastCheck(elemIndex);
				}}
				onClick={() => {
					set_lightRoomIndex(elemIndex);
					set_lightRoom(true);
				}}
				alt={'img'} />
		);
	}
	function	renderDaySeparator(day) {
		const	days = [`Dimanche`, `Lundi`, `Mardi`, `Mercredi`, `Jeudi`, `Vendredi`, `Samedi`];
		const	months = [`Janvier`, `Février`, `Mars`, `Avril`, `Mai`, `Juin`, `Juillet`, `Août`, `Septembre`, `Octobre`, `Novembre`, `Décembre`];

		const	fullDate = new Date(day);
		return (
			<StyledDate
				id={`${day}`}
				ref={() => domElements.push(`${day}`)}
				isToggleSelected={selectedDays[day] === 'FULL'}
				isToggleSome={selectedDays[day] === 'SOME'}
				onClick={() => {test();onDayToggleClick(day)}}>
				<Toggle />

				<p>{`${days[fullDate.getDay()]} ${fullDate.getDate()} ${months[fullDate.getMonth()]} ${fullDate.getFullYear()}`}</p>
			</StyledDate>
		)
	}

	return (
		<div>
			<ActionBar
				isEnabled={selectMode}
				albumID={props.albumID}
				onCancel={() => {
					set_selectedPictures([]);
					set_selectedDays({});
					set_selectMode(false);
				}}
				onAddToAlbum={() => set_albumSelectionModal(true)}
				onDeletePicture={onDeletePicture}
				onSetCover={onSetAlbumCover}
				len={selectedPictures.length} />
			<InfiniteList
				set_infiniteListHeight={set_infiniteListHeight}
				renderChildren={renderImage}
				renderDaySeparator={renderDaySeparator}
				childrenContainer={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 16}}
				pictureList={pictureList} />
			<AlbumSelectionModal
				isOpen={albumSelectionModal}
				onClose={() => {
					set_albumSelectionModal(false);
					set_selectedPictures([]);
					set_selectedDays({});
					set_selectMode(false);
				}}
				albumList={props.albumList}
				selected={selectedPictures} />
			<Timeline
				data={timelineData}
			/>
			<ToastSuccess
				isOpen={successToast}
				onClose={() => set_successToast(false)}
				status={'Les photos de couverture de l\'album ont été mises à jour'} />
			<Uploader
				memberPublicKey={props.memberPublicKey}
				albumID={props.albumID}
				set_pictureList={props.set_pictureList}
				isDragNDrop={props.isDragNDrop}
				set_isDragNDrop={props.set_isDragNDrop} />
			{lightRoom && <PictureLightroom
				onClose={() => set_lightRoom(false)}
				onDeletePicture={e => onDeletePicture([e.uri])}
				list={pictureList}
				originalIndex={lightRoomIndex} />
			}
		</div>
	);
}

export default PictureList;
