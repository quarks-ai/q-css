import anime from "../anime";

import {
	DEFAULT_ANIMATION,
	DEFAULT_THEME_MAP,
	EVENTS,
	FN_KEYS,
	THEME_KEY,
} from "./defaults";

export function toCamelCase(value: string) {
	return !/[A-Z]/.test(value)
		? value.replace(/-[^]/g, (capital: string) => capital[1].toUpperCase())
		: value;
}

export function toHyphenCase(value: string) {
	return value.includes("-")
		? value
		: value.replace(/[A-Z]/g, (capital: string) => "-" + capital.toLowerCase());
}

export function toCssVariables(
	key: string,
	value: string,
	prefix: string | null = null,
	themeMap: any = null
) {
	const themeKey = (v: string) =>
		`${DEFAULT_THEME_MAP[toCamelCase(key)] || ""}.${v}`;

	const defaultCssVariable = (v: string) =>
		`var(--${prefix && prefix + "-"}${v
			.replaceAll("$t.", "")
			.replaceAll("$", "")
			.replaceAll(".", "-")})`;

	return value.includes("p.") || value.includes("props") || !value.includes("$")
		? value
		: value
				.trim()
				.split(" ")
				.map((v) =>
					v.includes("$t.")
						? defaultCssVariable(v)
						: themeMap.has(themeKey(v.replaceAll("$", "")))
						? themeMap.get(themeKey(v.replaceAll("$", "")))
						: v
				)
				.join(" ")
				.trim();
}

export function toThemeVariables(key: string, value: string, themeMap: any) {
	const themeKey = (v: string) => v.replaceAll("$t.", "").replaceAll("$", "");
	const mappedThemeKey = (v: string) =>
		`${DEFAULT_THEME_MAP[toCamelCase(key)] || ""}.${v
			.replaceAll("$t.", "")
			.replaceAll("$", "")}`;

	const parsedValue =
		value.includes("p.") || value.includes("props") || !value.includes("$")
			? value
			: value
					.trim()
					.split(" ")
					.map((v) =>
						themeMap.has(themeKey(v))
							? themeMap.get(themeKey(v)).value
							: themeMap.has(mappedThemeKey(v))
							? themeMap.get(mappedThemeKey(v)).value
							: themeKey(v)
					)
					.join(" ")
					.trim();

	return parsedValue;
}

export function functionCreator(props: string[], body: string) {
	return new Function(...props, body);
}

export function parseFunctionBody(val: string) {
	return `{ return ${val
		.replace(/\.[^]/g, (v: string) => "?." + v[1])
		.replaceAll("$", val.includes("props") ? "" : "props.")}} `;
}

export function getSelector(val: string, className: string) {
	return val.replace(/&/g, `${className}`);
}

export function parse(obj: any, prefix: string | null = null, themeMap: any) {
	return Object.keys(obj).map(
		(k) => `${toHyphenCase(k)}:${toCssVariables(k, obj[k], prefix, themeMap)}`
	);
}

export function getDynamicStyles(compiled: any, themeMap: any) {
	const dynamicStyles: any = {};

	Object.keys(compiled)
		.filter((k: string) => k.startsWith("--"))
		.forEach((k: string) => {
			const parsed = compiled[k].replaceAll("$", "");
			const parsedFn = functionCreator(
				[parsed.includes("props") ? "props" : "p"],
				`return ${parsed}`
			);

			const parsedFnWithTheme = (t: any) => (props: any) => {
				return parsedFn(props)
					.split(" ")
					.map((v: string) => (t.has(v) ? `var(${t.get(v).key})` : v))
					.join(" ");
			};

			dynamicStyles[k] = parsedFnWithTheme(themeMap);

			delete compiled[k];
		});

	return dynamicStyles;
}

export function getDefaultProps(compiled: any, themeMap: any) {
	let props: any = {};
	Object.keys(compiled)
		.filter((k) => typeof compiled[k] === "string")
		.forEach((k) => {
			props[toCamelCase(k)] = toThemeVariables(k, compiled[k], themeMap);
		});

	return props;
}

export function getCssBody(
	className: string,
	compiled: any,
	prefix: string | null,
	themeMap: any
) {
	return `.${className}{${Object.keys(compiled)
		.filter((k) => typeof compiled[k] === "string")
		.map((k) => {
			const val = parse({ [k]: compiled[k] }, prefix, themeMap)[0];
			delete compiled[k];
			return val;
		})
		.join(";")};}`;
}

export function getCssAttributesBody(
	key: string,
	className: string,
	compiled: any,
	prefix: string | null,
	themeMap: any
) {
	return `${key.replaceAll("&", `.${className}`)} {${Object.keys(compiled)
		.map((k) => {
			const val = parse({ [k]: compiled[k] }, prefix, themeMap)[0];
			delete compiled[k];
			return val;
		})
		.join(";")};}`;
}

export function cleanExpr(str: string) {
	str = str.replaceAll(".", "___");
	let re = /(?:^|\W)\$(\w+)(?!\w)/g;
	let match: any;

	while ((match = re.exec(str))) {
		str = str.replace(match[0], " hahaha");
	}
	str = str.replaceAll("___", ".");

	return str;
}

export function getDefaultEventsProps(compiled: any, themeMap: any) {
	let fn: any = `{`;

	Object.keys(compiled)
		.filter((k) => typeof compiled[k] === "string")
		.forEach((k) => {
			fn += `${toCamelCase(k)}: ${
				FN_KEYS.some((v) => compiled[k].includes(v))
					? compiled[k]
							.trim()
							.split(" ")
							.map((e: string) => {
								const cleaned = e.replaceAll("$t.", "").replaceAll("$", "");
								const mapped = `${
									DEFAULT_THEME_MAP[toCamelCase(k)]
								}.${cleaned}`;
								return themeMap.has(cleaned)
									? `"${themeMap.get(cleaned)?.value}"`
									: themeMap.has(mapped)
									? `"${themeMap.get(mapped)?.value}"`
									: e;
							})
							.join(" ")
					: `"${compiled[k]}"`
			},\n`;
		});

	fn += "}";
	fn = fn.replaceAll("$", "");
	return functionCreator(["p", "e", "t"], `return ${fn}`);
}

// from http://jsfiddle.net/alnitak/hEsys/
export function getValueByKey(d: any, key: string) {
	key = key.replace(/\[(\w+)\]/g, ".$1");
	key = key.replace(/^\./, "");
	let a = key.split(".");

	for (let i = 0, n = a.length; i < n; ++i) {
		let k = a[i];
		if (k in d) {
			d = d[k];
		} else {
			return;
		}
	}
	return d;
}

// from http://jsfiddle.net/alnitak/hEsys/
export function setValueByKey(d: any, key: string, val: any) {
	key = key.replace(/\[(\w+)\]/g, ".$1");
	key = key.replace(/^\./, "");
	let a = key.split(".");

	for (let i = 0, n = a.length; i < n; ++i) {
		let k = a[i];
		if (i === a.length - 1) {
			d[k] = val;
		} else {
			if (k in d) {
				d = d[k];
			} else {
				d = d[k] = {};
			}
		}
	}
	return d;
}

function getTargets(ref: any, key: string) {
	const refs = ref.current.querySelectorAll(key);
	return refs?.length > 0 ? refs : document.querySelectorAll(key);
}

function callCallback(
	key: string,
	api: any,
	event: any,
	t: any,
	componentProps: any,
	props: any,
	targets: any,
	themeMap: any,
	ref: any,
	off: boolean = false,
	defaultState: any = {}
) {
	api.current.to(
		getDefaultEventsProps(
			props[`&:${key}${off ? ":off" : ""}`] || defaultState || {},
			themeMap
		)(componentProps, event, t) || {}
	);

	targets.forEach((target: any) => {
		const targetKey = `&:${key}${off ? ":off" : ""} ${target}`;

		if (props[targetKey]) {
			anime({
				targets: getTargets(ref, target),
				...DEFAULT_ANIMATION,
				...(getDefaultEventsProps(
					props[targetKey] || defaultState || {},
					themeMap
				)(componentProps, event, t) || {}),
			}).play();
		}
	});
}

function getEvent(
	compiled: any,
	key: string,
	parent: any,
	cssObject: any,
	themeMap: any,
	t: any,
	defaultToHover: boolean = false
) {
	const events: any = {};
	const filtered = Object.keys(compiled).filter((k) => k.includes(key));

	if (filtered.length > 0) {
		const targets = filtered
			.filter((k) => k.trim().split(" ").length > 1)
			.map((k) => k.trim().split(" ").slice(1).join(" "));

		const props: any = filtered.reduce(
			(a, b) => ({
				...a,
				[b]: { ...(parent?.compiled[b] || {}), ...compiled[b] },
			}),
			{}
		);

		const defaultState: any = filtered.reduce(
			(a, b) => ({
				...a,
				[b]: {
					...(defaultToHover
						? parent?.defaultCSSHovered || {}
						: parent?.defaultCSS || {}),
					...Object.keys(props[b]).reduce(
						(c, d) => ({
							...c,
							[d]:
								defaultToHover && cssObject?.defaultCSSHovered[d]
									? cssObject?.defaultCSSHovered[d]
									: cssObject.defaultCSS[d] || "0",
						}),
						{}
					),
				},
			}),
			{}
		);

		const ev = EVENTS[`&:${key}`];
		events[ev.on] =
			(api: any, componentProps: any, ref: any) => (event: any) => {
				if (api.current && ref.current) {
					callCallback(
						key,
						api,
						event,
						t,
						componentProps,
						props,
						targets,
						themeMap,
						ref,
						ev.haveActiveProp && !event?.active,
						defaultState[`&:${key}`]
					);
				}
				componentProps[ev.on]?.(event);
			};

		if (ev.off) {
			events[ev.off] =
				(api: any, componentProps: any, ref: any) => (event: any) => {
					if (api.current && ref.current) {
						callCallback(
							key,
							api,
							event,
							t,
							componentProps,
							props,
							targets,
							themeMap,
							ref,
							true,
							defaultState[`&:${key}`]
						);
					}
					componentProps[ev.off]?.(event);
				};
		}
	}

	filtered.forEach((k) => delete compiled[k]);
	return events;
}

export function getEvents(
	compiled: any,
	cssObject: any,
	themeMap: any,
	parent: any
) {
	let events: any = {};
	let proximity: any = {};
	let transitions: any = {};

	let defaults: any = {};

	const filteredKeys = Object.keys(compiled).filter((e) =>
		Object.keys(EVENTS).some((v) => e.includes(v))
	);

	if (filteredKeys.length > 0) {
		const t = [...themeMap].reduce((a: any, b: any) => {
			const theme = { ...a };
			setValueByKey(theme, b[0], b[1].value);
			return theme;
		}, {});

		events = {
			...events,
			...getEvent(compiled, "hovered", parent, cssObject, themeMap, t),
			...getEvent(compiled, "clicked", parent, cssObject, themeMap, t, true),
			...getEvent(compiled, "focused", parent, cssObject, themeMap, t),
			...getEvent(compiled, "drag", parent, cssObject, themeMap, t),
			...getEvent(compiled, "move", parent, cssObject, themeMap, t),
			...getEvent(compiled, "pinch", parent, cssObject, themeMap, t),
			...getEvent(compiled, "wheel", parent, cssObject, themeMap, t),
			...getEvent(compiled, "scroll", parent, cssObject, themeMap, t),
		};

		filteredKeys.forEach((k: string) => {
			if (Object.keys(EVENTS).filter((e: string) => k.includes(e)).length > 0) {
				const parentEventProps = parent?.compiled[k] || {};
				const props = { ...parentEventProps, ...compiled[k] };

				switch (k) {
					case "&:transition":
						transitions.from = (p: any) =>
							getDefaultEventsProps(props.from, themeMap)(p, null, t) || {};
						transitions.enter = (p: any) =>
							getDefaultEventsProps(props.enter, themeMap)(p, null, t) || {};
						transitions.leave = (p: any) =>
							getDefaultEventsProps(props.leave, themeMap)(p, null, t) || {};
						break;
					case "&:proximity":
						proximity.threshold = parseInt(props?.threshold) || 250;
						proximity.throttleInMs = parseInt(props?.throttleInMs) || 400;

						proximity.action = (p: any, e: any) => {
							return getDefaultEventsProps(props, themeMap)(p, e, t) || {};
						};

						break;
					default:
						break;
				}

				delete compiled[k];
			}
		});
	}

	return [defaults, events, proximity, transitions];
}

function getAttributeEvent(compiled: any, key: string) {
	const events: any = {};
	const ev = EVENTS[`&:${key}`];

	const filtered = Object.keys(compiled).filter((k) => k.includes(key));

	if (filtered.length > 0) {
		events[ev.on] =
			(api: any, componentProps: any, ref: any) => (event: any) => {
				if (api?.current && ref?.current && !componentProps.disabled) {
					if ((event?.active && !ev?.off) || ev?.off) {
						if (!ref.current.hasAttribute(key)) {
							ref.current.setAttribute(key, "true");
						}
						if (ref.current.hasAttribute(`${key}-off`)) {
							ref.current.removeAttribute(`${key}-off`);
						}
					}

					if (!ev?.off && !event?.active) {
						if (!ref.current.hasAttribute(`${key}-off`)) {
							ref.current.setAttribute(`${key}-off`, true);
						}
						if (ref.current.hasAttribute(key)) {
							ref.current.removeAttribute(key);
						}
					}
				}
				componentProps[ev.on]?.(event);
			};

		if (ev.off) {
			events[ev.off] =
				(api: any, componentProps: any, ref: any) => (event: any) => {
					if (api.current && ref.current && !componentProps.disabled) {
						if (!ref.current.hasAttribute(`${key}-off`)) {
							ref.current.setAttribute(`${key}-off`, true);
						}
						if (ref.current.hasAttribute(key)) {
							ref.current.removeAttribute(key);
						}
					}
					componentProps[ev.off]?.(event);
				};
		}
	}
	return events;
}

export function getAttributeEvents(compiled: any) {
	let events: any = {};
	let proximity: any = {};
	let transitions: any = {};

	let defaults: any = {};

	const filteredKeys = Object.keys(compiled).filter((e) =>
		Object.keys(EVENTS).some((v) => e.includes(v.replace("&:", "")))
	);

	if (filteredKeys.length > 0) {
		events = {
			...events,
			...getAttributeEvent(compiled, "hovered"),
			...getAttributeEvent(compiled, "clicked"),
			...getAttributeEvent(compiled, "focused"),
			...getAttributeEvent(compiled, "drag"),
			...getAttributeEvent(compiled, "move"),
			...getAttributeEvent(compiled, "pinch"),
			...getAttributeEvent(compiled, "wheel"),
			...getAttributeEvent(compiled, "scroll"),
		};
	}

	return [defaults, events, proximity, transitions];
}
