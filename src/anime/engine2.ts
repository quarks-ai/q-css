import { settings } from "./consts";

import { isBrowser, isDocumentHidden } from "./helpers";

export const activeInstances: any = [];

let raf: any;

export function startEngine() {
	let _getTime = Date.now;
	let _lagThreshold = 500;
	let _adjustedLag = 33;
	let _startTime = _getTime();
	let _lastUpdate = _startTime;
	let _gap = 1000 / 240;
	let _nextTime = _gap;
	let _listeners: any = [];
	let _id: any;
	let _req: any;
	let _raf: any;
	let _self: any = {
		time: 0,
		frame: 0,
	};
	let _delta: any;
	let _i: any;

	function tick(t: any) {
		let elapsed = _getTime() - _lastUpdate;
		let manual = t === true;
		let overlap;
		let dispatch;
		let time;
		let frame;

		elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
		_lastUpdate += elapsed;
		time = _lastUpdate - _startTime;
		overlap = time - _nextTime;

		if (overlap > 0 || manual) {
			frame = ++_self.frame;
			_delta = time - _self.time * 1000;
			_self.time = time = time / 1000;
			_nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
			dispatch = 1;
		}

		if (dispatch) {
			for (_i = 0; _i < activeInstances.length; _i++) {
				if (!activeInstances[_i].paused) {
					activeInstances[_i].tick(t);
					if (activeInstances[_i].next) {
						activeInstances[_i].paused = true;
					}
				} else {
					activeInstances.splice(_i, 1);
				}
			}
		}

		raf = activeInstances.length > 0 ? requestAnimationFrame(tick) : undefined;
	}

	if (
		!raf &&
		(!isDocumentHidden() || !settings.suspendWhenDocumentHidden) &&
		activeInstances.length > 0
	) {
		raf = requestAnimationFrame(tick);
		tick(2);
	}
}

function handleVisibilityChange() {
	if (!settings.suspendWhenDocumentHidden) return;

	if (isDocumentHidden()) {
		// suspend ticks
		raf = cancelAnimationFrame(raf);
	} else {
		// is back to active tab
		// first adjust animations to consider the time that ticks were suspended
		activeInstances.forEach((instance: any) =>
			instance._onDocumentVisibility()
		);
		startEngine();
	}
}

if (isBrowser) {
	document.addEventListener("visibilitychange", handleVisibilityChange);
}
