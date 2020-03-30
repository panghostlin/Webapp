/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 14:39:16
** @Filename:				_app.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 30 March 2020 - 13:15:50
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	styled							from	'styled-components';
import	WithTheme						from 	'../style/StyledTheme';
import	NavBar							from	'../components/Navbar';

const	Header = styled.header`
	padding-top: 76px;
`;

function	MyApp(props) {
	const	[member, set_member] = useState(null);
	const	[memberPublicKey, set_memberPublicKey] = useState(null);
	const	[isDragNDrop, set_isDragNDrop] = useState(false);
	const	{Component, pageProps} = props;

	return (
		<WithTheme>
			<div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
				{props.router.route !== '/' && <Header>
					<NavBar router={props.router} />
				</Header>}
				<div onDragEnter={() => set_isDragNDrop(true)} style={{width: '100%', minHeight: '100vh'}}>
					<Component
						isDragNDrop={isDragNDrop}
						set_isDragNDrop={set_isDragNDrop}
						element={props.element}
						router={props.router}
						member={member}
						memberPublicKey={memberPublicKey}
						{...pageProps} />
				</div>
			</div>
		</WithTheme>
	);
}


export default MyApp;