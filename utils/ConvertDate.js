/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 09 February 2020 - 17:47:59
** @Filename:				ConvertDate.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Sunday 09 February 2020 - 17:48:12
*******************************************************************************/


function	convertToMoment(each) {
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

	return `${year}-${month}-${day}`;
}

export default convertToMoment;