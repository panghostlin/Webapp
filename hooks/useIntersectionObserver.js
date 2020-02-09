/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 17 January 2020 - 12:05:50
** @Filename:				use-intersection-observer.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Saturday 18 January 2020 - 18:26:53
*******************************************************************************/

import React from "react";

const useIntersectionObserver = ({
	target,
	onIntersect,
	threshold = 0,
	rootMargin = "0px"
}) => {
	React.useEffect(() => {
		const observer = new IntersectionObserver(onIntersect, {
			rootMargin,
			threshold
		});
		const current = target.current;
		observer.observe(current);
		return () => {
			observer.unobserve(current);
		};
	});
};
export default useIntersectionObserver;