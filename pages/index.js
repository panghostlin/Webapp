/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 03 January 2020 - 16:49:43
** @Filename:				index.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 05 February 2020 - 11:46:26
*******************************************************************************/

import	React, {useState}		from	'react';
import	styled					from	'styled-components';
import	Input, {InputLabel}		from	'../components/Input';
import	{PrimaryButton}			from	'../components/Buttons';

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

function	validateEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function	CreateForm(props) {
	const	[email, set_email] = useState('');
	const	[password, set_password] = useState('');

	const	emailIsValid = validateEmail(email);
	const	passwordIsValid = password.length >= 6;

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
				onClick={() => props.onCreateMember(email, password)}>
				{'Inscription'}
			</PrimaryButton>
			<SwitchText onClick={props.onSwitch}>{'Se connecter'}</SwitchText>
		</Container>
	);
}
function	LoginForm(props) {
	const	[email, set_email] = useState('');
	const	[password, set_password] = useState('');

	const	emailIsValid = validateEmail(email);
	const	passwordIsValid = password.length >= 6;

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
				onClick={() => props.onLoginMember(email, password)}>
				{'Connexion'}
			</PrimaryButton>
			<SwitchText
				style={{width: 'auto', marginLeft: 'auto', display: 'flex'}}
				onClick={props.onSwitch}>
				{'Créer un compte'}
			</SwitchText>
		</Container>
	);
}
function	Index(props) {
	const	[form, set_form] = useState('login');

	if (form === 'login') {
		return (
			<LoginForm
				onSwitch={() => set_form(`create`)}
				onLoginMember={(email, password) => props.onLoginMember(email, password)}
			/>
		)
	} else {
		return (
			<CreateForm
				onSwitch={() => set_form(`login`)}
				onCreateMember={(email, password) => props.onCreateMember(email, password)}
			/>
		)
	}
}

export default Index;
