/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 14:39:16
** @Filename:				_app.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 13 February 2020 - 17:07:56
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	App								from	'next/app';
import	styled, {createGlobalStyle}		from	'styled-components';
import	* as API						from	'../utils/API';
import	NavBar							from	'../components/Navbar';

const GlobalStyle = createGlobalStyle`
	*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;font-family:Roboto,Helvetica,Arial,sans-serif;padding-inline-start: 0;font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;}
	html{overflow: hidden;height:100%;}
	body{background-color: #2A2B41;overflow: hidden;box-sizing: content-box;height:100%;padding:0;margin:0;}
	#__next{height:100%;width:100%;overflow-y: auto;padding:0;margin:0;};
	#__next::-webkit-scrollbar { width: 0 !important }
	#__next { overflow: -moz-scrollbars-none; }
	#__next { -ms-overflow-style: none; }

	h1,h2,h3,h4,h5,h6,p{margin:0;padding:0}
	a{text-decoration:none;color:#000}
	a:hover{text-decoration:none;cursor:pointer}
	button{background:0 0;color:inherit;border:none;padding:0;font:inherit;cursor:pointer;outline:inherit}
	nav{margin:0;padding:0}
	::placeholder{color:#000;opacity:.3}
	:-ms-input-placeholder{color:#000}
	::-ms-input-placeholder{color:#000}
`;

const	Header = styled.header`
	padding-top: 76px;
	box-shadow: 0 4px 12px rgba(0,0,0,0.2), 0 0 1px rgba(1,0,0,0.2);
`;

function	MyApp(props) {
	const	[isReady, set_isReady] = useState(false);
	const	[member, set_member] = useState(undefined);
	const	[isDragNDrop, set_isDragNDrop] = useState(false);

	useEffect(() => {onCheckMember()}, [props.router.route])

	async function	onCheckMember() {
		await API.CheckMember().then((status) => {
			if (status === false || status === undefined) {
				set_member(undefined);
				props.router.push('/')
			}
		})
		set_isReady(true);
	}
	function	onLoginMember(email, password) {
		API.LoginMember({email, password}).then((e) => {
			if (e !== false) {
				set_member(e)
				props.router.push('/gallery')
				return;
			}
			console.log(`Fail login member`);
		});
	}
	function	onCreateMember(email, password, callback) {
		API.CreateMember({email, password}).then((e) => {
			if (e !== false) {
				set_member(e)
				props.router.push('/gallery')
				return;
			}
			console.log(`Fail create member`);
		});
	}

	const	{Component, pageProps} = props;
	return (
		<div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
			<GlobalStyle />
			{props.router.route !== '/' && <Header>
				<NavBar router={props.router} />
			</Header>}
			<div onDragEnter={() => set_isDragNDrop(true)} style={{display: 'flex', flex: 1}}>
				<Component
					isDragNDrop={isDragNDrop}
					set_isDragNDrop={set_isDragNDrop}
					element={props.element}
					router={props.router}
					member={member}
					onLoginMember={onLoginMember}
					onCreateMember={onCreateMember}
					{...pageProps} />
			</div>
		</div>
	);
}

export default MyApp;