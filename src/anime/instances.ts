import { defaultInstanceSettings, defaultTweenSettings } from "./consts";

import { replaceObjectProps, mergeObjects } from "./helpers";

import { getKeyframesFromProperties } from "./keyframes";

import { getAnimatables } from "./animatables";

import { getAnimations } from "./animations";

import { getTimingsFromAnimations } from "./timings";

let instancesId = 0;

export function createInstance(params: any) {
	const instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
	const tweenSettings = replaceObjectProps(defaultTweenSettings, params);
	const properties = getKeyframesFromProperties(tweenSettings, params);
	const animatables = getAnimatables(params.targets);
	const animations = getAnimations(animatables, properties);
	const timings = getTimingsFromAnimations(animations, tweenSettings);

	// console.log("animations ; ", animations);
	const id = params.id || instancesId++;
	return mergeObjects(instanceSettings, {
		id,
		children: [],
		animatables: animatables,
		animations: animations,
		delay: timings.delay,
		duration: timings.duration,
		endDelay: timings.endDelay,
	});
}

export function createExtraAnimations(instance: any, params: any) {
	const tweenSettings = replaceObjectProps(defaultTweenSettings, params);
	const properties = getKeyframesFromProperties(tweenSettings, params);
	const animations = getAnimations(instance.animatables, properties);

	return animations;
}
