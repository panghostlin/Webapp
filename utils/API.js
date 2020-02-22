/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 06 January 2020 - 16:19:35
** @Filename:				API.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Saturday 22 February 2020 - 10:27:51
*******************************************************************************/

import fetch from 'isomorphic-unfetch';
import	* as Crypto from './Crypto';

// export const	API = `https://api.${process.env.BACKEND}`;
// const	WSAPI = `wss://api.${process.env.BACKEND}`;

export const	API = `http://localhost:8000`;
const	WSAPI = `ws://localhost:8000`;

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
	formData.append("file", chunk, file.name);
	formData.append('fileUUID', UUID);
	formData.append('fileType', file.type);
	formData.append('fileName', file.Name);
	formData.append('fileLastModified', file.LastModified);
	formData.append('fileWidth', file.Width);
	formData.append('fileHeight', file.Height);
	formData.append('fileAlbumID', albumID || '');
	formData.append('fileChunkID', chunkID);
	formData.append('fileParts', parts);
	formData.append('encryptionKey', file.Key);
	formData.append('encryptionIV', file.IV);

	return (
		fetch(`${API}/${url}`, {
			method: 'POST',
			body: formData,
			credentials: 'include'
		})
		.then(async (response) =>
		{
			const	json = await response.json();
			console.log(json)
			return (json);
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
	// allChunk.push(chunks)
	setTimeout(() => {
		send(chunks, currentIndex, chunksQuantity, file)
		// console.log(index)
	}, 1 * index)
	recursiveUpload(file, currentByte + chunkSize, chunkSize, chunksQuantity, index + 1)
}
export	const	upload = (url, file, UUID, albumID) => {
	const	chunkSize = 64 * 1024;
	const	chunksQuantity = Math.ceil(file.size / chunkSize);


	let		index = 0;
	let		chunks = '';

	// recursiveUpload(file, 0, chunkSize, chunksQuantity, 0)
	
	for (let currentByte = 0; currentByte < file.size; currentByte += chunkSize) {
		const	currentIndex = index;

		if (currentByte + chunkSize > file.size) {
			chunks = file.slice(currentByte, file.size)
		} else {
			chunks = file.slice(currentByte, currentByte + chunkSize)
		}
		send(url, chunks, currentIndex, chunksQuantity, file, UUID, albumID)
		index += 1
	}
};


export	const	CreateChunkPicture = (UUID, file, albumID) => upload('uploadPicture/', file, UUID, albumID);


export	const	WSCreateChunkPicture = (file, performAction, onMessage) => {
	let socket = new WebSocket(`${WSAPI}/ws/uploadPicture/`);

	socket.onopen = function(e) {
		console.log(e)
		// const	response = {Step: 0, UUID: ''}
		// onMessage(response)
		// performAction()
	};
	socket.onmessage = function (e) {
		if (onMessage) {
			const	response = JSON.parse(e.data);
			console.log(response)

			if (response.Step === 1 && response.UUID !== ``) {
				performAction(response.UUID)
			} else {
				if (response.Step === 4)
					socket.close()
				onMessage(response, file);
			}
		}
	}
	socket.onclose = function () {
		console.log("Socket closed");
		return
	}
	socket.onerror = (e) => console.warn(e)

	return socket;
}

/******************************************************************************
**	PICTURES
*****************************************************************************/
export	const	GetMemberPictures = args => performFetch('pictures/getby/member/', 'POST', args, null);
export	const	GetAlbumPictures = args => performFetch('pictures/getby/album/', 'POST', args, null);

export	const	SetPicturesAlbum = args => performFetch('pictures/set/album/', 'POST', args, null);
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

// export	const	GetImage = uri => performFetch(`downloadPicture/500x500/${uri}`, 'GET', null, null);

let		cryptoPrivateKey = undefined;
let		cryptoPublicKey = undefined;
export const	GetImage = async (uri) =>
{
	// if (cryptoPublicKey === undefined) {
	// 	const	publicKey = JSON.parse(sessionStorage.getItem(`Pub`))
	// 	cryptoPublicKey = await window.crypto.subtle.importKey("jwk", publicKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["encrypt"])
	// }
	if (cryptoPrivateKey === undefined) {
		const	privateKey = JSON.parse(sessionStorage.getItem(`Priv`))
		cryptoPrivateKey = await window.crypto.subtle.importKey("jwk", privateKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["decrypt"])
	}

	return (
		fetch(`${API}/downloadPicture/500x500/${uri}`, {
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
			)
			return (encryptionData);
		})
		.catch((err) => {
			console.warn(`${API}/${uri}`, err)
		})
	);
};