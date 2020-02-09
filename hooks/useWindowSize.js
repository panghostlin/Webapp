/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Thursday 06 February 2020 - 12:02:56
** @Filename:				useWindowSize.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 06 February 2020 - 12:04:35
*******************************************************************************/

import {useState} from 'react';
import useEventListener from './useEventListener';

const isClient = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

function useWindowSize(initialWidth, initialHeight) {
	const [windowSize, setWindowSize] = useState({
		width: isClient ? window.innerWidth : initialWidth,
		height: isClient ? window.innerHeight : initialHeight,
	});

	useEventListener('resize', () => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	});

	return windowSize;
}

export default useWindowSize;