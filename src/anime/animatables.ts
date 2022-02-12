import { emptyString } from "./consts";

import { is, flattenArray, filterArray, toArray } from "./helpers";

import { getElementTransforms } from "./values";

export function parseTargets(targets: any) {
	const targetsArray = targets
		? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))
		: [];
	return filterArray(
		targetsArray,
		(item: any, pos: any, self: any) => self.indexOf(item) === pos
	);
}

export function getAnimatables(targets: any) {
	const parsed = parseTargets(targets);
	return parsed.map((t, i) => {
		return {
			target: t,
			id: i,
			total: parsed.length,
			transforms: {
				list: getElementTransforms(t),
				last: null,
				string: emptyString,
			},
		};
	});
}
