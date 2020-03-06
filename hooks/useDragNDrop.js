/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 03 February 2020 - 10:19:34
** @Filename:				useDragNDrop.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 05 March 2020 - 13:57:29
*******************************************************************************/

import {useEffect, useRef, useState} from "react";

const useDragNDrop = () => {
	const [value, setValue] = useState(false);
	const ref = useRef();

	const handleDragEnter = () => setValue(true);
	const handleDragLeave = () => setValue(false);

	useEffect(() => {
		const node = ref.current;

		if (node) {
			node.ondragenter = handleDragEnter
			node.ondragleave = handleDragLeave

			return () => {
				node.ondragenter = null
				node.ondragleave = null
			};
		}
	}, [ref.current]);

	return [ref, value];
};

export default useDragNDrop;