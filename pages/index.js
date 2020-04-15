/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 03 January 2020 - 16:49:43
** @Filename:				index.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 18:39:23
*******************************************************************************/

import	React, {useState}		from	'react';
import	{useRouter}				from	'next/router';
import	Router					from	'next/router'

import	styled					from	'styled-components';
import	{PageContainer, Container, Row, Col}			from	'../style/Frame';
import	{Button, TextButton}	from	'../style/Button';
import	{H1, Label}				from	'../style/Typo';

import	{GalleryFakeBrowser}	from	'../components/FakeBrowsers';
import	Input					from	'../components/Input';
import	* as API				from	'../utils/API';
import	* as Crypto				from	'../utils/Crypto';
import	validateEmail			from	'../utils/ValidateEmail';

const	PageRow = styled(Row)`
	background-image: radial-gradient(rgba(255,255,255,.05) 1px,transparent 0),radial-gradient(rgba(255,255,255,.05) 1px,transparent 0);
    background: radial-gradient(${props => props.theme.colors[props.theme.mode]['neutral-darker']} 1px,transparent 0),radial-gradient(${props => props.theme.colors[props.theme.mode]['neutral-darker']} 1px,transparent 0),linear-gradient(180deg,${props => props.theme.colors[props.theme.mode]['neutral-darker']} 0%,${props => props.theme.colors[props.theme.mode]['neutral-lighter']} 100%);
    background-size: 40px 40px,40px 40px,100%,100%;
    background-position: 0 0,20px 20px,center;
	min-height: 100vh;
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
	z-index: 0;
	pointer-events: none;
	& > div:first-child {
		background: linear-gradient(20deg, ${props => props.theme.colors[props.theme.mode]['neutral-darker']} 2%, transparent 60%);
		width: 100%;
		height: 80%;
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
		background: linear-gradient(150deg,transparent 0%, ${props => props.theme.colors[props.theme.mode]['neutral-darker']} 100%);
		width: 80%;
		height: 40%;
		transform: rotate(-30deg) translate(20%, 100%) scale(1.8);
		border-top-right-radius: 50%;
		position: relative;
	}
`
const	BoxMessage = styled.div`
	text-align: center;
	font-size: 16px;
	color: #EF5350;
	transition: 0.4s;
	padding: 16px;
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
	const	router = useRouter();
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
					router.push('/gallery')
				})
				return;
			}
			set_createError(true)
		});
	}

	function	renderRowLogo() {
		return (
			<Row justify={'center'}>
				<Col xs={2} sm={4} md={8} lg={8} align={'center'}>
					<H1>{'Panghostlin'}</H1>
				</Col>
			</Row>
		);
	}
	function	renderRowEmail() {
		return (
			<Row justify={'center'} marginTop={3}>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Label style={(emailIsValid === false && email.length > 0) ? {color: '#E4475F'} : {}}>
						{'Email'}
					</Label>
				</Col>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Input
						autoFocus
						isOk={emailIsValid}
						value={email}
						onChange={e => set_email(e.target.value)} />
				</Col>
			</Row>
		);
	}
	function	renderRowPassword() {
		return (
			<Row justify={'center'} marginTop={1}>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Label style={(passwordIsValid === false && password.length > 0) ? {color: '#E4475F'} : {}}>
						{'Password'}
					</Label>
				</Col>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Input
						isOk={passwordIsValid}
						value={password}
						onChange={e => set_password(e.target.value)}
						type={'password'} />
				</Col>
			</Row>
		);
	}
	function	renderRowButtons() {
		return (
			<Row justify={'center'} marginTop={2}>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Button
						primary
						fluid
						disabled={!passwordIsValid || ! emailIsValid}
						onClick={onCreateMember}>
						{'Join'}
					</Button>
				</Col>
				<Col xs={2} sm={4} md={8} lg={8} align={'center'}>
					<TextButton
						primary
						color={'secondary-40'}
						onClick={props.onSwitch}>
						{'Already an account ? Login instead'}
					</TextButton>
				</Col>

				<Col xs={2} sm={4} md={8} lg={8}>
					<BoxMessage error={createError}>
						{'Impossible to create account'}
					</BoxMessage>
				</Col>
			</Row>
		);
	}

	return (
		<Container>
			{renderRowLogo()}
			{renderRowEmail()}
			{renderRowPassword()}
			{renderRowButtons()}
		</Container>
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
					Router.push(`/gallery`)
					setTimeout(() => {
						if (window.location.pathname === '/') {
							window.location.href = '/gallery';
						}
					}, 100)

				})

				return;
			}
			set_loginError(true)
		});
	}

	function	renderRowLogo() {
		return (
			<Row justify={'center'}>
				<Col xs={2} sm={4} md={8} lg={8} align={'center'}>
					<H1>{'Panghostlin'}</H1>
				</Col>
			</Row>
		);
	}
	function	renderRowEmail() {
		return (
			<Row justify={'center'} marginTop={3}>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Label style={(emailIsValid === false && email.length > 0) ? {color: '#E4475F'} : {}}>
						{'Email'}
					</Label>
				</Col>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Input
						autoFocus
						isOk={emailIsValid}
						value={email}
						onChange={e => set_email(e.target.value)} />
				</Col>
			</Row>
		);
	}
	function	renderRowPassword() {
		return (
			<Row justify={'center'} marginTop={1}>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Label style={(passwordIsValid === false && password.length > 0) ? {color: '#E4475F'} : {}}>
						{'Password'}
					</Label>
				</Col>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Input
						isOk={passwordIsValid}
						value={password}
						onChange={e => set_password(e.target.value)}
						type={'password'} />
				</Col>
			</Row>
		);
	}
	function	renderRowButtons() {
		return (
			<Row justify={'center'} marginTop={2}>
				<Col xs={2} sm={4} md={8} lg={8}>
					<Button
						primary
						fluid
						disabled={!passwordIsValid || ! emailIsValid}
						onClick={onLoginMember}>
						{'Login'}
					</Button>
				</Col>
				<Col xs={2} sm={4} md={8} lg={8} align={'center'}>
					<TextButton
						primary
						color={'secondary-40'}
						onClick={props.onSwitch}>
						{'Create an account'}
					</TextButton>
				</Col>

				<Col xs={2} sm={4} md={8} lg={8}>
					<BoxMessage error={loginError}>
						{'Invalid email or password.'}
					</BoxMessage>
				</Col>
			</Row>
		);
	}

	return (
		<Container>
			{renderRowLogo()}
			{renderRowEmail()}
			{renderRowPassword()}
			{renderRowButtons()}
		</Container>
	);
}

function	Login() {
	const	[form, set_form] = useState('Login');

	return (
		<>
			<PageContainer fluid style={{zIndex: 10}}>
				<PageRow>
					<Col xs={2} sm={4} md={8} lg={8} style={{position: 'relative'}} paddingVertical={9} align={'center'}>
						<ContainerBackground><div /><div /></ContainerBackground>
						{/* <H1 color={'secondary-80'} style={{zIndex: 1}}>{form}</H1> */}
						<GalleryFakeBrowser style={{transform: 'scale(0.8)'}} />

					</Col>
					<Col xs={2} sm={4} md={4} lg={4} background={'neutral-lighter'} paddingVertical={9}>
						{form === 'Login' ?
							<LoginForm onSwitch={() => set_form(`Signup`)} /> :
							<CreateForm onSwitch={() => set_form(`Login`)} />
						}
					</Col>
				</PageRow>
			</PageContainer>
		</>
	)
}

export default Login;
