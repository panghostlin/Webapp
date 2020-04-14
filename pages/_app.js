/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 14:39:16
** @Filename:				_app.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 14 April 2020 - 23:04:20
*******************************************************************************/

import	React, {useState, useRef, forwardRef, useImperativeHandle}		from	'react';
import	{useRouter}							from	'next/router';
import	WithTheme							from 	'../style/StyledTheme';
import	NavBar								from	'../components/Navbar';
import	ToastUpload							from	'../components/ToastUpload';

const	Toaster = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		toggleToast(status, options) {
			set_toast(status);
			set_preview(options.preview)
			set_total(options.total)
			set_current(options.current)
			set_step(options.step)
		}
	}));

	const	[toast, set_toast] = useState(false);
	const	[preview, set_preview] = useState(undefined);
	const	[total, set_total] = useState(-1);
	const	[current, set_current] = useState(-1);
	const	[step, set_step] = useState(-1);

	return (
		<ToastUpload
			open={toast}
			fileAsBlobURL={preview}
			total={total}
			current={current}
			step={step} />
	);
});

function	MyApp(props) {
	const	router = useRouter();
	const	[memberPublicKey, set_memberPublicKey] = useState(null);
	const	[isDragNDrop, set_isDragNDrop] = useState(false);
	const	toasterRef = useRef(null);

	const	{Component, pageProps} = props;

	return (
		<WithTheme>
			{router.route !== '/' && <NavBar />}
			<div
				onDragEnter={() => set_isDragNDrop(true)}
				style={{width: '100%', minHeight: '100vh'}}>
				<Component
					isDragNDrop={isDragNDrop}
					set_isDragNDrop={set_isDragNDrop}
					element={props.element}
					memberPublicKey={memberPublicKey}
					toasterRef={toasterRef.current}
					{...pageProps} />
			</div>
			<Toaster ref={toasterRef} />
		</WithTheme>
	);
}


export default MyApp;