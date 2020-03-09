/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 14 February 2020 - 16:11:29
** @Filename:				profile.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 09 March 2020 - 19:35:34
*******************************************************************************/

import	React, {useState, useEffect}				from	'react';
import	styled							from	'styled-components';
import	Input, {FakeInput, InputLabel}	from	'../components/Input';
import	* as API						from	'../utils/API';
import	* as Crypto						from	'../utils/Crypto';

const	Container = styled.header`
	font-size: 10pt;
	flex-direction: column;
	display: flex;
	width: 50%;
	margin: auto;
	background-color: #FFFFFF04;
	border-radius: 4px;
	padding: 0 40px 40px;
	margin-top: 80px;
`;
const	PageTitle = styled.h1`
	color: #FFFFFF;
	font-size: 36px;
	margin-top: 32px;
	margin-bottom: 32px;
`;
const	StorageUsage = styled.div`
	width: 100%;
	background: #EC407A60;
	height: 8px;
	margin-bottom: 16px;
	overflow: hidden;
	&::before {
		display: flex;
		background: #EC407A;
		height: 8px;
		width: ${props => `${props.percent}%`};
		content: "";
	}
`;

function	Profile(props) {
	const	[memberID, set_memberID] = useState(props.memberID || '');
	const	[email, set_email] = useState(props.email || '');
	const	[usedStorage, set_usedStorage] = useState(0);
	const	[fullUsedStorage, set_fullUsedStorage] = useState(0);
	const	[availableStorage, set_availableStorage] = useState(5*1024*1024*1024);
	const	[publicKey, set_publicKey] = useState(props.publicKey || '');
	const	[privateKey, set_privateKey] = useState(props.privateKey || '');

	useEffect(() => {
		getKeys()
		getProfileInformations()
	}, [])

	async function	getKeys() {
		const	sessionPublicKey = JSON.parse(sessionStorage.getItem(`Pub`))
		const	cryptoPublicKey = await window.crypto.subtle.importKey("jwk", sessionPublicKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["encrypt"])
		const	pemPublicKey = await Crypto.ConvertJwkToPublicPem(cryptoPublicKey)
		
		const	sessionPrivateKey = JSON.parse(sessionStorage.getItem(`Priv`))
		const	cryptoPrivateKey = await window.crypto.subtle.importKey("jwk", sessionPrivateKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["decrypt"])
		const	pemPrivateKey = await Crypto.ConvertJwkToPrivatePem(cryptoPrivateKey)

		set_privateKey(pemPrivateKey)
		set_publicKey(pemPublicKey)
	}
	async function	getProfileInformations() {
		API.GetMember().then((profile) => {
			set_memberID(profile.memberID);
			set_email(profile.email);
			set_usedStorage(profile.usedStorage || 0)
			set_fullUsedStorage(profile.fullUsedStorage || 0)
		});
	}

	function	converByteToMegaByte(value) {
		return (value / 1048576).toFixed(2);
	}
	function	converByteToGigaByte(value) {
		return (value / 1073741824).toFixed(0);
	}
	function	renderAvailableStorage(used, max) {
		return (
			`${converByteToMegaByte(used)} Mo / ${converByteToGigaByte(max)} Go`
		)
	}

	return (
		<Container>
			<PageTitle>{'Profil'}</PageTitle>

			<InputLabel>{`Used storage (${renderAvailableStorage(usedStorage, availableStorage)})`}</InputLabel>
			<StorageUsage percent={usedStorage / availableStorage * 100}/>

			<InputLabel>{`Physical used storage (${renderAvailableStorage(fullUsedStorage, availableStorage)})`}</InputLabel>
			<StorageUsage percent={fullUsedStorage / availableStorage * 100}/>

			<InputLabel value={memberID}>{'Unique ID'}</InputLabel>
			<Input disabled defaultValue={memberID} />

			<InputLabel value={email}>{'Email Address'}</InputLabel>
			<Input
				autoFocus
				value={email}
				onChange={e => set_email(e.target.value)} />
			
			<InputLabel>{'Public Key'}</InputLabel>
			<FakeInput font={'14px'}>
				{'-----BEGIN RSA PUBLIC KEY-----'}
				<p>{publicKey}</p>
				{'-----END RSA PUBLIC KEY-----'}
			</FakeInput>

			<InputLabel>{'Private Key'}</InputLabel>
			<FakeInput font={'14px'}>
				{'-----BEGIN RSA PRIVATE KEY-----'}
				<p>{privateKey}</p>
				{'-----END RSA PRIVATE KEY-----'}
			</FakeInput>
		</Container>
	);
}

export default Profile;
