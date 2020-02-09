/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 07 February 2020 - 15:06:55
** @Filename:				useKeyPress.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Friday 07 February 2020 - 15:46:15
*******************************************************************************/

import {useState}		from 'react';
import useEventListener	from './useEventListener';

function useKeyPress(targetKey, onKeyUp = () => null) {
	const [keyPressed, setKeyPressed] = useState(false);

	function downHandler({key}) {
		if (key === targetKey) {
			setKeyPressed(true);
		}
	}

	const upHandler = ({key}) => {
		if (key === targetKey) {
			setKeyPressed(false);
			if (onKeyUp)
				onKeyUp();
		}
	};

	useEventListener('keydown', downHandler);
	useEventListener('keyup', upHandler);

	return keyPressed;
}

export default useKeyPress;