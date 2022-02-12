export const THEME_KEY = "active_theme";

const borderStyles = "borderStyles";
const borderWidths = "borderWidths";
const colors = "colors";
const fonts = "fonts";
const fontSizes = "fontSizes";
const fontWeights = "fontWeights";
const letterSpacings = "letterSpacings";
const lineHeights = "lineHeights";
const radii = "radii";
const shadows = "shadows";
const sizes = "sizes";
const space = "space";
const transitions = "transitions";
const zIndices = "zIndices";

export const DEFAULT_THEME_MAP: any = {
	gap: space,
	gridGap: space,
	columnGap: space,
	gridColumnGap: space,
	rowGap: space,
	gridRowGap: space,
	inset: space,
	insetBlock: space,
	insetBlockEnd: space,
	insetBlockStart: space,
	insetInline: space,
	insetInlineEnd: space,
	insetInlineStart: space,
	margin: space,
	marginTop: space,
	marginRight: space,
	marginBottom: space,
	marginLeft: space,
	marginBlock: space,
	marginBlockEnd: space,
	marginBlockStart: space,
	marginInline: space,
	marginInlineEnd: space,
	marginInlineStart: space,
	padding: space,
	paddingTop: space,
	paddingRight: space,
	paddingBottom: space,
	paddingLeft: space,
	paddingBlock: space,
	paddingBlockEnd: space,
	paddingBlockStart: space,
	paddingInline: space,
	paddingInlineEnd: space,
	paddingInlineStart: space,
	top: space,
	right: space,
	bottom: space,
	left: space,
	scrollMargin: space,
	scrollMarginTop: space,
	scrollMarginRight: space,
	scrollMarginBottom: space,
	scrollMarginLeft: space,
	scrollMarginX: space,
	scrollMarginY: space,
	scrollMarginBlock: space,
	scrollMarginBlockEnd: space,
	scrollMarginBlockStart: space,
	scrollMarginInline: space,
	scrollMarginInlineEnd: space,
	scrollMarginInlineStart: space,
	scrollPadding: space,
	scrollPaddingTop: space,
	scrollPaddingRight: space,
	scrollPaddingBottom: space,
	scrollPaddingLeft: space,
	scrollPaddingX: space,
	scrollPaddingY: space,
	scrollPaddingBlock: space,
	scrollPaddingBlockEnd: space,
	scrollPaddingBlockStart: space,
	scrollPaddingInline: space,
	scrollPaddingInlineEnd: space,
	scrollPaddingInlineStart: space,

	fontSize: fontSizes,

	background: colors,
	backgroundColor: colors,
	backgroundImage: colors,
	borderImage: colors,
	border: colors,
	borderBlock: colors,
	borderBlockEnd: colors,
	borderBlockStart: colors,
	borderBottom: colors,
	borderBottomColor: colors,
	borderColor: colors,
	borderInline: colors,
	borderInlineEnd: colors,
	borderInlineStart: colors,
	borderLeft: colors,
	borderLeftColor: colors,
	borderRight: colors,
	borderRightColor: colors,
	borderTop: colors,
	borderTopColor: colors,
	caretColor: colors,
	color: colors,
	columnRuleColor: colors,
	fill: colors,
	outline: colors,
	outlineColor: colors,
	stroke: colors,
	textDecorationColor: colors,

	fontFamily: fonts,

	fontWeight: fontWeights,

	lineHeight: lineHeights,

	letterSpacing: letterSpacings,

	blockSize: sizes,
	minBlockSize: sizes,
	maxBlockSize: sizes,
	inlineSize: sizes,
	minInlineSize: sizes,
	maxInlineSize: sizes,
	width: sizes,
	minWidth: sizes,
	maxWidth: sizes,
	height: sizes,
	minHeight: sizes,
	maxHeight: sizes,
	flexBasis: sizes,
	gridTemplateColumns: sizes,
	gridTemplateRows: sizes,

	borderWidth: borderWidths,
	borderTopWidth: borderWidths,
	borderRightWidth: borderWidths,
	borderBottomWidth: borderWidths,
	borderLeftWidth: borderWidths,

	borderStyle: borderStyles,
	borderTopStyle: borderStyles,
	borderRightStyle: borderStyles,
	borderBottomStyle: borderStyles,
	borderLeftStyle: borderStyles,

	borderRadius: radii,
	borderTopLeftRadius: radii,
	borderTopRightRadius: radii,
	borderBottomRightRadius: radii,
	borderBottomLeftRadius: radii,

	boxShadow: shadows,
	textShadow: shadows,

	transition: transitions,

	zIndex: zIndices,
};

export const DOM_ELEMENTS = [
	"a",
	"abbr",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"base",
	"bdi",
	"bdo",
	"big",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"cite",
	"code",
	"col",
	"colgroup",
	"data",
	"datalist",
	"dd",
	"del",
	"details",
	"dfn",
	"dialog",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"iframe",
	"img",
	"input",
	"ins",
	"kbd",
	"keygen",
	"label",
	"legend",
	"li",
	"link",
	"main",
	"map",
	"mark",
	"menu",
	"menuitem",
	"meta",
	"meter",
	"nav",
	"noscript",
	"object",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"param",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"script",
	"section",
	"select",
	"small",
	"source",
	"span",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"title",
	"tr",
	"track",
	"u",
	"ul",
	"var",
	"video",
	"wbr", // SVG
	"circle",
	"clipPath",
	"defs",
	"ellipse",
	"foreignObject",
	"g",
	"image",
	"line",
	"linearGradient",
	"marker",
	"mask",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialGradient",
	"rect",
	"stop",
	"svg",
	"text",
	"tspan",
];

export const DEFAULTS: any = {
	translateX: "0",
	translateY: "0",
	translateZ: "0",

	scale: "1",
	scaleX: "1",
	scaleY: "1",
	scaleZ: "1",

	skew: "0",
	skewX: "0",
	skewY: "0",
	perspective: "0",

	rotate: "0",
	rotateX: "0",
	rotateY: "0",
	rotateZ: "0",
};
export const DEFAULTS_UNITS: any = {
	translateX: "px",
	translateY: "px",
	translateZ: "px",

	scale: "",
	scaleX: "",
	scaleY: "",
	scaleZ: "",

	skew: "deg",
	skewX: "deg",
	skewY: "deg",
	perspective: "px",

	rotate: "deg",
	rotateX: "deg",
	rotateY: "deg",
	rotateZ: "deg",
};

export const EVENTS: any = {
	"&:transition": null,
	"&:proximity": null,

	"&:hovered": { on: "onHover", haveActiveProp: true },
	"&:clicked": {
		on: "onPointerDown",
		off: "onPointerUp",
		haveActiveProp: false,
	},
	"&:focused": {
		on: "onFocus",
		off: "onBlur",
		haveActiveProp: false,
	},

	"&:drag": { on: "onDrag", haveActiveProp: true },
	"&:move": { on: "onMove", haveActiveProp: true },
	"&:pinch": { on: "onPinch", haveActiveProp: true },

	"&:wheel": { on: "onWheel", haveActiveProp: true },
	"&:scroll": { on: "onScroll", haveActiveProp: true },
};

export const DEFAULT_ANIMATION = {
	duration: 400,
	easing: "easeOutElastic(1, .6)",
};

export const FN_KEYS = ["p.", "e.", "t.", "$p.", "$t.", "$e.", "$", "stagger"];
