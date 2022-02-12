import { emptyString } from "./consts";
import { is, stringContains, arrayContains } from "./helpers";
import { convertPxToUnit, getTransformUnit, getUnit } from "./units";
import {
	lowerCaseRgx,
	transformsExecRgx,
	relativeValuesExecRgx,
	whiteSpaceTestRgx,
	digitWithExponentRgx,
	validTransforms,
} from "./consts";

import { normalizeColorToRgba } from "./colors";

export function getFunctionValue(val: any, animatable: any) {
	if (!is.fnc(val)) return val;
	return val(animatable.target, animatable.id, animatable.total);
}

function getCSSValue(el: any, prop: any, unit: any) {
	if (prop in el.style) {
		const uppercasePropName = prop.replace(lowerCaseRgx, "$1-$2").toLowerCase();
		const value =
			el.style[prop] ||
			getComputedStyle(el).getPropertyValue(uppercasePropName) ||
			"0";
		return unit ? convertPxToUnit(el, value, unit) : value;
	}
}

export function getAnimationType(el: any, prop: any) {
	if (
		is.dom(el) &&
		!is.inp(el) &&
		(!is.nil(el.getAttribute(prop)) || (is.svg(el) && el[prop]))
	)
		return "attribute";
	if (is.dom(el) && arrayContains(validTransforms, prop)) return "transform";
	if (is.dom(el) && prop !== "transform" && getCSSValue(el, prop, ""))
		return "css";
	if (!is.nil(el[prop])) return "object";
}

export function getElementTransforms(el: any) {
	if (!is.dom(el)) return;
	const str = el.style.transform;
	const transforms = new Map();
	if (!str) return transforms;
	let t;
	while ((t = transformsExecRgx.exec(str))) {
		transforms.set(t[1], t[2]);
	}
	return transforms;
}

function getTransformValue(el: any, propName: any, animatable: any, unit: any) {
	const defaultVal = stringContains(propName, "scale")
		? 1
		: 0 + getTransformUnit(propName);
	const value = getElementTransforms(el)?.get(propName) || defaultVal;
	if (animatable) {
		animatable.transforms.list.set(propName, value);
		animatable.transforms.last = propName;
	}
	return unit ? convertPxToUnit(el, value, unit) : value;
}

export function getOriginalTargetValue(
	target: any,
	propName: any,
	unit: any,
	animatable: any
) {
	switch (getAnimationType(target, propName)) {
		case "transform":
			return getTransformValue(target, propName, animatable, unit);
		case "css":
			return getCSSValue(target, propName, unit);
		case "attribute":
			return target.getAttribute(propName);
		default:
			return target[propName] || 0;
	}
}

export function getRelativeValue(to: any, from: any) {
	const operator = relativeValuesExecRgx.exec(to);
	if (!operator) return to;
	const u: any = getUnit(to) || 0;
	const x: number = parseFloat(from);
	const y: number = parseFloat(to.replace(operator[0], emptyString));
	switch (operator[0][0]) {
		case "+":
			return x + y + u;
		case "-":
			return x - y + u;
		case "*":
			return x * y + u;
	}
}

export function validateValue(val: any, unit: any) {
	if (is.col(val)) return normalizeColorToRgba(val);
	if (whiteSpaceTestRgx.test(val)) return val;
	const originalUnit = getUnit(val);
	const unitLess = originalUnit
		? val.substr(0, val.length - originalUnit.length)
		: val;
	if (unit) return unitLess + unit;
	return unitLess;
}

export function decomposeValue(val: any, unit: any) {
	const value =
		validateValue(is.pth(val) ? val.totalLength : val, unit) + emptyString;
	return {
		original: value,
		numbers: value.match(digitWithExponentRgx)
			? value.match(digitWithExponentRgx)?.map(Number)
			: [0],
		strings: is.str(val) || unit ? value.split(digitWithExponentRgx) : [],
	};
}

export const setValueByType: any = {
	css: (t: any, p: any, v: any) => (t.style[p] = v),
	attribute: (t: any, p: any, v: any) => t.setAttribute(p, v),
	object: (t: any, p: any, v: any) => (t[p] = v),
	transform: (t: any, p: any, v: any, transforms: any, manual: any) => {
		transforms.list.set(p, v);
		if (p === transforms.last || manual) {
			transforms.string = emptyString;
			transforms.list.forEach((value: any, prop: any) => {
				transforms.string += `${prop}(${value})${emptyString}`;
			});
			t.style.transform = transforms.string;
		}
	},
};
