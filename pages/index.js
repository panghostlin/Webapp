/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 03 January 2020 - 16:49:43
** @Filename:				index.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 12 March 2020 - 12:11:50
*******************************************************************************/

import	React, {useState}		from	'react';
import	styled					from	'styled-components';
import	Input, {InputLabel}		from	'../components/Input';
import	{PrimaryButton}			from	'../components/Buttons';
import	* as API				from	'../utils/API';
import	validateEmail			from	'../utils/ValidateEmail';
import	* as Crypto				from	'../utils/Crypto';

const	backgroundColor = '#191c28';
const	backgroundAccentColor = '#242a3b';

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

const	Page = styled.main`
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
`;

const	Container = styled.section`
	background-image: radial-gradient(rgba(255,255,255,.05) 1px,transparent 0),radial-gradient(rgba(255,255,255,.05) 1px,transparent 0);
    background: radial-gradient(${backgroundAccentColor} 1px,transparent 0),radial-gradient(${backgroundAccentColor} 1px,transparent 0),linear-gradient(180deg,${backgroundAccentColor} 0%,${backgroundColor} 100%);
    background-size: 40px 40px,40px 40px,100%,100%;
    background-position: 0 0,20px 20px,center;
	width: 100%;
    display: flex;
    flex-direction: column;
	flex-grow: 1;
`;
const	ContainerBackground = styled.div`
	position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
	& > div:first-child {
		background: linear-gradient(20deg, ${backgroundAccentColor} 2%, transparent 60%);
		width: 100%;
		height: 80vh;
		display: flex;
		border-bottom-left-radius: 50%;
		transform: rotate(-20deg) translateY(-30vh);
		position: relative;
		margin-bottom: 20vh;
		margin-top: -20vh;
		right: 0;
		top: 0;
	}
	& > div:last-child {
		background: linear-gradient(150deg,transparent 0%, ${backgroundAccentColor} 100%);
		width: 80vw;
		height: 40vh;
		transform: rotate(-30deg) translate(40vh, 60vh) scale(1.8);
		border-top-right-radius: 50%;
		position: relative;
	}
`
const	PageTitle = styled.div`
    display: flex;
	margin-top: 10vh;
	margin-bottom: 5vh;
    align-items: center;
    flex-direction: column;
    position: relative;
    color: #FFFFFF;
    text-align: center;
	width: 100%;
	& > h1 {
		font-size: 80px;
    	letter-spacing: 4px;
		margin-bottom: 60px;
	}
`;
const	HeroCTAButton = styled.button`
    color: #FFFFFF;
    border-radius: 4px;
	border: 1px solid #FFFFFF;
	background-color: ${backgroundAccentColor};
    font-size: 22px;
    padding: 8px 16px;
    backdrop-filter: blur(.4rem);
    user-select: none;
	margin-top: 64px;
	&:hover {
		background: #FFFFFF;
		color: ${backgroundColor};
		transition: 0.4s;
	}
`;
const	Box = styled.div`
    width: 30vw;
    margin: 0 auto;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 80px 100px -24px rgba(0,0,0,.45);
	background: ${backgroundAccentColor};
	padding: 64px 36px;
	padding-bottom: 36px;
	margin-bottom: 16px;
`;
const	BoxMessage = styled.div`
    width: 30vw;
    margin: 0 auto;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 80px 100px -24px rgba(0,0,0,.45);
	background: ${backgroundAccentColor};
	padding: 36px 36px;
	text-align: center;
	font-size: 16px;
	color: #EF5350;
	font-weight: bold;
	transition: 0.4s;
	${props => props.error ? 'opacity: 1' : 'opacity: 0'}
`;

function	setSessionsKey(decryptedPrivateKey, encodedPublicKey) {
	window.crypto.subtle.exportKey("jwk", decryptedPrivateKey).then((privateKey) => {
		sessionStorage.setItem(`Priv`, JSON.stringify(privateKey))
	});

	window.crypto.subtle.importKey("spki", encodedPublicKey, {name: "RSA-OAEP", hash: "SHA-512"}, true, ["encrypt"]).then((publicKey) => {
		window.crypto.subtle.exportKey("jwk", publicKey).then(e => sessionStorage.setItem(`Pub`, JSON.stringify(e)));
	});

}

function	CreateForm(props) {
	const	[email, set_email] = useState('');
	const	[password, set_password] = useState('');
	const	[createError, set_createError] = useState(false);

	const	emailIsValid = validateEmail(email);
	const	passwordIsValid = password.length >= 6;

	async function	onCreateMember() {
		const	pem = await Crypto.GeneratePemKeysFromPassword(password)
		const	digestPassword = await Crypto.DigestPassword(password);
		API.CreateMember({
			email,
			password: digestPassword,
			publicKey: Crypto.ToBase64(pem.exportedPublicKey),
			privateKey: {
				key: Crypto.ToBase64(pem.cryptedPrivateKey),
				salt: Crypto.ToBase64(pem.salt),
				IV: Crypto.ToBase64(pem.IV)
			}
		}).then((keys) => {
			if (!!keys) {
				sessionStorage.setItem(`PublicKey`, keys.PublicKey);
				sessionStorage.setItem(`PrivateKey`, keys.PrivateKey);
				sessionStorage.setItem(`PrivateSalt`, keys.PrivateSalt);
				sessionStorage.setItem(`PrivateIV`, keys.PrivateIV);

				Crypto.RetrievePemKeysFromPassword(password, Crypto.FromBase64(keys.PrivateKey), Crypto.FromBase64(keys.PrivateSalt), Crypto.FromBase64(keys.PrivateIV)).then((decryptedPrivateKey) => {
					setSessionsKey(decryptedPrivateKey, Crypto.FromBase64(keys.PublicKey))
					props.router.push('/gallery')
				})
				return;
			}
			set_createError(true)
		});
	}

	return (
		<>
			<Box>
				<InputLabel value={email} isOk={emailIsValid}>{'Email'}</InputLabel>
				<Input
					autoFocus
					isOk={emailIsValid}
					value={email}
					onChange={e => set_email(e.target.value)} />

				<InputLabel style={{marginTop: 16}} value={password} isOk={passwordIsValid}>{'Password'}</InputLabel>
				<Input
					isOk={passwordIsValid}
					value={password}
					onChange={e => set_password(e.target.value)}
					type={'password'} />
				<HeroCTAButton
					style={{width: 'auto', marginTop: 0, marginLeft: 'auto', display: 'flex'}}
					disabled={!passwordIsValid || ! emailIsValid}
					onClick={onCreateMember}>
					{'Join'}
				</HeroCTAButton>
				<SwitchText
					style={{width: 'auto', marginLeft: 'auto', display: 'flex'}}
					onClick={props.onSwitch}>
					{'Already an account ? Login instead'}
				</SwitchText>
			</Box>
			<BoxMessage error={createError}>
				{'Impossible to create account'}
			</BoxMessage>
		</>
	);
}
function	LoginForm(props) {
	const	[email, set_email] = useState('');
	const	[password, set_password] = useState('');
	const	[loginError, set_loginError] = useState(false);

	const	emailIsValid = validateEmail(email);
	const	passwordIsValid = password.length >= 6;

	async function	onLoginMember() {
		const	digestPassword = await Crypto.DigestPassword(password);

		API.LoginMember({email, password: digestPassword}).then((keys) => {
			if (!!keys) {
				localStorage.setItem(`PublicKey`, keys.PublicKey);
				localStorage.setItem(`PrivateKey`, keys.PrivateKey);
				localStorage.setItem(`PrivateSalt`, keys.PrivateSalt);
				localStorage.setItem(`PrivateIV`, keys.PrivateIV);

				Crypto.RetrievePemKeysFromPassword(password, Crypto.FromBase64(keys.PrivateKey), Crypto.FromBase64(keys.PrivateSalt), Crypto.FromBase64(keys.PrivateIV)).then((decryptedPrivateKey) => {
					setSessionsKey(decryptedPrivateKey, Crypto.FromBase64(keys.PublicKey))
					props.router.push('/gallery')
				})

				return;
			}
			set_loginError(true)
		});
	}

	return (
		<>
			<Box>
				<InputLabel value={email} isOk={emailIsValid}>{'Email'}</InputLabel>
				<Input
					autoFocus
					isOk={emailIsValid}
					value={email}
					onChange={e => set_email(e.target.value)} />

				<InputLabel style={{marginTop: 16}} value={password} isOk={passwordIsValid}>{'Password'}</InputLabel>
				<Input
					isOk={passwordIsValid}
					value={password}
					onChange={e => set_password(e.target.value)}
					type={'password'} />
				<HeroCTAButton
					style={{width: 'auto', marginTop: 0, marginLeft: 'auto', display: 'flex'}}
					disabled={!passwordIsValid || ! emailIsValid}
					onClick={onLoginMember}>
					{'Login'}
				</HeroCTAButton>
				<SwitchText
					style={{width: 'auto', marginLeft: 'auto', display: 'flex'}}
					onClick={props.onSwitch}>
					{'Create an account'}
				</SwitchText>
			</Box>
			<BoxMessage error={loginError}>
				{'Invalid email or password.'}
			</BoxMessage>
		</>
	);
}
function	Login(props) {
	const	[form, set_form] = useState('Login');

	return (
		<Page>
			<Container>
				<ContainerBackground><div /><div /></ContainerBackground>
				<PageTitle><h1>{form}</h1></PageTitle>
				{form === 'Login' ?
					<LoginForm router={props.router} onSwitch={() => set_form(`Signup`)} /> :
					<CreateForm router={props.router} onSwitch={() => set_form(`Login`)} />
				}
			</Container>
		</Page>
	)
}

export default Login;
