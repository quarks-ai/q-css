import createMemo from "../utils/memo";
import hash from "../utils/hash";
import astish from "../utils/css";
import { toCssVariables } from "../utils/utils";

function parse(obj: any, prefix: string | null = null) {
	return Object.keys(obj).map(
		(k) => `${k}:${toCssVariables(k, obj[k], prefix)}`
	);
}

// inspired from stitches
function createGlobalCSSFunction(config: any, sheet: any) {
	return function (style: string) {
		const className = hash(style);
		if (sheet.cache.has(className)) return;
		sheet.cache.set(className, className);

		const compiled = astish(style);

		const rules: any = new Set();
		const inlineRules: any = new Set();

		for (let value in compiled) {
			if (typeof compiled[value] === "object" && value !== "*") {
				const parsed = parse(compiled[value], config.prefix).join(";");
				rules.add(`${value} {${parsed};}`);
			} else {
				const parsed = parse(
					typeof compiled[value] === "object"
						? compiled[value]
						: { [value]: compiled[value] },
					config.prefix
				);
				parsed.forEach((p) => inlineRules.add(p));
			}
		}

		inlineRules.size > 0 && rules.add(`* {${[...inlineRules].join(";")};}`);

		[...rules].forEach((rule: string) => {
			const h = hash(rule);
			if (!sheet.cache.has(h)) {
				sheet.cache.set(h, h);
				sheet.sheet.insertRule(rule, sheet.sheet.cssRules.length);
			}
		});
	};
}

export default createMemo(createGlobalCSSFunction);
