/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 09 February 2020 - 17:47:59
** @Filename:				ConvertDate.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 13:29:29
*******************************************************************************/


export function	convertToMoment(each, separator = '-') {
	const	date = each ? new Date(each) : new Date();

	const	year = date.getFullYear();
	let		day = date.getDate();
	let		month = date.getMonth() + 1;
	if (month < 10) {
		month = `0${month}`
	}
	if (day < 10) {
		day = `0${day}`
	}

	return `${year}${separator}${month}${separator}${day}`;
}

export function	convertToDay(each) {
	const	date = each ? new Date(each) : new Date();
	const	months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

	const	day = date.getDate();
	const	month = months[date.getMonth()];
	const	year = date.getFullYear();
	return (`${day} ${month} ${year}`);
}

export function	convertDate(day) {
	//Need to convert date to this format : yyyy-MM-ddThh:mm:ss
	const	yyyy = day.getFullYear();
	const	MM = day.getMonth() + 1 < 10 ? `0${day.getMonth() + 1}` : day.getMonth() + 1;
	const	dd = day.getDate() < 10 ? `0${day.getDate()}` : day.getDate();
	const	hh = day.getHours() < 10 ? `0${day.getHours()}` : day.getHours();
	const	mm = day.getMinutes() < 10 ? `0${day.getMinutes()}` : day.getMinutes();
	const	ss = day.getSeconds() < 10 ? `0${day.getSeconds()}` : day.getSeconds();
	return (`${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`);
}

export function	formatDate(day) {
	const	yyyy = day.getFullYear();
	const	MM = day.getMonth() + 1 < 10 ? `0${day.getMonth() + 1}` : day.getMonth() + 1;
	const	dd = day.getDate() < 10 ? `0${day.getDate()}` : day.getDate();
	const	hh = day.getHours() < 10 ? `0${day.getHours()}` : day.getHours();
	const	mm = day.getMinutes() < 10 ? `0${day.getMinutes()}` : day.getMinutes();
	const	ss = day.getSeconds() < 10 ? `0${day.getSeconds()}` : day.getSeconds();
	return (`${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`);
}

export default convertToMoment;