/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Saturday 18 January 2020 - 18:37:47
** @Filename:				useInfiniteScroll.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Thursday 06 February 2020 - 13:31:24
*******************************************************************************/

import {useState, useEffect} from "react";

const useInfiniteScroll = callback => {
	const [isFetching, set_isFetching] = useState(false);

	useEffect(() => {
		document.getElementById(`__next`).addEventListener("scroll", handleScroll);

		return () => document.getElementById(`__next`).removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (!isFetching) return;
		callback(() => {
			console.log("Loading....");
		});
	}, [isFetching]);

	function handleScroll() {
		if (
			window.innerHeight + document.documentElement.scrollTop !==
			document.documentElement.offsetHeight
		)
			return;
		set_isFetching(true);
	}

	return [isFetching, set_isFetching];
};

export default useInfiniteScroll;