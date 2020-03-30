/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 12:40:39
** @Filename:				Navbar.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Saturday 14 March 2020 - 13:35:38
*******************************************************************************/

import	React						from	'react';
import	styled						from	'styled-components';
import	Router						from	'next/router'

import	GgImage						from	'../Icons/Image';
import	GgAlbum						from	'../Icons/Album';
import	GgUpload					from	'../Icons/Upload';
import	GgClose						from	'../Icons/Cross';
import	GgAdd						from	'../Icons/Add';
import	GgTrash						from	'../Icons/Trash';
import	GgProfile					from	'../Icons/Profile';
import	GgTime						from	'../Icons/Time';
import	GgCheckbox					from	'../Icons/Checkbox';
import	GgCoverTemplate				from	'../Icons/CoverTemplate';
import	GgRotateRight				from	'../Icons/RotateRight';
import	GgRotateLeft				from	'../Icons/RotateLeft';

const	backgroundColor = '#191c28';
const	backgroundAltColor = '#1e2331';
const	backgroundAccentColor = '#242a3b';
const	StyledNavbar = styled.nav`
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 76px;
	width: 100%;
	position: fixed;
	top: 0;
	left: 0%;
	z-index: 500;
	padding: 0px 8.33%;
    background: ${backgroundAccentColor};
	box-shadow: 0 3px 12px ${backgroundColor}AA;
`;
const	Menu = styled.menu`
	display: flex;
	width: 100%;
	align-items: center;
`;
const	MenuItem = styled.div`
	display: flex;
	cursor: pointer;
	padding: 16px;
	margin: 0 16px;
	justify-content: center;
	&:first-child {
		margin-left: -16px;
	}
	${props => props.noSpaceRight && 'margin-right: 0'};
	${props => props.noSpaceLeft && 'margin-left: 0'};
	&::after {
		cursor: pointer;
		content: '${props => props.content}';
		display: flex;
		background: #FFFFFF;
		position: absolute;
		padding: 4px 8px;
		border-radius: 4px;
		opacity: 0;
		z-index: -1000;
	}
	&:hover::after {
		content: '${props => props.content}';
		display: flex;
		background: #FFFFFF;
		position: absolute;
		top: 80%;
		padding: 4px 8px;
		border-radius: 4px;
		opacity: 1;
		transition: 0.4s;
		z-index: 1;
	}
`;
const	SearchBar = styled.input`
	width: 300px;
	height: calc(20px * 1.5);
	border-radius: 4px;
	border: none;
	margin-left: auto;
	outline: none;
	padding-left: 8px;
	padding-right: 8px;
	font-size: 14px;
`;
const	Text = styled.p`
	font-size: 16px;
	color: #FFFFFF;
`;
const	StyledActionbar = styled(StyledNavbar)`
	z-index: ${props => props.isEnabled ? 500 : -1};
`;

function	NavBar(props) {
	return (
		<StyledNavbar>
			<Menu>
				<MenuItem content={'Mes albums'} onClick={() => Router.push(`/albums`)}>
					<GgAlbum />
				</MenuItem>
				<MenuItem content={'Ma galerie'} onClick={() => Router.push(`/gallery`)}>
					<GgImage />
				</MenuItem>

				<SearchBar placeholder={'Rechercher des photos'} />
				<MenuItem content={'Importer'}>
					<GgUpload />
				</MenuItem>
				<MenuItem
					content={'Profil'}
					noSpaceRight
					onClick={() => Router.push(`/profile`, `/profile`)}>
					<GgProfile />
				</MenuItem>
			</Menu>
		</StyledNavbar>
	);
}

function	ActionBar(props) {
	return (
		<StyledActionbar isEnabled={props.isEnabled}>
			<Menu>
				<MenuItem
					noSpaceLeft
					content={'Select all'}
					onClick={props.allPictureSelected ? props.onUnselectAll : props.onSelectAll}>
					<GgCheckbox checked={props.allPictureSelected} />
				</MenuItem>
				<MenuItem
					noSpaceLeft
					content={'Annuler'}
					onClick={props.onCancel}>
					<GgClose />
				</MenuItem>
				<Text>
					{`${props.len || 0} photo${props.len > 1 ? 's' : ''} sélectionnée${props.len > 1 ? 's' : ''}`}
				</Text>


				<MenuItem
					style={{marginLeft: 'auto'}}
					content={'Change date'}
					onClick={props.onChangeDate}>
					<GgTime />
				</MenuItem>

				<MenuItem
					content={'Rotate Left'}
					onClick={() => props.onRotate('left')}>
					<GgRotateLeft />
				</MenuItem>
				<MenuItem
					content={'Rotate right'}
					onClick={() => props.onRotate('right')}>
					<GgRotateRight />
				</MenuItem>

				<MenuItem
					content={'Add to album'}
					onClick={props.onAddToAlbum}>
					<GgAdd />
				</MenuItem>
				{props.albumID && <MenuItem
					content={'Set as cover picture'}
					onClick={props.onSetCover}>
					<GgCoverTemplate />
				</MenuItem>}
				<MenuItem
					noSpaceRight
					content={'Delete'}
					onClick={() => props.onDeletePicture()}>
					<GgTrash />
				</MenuItem>
			</Menu>
		</StyledActionbar>
	);
}

export {ActionBar};
export default NavBar;
