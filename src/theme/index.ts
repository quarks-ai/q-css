import createMemo from "../utils/memo";
import hash from "../utils/hash";
import { THEME_KEY } from "../utils/defaults";

// inspired from stitches
function createCreateThemeFunction(config: any) {
	return function (theme: any) {
		const className = `${config.prefix && config.prefix + "-"}t-${hash(
			JSON.stringify(theme)
		)}`;

		let themeObject: Map<string, any> = new Map();
		const cssProps: any = [];

		for (const themeKey in theme) {
			for (const themeToken in theme[themeKey]) {
				const propertyName = `--${
					config.prefix && config.prefix + "-"
				}${themeKey}-${themeToken}`;
				const propertyValue = String(theme[themeKey][themeToken]);

				themeObject.set(`${themeKey}.${themeToken}`, {
					value: propertyValue,
					key: propertyName,
					type: themeKey,
					toString: () => `var(${propertyName})`,
				});
				cssProps.push(`${propertyName}:${propertyValue}`);
			}
		}

		return {
			className,
			themeObject,
			cssProps,
			toString: () => `:root {${cssProps.join(";")}}`,
		};
	};
}

export function createApplyThemeFunction(defaultTheme: any, sheet: any) {
	return function (theme: any): void {
		if (theme.cssProps.length) {
			let themeCssRule: string | null = null;

			if (sheet.cache.has(theme.className)) {
				const cachedTheme: any = sheet.cache.get(theme.className);
				themeCssRule = cachedTheme?.themeCssRule || null;
				sheet.cache.set(THEME_KEY, {
					theme,
					mergedThemeObject: cachedTheme?.mergedThemeObject,
					themeCssRule,
				});
			}

			if (!sheet.cache.has(theme.className) || !themeCssRule) {
				const mergedCssProps = new Set([
					...defaultTheme.cssProps,
					...theme.cssProps,
				]);

				const mergedThemeObject = new Map([
					...defaultTheme.themeObject,
					...theme.themeObject,
				]);
				themeCssRule = `:root {${[...mergedCssProps].join(";\n")}}`;

				sheet.cache.set(theme.className, {
					theme,
					mergedThemeObject,
					themeCssRule,
				});
				sheet.cache.set(THEME_KEY, { theme, mergedThemeObject, themeCssRule });
			}

			if (sheet.sheet.cssRules) {
				for (var i = 0; i < sheet.sheet.cssRules.length; i++) {
					sheet.sheet.deleteRule(i);
				}
			}

			sheet.sheet.insertRule(themeCssRule, sheet.sheet.cssRules.length);
		}
	};
}

export default createMemo(createCreateThemeFunction);
