
// const	API = `http://localhost:8000`;
const	API = `https://api.${process.env.BACKEND}`;

/* Crypto helpers */
function _arrayBufferToBase64(buffer) {
	var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return btoa( binary );
}
async function	EncryptData(dataToEncrypt, publicKey) {
	const	secretKey = await crypto.subtle.generateKey({name: "AES-CTR", length: 256}, true, ["encrypt", "decrypt"]);
	const	IV = crypto.getRandomValues(new Uint8Array(16))
	const	encryptedData = await crypto.subtle.encrypt({name: "AES-CTR", counter: IV, length: 128}, secretKey, dataToEncrypt);
	const	rawExportedSecretKey = await crypto.subtle.exportKey("raw", secretKey);
	const	encryptedSecretKey = await crypto.subtle.encrypt({name: "RSA-OAEP"}, publicKey, rawExportedSecretKey);
	const	encodedSecretKey = _arrayBufferToBase64(encryptedSecretKey);

	return ({encryptedData, IV, encodedSecretKey});
}

/* IMAGE TO XXX */
function	GetBinary(file) {
	const	fileReader = new FileReader();

	return new Promise((resolve, reject) => {
		fileReader.onerror = () => {
			fileReader.abort();
			reject(new DOMException("Problem parsing input file."));
		};
		fileReader.onload = function() {
			resolve(this.result)
		};
		fileReader.readAsArrayBuffer(file);
	});
}
function	GetFile(file) {
	const	fileReader = new FileReader();

	return new Promise((resolve, reject) => {
		fileReader.onerror = () => {
			fileReader.abort();
			reject(new DOMException("Problem parsing input file."));
		};
		fileReader.onload = () => {
			resolve(fileReader.result);
		};
		fileReader.readAsArrayBuffer(file);
		// fileReader.readAsDataURL(file);
	});
}
function	GetImage(image, options) {
	const	originalImageWidth = options.width
	const	originalImageHeight = options.height
	const	thumbSize = options.targetSize;
	const	canvas = new OffscreenCanvas(originalImageWidth, originalImageHeight);
	const	c = canvas.getContext('2d');

	const	ratio = Math.min(thumbSize / originalImageWidth, thumbSize / originalImageHeight);
	const	rWidth = Math.round(originalImageWidth * ratio);
	const	rHeight = Math.round(originalImageHeight * ratio);
	const	newWidth = (((rWidth - originalImageWidth) / rWidth) * -0.01)
	const	newHeight = (((rHeight - originalImageHeight) / rHeight) * -0.01)

	return new Promise((resolve) => {
		c.putImageData(image, 0, 0, 0, 0, originalImageWidth, originalImageHeight);
		c.scale(newWidth, newHeight);
		c.getImageData(0, 0, thumbSize, thumbSize);
		canvas.convertToBlob({type: options.type, quality: 0.8}).then((blob) => {
			resolve({blob, width: rWidth, height: rHeight})
		})
	});
}

/* IMAGE UPLOAD */
function	ChunckSender(chunk, chunkID, parts, file, options) {
	let		formData  = new FormData();
	formData.append('file', new Blob([chunk]), file.name);
	formData.append('fileUUID', options.fileUUID);
	formData.append('fileType', options.type);
	formData.append('fileName', options.name);
	formData.append('fileLastModified', options.lastModified);
	formData.append('fileSizeType', file.SizeType);
	formData.append('fileWidth', file.Width);
	formData.append('fileHeight', file.Height);
	formData.append('fileAlbumID', options.fileAlbumID || '');
	formData.append('fileChunkID', chunkID);
	formData.append('fileParts', parts);
	formData.append('encryptionKey', file.Key);
	formData.append('encryptionIV', file.IV);
	formData.append('isLast', file.IsLast);
	formData.append('isReupload', options.isReupload);

	return (
		fetch(`${API}/uploadPicture/`, {
			method: 'POST',
			body: formData,
			credentials: 'include'
		})
		.catch((err) => {
			console.warn(`${API}/uploadPicture/`, err)
		})
	);
}
function	ChunkUploader(file, options, eventPort) {
	const	chunkSize = 16 * 64 * 1024; //1mo
	const	chunksQuantity = Math.ceil(file.encryptedData.byteLength / chunkSize);
	let		doneCount = 0;
	let		index = 0;
	let		chunks = '';

	for (let currentByte = 0; currentByte < file.encryptedData.byteLength; currentByte += chunkSize) {
		const	currentIndex = index;

		if (currentByte + chunkSize >= file.encryptedData.byteLength) {
			chunks = file.encryptedData.slice(currentByte, file.encryptedData.byteLength)
		} else {
			chunks = file.encryptedData.slice(currentByte, currentByte + chunkSize)
		}
		ChunckSender(chunks, currentIndex, chunksQuantity, file, options)
		.then(() => {
			doneCount++
			if (doneCount === chunksQuantity)
				eventPort.postMessage(true);
		})
		index += 1
	}
}

async function	UploadPicture(image, options, eventPort) {
	let		encryptionData = null;
	encryptionData = await EncryptData(image, options.cryptoPublicKey);
	encryptionData.Width = options.width;
	encryptionData.Height = options.height;
	encryptionData.SizeType = options.targetSize === `original` ? options.targetSize : `max${options.targetSize}`;
	encryptionData.Key = encryptionData.encodedSecretKey;
	encryptionData.IV = _arrayBufferToBase64(encryptionData.IV);
	encryptionData.IsLast = options.isLast

	ChunkUploader(encryptionData, options, eventPort)
}

self.addEventListener('message', async (event) => {
	if (event.data.type === 'binary') {
		const	binary = await GetBinary(event.data.file);
		event.ports[0].postMessage(binary);
	}
	else if (event.data.type === 'file')
	{
		const	fileResult = await GetFile(event.data.file);
		event.ports[0].postMessage(fileResult, [fileResult]);
	}
	else if (event.data.type === 'both')
	{
		Promise.all([GetBinary(event.data.file), GetFile(event.data.file)]).then(function(values) {
			event.ports[0].postMessage({binary: values[0], file: values[1]});
		});
	}
	else if (event.data.type === 'image')
	{
		let	imageResult = await GetImage(event.data.image, event.data.options);
		event.ports[0].postMessage(imageResult);
		imageResult = null;
	}

	else if (event.data.type === 'uploadPicture')
	{
		UploadPicture(
			event.data.file,
			event.data.options,
			event.ports[0]
		);
	}
})
