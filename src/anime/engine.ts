import { settings } from "./consts";

import { isBrowser, isDocumentHidden } from "./helpers";

export const activeInstances: any = [];

let raf: any;

function tick(t: number) {
	console.log("tick : ", t);
	// memo on algorithm issue:
	// dangerous iteration over mutable `activeInstances`
	// (that collection may be updated from within callbacks of `tick`-ed animation instances)
	let activeInstancesLength = activeInstances.length;
	let i = 0;
	while (i < activeInstancesLength) {
		const activeInstance = activeInstances[i];
		if (!activeInstance.paused) {
			activeInstance.tick(t);
			i++;
		} else {
			activeInstances.splice(i, 1);
			activeInstancesLength--;
		}
	}
	raf = i > 0 ? requestAnimationFrame(tick) : undefined;
}

export function startEngine() {
	if (
		!raf &&
		(!isDocumentHidden() || !settings.suspendWhenDocumentHidden) &&
		activeInstances.length > 0
	) {
		raf = requestAnimationFrame(tick);
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
