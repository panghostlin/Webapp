/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Tuesday 31 March 2020 - 13:37:07
** @Filename:				Modals.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 31 March 2020 - 15:49:48
*******************************************************************************/

import	React, {useState}				from	'react';
import	styled							from	'styled-components';
import	PhotoCardWidth					from	'./PhotoCardWidth';
import	InfiniteList					from	'./InfiniteList';
import	ModalAlbumSelection				from	'./ModalAlbumSelection';
import	ModalDayPicker					from	'./ModalDayPicker';
import	ModalConfirmation				from	'./ModalConfirmation';
import	ToastUpload						from	'./ToastUpload';
import	ToastSuccess					from	'./ToastSuccess';
import	PictureLightroom				from	'./PictureLightroom';
import	DragNDrop						from	'./DragNDrop';
import	Timebar							from	'./Timebar';
import	{ActionBar}						from	'./Navbar';
import	* as API						from	'../utils/API';
import	useKeyPress						from	'../hooks/useKeyPress';
import	convertToMoment					from	'../utils/ConvertDate';
import	* as Worker						from	'../utils/Worker';

export default function	Modals(props) {
	const	[email, set_email] = useState('');

	function	renderDayPickerModal() {
		return (
			<ModalDayPicker
				isOpen={changeDateModal}
				onConfirm={(newDate) => {
					const	_mappedPictureList = [];
					const	_pictureList = pictureList.map((each) => {
						if (selectedPicturesKeys.includes(each.uri)) {
							each.originalTime = newDate;
							each.dateAsKey = convertToMoment(newDate)
						}
						_mappedPictureList[each.uri] = each
						return (each);
					});

					set_changeDateModal(false);
					set_selectedPicturesKeys([]);
					set_selectedDays({});
					set_selectMode(false);
					set_mappedPictureList(_mappedPictureList);
					set_pictureList(_pictureList);
				}}
				onClose={() => {
					set_changeDateModal(false);
					set_selectedPicturesKeys([]);
					set_selectedDays({});
					set_selectMode(false);
				}}
				selectedObject={mappedPictureList[selectedPicturesKeys[0]]}
				selected={selectedPicturesKeys} />
		)
	}
	<ModalAlbumSelection
				isOpen={albumSelectionModal}
				onClose={() => {
					set_albumSelectionModal(false);
					set_selectedPicturesKeys([]);
					set_selectedDays({});
					set_selectMode(false);
				}}
				albumList={props.albumList}
				selected={selectedPicturesKeys} />
			<ModalDayPicker
				isOpen={changeDateModal}
				onConfirm={(newDate) => {
					const	_mappedPictureList = [];
					const	_pictureList = pictureList.map((each) => {
						if (selectedPicturesKeys.includes(each.uri)) {
							each.originalTime = newDate;
							each.dateAsKey = convertToMoment(newDate)
						}
						_mappedPictureList[each.uri] = each
						return (each);
					});

					set_changeDateModal(false);
					set_selectedPicturesKeys([]);
					set_selectedDays({});
					set_selectMode(false);
					set_mappedPictureList(_mappedPictureList);
					set_pictureList(_pictureList);
				}}
				onClose={() => {
					set_changeDateModal(false);
					set_selectedPicturesKeys([]);
					set_selectedDays({});
					set_selectMode(false);
				}}
				selectedObject={mappedPictureList[selectedPicturesKeys[0]]}
				selected={selectedPicturesKeys} />
			<ModalConfirmation
				isOpen={modalConfirmationStatus}
				onClose={() => {
					set_selectedPicturesKeys([]);
					set_selectedDays({});
					set_selectMode(false);
					set_pendingAction([]);
					set_modalConfirmationStatus(false);
				}}
				onConfirm={() => {
					set_modalConfirmationStatus(false);
					pendingAction[0]();
					set_selectedPicturesKeys([]);
					set_selectedDays({});
					set_selectMode(false);
				}}
				text={`Are you sure you want to rotate ${pendingAction[1]} these ${selectedPicturesKeys.length} picture(s)?`}
			/>

	return (
		<>
			{renderDayPickerModal()}
			{renderRowEmail()}
			{renderRowPassword()}
			{renderRowButtons()}
		</>
	);
}
