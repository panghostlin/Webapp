/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Wednesday 15 January 2020 - 10:46:09
** @Filename:				ModalDayPicker.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 12 March 2020 - 22:53:27
*******************************************************************************/

import	React, {useState}				from	'react';
import	styled							from	'styled-components';
import	DayPicker						from	'react-day-picker';
import '../public/Daypicker.css';

import	* as API						from	'../utils/API';
import	useLockBodyScroll				from	'../hooks/useLockBodyScroll';
import	Input, {InputLabel}				from	'./Input';
import	{PrimaryButton}					from	'./Buttons';
import	GgClose							from	'../Icons/Cross';

const	ModalContent = styled.div`overflow: ${props => props.noOverflow ? 'hidden' : 'overlay'};`;
const	ModalContainer = styled.div`height: ${props => props.adapt ? 'auto' : '620px'};`;
const	Modal = styled.div`
	background-color: rgba(0,0,0,.6);
    cursor: zoom-out;
	position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 700;
	& > div {
		height: 100%;
		padding: 64px 120px 100px;
		outline: none;
		pointer-events: none;
		cursor: default;
		display: flex;
		& > ${ModalContainer} {
			width: 100%;
			max-width: 560px;
			pointer-events: auto;
			border-radius: 4px;
			box-shadow: 0 8px 16px rgba(0,0,0,.15);
			min-width: 0;
			margin: auto;
			position: relative;
			pointer-events: default;
			& > ${ModalContent} {
				background-color: #2A2B41;
				position: relative;
				padding: 0;
				width: auto;
				height: 100%;
				padding: 0 40px 40px;
				border-radius: 4px;
				box-sizing: border-box;
				& > h1 {
					font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
					font-size: 32px;
					color: #FFFFFF;
					margin-top: 32px;
					margin-bottom: 32px;
					background: transparent;
				}
			}
			& > ${GgClose} {
				position: absolute;
				top: 16px;
				right: 0;
				cursor: pointer;
				padding: 16px;
				/* margin: 16px; */
			}
		}
	}
`;

function ModalDayPicker(props) {
	useLockBodyScroll()

	const	[selectedDayInput, set_selectedDayInput] = useState(convertDate(new Date(props.selectedObject.originalTime)))
	const	[selectedDayPicker, set_selectedDayPicker] = useState(new Date(props.selectedObject.originalTime))

	function	convertDate(day) {
		//Need to convert date to this format : yyyy-MM-ddThh:mm:ss
		const	yyyy = day.getFullYear();
		const	MM = day.getMonth() + 1 < 10 ? `0${day.getMonth() + 1}` : day.getMonth() + 1;
		const	dd = day.getDate() < 10 ? `0${day.getDate()}` : day.getDate();
		const	hh = day.getHours() < 10 ? `0${day.getHours()}` : day.getHours();
		const	mm = day.getMinutes() < 10 ? `0${day.getMinutes()}` : day.getMinutes();
		const	ss = day.getSeconds() < 10 ? `0${day.getSeconds()}` : day.getSeconds();
		return (`${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`);
	}

	function	formatDate(day) {
		const	yyyy = day.getFullYear();
		const	MM = day.getMonth() + 1 < 10 ? `0${day.getMonth() + 1}` : day.getMonth() + 1;
		const	dd = day.getDate() < 10 ? `0${day.getDate()}` : day.getDate();
		const	hh = day.getHours() < 10 ? `0${day.getHours()}` : day.getHours();
		const	mm = day.getMinutes() < 10 ? `0${day.getMinutes()}` : day.getMinutes();
		const	ss = day.getSeconds() < 10 ? `0${day.getSeconds()}` : day.getSeconds();
		return (`${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`);
	}

	function	renderContent() {
		return (
				<ModalContainer adapt onClick={e => {e.preventDefault(); e.stopPropagation();}}>
					<ModalContent noOverflow>
						<h1>{'Change the date'}</h1>
						<InputLabel>{'Date'}</InputLabel>
						<Input
							className={'unstyled'}
							autoFocus
							type={'datetime-local'}
							required={'required'}
							value={selectedDayInput}
							onChange={(e) => {
								set_selectedDayInput(e.target.value)
								set_selectedDayPicker(new Date(e.target.value))
							}} />
						<DayPicker
							locale={'en'}
							fixedWeeks
							enableOutsideDaysClick={false}
							firstDayOfWeek={1}
							selectedDays={selectedDayPicker}
							initialMonth={selectedDayPicker}
							onDayClick={(day) => {
								set_selectedDayInput(convertDate(day))
								set_selectedDayPicker(day)
							}}
						/>
						<PrimaryButton
							onClick={() => {
								const	newDate = formatDate(new Date(selectedDayInput));
								API.SetPicturesDate({
									newDate,
									groupIDs: props.selected,
								}).then(() => {
									set_selectedDayInput('');
									props.onConfirm(newDate);
								});
							}}
							disabled={!selectedDayInput}
							style={{width: 'auto', marginTop: 0, marginLeft: 'auto', display: 'flex'}}>
							{'Save this date'}
						</PrimaryButton>
					</ModalContent>
					<GgClose onClick={() => {props.onClose(); set_selectedDayInput('');}} />
				</ModalContainer>
			);
	}

	if (!props.isOpen)
		return (null);
	
	return (
		<Modal
			onClick={() => {
				props.onClose();
			}}>
			<div>
				{renderContent()}
			</div>
		</Modal>
	)
}

function ModalDayPickerControler(props) {
	if (!props.isOpen)
		return (null);
	return <ModalDayPicker {...props} />
}

export default ModalDayPickerControler;
