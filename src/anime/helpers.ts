import {
	defaultInstanceSettings,
	defaultTweenSettings,
	hexTestRgx,
	rgbTestRgx,
	hslTestRgx,
} from "./consts";

// Strings functions

export function selectString(str: string) {
	try {
		let nodes = document.querySelectorAll(str);
		return nodes;
	} catch (e) {
		return [];
	}
}

export function stringContains(str: string, text: string) {
	return str.indexOf(text) > -1;
}

// Numbers functions

export function clamp(val: number, min: number, max: number) {
	return Math.min(Math.max(val, min), max);
}

export function round(val: number, base = 1) {
	return Math.round(val * base) / base;
}

export function random(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Types

export const is = {
	arr: (a: any) => Array.isArray(a),
	obj: (a: any) => stringContains(Object.prototype.toString.call(a), "Object"),
	pth: (a: any) => is.obj(a) && a.hasOwnProperty("totalLength"),
	svg: (a: any) => a instanceof SVGElement,
	inp: (a: any) => a instanceof HTMLInputElement,
	dom: (a: any) => a.nodeType || is.svg(a),
	str: (a: any) => typeof a === "string",
	fnc: (a: any) => typeof a === "function",
	und: (a: any) => typeof a === "undefined",
	nil: (a: any) => is.und(a) || a === null,
	hex: (a: any) => hexTestRgx.test(a),
	rgb: (a: any) => rgbTestRgx.test(a),
	hsl: (a: any) => hslTestRgx.test(a),
	col: (a: any) => is.hex(a) || is.rgb(a) || is.hsl(a),
	key: (a: any) =>
		!defaultInstanceSettings.hasOwnProperty(a) &&
		!defaultTweenSettings.hasOwnProperty(a) &&
		a !== "targets" &&
		a !== "keyframes",
};

// Arrays

// Arrays

export function filterArray(arr: any, callback: any) {
	const len = arr.length;
	const thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	const result = [];
	for (let i = 0; i < len; i++) {
		if (i in arr) {
			const val = arr[i];
			if (callback.call(thisArg, val, i, arr)) {
				result.push(val);
			}
		}
	}
	return result;
}

export function flattenArray(arr: any) {
	return arr.reduce(
		(a: any, b: any) => a.concat(is.arr(b) ? flattenArray(b) : b),
		[]
	);
}

export function toArray(o: any) {
	if (is.arr(o)) return o;
	if (is.str(o)) o = selectString(o) || o;
	if (o instanceof NodeList || o instanceof HTMLCollection)
		return [].slice.call(o);
	return [o];
}

export function arrayContains(arr: any, val: any) {
	return arr.some((a: any) => a === val);
}

// Objects

export function cloneObject(o: any) {
	const clone: any = {};
	for (let p in o) clone[p] = o[p];
	return clone;
}

export function replaceObjectProps(o1: any, o2: any) {
	const o = cloneObject(o1);
	for (let p in o1) o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
	return o;
}

export function mergeObjects(o1: any, o2: any) {
	const o = cloneObject(o1);
	for (let p in o2) o[p] = is.und(o1[p]) ? o2[p] : o1[p];
	return o;
}

// Functions

export function applyArguments(func: any, args: any) {
	return func.apply(null, args);
}

// Document

export const isBrowser = !is.und(window) && !is.und(window.document);

export function isDocumentHidden() {
	return isBrowser && document.hidden;
}
