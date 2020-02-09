/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 06 January 2020 - 16:19:35
** @Filename:				API.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 06 February 2020 - 20:59:05
*******************************************************************************/

import fetch from 'isomorphic-unfetch';

export const	API = 'https://proxy.localhost';
const	WSAPI = 'wss://proxy.localhost';
// export const	API = 'https://192.168.0.13:8099';
// const	WSAPI = 'wss://192.168.0.13:8099';

const	performFetch = (url, method, args, callback) =>
{
	const	body = JSON.stringify({...args});

	return (
		fetch(`${API}/${url}`, {
			method,
			body,
			// credentials: `same-origin`,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				// Authorization: 
			},
			credentials: 'include'
		})
		.then(async (response) =>
		{
			const	json = await response.json();
			if (callback && json)
				callback(json);
			return (json);
		})
		.catch((err) => {
			console.warn(url, err)
		})
	);
};

function	send(url, chunk, chunkId, parts, file, UUID, albumID) {
	return (
		new Promise((resolve, reject) =>
		{
			const xhr = new XMLHttpRequest();

			xhr.open('POST', `${API}/${url}/`, true);
			xhr.withCredentials = true;

			xhr.setRequestHeader('Content-Type', 'application/octet-stream');
			xhr.setRequestHeader('Access-Control-Allow-Credentials', true);
			xhr.setRequestHeader('X-Content-Type', file.type || '');
			xhr.setRequestHeader('X-Content-Length', file.size);
			xhr.setRequestHeader('X-Content-Name', encodeURI(file.name || ''));
			xhr.setRequestHeader('X-Content-Parts', parts);
			xhr.setRequestHeader('X-Content-Last-Modified', file.lastModified);
			xhr.setRequestHeader('X-Content-UUID', UUID);
			xhr.setRequestHeader('X-Content-AlbumID', albumID || '');
			xhr.setRequestHeader('X-Chunk-ID', chunkId);

			xhr.onreadystatechange = () =>
			{
				if (xhr.readyState === 4 && xhr.status === 200)
					return (resolve(xhr.response));
			};
			xhr.onerror = reject;
			xhr.send(chunk);
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



export	const	CreateMember = args => performFetch('newMember/', 'POST', args, null, false);
export	const	LoginMember = args => performFetch('loginMember/', 'POST', args, null, false);

export	const	CreateChunkPicture = (UUID, file, albumID) => upload('uploadPicture/', file, UUID, albumID);


export	const	WSCreateChunkPicture = (file, performAction, onMessage) => {
	let socket = new WebSocket(`${WSAPI}/ws/uploadPicture/`);

	socket.onopen = function(e) {
		// const	response = {Step: 0, UUID: ''}
		// onMessage(response)
		// performAction()
	};
	socket.onmessage = function (e) {
		if (onMessage) {
			const	response = JSON.parse(e.data);
			// console.log(response)

			if (response.Step === 1 && response.UUID !== ``) {
				performAction(response.UUID)
			} else {
				onMessage(response, file);
			}
		}
	}
	socket.onclose = function () {
		console.log("Socket closed");
		return
	}

	// while (true) {
	// }
	console.log(`RETURNING`)
	return socket;
}

/******************************************************************************
**	PICTURES
*****************************************************************************/
export	const	GetMemberPictures = args => performFetch('pictures/getby/member/', 'POST', args, null, false);
export	const	GetAlbumPictures = args => performFetch('pictures/getby/album/', 'POST', args, null, false);

export	const	SetPicturesAlbum = args => performFetch('pictures/set/album/', 'POST', args, null, false);
export	const	DeletePictures = args => performFetch('deletePictures/', 'POST', args, null, false);

/******************************************************************************
**	ALBUMS
*****************************************************************************/
export	const	CreateAlbum = args => performFetch('albums/create/', 'POST', args, null, false);
export	const	ListAlbums = args => performFetch('albums/list/', 'POST', args, null, false);
export	const	GetAlbum = args => performFetch('albums/get/', 'POST', args, null, false);
export	const	DeleteAlbum = args => performFetch('albums/delete/', 'POST', args, null, false);
export	const	SetAlbumCover = args => performFetch('albums/set/cover/', 'POST', args, null, false);
export	const	SetAlbumName = args => performFetch('albums/set/name/', 'POST', args, null, false);
