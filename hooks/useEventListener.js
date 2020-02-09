/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Thursday 06 February 2020 - 12:04:54
** @Filename:				useEventListener.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 06 February 2020 - 12:05:17
*******************************************************************************/

import {useRef, useEffect} from 'react';

const isClient = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

function useEventListener(eventName, handler, element = isClient ? window : undefined) {
	const savedHandler = useRef();

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(
		() => {
			const isSupported = element && element.addEventListener;
			if (!isSupported) return;

			const eventListener = event => savedHandler.current(event);
			element.addEventListener(eventName, eventListener);

			return () => {
				element.removeEventListener(eventName, eventListener);
			};
		},
		[eventName, element],
	);
}

export default useEventListener;