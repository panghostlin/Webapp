/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 14:39:16
** @Filename:				_app.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 00:41:54
*******************************************************************************/

import	React, {useState, useRef, forwardRef, useImperativeHandle}		from	'react';
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
			onUploadFile(oldWorker, index, files, fileUUID);
		},
		SetUploader() {
			SetUploader();
		}
	}));

	const	quality = 1; //0.8
	const	imgref = React.useRef(null);
	let		cryptoPublicKey = null;

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

			console.log(currentWorker)
			console.log(options)
			console.log(versions)

			
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
	async function	onUploadFile(oldWorker, index, files, fileUUID = undefined) {
		if (oldWorker)
			Worker.terminate(oldWorker)

		if (index >= files.length) {
			props.toasterRef.current.toggleToast(false, {
				preview: null,
				total: 0,
				current: 0,
				step: 0
			});
			return;
		}

		if (cryptoPublicKey === null) {
			const	publicKey = JSON.parse(sessionStorage.getItem(`Pub`))
			cryptoPublicKey = await window.crypto.subtle.importKey("jwk", publicKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["encrypt"])
		}

		const	currentWorker = Worker.register();
		const	file = files[index];
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
			total: files.length,
			current: index,
			step: 0
		});

		API.WSCreateChunkPicture(
			fileUUID,
			(UUID) => {
				const	options = {
					fileUUID: UUID,
					// fileAlbumID: props.albumID,
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

						// props.set_pictureList(_prev => [..._prev, response.Picture])
						onUploadFile(currentWorker, index + 1, files);
					} else {
						console.error(`ERROR WITH ${index}`);
						onUploadFile(currentWorker, index + 1, files) //SKIP THE FAILURE
					}
				} else {
					props.toasterRef.current.toggleToast(true, {
						preview: imgObject,
						total: files.length,
						current: index,
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
					// const	currentWorker = Worker.register();
					props.set_isDragNDrop(false);
					onUploadFile(undefined, 0, event.dataTransfer.files)
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

	return (
		<WithTheme>
			{router.route !== '/' && <NavBar />}
			<div
				onDragEnter={() => set_isDragNDrop(true)}
				style={{width: '100%', minHeight: '100vh'}}>
				<Component
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
				albumID={props.albumID}
				set_pictureList={props.set_pictureList}

				isDragNDrop={isDragNDrop}
				set_isDragNDrop={set_isDragNDrop} />
		</WithTheme>
	);
}


export default MyApp;