import { defaultTweenSettings } from "./consts";

import {
	clamp,
	random,
	is,
	arrayContains,
	replaceObjectProps,
	mergeObjects,
} from "./helpers";

import { parseEasings, penner } from "./easings";
import { getUnit, convertPxToUnit } from "./units";

import {
	getOriginalTargetValue,
	getAnimationType,
	getFunctionValue,
	getRelativeValue,
	setValueByType,
	validateValue,
} from "./values";

import { animate } from "./animate";
import { activeInstances } from "./engine";
import { setDashoffset, getPath } from "./svg";
import { parseTargets, getAnimatables } from "./animatables";

// Remove targets from animation

function removeTargetsFromAnimations(targetsArray: any, animations: any) {
	for (let a = animations.length; a--; ) {
		if (arrayContains(targetsArray, animations[a].animatable.target)) {
			animations.splice(a, 1);
		}
	}
}

export function removeTargetsFromInstance(targetsArray: any, instance: any) {
	const animations = instance.animations;
	const children = instance.children;
	removeTargetsFromAnimations(targetsArray, animations);
	for (let c = children.length; c--; ) {
		const child = children[c];
		const childAnimations = child.animations;
		removeTargetsFromAnimations(targetsArray, childAnimations);
		if (!childAnimations.length && !child.children.length)
			children.splice(c, 1);
	}
	if (!animations.length && !children.length) instance.pause();
}

function removeTargetsFromActiveInstances(targets: any) {
	const targetsArray = parseTargets(targets);
	for (let i = activeInstances.length; i--; ) {
		const instance = activeInstances[i];
		removeTargetsFromInstance(targetsArray, instance);
	}
}

// Stagger helpers

function stagger(val: any, params: any = {}) {
	const direction = params.direction || "normal";
	const easing = params.easing
		? parseEasings(params.easing, params.duration || 1000)
		: null;
	const grid = params.grid;
	const axis = params.axis;
	let fromIndex = params.from || 0;
	const fromFirst = fromIndex === "first";
	const fromCenter = fromIndex === "center";
	const fromLast = fromIndex === "last";
	const isRange = is.arr(val);
	const val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
	const val2 = isRange ? parseFloat(val[1]) : 0;
	const unit = getUnit(isRange ? val[1] : val) || 0;
	const start = params.start || 0 + (isRange ? val1 : 0);
	let values: any = [];
	let maxValue = 0;
	return (el: any, i: any, t: any) => {
		if (fromFirst) fromIndex = 0;
		if (fromCenter) fromIndex = (t - 1) / 2;
		if (fromLast) fromIndex = t - 1;
		if (!values.length) {
			for (let index = 0; index < t; index++) {
				if (!grid) {
					values.push(Math.abs(fromIndex - index));
				} else {
					const fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
					const fromY = !fromCenter
						? Math.floor(fromIndex / grid[0])
						: (grid[1] - 1) / 2;
					const toX = index % grid[0];
					const toY = Math.floor(index / grid[0]);
					const distanceX = fromX - toX;
					const distanceY = fromY - toY;
					let value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
					if (axis === "x") value = -distanceX;
					if (axis === "y") value = -distanceY;
					values.push(value);
				}
				maxValue = Math.max(...values);
			}
			if (easing)
				values = values.map((val: any) => easing(val / maxValue) * maxValue);
			if (direction === "reverse")
				values = values.map((val: any) =>
					axis ? (val < 0 ? val * -1 : -val) : Math.abs(maxValue - val)
				);
		}
		const spacing = isRange ? (val2 - val1) / maxValue : val1;
		return start + spacing * (Math.round(values[i] * 100) / 100) + unit;
	};
}

// Timeline

function getInstanceTimings(animations: any, tweenSettings: any) {
	const animLength = animations.length;
	const getTlOffset = (anim: any) =>
		anim.timelineOffset ? anim.timelineOffset : 0;
	const timings: any = {};
	timings.duration = animLength
		? Math.max.apply(
				Math,
				animations.map((anim: any) => getTlOffset(anim) + anim.duration)
		  )
		: tweenSettings.duration;
	timings.delay = animLength
		? Math.min.apply(
				Math,
				animations.map((anim: any) => getTlOffset(anim) + anim.delay)
		  )
		: tweenSettings.delay;
	timings.endDelay = animLength
		? timings.duration -
		  Math.max.apply(
				Math,
				animations.map(
					(anim: any) => getTlOffset(anim) + anim.duration - anim.endDelay
				)
		  )
		: tweenSettings.endDelay;
	return timings;
}

function timeline(params: any = {}) {
	let tl = animate(params);
	tl.duration = 0;

	tl.add = function (instanceParams: any, timelineOffset: any) {
		const tlIndex = activeInstances.indexOf(tl);
		const children = tl.children;
		if (tlIndex > -1) activeInstances.splice(tlIndex, 1);
		function passThrough(ins: any) {
			ins.passThrough = true;
		}
		for (let i = 0; i < children.length; i++) passThrough(children[i]);
		let insParams = mergeObjects(
			instanceParams,
			replaceObjectProps(defaultTweenSettings, params)
		);
		insParams.targets = insParams.targets || params.targets;
		const tlDuration = tl.duration;
		insParams.autoplay = false;
		insParams.direction = tl.direction;
		insParams.timelineOffset = is.und(timelineOffset)
			? tlDuration
			: getRelativeValue(timelineOffset, tlDuration);
		passThrough(tl);
		tl.seek(insParams.timelineOffset);
		const ins = animate(insParams);
		passThrough(ins);
		const totalDuration = ins.duration + insParams.timelineOffset;
		children.push(ins);
		const timings = getInstanceTimings(children, params);
		tl.delay = timings.delay;
		tl.endDelay = timings.endDelay;
		tl.duration = timings.duration;
		tl.seek(0);
		tl.reset();
		if (tl.autoplay) tl.play();
		return tl;
	};
	return tl;
}

// Set Value helper

function setTargetsValue(targets: any, properties: any) {
	const animatables = getAnimatables(targets);
	animatables.forEach((animatable) => {
		for (let property in properties) {
			const value = getFunctionValue(properties[property], animatable);
			const target = animatable.target;
			const valueUnit = getUnit(value);
			const originalValue = getOriginalTargetValue(
				target,
				property,
				valueUnit,
				animatable
			);
			const unit = valueUnit || getUnit(originalValue);
			const to = getRelativeValue(validateValue(value, unit), originalValue);
			const animType: any = getAnimationType(target, property);
			setValueByType[animType](
				target,
				property,
				to,
				animatable.transforms,
				true
			);
		}
	});
}

const anime: any = animate;

anime.version = "__packageVersion__";
anime.speed = 1;
anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeTargetsFromActiveInstances;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;
anime.clamp = clamp;
anime.random = random;

export default anime;
