import createSheet from "./sheet";
import createMemo from "./utils/memo";
import createCSSFunction from "./css";
import createStyledFunction from "./styled";
import createGlobalCSSFunction from "./global";
import { DOM_ELEMENTS } from "./utils/defaults";
import createCreateThemeFunction, { createApplyThemeFunction } from "./theme";

function setup(config: any = {}) {
	config = {
		...config,
		prefix: config?.prefix || "",
		media: config?.media || {},
		theme: config?.theme || {},
	};

	// Creating multiple sheets each for managing different type of rules
	const globSheet = createSheet("q-global");
	const themeSheet = createSheet("q-theme");
	const sheet = createSheet("q-styled");
	const mediaSheet = createSheet("q-media");

	// creating and applying the default theme;
	const createTheme = createCreateThemeFunction(config);
	const defaultTheme = createTheme(config.theme);
	const applyTheme = createApplyThemeFunction(defaultTheme, themeSheet);
	applyTheme(defaultTheme);

	const toString = () =>
		`${String(globSheet)}\n${String(themeSheet)}\n${String(sheet)}\n${String(
			mediaSheet
		)}\n`;

	const css = createCSSFunction(config, sheet, themeSheet);
	const globalCss = createGlobalCSSFunction(config, globSheet);
	const styledConstructor = createStyledFunction(css, false);
	const styled: any = styledConstructor;

	const animatedConstructor = createStyledFunction(css, true);
	const animated: any = animatedConstructor;

	DOM_ELEMENTS.forEach((element: string) => {
		styled[element] = styledConstructor(element);
		animated[element] = animatedConstructor(element);
	});

	return {
		globSheet,
		themeSheet,
		sheet,
		mediaSheet,
		config,
		defaultTheme,
		prefix: config.prefix,
		css,
		globalCss,
		keyframes: "createKeyframesFunction(config, sheet)",
		createTheme,
		styled,
		animated,
		applyTheme,
		getCssText: toString,
		toString: toString,
	};
}

export default createMemo(setup);
