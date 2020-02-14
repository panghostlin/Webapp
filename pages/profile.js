/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 14 February 2020 - 16:11:29
** @Filename:				profile.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Friday 14 February 2020 - 18:23:18
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	styled							from	'styled-components';
import	Input, {FakeInput, InputLabel}	from	'../components/Input';
import	TextArea						from	'../components/TextArea';
import	{PrimaryButton}					from	'../components/Buttons';
import	* as API						from	'../utils/API';

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

function	Profile(props) {
	const	[memberID, set_memberID] = useState('');
	const	[email, set_email] = useState('');
	const	[publicKey, set_publicKey] = useState('');
	const	[privateKey, set_privateKey] = useState('');
	const	[password, set_password] = useState('');

	const	emailIsValid = false;
	const	passwordIsValid = password.length >= 6;

	useEffect(() => {
		API.GetMember().then((e) => {
			set_memberID(e.ID);
			set_email(e.email);
			set_publicKey(e.publicKey);
			set_privateKey(e.privateKey);
		})
	}, [])

	return (
		<Container>
			<PageTitle>{'Profil'}</PageTitle>

			<InputLabel value={memberID}>{'Identifiant unique'}</InputLabel>
			<Input disabled defaultValue={memberID} />

			<InputLabel value={email}>{'Adresse email'}</InputLabel>
			<Input
				autoFocus
				value={email}
				onChange={e => set_email(e.target.value)} />
			
			<InputLabel>{'Clée publique'}</InputLabel>
			<FakeInput font={'16px'}>
				{'-----BEGIN RSA PUBLIC KEY-----'}
				<p>{publicKey.slice(30, publicKey.length - 29)}</p>
				{'-----END RSA PUBLIC KEY-----'}
			</FakeInput>

			<InputLabel>{'Clée privée'}</InputLabel>
			<FakeInput font={'16px'}>
				{'-----BEGIN RSA PRIVATE KEY-----'}
				<p>{privateKey.slice(31, privateKey.length - 30)}</p>
				{'-----END RSA PRIVATE KEY-----'}
			</FakeInput>
		</Container>
	);
}

export default Profile;
