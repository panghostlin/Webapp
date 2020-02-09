/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Saturday 18 January 2020 - 18:21:26
** @Filename:				useScrollLock.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Saturday 18 January 2020 - 18:34:16
*******************************************************************************/

import {useLayoutEffect} from 'react';

function useLockBodyScroll() {
	useLayoutEffect(() => {
		const originalStyle = window.getComputedStyle(document.body).overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = originalStyle;
		};
	}, []);
}

export default useLockBodyScroll;