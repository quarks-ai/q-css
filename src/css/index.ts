import createMemo from "../utils/memo";
import hash from "../utils/hash";
import astish from "../utils/css";
import {
	getCssBody,
	getDefaultProps,
	functionCreator,
	parseFunctionBody,
	getEvents,
	getCssAttributesBody,
	getAttributeEvents,
	getDynamicStyles,
} from "../utils/utils";
import { DEFAULTS, EVENTS, THEME_KEY } from "../utils/defaults";

function stringify(obj: any) {
	let result = "";
	for (const v in obj) {
		if (typeof obj[v] === "string") {
			result += `${v}:${obj[v]};\n`;
		} else {
			result += `${v}{\n${stringify(obj[v])}}`;
		}
	}
	return result;
}

function createCSSFunction(config: any, sheet: any, themeSheet: any) {
	return function css(
		style: string,
		save: boolean = true,
		parent: any = null,
		animated: boolean = false
	) {
		const className = hash(style);
		if (sheet.cache.has(className)) {
			return sheet.cache.get(className);
		}

		const compiled = astish(style);

		let defaultCSS: any = {
			...(parent?.defaultCSS ? parent.defaultCSS : DEFAULTS),
			...getDefaultProps(
				compiled,
				themeSheet.cache.get(THEME_KEY).mergedThemeObject
			),
		};

		const defaultCSSHovered = compiled["&:hovered"]
			? {
					...parent?.defaultCSSHovered,
					...getDefaultProps(
						compiled["&:hovered"],
						themeSheet.cache.get(THEME_KEY).mergedThemeObject
					),
			  }
			: {};

		const cssObject: any = {
			className,
			compiled,
			props: {},
			defaults: {},
			defaultCSS,
			getClassNames: () => [className],
			defaultCSSHovered,
			willAnimate: false,
			willTransition: false,
			willProximity: false,
			events: {},
			proximity: {},
			transitions: {},
			dynamicStyles: {},
			variants: new Set(),
			baseStyles: new Set(),
			mediaStyles: new Set(),
			toString: () => `.${className}`,
		};

		const dynamicStyles = getDynamicStyles(
			compiled,
			themeSheet.cache.get(THEME_KEY).theme.themeObject
		);
		cssObject.dynamicStyles = dynamicStyles;

		cssObject.baseStyles.add(
			getCssBody(
				className,
				compiled,
				config.prefix,
				themeSheet.cache.get(THEME_KEY).theme.themeObject
			)
		);

		let events: any, defaults: any, proximity: any, transitions: any;

		if (animated) {
			[defaults, events, proximity, transitions] = getEvents(
				compiled,
				cssObject,
				themeSheet.cache.get(THEME_KEY).mergedThemeObject,
				parent
			);
		} else {
			[defaults, events, proximity, transitions] = getAttributeEvents(compiled);
		}

		cssObject.defaults = defaults;

		cssObject.events = events;
		cssObject.proximity = proximity;
		cssObject.transitions = transitions;

		cssObject.getEvents = () => cssObject.events;
		cssObject.getProximity = () => cssObject.proximity;
		cssObject.getTransitions = () => cssObject.transitions;
		cssObject.getDynamicStyles = () => cssObject.dynamicStyles;

		cssObject.willAnimate =
			(Object.keys(events)?.length > 0 ||
				Object.keys(proximity)?.length > 0 ||
				Object.keys(transitions)?.length > 0) &&
			true;
		cssObject.willProximity = Object.keys(proximity).length > 0 && true;
		cssObject.willTransition = Object.keys(transitions).length > 0 && true;

		for (let value in compiled) {
			if (value.includes("$")) {
				cssObject.variants.add({
					cssObject: css(stringify(compiled[value]), false, cssObject),
					condition: functionCreator(["props"], parseFunctionBody(value)),
				});

				delete compiled[value];
			} else {
				if (!Object.keys(EVENTS).some((v) => value.includes(v))) {
					cssObject.baseStyles.add(
						getCssAttributesBody(
							value,
							className,
							compiled[value],
							config.prefix,
							themeSheet.cache.get(THEME_KEY).theme.themeObject
						)
					);
				}
			}
		}

		let rules: any = [];

		cssObject.baseStyles.forEach((rule: any) => (rules = [...rules, rule]));
		if (cssObject.variants.size > 0) {
			cssObject.variants?.forEach(function getRule(variant: any) {
				variant.cssObject.baseStyles.forEach(
					(rule: any) => (rules = [...rules, rule])
				);

				variant.cssObject.variants?.forEach(getRule);
			});

			const getClassNames: any = (props: any) =>
				[
					className,
					...[...cssObject.variants]
						.map(
							(v: any) => v.condition(props) && v.cssObject.getClassNames(props)
						)
						.flat(),
				].filter(Boolean);

			const getDynamicStyles: any = (props: any) => {
				const obj = {
					...cssObject.dynamicStyles,
					...[...cssObject.variants]
						.map((v) => v.condition(props) && v.cssObject.dynamicStyles)
						.filter(Boolean)
						.reduce((a, b) => ({ ...a, ...b }), {}),
				};

				return Object.keys(obj).reduce(
					(a, b) => ({
						...a,
						[b]: obj[b](props),
					}),
					{}
				);
			};

			const getEvents: any = (props: any) => {
				return {
					...cssObject.events,
					...[...cssObject.variants]
						.map((v) => v.condition(props) && v.cssObject.events)
						.filter(Boolean)
						.reduce((a, b) => ({ ...a, ...b }), {}),
				};
			};

			const getTransitions: any = (props: any) => ({
				...cssObject.transitions,
				...[...cssObject.variants]
					.map((v) => v.condition(props) && v.cssObject.transitions)
					.filter(Boolean)
					.reduce((a, b) => ({ ...a, ...b }), {}),
			});

			const getProximity: any = (props: any) => ({
				...cssObject.proximity,
				...[...cssObject.variants]
					.map((v) => v.condition(props) && v.cssObject.proximity)
					.filter(Boolean)
					.reduce((a, b) => ({ ...a, ...b }), {}),
			});

			cssObject.getEvents = getEvents;
			cssObject.getProximity = getProximity;
			cssObject.getTransitions = getTransitions;
			cssObject.getDynamicStyles = getDynamicStyles;

			cssObject.getClassNames = getClassNames;
		} else {
			const getDynamicStyles: any = (props: any) => {
				return Object.keys(cssObject.dynamicStyles).reduce(
					(a, b) => ({
						...a,
						[b]: cssObject.dynamicStyles[b](props),
					}),
					{}
				);
			};
			cssObject.getDynamicStyles = getDynamicStyles;
		}

		sheet.cache.set(className, cssObject);

		if (save) {
			[...rules].forEach((rule: string, i: number) => {
				const h = className + hash(rule);
				if (!sheet.cache.has(h)) {
					sheet.cache.set(h, h);
					sheet.sheet.insertRule(rule, sheet.sheet.cssRules.length);
				}
			});
		}

		return cssObject;
	};
}

export default createMemo(createCSSFunction);
