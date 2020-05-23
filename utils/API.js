/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 06 January 2020 - 16:19:35
** @Filename:				API.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 14 April 2020 - 20:31:49
*******************************************************************************/

import fetch from 'isomorphic-unfetch';
import	* as Crypto from './Crypto';

export const API = process.env.isDev ? `http://localhost:8000` : `https://api.${process.env.BACKEND}`;
const WSAPI = process.env.isDev ? `ws://localhost:8000` : `wss://api.${process.env.BACKEND}`;

const	performFetch = (url, method, args, header) =>
{
	const	body = JSON.stringify({...args});
	return (
		fetch(`${API}/${url}`, {
			method,
			body,
			headers: {
				'Content-Type': 'application/json',
				'cookie': header
			},
			credentials: 'include'
		})
		.then(async (response) =>
		{
			if (response.status === 401) {
				//The user is Unauthorized -> Invalid token/not connected, need for auth
				window.location.href = '/';
				return null;
			}
			const	json = await response.json();
			return (json);
		})
		.catch((err) => {
			console.warn(`${API}/${url}`, err)
		})
	);
};

function	send(url, chunk, chunkID, parts, file, UUID, albumID) {
	const	formData  = new FormData();
	formData.append('file', new Blob([chunk]), file.name);
	formData.append('fileUUID', UUID);
	formData.append('fileType', file.type);
	formData.append('fileName', file.Name);
	formData.append('fileLastModified', file.LastModified);
	formData.append('fileSizeType', file.SizeType);
	formData.append('fileWidth', file.Width);
	formData.append('fileHeight', file.Height);
	formData.append('fileAlbumID', albumID || '');
	formData.append('fileChunkID', chunkID);
	formData.append('fileParts', parts);
	formData.append('encryptionKey', file.Key);
	formData.append('encryptionIV', file.IV);
	formData.append('isLast', file.IsLast);
	formData.append('preview', file.Preview);

	return (
		fetch(`${API}/${url}`, {
			method: 'POST',
			body: formData,
			credentials: 'include'
		})
		.catch((err) => {
			console.warn(`${API}/${url}`, err)
		})
	);
}
const	recursiveUpload = (file, currentByte, chunkSize, chunksQuantity, index) => {
	if (currentByte > file.size)
		return;

	const	currentIndex = index;
	let		chunks = '';

	if (currentByte + chunkSize > file.size) {
		chunks = file.slice(currentByte, file.size)
	} else {
		chunks = file.slice(currentByte, currentByte + chunkSize)
	}
	setTimeout(() => {
		send(chunks, currentIndex, chunksQuantity, file)
	}, 1 * index)
	recursiveUpload(file, currentByte + chunkSize, chunkSize, chunksQuantity, index + 1)
}
export	const	upload = (url, file, UUID, albumID) => {
	const	chunkSize = 64 * 1024;
	const	chunksQuantity = Math.ceil(file.encryptedData.byteLength / chunkSize);

	let		index = 0;
	let		chunks = '';

	for (let currentByte = 0; currentByte < file.encryptedData.byteLength; currentByte += chunkSize) {
		const	currentIndex = index;

		if (currentByte + chunkSize > file.encryptedData.byteLength) {
			chunks = file.encryptedData.slice(currentByte, file.encryptedData.byteLength)
		} else {
			chunks = file.encryptedData.slice(currentByte, currentByte + chunkSize)
		}
		send(url, chunks, currentIndex, chunksQuantity, file, UUID, albumID)
		index += 1
	}
};


export	const	CreateChunkPicture = (UUID, file, albumID) => upload('uploadPicture/', file, UUID, albumID);

export	const	WSCreateChunkPicture = (UUID = undefined, performAction, onMessage) => {
	let	uri = `${WSAPI}/ws/uploadPicture/`

	if (UUID)
		uri += UUID

	const	socket = new WebSocket(uri);
	socket.onmessage = (e) => {
		if (onMessage) {
			const	response = JSON.parse(e.data);
			if (response.Step === 1 && response.UUID !== ``) {
				performAction(response.UUID)
			} else {
				if (response.Step === 4) {
					socket.close()
				}
				onMessage(response);
			}
		} else {
			socket.close();
		}
	}
	socket.onclose = () => null
	socket.onerror = e => console.warn(e)
}


/******************************************************************************
**	PICTURES
*****************************************************************************/
export	const	GetMemberPictures = args => performFetch('pictures/getby/member/', 'POST', args, null);
export	const	GetAlbumPictures = args => performFetch('pictures/getby/album/', 'POST', args, null);

export	const	SetPicturesAlbum = args => performFetch('pictures/set/album/', 'POST', args, null);
export	const	SetPicturesDate = args => performFetch('pictures/set/date/', 'POST', args, null);

export	const	DeletePictures = args => performFetch('deletePictures/', 'POST', args, null);

/******************************************************************************
**	ALBUMS
*****************************************************************************/
export	const	CreateAlbum = args => performFetch('albums/create/', 'POST', args, null);
export	const	ListAlbums = args => performFetch('albums/list/', 'POST', args, null);
export	const	GetAlbum = args => performFetch('albums/get/', 'POST', args, null);
export	const	DeleteAlbum = args => performFetch('albums/delete/', 'POST', args, null);
export	const	SetAlbumCover = args => performFetch('albums/set/cover/', 'POST', args, null);
export	const	SetAlbumName = args => performFetch('albums/set/name/', 'POST', args, null);

/******************************************************************************
**	Members
*****************************************************************************/
export	const	CreateMember = args => performFetch('newMember/', 'POST', args, null);
export	const	LoginMember = args => performFetch('loginMember/', 'POST', args, null);
export	const	CheckMember = (args, cookies) => performFetch('checkMember/', 'POST', args, cookies);
export	const	GetMember = args => performFetch('getMember/', 'POST', args, null);

let		cryptoPrivateKey = null;
export const	GetImage = async (uri, signal, size = 'max500') =>
{
	if (cryptoPrivateKey === null) {
		const	privateKey = JSON.parse(sessionStorage.getItem(`Priv`))
		cryptoPrivateKey = await window.crypto.subtle.importKey("jwk", privateKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["decrypt"])
	}

	return (
		fetch(`${API}/downloadPicture/${size}/${uri}`, {
			signal,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(async (response) =>
		{
			const	buffer = await response.json();
			const	encryptionData = await Crypto.DecryptData(
				Crypto.FromBase64(buffer.Picture),
				cryptoPrivateKey,
				Crypto.FromBase64(buffer.IV),
				buffer.Key
			);
			return ([encryptionData, buffer.Preview]);
		})
		.catch((err) => {
			console.warn(`${API}/${uri}`, err)
		})
	);
};
export const	GetPreview = async (uri, signal) =>
{
	if (cryptoPrivateKey === null) {
		const	privateKey = JSON.parse(sessionStorage.getItem(`Priv`))
		cryptoPrivateKey = await window.crypto.subtle.importKey("jwk", privateKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["decrypt"])
	}

	return (
		fetch(`${API}/downloadPreview/${uri}`, {
			signal,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(async (response) =>
		{
			const	buffer = await response.json();
			//WILL NEED A DECRYPT
			console.warn(`PREVIEW IS NOT E2E ENCRYPTED`)
			return (buffer.preview);
		})
		.catch((err) => {
			console.warn(`${API}/${uri}`, err)
		})
	);
};