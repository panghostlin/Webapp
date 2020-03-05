/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Thursday 05 March 2020 - 10:50:32
** @Filename:				usePrevious.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 05 March 2020 - 10:50:55
*******************************************************************************/

import {useEffect, useRef} from 'react';

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}

export default usePrevious;