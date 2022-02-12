import { settings } from "./consts";

import { clamp, filterArray } from "./helpers";

import { createExtraAnimations, createInstance } from "./instances";

import { setValueByType } from "./values";

// import { startEngine, activeInstances } from "./engine";
import { startEngine, activeInstances } from "./engine2";
import { getPathProgress } from "./svg";
import { parseTargets } from "./animatables";
import { removeTargetsFromInstance } from "./anime";

export function animate(params: any = {}) {
	let startTime = 0,
		lastTime = 0,
		now = 0;
	let children: any;
	let childrenLength = 0;
	let resolve: any = null;

	function makePromise(instance: any) {
		const promise =
			window.Promise && new Promise((_resolve) => (resolve = _resolve));
		instance.finished = promise;
		return promise;
	}

	let instance = createInstance(params);
	let promise = makePromise(instance);

	function toggleInstanceDirection() {
		const direction = instance.direction;
		if (direction !== "alternate") {
			instance.direction = direction !== "normal" ? "normal" : "reverse";
		}
		instance.reversed = !instance.reversed;
		children.forEach((child: any) => (child.reversed = instance.reversed));
	}

	function adjustTime(time: number) {
		return instance.reversed ? instance.duration - time : time;
	}

	function resetTime() {
		startTime = 0;
		lastTime = adjustTime(instance.currentTime) * (1 / settings.speed);
	}

	function seekChild(time: number, child: any) {
		if (child) child.seek(time - child.timelineOffset);
	}

	function syncInstanceChildren(time: any) {
		if (!instance.reversePlayback) {
			for (let i = 0; i < childrenLength; i++) seekChild(time, children[i]);
		} else {
			for (let i = childrenLength; i--; ) seekChild(time, children[i]);
		}
	}

	function setAnimationsProgress(insTime: any) {
		let i = 0;
		const animations = instance.animations;
		const animationsLength = animations.length;
		while (i < animationsLength) {
			const anim = animations[i];
			const animatable = anim.animatable;
			const tweens = anim.tweens;
			const tweenLength = tweens.length - 1;
			let tween = tweens[tweenLength];
			// Only check for keyframes if there is more than one tween
			if (tweenLength)
				tween = filterArray(tweens, (t: any) => insTime < t.end)[0] || tween;
			const elapsed =
				clamp(insTime - tween.start - tween.delay, 0, tween.duration) /
				tween.duration;
			const eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
			const strings = tween.to.strings;
			const round = tween.round;
			const numbers = [];
			const toNumbersLength = tween.to.numbers.length;
			let progress;
			for (let n = 0; n < toNumbersLength; n++) {
				let value;
				const toNumber = tween.to.numbers[n];
				const fromNumber = tween.from.numbers[n] || 0;
				if (!tween.isPath) {
					value = fromNumber + eased * (toNumber - fromNumber);
				} else {
					value = getPathProgress(
						tween.value,
						eased * toNumber,
						tween.isPathTargetInsideSVG
					);
				}
				if (round) {
					if (!(tween.isColor && n > 2)) {
						value = Math.round(value * round) / round;
					}
				}
				numbers.push(value);
			}
			// Manual Array.reduce for better performances
			const stringsLength = strings.length;
			if (!stringsLength) {
				progress = numbers[0];
			} else {
				progress = strings[0];
				for (let s = 0; s < stringsLength; s++) {
					const a = strings[s];
					const b = strings[s + 1];
					const n = numbers[s];
					if (!isNaN(n)) {
						if (!b) {
							progress += n + " ";
						} else {
							progress += n + b;
						}
					}
				}
			}
			setValueByType[anim.type](
				animatable.target,
				anim.property,
				progress,
				animatable.transforms
			);
			anim.currentValue = progress;
			i++;
		}
	}

	function setCallback(cb: any) {
		if (instance[cb] && !instance.passThrough) instance[cb](instance);
	}

	function countIteration() {
		if (instance.remainingLoops && instance.remainingLoops !== true) {
			instance.remainingLoops--;
		}
	}

	function setInstanceProgress(engineTime: number) {
		const insDuration = instance.duration;
		const insDelay = instance.delay;
		const insEndDelay = insDuration - instance.endDelay;
		const insTime = adjustTime(engineTime);
		instance.progress = clamp(insTime / insDuration, 0, 1);
		instance.reversePlayback = insTime < instance.currentTime;
		if (children) {
			syncInstanceChildren(insTime);
		}
		if (!instance.began && instance.currentTime > 0) {
			instance.began = true;
			setCallback("begin");
		}
		if (!instance.loopBegan && instance.currentTime > 0) {
			instance.loopBegan = true;
			setCallback("loopBegin");
		}
		if (insTime <= insDelay && instance.currentTime !== 0) {
			setAnimationsProgress(0);
		}
		if (
			(insTime >= insEndDelay && instance.currentTime !== insDuration) ||
			!insDuration
		) {
			setAnimationsProgress(insDuration);
		}
		if (insTime > insDelay && insTime < insEndDelay) {
			if (!instance.changeBegan) {
				instance.changeBegan = true;
				instance.changeCompleted = false;
				setCallback("changeBegin");
			}
			setCallback("change");
			setAnimationsProgress(insTime);
		} else {
			if (instance.changeBegan) {
				instance.changeCompleted = true;
				instance.changeBegan = false;
				setCallback("changeComplete");
			}
		}
		instance.currentTime = clamp(insTime, 0, insDuration);
		if (instance.began) setCallback("update");
		if (engineTime >= insDuration) {
			lastTime = 0;
			countIteration();
			if (!instance.remainingLoops) {
				instance.paused = true;
				if (!instance.completed) {
					instance.completed = true;
					setCallback("loopComplete");
					setCallback("complete");
					if (!instance.passThrough && "Promise" in window) {
						resolve();
						promise = makePromise(instance);
					}
				}
			} else {
				startTime = now;
				setCallback("loopComplete");
				instance.loopBegan = false;
				if (instance.direction === "alternate") {
					toggleInstanceDirection();
				}
			}
		}
	}

	instance.reset = function () {
		const direction = instance.direction;
		instance.passThrough = false;
		instance.currentTime = 0;
		instance.progress = 0;
		instance.paused = true;
		instance.began = false;
		instance.loopBegan = false;
		instance.changeBegan = false;
		instance.completed = false;
		instance.changeCompleted = false;
		instance.reversePlayback = false;
		instance.reversed = direction === "reverse";
		instance.remainingLoops = instance.loop;
		children = instance.children;
		childrenLength = children.length;
		for (let i = childrenLength; i--; ) instance.children[i].reset();
		if (
			(instance.reversed && instance.loop !== true) ||
			(direction === "alternate" && instance.loop === 1)
		)
			instance.remainingLoops++;
		setAnimationsProgress(instance.reversed ? instance.duration : 0);
	};

	// internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)
	instance._onDocumentVisibility = resetTime;

	instance.tick = function (t: number) {
		now = t;
		if (!startTime) startTime = now;
		setInstanceProgress((now + (lastTime - startTime)) * settings.speed);
	};

	instance.seek = function (time: number) {
		setInstanceProgress(adjustTime(time));
	};

	instance.pause = function () {
		instance.paused = true;
		resetTime();
	};

	instance.play = function () {
		if (!instance.paused) return;
		if (instance.completed) instance.reset();
		instance.paused = false;
		activeInstances.push(instance);
		resetTime();
		startEngine();
	};

	instance.reverse = function () {
		toggleInstanceDirection();
		instance.completed = instance.reversed ? false : true;
		resetTime();
	};

	instance.restart = function () {
		instance.reset();
		instance.play();
	};

	instance.remove = function (targets: any) {
		const targetsArray = parseTargets(targets);
		removeTargetsFromInstance(targetsArray, instance);
	};

	instance.next = null;

	// instance.to = function (opts: any) {
	// 	const nextInstance = animate({
	// 		...params,
	// 		...opts,
	// 		autoplay: false,
	// 	});
	// 	instance.next = nextInstance;
	// 	if (instance.paused) {
	// 		instance.paused = false;
	// 		activeInstances.push(instance);
	// 		resetTime();
	// 		startEngine();
	// 	}
	// };

	instance.to = function (opts: any) {
		instance = animate({
			...params,
			...opts,
			id: instance.id,
			autoplay: false,
		});

		instance.paused = false;

		let foundSame = false;
		let activeInstancesLength = activeInstances.length;

		if (activeInstancesLength > 0) {
			let i = 0;
			while (i < activeInstances.length) {
				const activeInstance = activeInstances[i];
				if (activeInstance.id === instance.id) {
					// activeInstances.splice(i, 1);
					activeInstances[i].paused = true;
					activeInstances.push(instance);
					foundSame = true;
					break;
				}
				i++;
			}
		}

		if (!foundSame || activeInstances.length === 0) {
			activeInstances.push(instance);
		}
		startEngine();
	};

	instance.reset();

	if (instance.autoplay) {
		instance.play();
	}

	return instance;
}
