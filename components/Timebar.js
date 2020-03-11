/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Wednesday 11 March 2020 - 15:11:26
** @Filename:				Timebar.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 11 March 2020 - 15:24:12
*******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	styled							from	'styled-components';
import	useEffectOnce					from	'../hooks/useEffectOnce';

const	StyledCursorIndicator = styled.div`
	height: 2px;
	z-index: 1;
	background: #FFFFFF;
	pointer-events: none;
	position: absolute;
	right: 0;
	width: 72px;
	will-change: transform;
	opacity: 0;
	& > p {
		position: absolute;
		pointer-events: none;
		color: #FFFFFF;
		font-size: 1em;
		white-space: nowrap;
		top: -1.2em;
		right: 8px;
	}
`;
const	StyledTimebar = styled.div`
	position: fixed;
	top: 92px;
	right: 0;
	bottom: 32px;
	width: 120px;
	opacity: 0;
	transition: 0.2s;
	cursor: pointer;
	z-index: 10;
	will-change: opacity;
	&:hover {
		opacity: 1;
		& > ${StyledCursorIndicator} {
			opacity: 1
		}
	}
`;
const	StyledSeparatorDate = styled.div`
	position: absolute;
	right: 8px;
	white-space: nowrap;
	top: ${props => props.top}%;
	color: #FFFFFF;
	pointer-events: none;
	font-variant-caps: all-small-caps;
    font-size: 0.8em;
`;
const	StyledScrollIndicator = styled.div`
	height: 1px;
	z-index: 1;
	background: #FFFFFF;
	pointer-events: none;
	position: absolute;
	right: 0;
	width: 52px;
	will-change: transform;
	& > p {
		position: absolute;
		pointer-events: none;
		color: #FFFFFF;
		font-size: 1em;
		white-space: nowrap;
		top: -1.2em;
		right: 8px;
	}
`;

const	Timebar = React.memo((props) => {
	let		timer = null;
	const	[ranges, _set_ranges] = useState(null)
	const	timebarContainer = React.useRef();
	const	cursor = React.useRef();
	const	scrollCursor = React.useRef();
	const	rangesRef = React.useRef(ranges);
	const	set_ranges = x => {rangesRef.current = x; _set_ranges(x);};

	/**************************************************************************
	**	Setup the ranges and get the current scroll position when the data is
	**	updated
	**************************************************************************/
	useEffect(() => {
		set_ranges(props.data.map((each, index, data) => {
			return ([index === 0 ? -10 : each[2], data[index + 1] ? data[index + 1][2] : 100, each[1]])
		}));

		const [scrollPosition, label] = getScrollPosition()
		if (scrollCursor.current)
			scrollCursor.current.children[0].innerHTML = label
		requestAnimationFrame(() => {
			if (scrollCursor.current) {
				scrollCursor.current.style.transform = `translateY(${scrollPosition}px)`;
			}
		})
	}, [props.data])

	/**************************************************************************
	**	Register the mousemove behaviour
	**************************************************************************/
	useEffectOnce(() => {
		const	moveHandler = (e) => {
			e.preventDefault();
			const label = getCursorLabelPosition(e.clientY - 95)
			if (cursor.current && getComputedStyle(cursor.current).opacity === '1') {
				cursor.current.children[0].innerHTML = label;
				if (scrollCursor.current)
					scrollCursor.current.children[0].innerHTML = '';
			}
			requestAnimationFrame(() => cursor.current && (cursor.current.style.transform = `translateY(${e.clientY - 95}px)`));
		};
		document.addEventListener('mousemove', moveHandler);
		return () => document.removeEventListener('mousemove', moveHandler);
	});

	/**************************************************************************
	**	Register the on scroll behaviour
	**************************************************************************/
	useEffectOnce(() => {
		const	scrollHandler = (e) => {
			e.preventDefault();
			const [scrollPosition, label] = getScrollPosition()

			if (cursor.current && getComputedStyle(cursor.current).opacity === '1' && scrollCursor.current)
				scrollCursor.current.children[0].innerHTML = '';
			else if (scrollCursor.current)
				scrollCursor.current.children[0].innerHTML = label;

			if (timebarContainer.current)
				timebarContainer.current.style.opacity = 1;
			requestAnimationFrame(() => {
				if (scrollCursor.current)
					scrollCursor.current.style.transform = `translateY(${scrollPosition}px)`;
			});
			if (timer !== null)
				clearTimeout(timer);
			timer = setTimeout(() => {
				if (timebarContainer.current)
					timebarContainer.current.style.opacity = null;
		  	}, 600);
		};

		document.addEventListener('scroll', scrollHandler);
		return () => {
			document.removeEventListener('scroll', scrollHandler)
			clearTimeout(timer);
		};
	});

	/**************************************************************************
	**	Register the drag behaviour
	**************************************************************************/
	useEffectOnce(() => {
		const	mousedown = () => {
			timebarContainer.current.addEventListener('mousemove', mousemove);
		};

		const	mousemove = (e) => {
			const	timebarClickPosition = e.clientY - 93;
			const	timebarHeight = timebarContainer.current?.offsetHeight;
			const	totalHeight = window.document.body.offsetHeight - window.innerHeight;
			const	percentToScroll = timebarClickPosition / timebarHeight;
			const	distanceToScroll = (totalHeight * percentToScroll);
			window.scrollTo({top: distanceToScroll, left: 0, behavior: 'auto'})
		};

		const	mouseup = () => {
			timebarContainer.current.removeEventListener('mousemove', mousemove)
		};

		timebarContainer.current.addEventListener('mousedown', mousedown);
		timebarContainer.current.addEventListener('mouseup', mouseup);
		return () => {
			timebarContainer.current.removeEventListener('mousedown', mousedown)
			timebarContainer.current.removeEventListener('mouseup', mouseup)
			timebarContainer.current.removeEventListener('mousemove', mousemove)
		};
	});

	function	getScrollPosition() {
		const	totalHeight = window.document.body.offsetHeight - window.innerHeight;
		const	distanceFromTop = window.pageYOffset;
		const	timebarHeight = timebarContainer.current?.offsetHeight;
		const	scrollPosition = ((distanceFromTop * timebarHeight) / totalHeight);
		const	relativePosition = scrollPosition / timebarHeight * 100;
		const	find = rangesRef.current.find(e => relativePosition > e[0] && relativePosition < e[1]);

		return	[scrollPosition - 1, find ? find[2] : ''];
	}

	function	getCursorLabelPosition(position) {
		const	timebarHeight = timebarContainer.current?.offsetHeight;
		const	relativePosition = position / timebarHeight * 100;
		const	find = rangesRef.current.find(e => relativePosition > e[0] && relativePosition < e[1]);

		return	find ? find[2] : '';
	}

	function	scrollOnClick(e) {
		const	timebarClickPosition = e.clientY - 93;
		const	timebarHeight = timebarContainer.current?.offsetHeight;
		const	totalHeight = window.document.body.offsetHeight - window.innerHeight;
		const	percentToScroll = timebarClickPosition / timebarHeight;
		const	distanceFromPageTop = window.document.body.getBoundingClientRect().top;
		const	distanceToScroll = (totalHeight * percentToScroll);
		const	distanceSinceLastPosition = distanceToScroll + distanceFromPageTop;

		window.scrollTo({top: distanceToScroll, left: 0, behavior: distanceSinceLastPosition < 2000 && distanceSinceLastPosition > -2000 ? 'smooth' : 'auto'})
	}

	return (
		<StyledTimebar ref={timebarContainer} onClick={scrollOnClick}>
			{
				props.data.map((eachPeriod) => {
					return (
						<StyledSeparatorDate key={eachPeriod} top={eachPeriod[2]}>{eachPeriod[0]}</StyledSeparatorDate>
					)
				})
			}
			<StyledCursorIndicator ref={cursor}><p></p></StyledCursorIndicator>
			<StyledScrollIndicator ref={scrollCursor}><p></p></StyledScrollIndicator>
		</StyledTimebar>
	)
})

export default Timebar;
