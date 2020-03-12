/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 17 January 2020 - 15:15:55
** @Filename:				PictureList.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 12 March 2020 - 22:53:14
*******************************************************************************/

import	React, {useState, useEffect, useLayoutEffect}	from	'react';
import	styled							from	'styled-components';
import	PhotoCardWidth					from	'./PhotoCardWidth';
import	InfiniteList					from	'./InfiniteList';
import	ModalAlbumSelection				from	'./ModalAlbumSelection';
import	ModalDayPicker					from	'./ModalDayPicker';
import	ToastUpload						from	'./ToastUpload';
import	ToastSuccess					from	'./ToastSuccess';
import	PictureLightroom				from	'./PictureLightroom';
import	DragNDrop						from	'./DragNDrop';
import	Timebar							from	'./Timebar';
import	{ActionBar}						from	'./Navbar';
import	* as API						from	'../utils/API';
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

function	PictureList(props) {
	const	[update, set_update] = useState(0);
	const	[isReady, set_isReady] = useState(false);

	const	[pictureList, set_pictureList] = useState(props.pictureList);
	const	[mappedPictureList, set_mappedPictureList] = useState([]);
	const	[timelineData, set_timelineData] = useState([]);
	
	const	[selectMode, set_selectMode] = useState(false);
	const	[selectedPictures, set_selectedPictures] = useState([]);
	const	[selectedDays, set_selectedDays] = useState({});
	const	[albumSelectionModal, set_albumSelectionModal] = useState(false);
	const	[changeDateModal, set_changeDateModal] = useState(false);
	const	[successToast, set_successToast] = useState(false);
	
	const	[lightRoom, set_lightRoom] = useState(false);
	const	[lightRoomIndex, set_lightRoomIndex] = useState(0);
	
	const	isShift = useKeyPress('Shift');
	const	[lastCheck, set_lastCheck] = useState(-1);
	const	[infiniteListHeight, set_infiniteListHeight] = useState(0);

	const	domElements = [];

	useEffect(() => {
		const	_mappedPictureList = [];
		props.pictureList.forEach(each => _mappedPictureList[each.uri] = each)

		set_mappedPictureList(_mappedPictureList);
		set_pictureList(props.pictureList);
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
				timelineScrollerData.push([getMonthYear(e), getDate(e), relativeFromTop])
			} else {
				timelineScrollerData.push(['•', getDate(e), relativeFromTop])

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
	function	getDate(day) {
		const	months = [`Janvier`, `Février`, `Mars`, `Avril`, `Mai`, `Juin`, `Juillet`, `Août`, `Septembre`, `Octobre`, `Novembre`, `Décembre`];
		const	fullDate = new Date(day);

		return (`${fullDate.getDate()} ${months[fullDate.getMonth()]} ${fullDate.getFullYear()}`);
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
		}
	}
	function	onSelectAll() {
		const	_selectedDays = {};
		const	_selectedPictures = pictureList.map(e => e.uri)
		pictureList.map(e => _selectedDays[e.dateAsKey] = `FULL`)

		set_lastCheck(-1);
		set_selectedPictures(_selectedPictures);
		set_selectedDays(_selectedDays);
	}
	function	onUnselectAll() {
		set_lastCheck(-1);
		set_selectedPictures([]);
		set_selectedDays({});
		set_selectMode(false);
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
				onClick={() => onDayToggleClick(day)}>
				<Toggle />

				<p>{`${days[fullDate.getDay()]} ${fullDate.getDate()} ${months[fullDate.getMonth()]} ${fullDate.getFullYear()}`}</p>
			</StyledDate>
		)
	}

	return (
		<div>
			<ActionBar
				isEnabled={selectMode}
				allPictureSelected={selectMode && pictureList.length === selectedPictures.length}
				albumID={props.albumID}
				onCancel={() => {
					set_selectedPictures([]);
					set_selectedDays({});
					set_selectMode(false);
				}}
				onAddToAlbum={() => set_albumSelectionModal(true)}
				onChangeDate={() => set_changeDateModal(true)}
				onDeletePicture={onDeletePicture}
				onSetCover={onSetAlbumCover}
				onSelectAll={onSelectAll}
				onUnselectAll={onUnselectAll}
				len={selectedPictures.length} />
			<InfiniteList
			update={update}
				set_infiniteListHeight={set_infiniteListHeight}
				renderChildren={renderImage}
				renderDaySeparator={renderDaySeparator}
				childrenContainer={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 16}}
				pictureList={pictureList} />
			<ModalAlbumSelection
				isOpen={albumSelectionModal}
				onClose={() => {
					set_albumSelectionModal(false);
					set_selectedPictures([]);
					set_selectedDays({});
					set_selectMode(false);
				}}
				albumList={props.albumList}
				selected={selectedPictures} />
			<ModalDayPicker
				isOpen={changeDateModal}
				onConfirm={(newDate) => {
					const	_mappedPictureList = [];
					const	_pictureList = pictureList.map((each) => {
						if (selectedPictures.includes(each.uri)) {
							each.originalTime = newDate;
							each.dateAsKey = convertToMoment(newDate)
						}
						_mappedPictureList[each.uri] = each
						return (each);
					});

					set_changeDateModal(false);
					set_selectedPictures([]);
					set_selectedDays({});
					set_selectMode(false);
					set_mappedPictureList(_mappedPictureList);
					set_pictureList(_pictureList);
				}}
				onClose={() => {
					set_changeDateModal(false);
					set_selectedPictures([]);
					set_selectedDays({});
					set_selectMode(false);
				}}
				selectedObject={mappedPictureList[selectedPictures[0]]}
				selected={selectedPictures} />
			<Timebar
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
