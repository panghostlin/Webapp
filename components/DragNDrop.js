/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 10:53:18
** @Filename:				DragNDrop.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 13 February 2020 - 18:40:24
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	styled							from	'styled-components';
import	useLockBodyScroll				from	'../hooks/useLockBodyScroll';

const	GgImportSize = 12;
const	GgImport = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: calc(18px * ${GgImportSize});
    height: calc(14px * ${GgImportSize});
    border: calc(2px * ${GgImportSize}) solid;
    border-top: 0;
    box-shadow: calc(-6px * ${GgImportSize}) calc(-8px * ${GgImportSize}) 0 calc(-6px * ${GgImportSize}), calc(6px * ${GgImportSize}) calc(-8px * ${GgImportSize}) 0 calc(-6px * ${GgImportSize});
	color: #4A4B6E;
	z-index: -1;
	&::after {
	    content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: calc(6px * ${GgImportSize});
		height: calc(6px * ${GgImportSize});
		border-right: calc(2px * ${GgImportSize}) solid;
		border-bottom: calc(2px * ${GgImportSize}) solid;
		right: calc(4px * ${GgImportSize});
		bottom: calc(4px * ${GgImportSize});
		transform: rotate(45deg);
	}
	&::before {
		content: "";
		display: block;
		box-sizing: border-box;
		position: absolute;
		background: currentColor;
		width: calc(2px * ${GgImportSize});
		height: calc(14px * ${GgImportSize});
		right: calc(6px * ${GgImportSize});
		bottom: calc(5px * ${GgImportSize});
	}
`;
const	DragNDropContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background-color: #2E3056;
	z-index: 1000;
	transition: 0.4s;
	&::after {
		content: '';
		position: absolute;
		top: 16px;
		left: 16px;
		right: 16px;
		bottom: 16px;
		border: 2px dashed #B5B7DF;
		border-radius: 4px;
	}
`;
const	DragNDropTitle = styled.h3`
	font-size: 30px;
	color: #FFFFFF;
	font-weight: 800;
	margin-top: 16px;
`;

let	DragNDropTimeout = false
function	DragNDrop(props) {
	useLockBodyScroll();

	const	[isMounted, set_isMounted] = useState(false);
	useEffect(() => {
		if (props.isOpen === true) {
			set_isMounted(true);
			DragNDropTimeout = true;
		} else {
			setTimeout(() => {
				if (DragNDropTimeout === false) {
					set_isMounted(false);
					DragNDropTimeout = false;
				}
			}, 100);
		}
	}, [props.isOpen]);

	if (!props.isOpen)
		return (null)

	return (
		<DragNDropContainer
			onDragOver={e => e.preventDefault()}
			onDrop={(e) => {
				e.preventDefault();
				props.onDrop(e);
			}}
			style={isMounted ? {opacity: 1} : {opacity: 0}}
			onDragLeave={() => {
				if (isMounted)
					props.onDragLeave();
				set_isMounted(false);
			}}>
			<GgImport />
			<DragNDropTitle>{'Déposez vos photos pour les importer'}</DragNDropTitle>
		</DragNDropContainer>
	);
}
function DragNDropControler(props) {
	if (!props.isOpen)
		return (null);
	return <DragNDrop {...props} />
}

export default DragNDropControler;