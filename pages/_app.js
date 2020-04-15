/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 14:39:16
** @Filename:				_app.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 12:38:53
*******************************************************************************/

import	React, {useState, useEffect, useRef, forwardRef, useImperativeHandle}		from	'react';
import	{useRouter}							from	'next/router';
import	WithTheme							from 	'../style/StyledTheme';
import	NavBar								from	'../components/Navbar';
import	ToastUpload							from	'../components/ToastUpload';
import	DragNDrop							from	'../components/DragNDrop';
import	{convertToMoment}					from	'../utils/ConvertDate';
import	* as Worker							from	'../utils/Worker';
import	* as API							from	'../utils/API';

const	Toaster = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		toggleToast(status, options) {
			set_toast(status);
			set_preview(options.preview)
			set_total(options.total)
			set_current(options.current)
			set_step(options.step)
		}
	}));

	const	[toast, set_toast] = useState(false);
	const	[preview, set_preview] = useState(undefined);
	const	[total, set_total] = useState(-1);
	const	[current, set_current] = useState(-1);
	const	[step, set_step] = useState(-1);

	return (
		<ToastUpload
			open={toast}
			fileAsBlobURL={preview}
			total={total}
			current={current}
			step={step} />
	);
});

const	Uploader = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		Reupload(oldWorker, index, files, fileUUID) {
			props.set_isDragNDrop(false);
			const	currentPage = Object.assign({}, props.componentRef);
			const	filesWithOptions = [];
			const	filesLength = files.length;

			for (var i = 0; i < filesLength; i++) {
				filesWithOptions.push({
					file: files[i],
					page: currentPage,
					UUID: fileUUID,
				});
			}
			uploadStack.current = [...uploadStack.current, ...filesWithOptions];
			uploadQueue.current = [...uploadQueue.current, ...filesWithOptions];
			set_stackVersion(_stackVersion => _stackVersion + 1);
		},
		SetUploader() {
			SetUploader();
		}
	}));

	const	uploadStack = useRef([]);
	const	uploadQueue = useRef([]);
	// const	[uploadStack, set_uploadStack] = useState([]);
	const	[stackVersion, set_stackVersion] = useState(0);
	const	[isUploading, set_isUploading] = useState(false);

	const	quality = 1; //0.8
	const	imgref = React.useRef(null);
	let		cryptoPublicKey = null;

	useEffect(() => {
		if (isUploading === false) {
			set_isUploading(true);
			onUploadStack(uploadStack, 0);
		}
	}, [stackVersion])


	function	CreateOriginalImage(objectURL) {
		return new Promise((resolve) => {
			const img = imgref.current;

			img.onload = function(e) {
				resolve(img);
			}
			img.onerror = function(message) {
				console.log(message)
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
			canvas.convertToBlob({type: 'image/jpeg', quality}).then((blob) => {
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
			canvas.convertToBlob({type: 'image/jpeg', quality}).then((blob) => {
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
	async function	onUploadStack() {
		const	element = uploadQueue.current[0];
		if (!element) {
			set_isUploading(false);
			uploadStack.current = []
			uploadQueue.current = []
			props.toasterRef.current.toggleToast(false, {preview: null, total: 0, current: 0, step: 0});
			return null;
		}

		if (cryptoPublicKey === null) {
			const	publicKey = JSON.parse(sessionStorage.getItem(`Pub`))
			cryptoPublicKey = await window.crypto.subtle.importKey("jwk", publicKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["encrypt"])
		}

		const	currentWorker = Worker.register();
		const	file = element.file;
		const	page = element.page;
		const	index = element.index;
		const	fileUUID = element.UUID;
		const	fileAsArrayBuffer = await Worker.postMessage(currentWorker, {file, type: 'file'})
		const	imgObject = URL.createObjectURL(new Blob([file], {type: file.type}));
		const	fileAsImg = await CreateOriginalImage(imgObject);

		/* ********************************************************************
		**	Now, for each image, we need to :
		**	- Generate a secret key
		**	- Generate an IV
		**	- Encrypt the image
		******************************************************************** */
		props.toasterRef.current.toggleToast(true, {
			preview: imgObject,
			total: uploadStack.current.length,
			current: uploadStack.current.length - uploadQueue.current.length,
			step: 0
		});

		API.WSCreateChunkPicture(
			fileUUID,
			(UUID) => {
				const	options = {
					fileUUID: UUID,
					fileAlbumID: (props.router.pathname === '/albums/[albumID]' && props.router.query.albumID) || '',
					cryptoPublicKey,
					name: file.name,
					lastModified: file.lastModified,
					type: file.type,
					isReupload: fileUUID !== undefined
				};
				const	versions = {file, arrayBuffer: fileAsArrayBuffer, image: fileAsImg};
				performWorkerUpload(currentWorker, options, versions)
			},
			(response) => {
				if (response.Step === 4) {
					if (response.Picture && response.Picture.uri !== '' && response.IsSuccess === true) {
						response.Picture.dateAsKey = convertToMoment(response.Picture.originalTime)

						props.onUploaded(_prev => [..._prev, response.Picture], page);
						Worker.terminate(currentWorker);
						const	_uploadQueue = uploadQueue.current;
						_uploadQueue.shift();
						uploadQueue.current = _uploadQueue
						onUploadStack();
						
					} else {
						console.error(`ERROR WITH ${index}`);
						Worker.terminate(currentWorker);
						const	_uploadQueue = uploadQueue.current;
						_uploadQueue.shift();
						uploadQueue.current = _uploadQueue
						onUploadStack();
					}
				} else {
					props.toasterRef.current.toggleToast(true, {
						preview: imgObject,
						total: uploadStack.current.length,
						current: uploadStack.current.length - uploadQueue.current.length,
						step: response.Step
					})
				}	
			}
		);
	}

	function SetUploader() {
		props.toasterRef.current.toggleToast(true, {total: -1, current: -1, step: 0});
	}

	return (
		<>
			<img id={'image'} ref={imgref} style={{opacity: 0, pointerEvent: 'none'}} />
			<DragNDrop
				isOpen={props.isDragNDrop}
				onDragLeave={() => props.set_isDragNDrop(false)}
				onDrop={(event) => {
					props.set_isDragNDrop(false);
					const	currentPage = Object.assign({}, props.componentRef);
					const	filesWithOptions = [];
					const	filesLength = event.dataTransfer.files.length;

					for (var i = 0; i < filesLength; i++) {
						filesWithOptions.push({
							file: event.dataTransfer.files[i],
							page: currentPage,
							UUID: undefined,
						});
					}
					uploadStack.current = [...uploadStack.current, ...filesWithOptions];
					uploadQueue.current = [...uploadQueue.current, ...filesWithOptions];
					set_stackVersion(_stackVersion => _stackVersion + 1);
				}} />
		</>
	);
});

function	MyApp(props) {
	const	{Component, pageProps} = props;
	const	router = useRouter();
	const	[isDragNDrop, set_isDragNDrop] = useState(false);
	const	toasterRef = useRef(null);
	const	uploaderRef = useRef(null);
	const	componentRef = useRef(null);

	return (
		<WithTheme>
			{router.route !== '/' && <NavBar />}
			<div
				onDragEnter={() => set_isDragNDrop(true)}
				style={{width: '100%', minHeight: '100vh'}}>
				<Component
					ref={componentRef}
					isDragNDrop={isDragNDrop}
					set_isDragNDrop={set_isDragNDrop}
					element={props.element}
					toasterRef={toasterRef}
					{...pageProps} />
			</div>
			<Toaster ref={toasterRef} />
			<Uploader
				ref={uploaderRef}
				toasterRef={toasterRef}
				componentRef={componentRef}
				isDragNDrop={isDragNDrop}
				set_isDragNDrop={set_isDragNDrop}
				router={router}
				onUploaded={(data, objCopy) => {
					if (objCopy.current && componentRef.current) {
						const	onUploadPageInformation = JSON.stringify(objCopy.current.pageInformations);
						const	currentPageInformation = JSON.stringify(componentRef.current.pageInformations);

						if (onUploadPageInformation === currentPageInformation) {
							//Same page, we can perform the onUploaded callback
							componentRef.current.onUploaded(data)
						} else if (currentPageInformation === '{"page":"gallery"}') {
							//Main page -> we can still append the picture to the page
							componentRef.current.onUploaded(data)
						}
					}
				}} />
		</WithTheme>
	);
}


export default MyApp;