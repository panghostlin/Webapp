/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Saturday 18 January 2020 - 12:27:17
** @Filename:				Img.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Saturday 18 January 2020 - 12:45:59
*******************************************************************************/

import	React			from	'react';

function Img(props) {
	return (
		<img
			className={props.className}
			onError={(e) => {
				e.target.onerror = null;
				e.target.src=props.srcErr
				e.target.style='filter: grayscale(1);'
			}}
			src={props.src}
			alt={props.alt} />
	);
}

export default Img;
