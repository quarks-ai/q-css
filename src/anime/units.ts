import { cache } from "./cache";

import { unitsExecRgx } from "./consts";

import { is, stringContains, arrayContains } from "./helpers";

export function getUnit(val: string) {
	const split = unitsExecRgx.exec(val);
	if (split) return split[1];
}

export function getTransformUnit(propName: string) {
	if (stringContains(propName, "translate") || propName === "perspective")
		return "px";
	if (stringContains(propName, "rotate") || stringContains(propName, "skew"))
		return "deg";
	return "";
}

export function convertPxToUnit(el: any, value: any, unit: any) {
	const valueUnit = getUnit(value);
	if (arrayContains([unit, "deg", "rad", "turn"], valueUnit)) return value;
	const cached = cache.CSS[value + unit];
	if (!is.und(cached)) return cached;
	const baseline = 100;
	const tempEl = document.createElement(el.tagName);
	const parentNode = el.parentNode;
	const parentEl =
		parentNode && parentNode !== document ? parentNode : document.body;
	parentEl.appendChild(tempEl);
	tempEl.style.position = "absolute";
	tempEl.style.width = baseline + unit;
	const factor = baseline / tempEl.offsetWidth;
	parentEl.removeChild(tempEl);
	const convertedUnit = factor * parseFloat(value);
	cache.CSS[value + unit] = convertedUnit;
	return convertedUnit;
}
