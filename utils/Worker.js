/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 24 February 2020 - 22:00:57
** @Filename:				Worker.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Wednesday 15 April 2020 - 00:22:35
*******************************************************************************/

import {API} from './API';

export function	register() {
	if (window.Worker) {
		const	worker = new Worker('/sw.js');
		return (worker);
	}
}
export function postMessage(currentWorker, message) {
	return new Promise((resolve) => {
		const messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = event => resolve(event.data);
		message.API = API
		currentWorker.postMessage(message, [messageChannel.port2])
	});
}

export function terminate(currentWorker) {
	if (currentWorker)
		currentWorker.terminate()
}
