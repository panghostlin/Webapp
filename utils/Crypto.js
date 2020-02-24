/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Wednesday 19 February 2020 - 13:40:53
** @Filename:				Crypto.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 24 February 2020 - 14:12:49
*******************************************************************************/

function _arrayBufferToBase64(buffer) {
	var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return window.btoa( binary );
}
function _base64ToArrayBuffer(base64) {
	var binary_string = window.atob(base64);
	var len = binary_string.length;
	var bytes = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}
export function	ToBase64(buffer) {
	return (_arrayBufferToBase64(buffer));
}
export function	FromBase64(buffer) {
	return (_base64ToArrayBuffer(buffer));
}

export async function	GeneratePemKeysFromPassword(password) {
	const	encoder = new TextEncoder("utf-8");
	const	encodedPassword = encoder.encode(password);
	const	iv = new Uint8Array(256);
	const	salt = new Uint8Array(256);

	window.crypto.getRandomValues(iv);
	window.crypto.getRandomValues(salt);

	/* ************************************************************************
	**	We are generating a private and a public key for the member.
	**	Theses keys are the most important part of all the process. Without
	**	them, no encryption, but also no decryption.
	************************************************************************ */
	const	pemKey = await window.crypto.subtle.generateKey({
		name: "RSA-OAEP",
		modulusLength: 4096,
		publicExponent: new Uint8Array([1, 0, 1]),
		hash: {name: "SHA-512"},
	}, true, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);

	/* ************************************************************************
	**	We need to save the keys to the database to get access to them
	**	We cannot (should not, must not) save the plain keys.
	**	We need to encrypt the private key, which will be used for decryption
	**	with the user password.
	**	To achieve this, we need to transform the password to a crypto key, and
	**	derive it from a random salt.
	**	The salt will be stored with the password for user decryption
	************************************************************************ */
	const	passwordKey = await window.crypto.subtle.importKey("raw",
		encodedPassword,
		{"name": "PBKDF2"},
		false,
		["deriveKey"]
	);
	const	derivedKey = await window.crypto.subtle.deriveKey(
		{"name": "PBKDF2", salt: salt, "iterations": 100000, "hash": "SHA-256"},
		passwordKey,
		{"name": "AES-GCM", "length": 256},
		true,
		["wrapKey", "unwrapKey"]
	);

	/* ************************************************************************
	**	We can now wrap the private key with the key derived from the password
	**	with an IV which will be stored on the server with the salt and the
	**	crypted private key.
	************************************************************************ */
	const	cryptedPrivateKey = await window.crypto.subtle.wrapKey("pkcs8", pemKey.privateKey, derivedKey, {name: "AES-GCM", iv: iv});
	const	exportedPublicKey = await window.crypto.subtle.exportKey("spki", pemKey.publicKey);

	return ({
		privateKey: pemKey.privateKey,
		publicKey: pemKey.publicKey,
		exportedPublicKey,
		cryptedPrivateKey,
		salt,
		IV: iv
	})
}

export async function	RetrievePemKeysFromPassword(password, encryptedPrivateKey, salt, IV) {
	const	encoder = new TextEncoder("utf-8");
	const	encodedPassword = encoder.encode(password);

	/* ************************************************************************
	**	We need to reverse the encryption process
	**	First thing to do is to recreate the derived key from the password and
	**	the salt
	************************************************************************ */
	const	passwordKey = await window.crypto.subtle.importKey("raw",
		encodedPassword,
		{"name": "PBKDF2"},
		false,
		["deriveKey"]
	);
	const	derivedKey = await window.crypto.subtle.deriveKey(
		{"name": "PBKDF2", salt: salt, "iterations": 100000, "hash": "SHA-256"},
		passwordKey,
		{"name": "AES-GCM", "length": 256},
		true,
		["wrapKey", "unwrapKey"]
	);

	/* ************************************************************************
	**	Then, we can unwrap the encryptedPrivateKey with the help of the
	**	derivedKey and the IV
	************************************************************************ */
	const	undecyptedPrivateKey = await window.crypto.subtle.unwrapKey(
		"pkcs8",
		encryptedPrivateKey,
		derivedKey,
		{name: "AES-GCM", iv: IV},
		{name: "RSA-OAEP", hash: "SHA-512"},
		true,
		["decrypt", "unwrapKey"]
	);
	
	return undecyptedPrivateKey
}


export async function	EncryptData(dataToEncrypt, publicKey) {
	const	secretKey = await window.crypto.subtle.generateKey({name: "AES-CTR", length: 256}, true, ["encrypt", "decrypt"]);
	const	IV = window.crypto.getRandomValues(new Uint8Array(16))
	const	encryptedData = await window.crypto.subtle.encrypt({name: "AES-CTR", counter: IV, length: 128}, secretKey, dataToEncrypt);
	const	rawExportedSecretKey = await window.crypto.subtle.exportKey("raw", secretKey);
	const	encryptedSecretKey = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, publicKey, rawExportedSecretKey);
	const	encodedSecretKey = _arrayBufferToBase64(encryptedSecretKey);

	return ({encryptedData, IV, encodedSecretKey});
}

export async function	DecryptData(dataToDecrypt, privateKey, IV, encodedSecretKey) {
	const	decodedSecretKey = _base64ToArrayBuffer(encodedSecretKey)
	const	decryptedSecretKey = await window.crypto.subtle.decrypt({name: "RSA-OAEP"}, privateKey, decodedSecretKey);
	const	secretKey = await window.crypto.subtle.importKey("raw", decryptedSecretKey, "AES-CTR", true, ["encrypt", "decrypt"]);
	const	decrypted = await window.crypto.subtle.decrypt({name: "AES-CTR", counter: IV, length: 128}, secretKey, dataToDecrypt);
	const	blob = new Blob([decrypted]);
	const	urlCreator = window.URL || window.webkitURL;
    const	imageUrl = urlCreator.createObjectURL(blob);

	return (imageUrl);
}

export async function	ConvertJwkToPrivatePem(key) {
	function addNewLines(str) {
		let	finalString = '';
		while(str.length > 0) {
			finalString += str.substring(0, 64) + '\n';
			str = str.substring(64);
		}
	
		return finalString;
	}
	function arrayBufferToBase64(arrayBuffer) {
		const	byteArray = new Uint8Array(arrayBuffer);
		let		byteString = '';
		for(let i=0; i < byteArray.byteLength; i++) {
			byteString += String.fromCharCode(byteArray[i]);
		}
		return window.btoa(byteString);
	}

	const	exported = await window.crypto.subtle.exportKey("pkcs8", key)
	const	b64Key = addNewLines(arrayBufferToBase64(exported));
	return b64Key;
}

export async function	ConvertJwkToPublicPem(key) {
	function addNewLines(str) {
		let	finalString = '';
		while(str.length > 0) {
			finalString += str.substring(0, 64) + '\n';
			str = str.substring(64);
		}
	
		return finalString;
	}
	function arrayBufferToBase64(arrayBuffer) {
		const	byteArray = new Uint8Array(arrayBuffer);
		let		byteString = '';
		for(let i=0; i < byteArray.byteLength; i++) {
			byteString += String.fromCharCode(byteArray[i]);
		}
		return window.btoa(byteString);
	}

	const	exported = await window.crypto.subtle.exportKey("spki", key)
	const	b64Key = addNewLines(arrayBufferToBase64(exported));
	
	return b64Key;
}

export async function	DigestPassword(password) {
	const encoder = new TextEncoder();
  	const data = encoder.encode(password);
	const hash = await crypto.subtle.digest('SHA-256', data);
	return (_arrayBufferToBase64(hash));
}