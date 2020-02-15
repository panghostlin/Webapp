/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 03 January 2020 - 16:49:43
** @Filename:				index.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Saturday 15 February 2020 - 15:18:07
*******************************************************************************/

import	React, {useState}		from	'react';
import	styled					from	'styled-components';
import	Input, {InputLabel}		from	'../components/Input';
import	{PrimaryButton}			from	'../components/Buttons';
import	* as API				from	'../utils/API';

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
const	SwitchText = styled.p`
	font-size: 12px;
	cursor: pointer;
	margin-left: auto;
	margin-top: 16px;
	color: #00000090;
	transition: 0.2s;
	border-bottom: 1px solid #00000090;
	&:hover {
		color: #B5B7DF80;
		border-bottom: 1px solid #B5B7DF80;
	}
`;
const	ErrorMessage = styled.p`
	font-size: 12px;
	margin-left: auto;
	margin-top: 16px;
	color: #FF453A;
`

function	validateEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function	CreateForm(props) {
	const	[email, set_email] = useState('');
	const	[password, set_password] = useState('');
	const	[createError, set_createError] = useState(false);

	const	emailIsValid = validateEmail(email);
	const	passwordIsValid = password.length >= 6;

	function	onCreateMember() {
		API.CreateMember({email, password}).then((e) => {
			if (!!e) {
				props.router.push('/gallery')
				return;
			}
			set_createError(true)
		});
	}

	return (
		<Container>
			<PageTitle>{'Inscription'}</PageTitle>

			<InputLabel value={email} isOk={emailIsValid}>{'Adresse email'}</InputLabel>
			<Input
				autoFocus
				isOk={emailIsValid}
				value={email}
				onChange={e => set_email(e.target.value)} />

			<InputLabel style={{marginTop: 16}} value={password} isOk={passwordIsValid}>{'Mot de passe'}</InputLabel>
			<Input
				isOk={passwordIsValid}
				value={password}
				onChange={e => set_password(e.target.value)}
				type={'password'} />
			<PrimaryButton
				style={{width: 'auto', marginTop: 0, marginLeft: 'auto', display: 'flex'}}
				disabled={!passwordIsValid || ! emailIsValid}
				onClick={onCreateMember}>
				{'Inscription'}
			</PrimaryButton>
			<SwitchText onClick={props.onSwitch}>{'Se connecter'}</SwitchText>
			<ErrorMessage>{loginError && 'Impossible de vous créer un compte avec ces identifiants'}</ErrorMessage>
		</Container>
	);
}
function	LoginForm(props) {
	const	[email, set_email] = useState('');
	const	[password, set_password] = useState('');
	const	[loginError, set_loginError] = useState(false);

	const	emailIsValid = validateEmail(email);
	const	passwordIsValid = password.length >= 6;

	function	onLoginMember() {
		API.LoginMember({email, password}).then((e) => {
			if (!!e) {
				props.router.push('/gallery')
				return;
			}
			set_loginError(true)
		});
	}

	return (
		<Container>
			<PageTitle>{'Connexion'}</PageTitle>

			<InputLabel value={email} isOk={emailIsValid}>{'Adresse email'}</InputLabel>
			<Input
				autoFocus
				isOk={emailIsValid}
				value={email}
				onChange={e => set_email(e.target.value)} />

			<InputLabel style={{marginTop: 16}} value={password} isOk={passwordIsValid}>{'Mot de passe'}</InputLabel>
			<Input
				isOk={passwordIsValid}
				value={password}
				onChange={e => set_password(e.target.value)}
				type={'password'} />
			<PrimaryButton
				style={{width: 'auto', marginTop: 0, marginLeft: 'auto', display: 'flex'}}
				disabled={!passwordIsValid || ! emailIsValid}
				onClick={onLoginMember}>
				{'Connexion'}
			</PrimaryButton>
			<SwitchText
				style={{width: 'auto', marginLeft: 'auto', display: 'flex'}}
				onClick={props.onSwitch}>
				{'Créer un compte'}
			</SwitchText>
			<ErrorMessage>{loginError && 'Impossible de vous connecter avec ces identifiants'}</ErrorMessage>
		</Container>
	);
}
function	Index(props) {
	const	[form, set_form] = useState('login');

	if (form === 'login')
		return (<LoginForm router={props.router} onSwitch={() => set_form(`create`)} />)
	else
		return (<CreateForm router={props.router} onSwitch={() => set_form(`login`)} />)
}

export default Index;
