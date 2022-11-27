var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import React, { forwardRef, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import throttle from "lodash.throttle";
import { observeElementInViewport } from "observe-element-in-viewport";
function createSheet(id) {
  const root = (globalThis == null ? void 0 : globalThis.document) || null;
  function createCSSMediaRule(sourceCssText, type) {
    return {
      type,
      cssRules: [],
      insertRule(cssText, index2) {
        this.cssRules.splice(index2, 0, createCSSMediaRule(cssText, 1));
      },
      get cssText() {
        return sourceCssText === "@media{}" ? `@media{${[].map.call(this.cssRules, (cssRule) => cssRule.cssText).join("")}}` : sourceCssText;
      }
    };
  }
  const sheet = root && (root == null ? void 0 : root.head) ? Object.assign(((root == null ? void 0 : root.head) || root).appendChild(document.createElement("style")), {
    innerHTML: " ",
    id
  }).sheet : createCSSMediaRule("", "text/css");
  return {
    sheet,
    cache: /* @__PURE__ */ new Map(),
    toString() {
      const { cssRules } = sheet;
      return [].map.call(cssRules, (cssRule) => cssRule.cssText).join("");
    }
  };
}
function createMemo(fn) {
  if (typeof fn !== "function") {
    throw new TypeError("fn Expected to be a function");
  }
  let cache = /* @__PURE__ */ new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      let result = fn.apply(null, args);
      cache.set(key, result);
      return result;
    }
  };
}
function hash(str) {
  let i = 0;
  let out = 11;
  while (i < str.length) {
    out = 101 * out + str.charCodeAt(i++) >>> 0;
  }
  return "q-" + out;
}
let newRule = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/g;
let ruleClean = /\/\*[^]*?\*\/|\s\s+|\n/g;
function astish(str) {
  let tree = [{}];
  let block;
  while (block = newRule.exec(str.replace(ruleClean, ""))) {
    if (block[4]) {
      tree.shift();
    }
    if (block[3]) {
      tree.unshift(tree[0][block[3]] = tree[0][block[3]] || {});
    } else if (!block[4]) {
      tree[0][block[1]] = block[2];
    }
  }
  return tree[0];
}
const THEME_KEY = "active_theme";
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
const DEFAULT_THEME_MAP = {
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
  zIndex: zIndices
};
const DOM_ELEMENTS = [
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
  "wbr",
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
  "tspan"
];
const DEFAULTS = {
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
  rotateZ: "0"
};
const EVENTS = {
  "&:transition": null,
  "&:proximity": null,
  "&:hovered": { on: "onHover", haveActiveProp: true },
  "&:clicked": {
    on: "onPointerDown",
    off: "onPointerUp",
    haveActiveProp: false
  },
  "&:focused": {
    on: "onFocus",
    off: "onBlur",
    haveActiveProp: false
  },
  "&:drag": { on: "onDrag", haveActiveProp: true },
  "&:move": { on: "onMove", haveActiveProp: true },
  "&:pinch": { on: "onPinch", haveActiveProp: true },
  "&:wheel": { on: "onWheel", haveActiveProp: true },
  "&:scroll": { on: "onScroll", haveActiveProp: true }
};
const FN_KEYS = ["p.", "e.", "t.", "$p.", "$t.", "$e.", "$", "stagger"];
function toCamelCase(value) {
  return !/[A-Z]/.test(value) ? value.replace(/-[^]/g, (capital) => capital[1].toUpperCase()) : value;
}
function toHyphenCase(value) {
  return value.includes("-") ? value : value.replace(/[A-Z]/g, (capital) => "-" + capital.toLowerCase());
}
function toCssVariables(key, value, prefix = null, themeMap = null) {
  const themeKey = (v) => `${DEFAULT_THEME_MAP[toCamelCase(key)] || ""}.${v}`;
  const defaultCssVariable = (v) => `var(--${prefix && prefix + "-"}${v.replaceAll("$t.", "").replaceAll("$", "").replaceAll(".", "-")})`;
  return value.includes("p.") || value.includes("props") || !value.includes("$") ? value : value.trim().split(" ").map((v) => v.includes("$t.") ? defaultCssVariable(v) : themeMap.has(themeKey(v.replaceAll("$", ""))) ? themeMap.get(themeKey(v.replaceAll("$", ""))) : v).join(" ").trim();
}
function toThemeVariables(key, value, themeMap) {
  const themeKey = (v) => v.replaceAll("$t.", "").replaceAll("$", "");
  const mappedThemeKey = (v) => `${DEFAULT_THEME_MAP[toCamelCase(key)] || ""}.${v.replaceAll("$t.", "").replaceAll("$", "")}`;
  const parsedValue = value.includes("p.") || value.includes("props") || !value.includes("$") ? value : value.trim().split(" ").map((v) => themeMap.has(themeKey(v)) ? themeMap.get(themeKey(v)).value : themeMap.has(mappedThemeKey(v)) ? themeMap.get(mappedThemeKey(v)).value : themeKey(v)).join(" ").trim();
  return parsedValue;
}
function functionCreator(props, body) {
  return new Function(...props, body);
}
function parseFunctionBody(val) {
  return `{ return ${val.replace(/\.[^]/g, (v) => "?." + v[1]).replaceAll("$", val.includes("props") ? "" : "props.")}} `;
}
function parse$1(obj, prefix = null, themeMap) {
  return Object.keys(obj).map((k) => `${toHyphenCase(k)}:${toCssVariables(k, obj[k], prefix, themeMap)}`);
}
function getDynamicStyles(compiled, themeMap) {
  const dynamicStyles = {};
  Object.keys(compiled).filter((k) => k.startsWith("--")).forEach((k) => {
    const parsed = compiled[k].replaceAll("$", "");
    const parsedFn = functionCreator([parsed.includes("props") ? "props" : "p"], `return ${parsed}`);
    const parsedFnWithTheme = (t) => (props) => {
      return parsedFn(props).split(" ").map((v) => t.has(v) ? `var(${t.get(v).key})` : v).join(" ");
    };
    dynamicStyles[k] = parsedFnWithTheme(themeMap);
    delete compiled[k];
  });
  return dynamicStyles;
}
function getDefaultProps(compiled, themeMap) {
  let props = {};
  Object.keys(compiled).filter((k) => typeof compiled[k] === "string").forEach((k) => {
    props[toCamelCase(k)] = toThemeVariables(k, compiled[k], themeMap);
  });
  return props;
}
function getCssBody(className, compiled, prefix, themeMap) {
  return `.${className}{${Object.keys(compiled).filter((k) => typeof compiled[k] === "string").map((k) => {
    const val = parse$1({ [k]: compiled[k] }, prefix, themeMap)[0];
    delete compiled[k];
    return val;
  }).join(";")};}`;
}
function getCssAttributesBody(key, className, compiled, prefix, themeMap) {
  return `${key.replaceAll("&", `.${className}`)} {${Object.keys(compiled).map((k) => {
    const val = parse$1({ [k]: compiled[k] }, prefix, themeMap)[0];
    delete compiled[k];
    return val;
  }).join(";")};}`;
}
function getDefaultEventsProps(compiled, themeMap) {
  let fn = `{`;
  Object.keys(compiled).filter((k) => typeof compiled[k] === "string").forEach((k) => {
    fn += `${toCamelCase(k)}: ${FN_KEYS.some((v) => compiled[k].includes(v)) ? compiled[k].trim().split(" ").map((e) => {
      var _a, _b;
      const cleaned = e.replaceAll("$t.", "").replaceAll("$", "");
      const mapped = `${DEFAULT_THEME_MAP[toCamelCase(k)]}.${cleaned}`;
      return themeMap.has(cleaned) ? `"${(_a = themeMap.get(cleaned)) == null ? void 0 : _a.value}"` : themeMap.has(mapped) ? `"${(_b = themeMap.get(mapped)) == null ? void 0 : _b.value}"` : e;
    }).join(" ") : `"${compiled[k]}"`},
`;
  });
  fn += "}";
  fn = fn.replaceAll("$", "");
  return functionCreator(["p", "e", "t"], `return ${fn}`);
}
function setValueByKey(d, key, val) {
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
function getEvent(compiled, key, parent, cssObject, themeMap, t, defaultToHover = false) {
  const events = {};
  const filtered = Object.keys(compiled).filter((k) => k.includes(key));
  if (filtered.length > 0) {
    filtered.filter((k) => k.trim().split(" ").length > 1).map((k) => k.trim().split(" ").slice(1).join(" "));
    const props = filtered.reduce((a, b) => __spreadProps(__spreadValues({}, a), {
      [b]: __spreadValues(__spreadValues({}, (parent == null ? void 0 : parent.compiled[b]) || {}), compiled[b])
    }), {});
    filtered.reduce((a, b) => __spreadProps(__spreadValues({}, a), {
      [b]: __spreadValues(__spreadValues({}, defaultToHover ? (parent == null ? void 0 : parent.defaultCSSHovered) || {} : (parent == null ? void 0 : parent.defaultCSS) || {}), Object.keys(props[b]).reduce((c, d) => __spreadProps(__spreadValues({}, c), {
        [d]: defaultToHover && (cssObject == null ? void 0 : cssObject.defaultCSSHovered[d]) ? cssObject == null ? void 0 : cssObject.defaultCSSHovered[d] : cssObject.defaultCSS[d] || "0"
      }), {}))
    }), {});
    const ev = EVENTS[`&:${key}`];
    events[ev.on] = (api, componentProps, ref) => (event) => {
      var _a;
      (_a = componentProps[ev.on]) == null ? void 0 : _a.call(componentProps, event);
    };
    if (ev.off) {
      events[ev.off] = (api, componentProps, ref) => (event) => {
        var _a;
        (_a = componentProps[ev.off]) == null ? void 0 : _a.call(componentProps, event);
      };
    }
  }
  filtered.forEach((k) => delete compiled[k]);
  return events;
}
function getEvents(compiled, cssObject, themeMap, parent) {
  let events = {};
  let proximity = {};
  let transitions2 = {};
  let defaults = {};
  const filteredKeys = Object.keys(compiled).filter((e) => Object.keys(EVENTS).some((v) => e.includes(v)));
  if (filteredKeys.length > 0) {
    const t = [...themeMap].reduce((a, b) => {
      const theme = __spreadValues({}, a);
      setValueByKey(theme, b[0], b[1].value);
      return theme;
    }, {});
    events = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, events), getEvent(compiled, "hovered", parent, cssObject)), getEvent(compiled, "clicked", parent, cssObject, themeMap, t, true)), getEvent(compiled, "focused", parent, cssObject)), getEvent(compiled, "drag", parent, cssObject)), getEvent(compiled, "move", parent, cssObject)), getEvent(compiled, "pinch", parent, cssObject)), getEvent(compiled, "wheel", parent, cssObject)), getEvent(compiled, "scroll", parent, cssObject));
    filteredKeys.forEach((k) => {
      if (Object.keys(EVENTS).filter((e) => k.includes(e)).length > 0) {
        const parentEventProps = (parent == null ? void 0 : parent.compiled[k]) || {};
        const props = __spreadValues(__spreadValues({}, parentEventProps), compiled[k]);
        switch (k) {
          case "&:transition":
            transitions2.from = (p) => getDefaultEventsProps(props.from, themeMap)(p, null, t) || {};
            transitions2.enter = (p) => getDefaultEventsProps(props.enter, themeMap)(p, null, t) || {};
            transitions2.leave = (p) => getDefaultEventsProps(props.leave, themeMap)(p, null, t) || {};
            break;
          case "&:proximity":
            proximity.threshold = parseInt(props == null ? void 0 : props.threshold) || 250;
            proximity.throttleInMs = parseInt(props == null ? void 0 : props.throttleInMs) || 400;
            proximity.action = (p, e) => {
              return getDefaultEventsProps(props, themeMap)(p, e, t) || {};
            };
            break;
        }
        delete compiled[k];
      }
    });
  }
  return [defaults, events, proximity, transitions2];
}
function getAttributeEvent(compiled, key) {
  const events = {};
  const ev = EVENTS[`&:${key}`];
  const filtered = Object.keys(compiled).filter((k) => k.includes(key));
  if (filtered.length > 0) {
    events[ev.on] = (api, componentProps, ref) => (event) => {
      var _a;
      if ((ref == null ? void 0 : ref.current) && !componentProps.disabled) {
        if ((event == null ? void 0 : event.active) && !(ev == null ? void 0 : ev.off) || (ev == null ? void 0 : ev.off)) {
          if (!ref.current.hasAttribute(key)) {
            ref.current.setAttribute(key, "true");
          }
          if (ref.current.hasAttribute(`${key}-off`)) {
            ref.current.removeAttribute(`${key}-off`);
          }
        }
        if (!(ev == null ? void 0 : ev.off) && !(event == null ? void 0 : event.active)) {
          if (!ref.current.hasAttribute(`${key}-off`)) {
            ref.current.setAttribute(`${key}-off`, true);
          }
          if (ref.current.hasAttribute(key)) {
            ref.current.removeAttribute(key);
          }
        }
      }
      ev.on in componentProps && ((_a = componentProps[ev.on]) == null ? void 0 : _a.call(componentProps, event));
    };
    if (ev.off) {
      events[ev.off] = (api, componentProps, ref) => (event) => {
        var _a;
        if (ref.current && !componentProps.disabled) {
          if (!ref.current.hasAttribute(`${key}-off`)) {
            ref.current.setAttribute(`${key}-off`, true);
          }
          if (ref.current.hasAttribute(key)) {
            ref.current.removeAttribute(key);
          }
        }
        (_a = componentProps[ev.off]) == null ? void 0 : _a.call(componentProps, event);
      };
    }
  }
  return events;
}
function getAttributeEvents(compiled) {
  let events = {};
  let proximity = {};
  let transitions2 = {};
  let defaults = {};
  const filteredKeys = Object.keys(compiled).filter((e) => Object.keys(EVENTS).some((v) => e.includes(v.replace("&:", ""))));
  if (filteredKeys.length > 0) {
    events = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, events), getAttributeEvent(compiled, "hovered")), getAttributeEvent(compiled, "clicked")), getAttributeEvent(compiled, "focused")), getAttributeEvent(compiled, "drag")), getAttributeEvent(compiled, "move")), getAttributeEvent(compiled, "pinch")), getAttributeEvent(compiled, "wheel")), getAttributeEvent(compiled, "scroll"));
  }
  return [defaults, events, proximity, transitions2];
}
function stringify(obj) {
  let result = "";
  for (const v in obj) {
    if (typeof obj[v] === "string") {
      result += `${v}:${obj[v]};
`;
    } else {
      result += `${v}{
${stringify(obj[v])}}`;
    }
  }
  return result;
}
function createCSSFunction(config, sheet, themeSheet) {
  return function css(style, save = true, parent = null, animated = false) {
    var _a, _b, _c, _d;
    const className = hash(style);
    if (sheet.cache.has(className)) {
      return sheet.cache.get(className);
    }
    const compiled = astish(style);
    let defaultCSS = __spreadValues(__spreadValues({}, (parent == null ? void 0 : parent.defaultCSS) ? parent.defaultCSS : DEFAULTS), getDefaultProps(compiled, themeSheet.cache.get(THEME_KEY).mergedThemeObject));
    const defaultCSSHovered = compiled["&:hovered"] ? __spreadValues(__spreadValues({}, parent == null ? void 0 : parent.defaultCSSHovered), getDefaultProps(compiled["&:hovered"], themeSheet.cache.get(THEME_KEY).mergedThemeObject)) : {};
    const cssObject = {
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
      variants: /* @__PURE__ */ new Set(),
      baseStyles: /* @__PURE__ */ new Set(),
      mediaStyles: /* @__PURE__ */ new Set(),
      toString: () => `.${className}`
    };
    const dynamicStyles = getDynamicStyles(compiled, themeSheet.cache.get(THEME_KEY).theme.themeObject);
    cssObject.dynamicStyles = dynamicStyles;
    cssObject.baseStyles.add(getCssBody(className, compiled, config.prefix, themeSheet.cache.get(THEME_KEY).theme.themeObject));
    let events, defaults, proximity, transitions2;
    if (animated) {
      [defaults, events, proximity, transitions2] = getEvents(compiled, cssObject, themeSheet.cache.get(THEME_KEY).mergedThemeObject, parent);
    } else {
      [defaults, events, proximity, transitions2] = getAttributeEvents(compiled);
    }
    cssObject.defaults = defaults;
    cssObject.events = events;
    cssObject.proximity = proximity;
    cssObject.transitions = transitions2;
    cssObject.getEvents = () => cssObject.events;
    cssObject.getProximity = () => cssObject.proximity;
    cssObject.getTransitions = () => cssObject.transitions;
    cssObject.getDynamicStyles = () => cssObject.dynamicStyles;
    cssObject.willAnimate = (((_a = Object.keys(events)) == null ? void 0 : _a.length) > 0 || ((_b = Object.keys(proximity)) == null ? void 0 : _b.length) > 0 || ((_c = Object.keys(transitions2)) == null ? void 0 : _c.length) > 0) && true;
    cssObject.willProximity = Object.keys(proximity).length > 0 && true;
    cssObject.willTransition = Object.keys(transitions2).length > 0 && true;
    for (let value in compiled) {
      if (value.includes("$")) {
        cssObject.variants.add({
          cssObject: css(stringify(compiled[value]), false, cssObject),
          condition: functionCreator(["props"], parseFunctionBody(value))
        });
        delete compiled[value];
      } else {
        if (!Object.keys(EVENTS).some((v) => value.includes(v))) {
          cssObject.baseStyles.add(getCssAttributesBody(value, className, compiled[value], config.prefix, themeSheet.cache.get(THEME_KEY).theme.themeObject));
        }
      }
    }
    let rules = [];
    cssObject.baseStyles.forEach((rule) => rules = [...rules, rule]);
    if (cssObject.variants.size > 0) {
      (_d = cssObject.variants) == null ? void 0 : _d.forEach(function getRule(variant) {
        var _a2;
        variant.cssObject.baseStyles.forEach((rule) => rules = [...rules, rule]);
        (_a2 = variant.cssObject.variants) == null ? void 0 : _a2.forEach(getRule);
      });
      const getClassNames = (props) => [
        className,
        ...[...cssObject.variants].map((v) => v.condition(props) && v.cssObject.getClassNames(props)).flat()
      ].filter(Boolean);
      const getDynamicStyles2 = (props) => {
        const obj = __spreadValues(__spreadValues({}, cssObject.dynamicStyles), [...cssObject.variants].map((v) => v.condition(props) && v.cssObject.dynamicStyles).filter(Boolean).reduce((a, b) => __spreadValues(__spreadValues({}, a), b), {}));
        return Object.keys(obj).reduce((a, b) => __spreadProps(__spreadValues({}, a), {
          [b]: obj[b](props)
        }), {});
      };
      const getEvents2 = (props) => {
        return __spreadValues(__spreadValues({}, cssObject.events), [...cssObject.variants].map((v) => v.condition(props) && v.cssObject.events).filter(Boolean).reduce((a, b) => __spreadValues(__spreadValues({}, a), b), {}));
      };
      const getTransitions = (props) => __spreadValues(__spreadValues({}, cssObject.transitions), [...cssObject.variants].map((v) => v.condition(props) && v.cssObject.transitions).filter(Boolean).reduce((a, b) => __spreadValues(__spreadValues({}, a), b), {}));
      const getProximity = (props) => __spreadValues(__spreadValues({}, cssObject.proximity), [...cssObject.variants].map((v) => v.condition(props) && v.cssObject.proximity).filter(Boolean).reduce((a, b) => __spreadValues(__spreadValues({}, a), b), {}));
      cssObject.getEvents = getEvents2;
      cssObject.getProximity = getProximity;
      cssObject.getTransitions = getTransitions;
      cssObject.getDynamicStyles = getDynamicStyles2;
      cssObject.getClassNames = getClassNames;
    } else {
      const getDynamicStyles2 = (props) => {
        return Object.keys(cssObject.dynamicStyles).reduce((a, b) => __spreadProps(__spreadValues({}, a), {
          [b]: cssObject.dynamicStyles[b](props)
        }), {});
      };
      cssObject.getDynamicStyles = getDynamicStyles2;
    }
    sheet.cache.set(className, cssObject);
    if (save) {
      [...rules].forEach((rule, i) => {
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
var createCSSFunction$1 = createMemo(createCSSFunction);
function mergeRefs(...inputRefs) {
  return (ref) => {
    inputRefs.forEach((inputRef) => {
      if (!inputRef) {
        return;
      }
      if (typeof inputRef === "function") {
        inputRef(ref);
      } else {
        inputRef.current = ref;
      }
    });
  };
}
function getMousePosition(mouseEvent) {
  const x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
  const y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  return { x, y };
}
function distancePoints(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
function precisionRound(number, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
function lineEq(y2, y1, x2, x1, currentVal) {
  const m = (y2 - y1) / (x2 - x1);
  const b = y1 - m * x1;
  const y = m * currentVal + b;
  return y > 1 ? 1 : precisionRound(y, 2);
}
function callOnMouseMove({ callback, ref, threshold }) {
  return function(event) {
    if (ref == null ? void 0 : ref.current) {
      requestAnimationFrame(function run() {
        const mousePosition = getMousePosition(event);
        const documentScrolls = {
          left: document.body.scrollLeft + document.documentElement.scrollLeft,
          top: document.body.scrollTop + document.documentElement.scrollTop
        };
        const elementRectangle = ref.current.getBoundingClientRect();
        const elementCoordinates = {
          x1: elementRectangle.left + documentScrolls.left,
          x2: elementRectangle.width + elementRectangle.left + documentScrolls.left,
          y1: elementRectangle.top + documentScrolls.top,
          y2: elementRectangle.height + elementRectangle.top + documentScrolls.top
        };
        const closestPoint = {
          x: mousePosition.x,
          y: mousePosition.y
        };
        if (mousePosition.x < elementCoordinates.x1) {
          closestPoint.x = elementCoordinates.x1;
        } else if (mousePosition.x > elementCoordinates.x2) {
          closestPoint.x = elementCoordinates.x2;
        }
        if (mousePosition.y < elementCoordinates.y1) {
          closestPoint.y = elementCoordinates.y1;
        } else if (mousePosition.y > elementCoordinates.y2) {
          closestPoint.y = elementCoordinates.y2;
        }
        const distance = Math.floor(distancePoints(mousePosition.x, mousePosition.y, closestPoint.x, closestPoint.y));
        const proximity = Math.round((1 - lineEq(0, 1, 0, threshold, distance)) * 100) / 100;
        const pos = [
          Math.round(mousePosition.x - (elementRectangle.width / 2 + elementRectangle.left + documentScrolls.left)),
          Math.round(mousePosition.y - (elementRectangle.height / 2 + elementRectangle.top + documentScrolls.top))
        ];
        callback({
          distance,
          proximity,
          isNearby: distance <= threshold,
          pos
        });
      });
    }
  };
}
const defaultOptions = {
  threshold: 200,
  throttleInMs: 50,
  active: true
};
const THROTTLE = 1e3 / 60;
function useProximtiyFeedback(options) {
  const { threshold, active, callback, ref } = __spreadValues(__spreadValues({}, defaultOptions), options);
  const [isInViewport, setIsInViewport] = React.useState(false);
  const onMouseMove = React.useCallback(callOnMouseMove({
    threshold,
    ref,
    callback: ({ distance, proximity, isNearby, pos }) => {
      callback({ distance, proximity, isNearby, pos });
    }
  }), [ref, threshold]);
  var throttledOnMouseMove = throttle(onMouseMove, THROTTLE);
  React.useEffect(function() {
    if (ref.current && active) {
      return observeElementInViewport(ref.current, function() {
        setIsInViewport(true);
      }, function() {
        setIsInViewport(false);
      }, {
        viewport: null
      });
    } else {
      return void 0;
    }
  }, [ref, active]);
  React.useEffect(() => {
    if (isInViewport && active) {
      document.addEventListener("mousemove", throttledOnMouseMove);
    } else {
      document.removeEventListener("mousemove", throttledOnMouseMove);
    }
    return () => {
      document.removeEventListener("mousemove", throttledOnMouseMove);
    };
  }, [isInViewport, active]);
  return;
}
const AnimatedC = forwardRef((_a, forwardedRef) => {
  var _b = _a, {
    as = "span",
    defaults = {},
    events,
    proximity,
    transitions: transitions2,
    willAnimate,
    willProximity,
    willTransition,
    onBlur,
    onFocus,
    onMouseUp,
    onProximity,
    onMouseDown
  } = _b, props = __objRest(_b, [
    "as",
    "defaults",
    "events",
    "proximity",
    "transitions",
    "willAnimate",
    "willProximity",
    "willTransition",
    "onBlur",
    "onFocus",
    "onMouseUp",
    "onProximity",
    "onMouseDown"
  ]);
  const Comp = as;
  const animeRef = useRef(null);
  const ref = mergeRefs(forwardedRef, animeRef);
  useProximtiyFeedback({
    ref: animeRef,
    threshold: (proximity == null ? void 0 : proximity.threshold) || 250,
    active: willProximity || onProximity !== null && onProximity !== void 0,
    callback: (e) => {
      onProximity(e);
    }
  });
  const bind = useGesture(__spreadValues({}, events ? Object.keys(events).map((k) => {
    return {
      [k]: events[k](null, __spreadProps(__spreadValues({}, props), { onMouseUp, onMouseDown, onBlur, onFocus }), animeRef)
    };
  }).reduce((obj, item) => __spreadValues(__spreadValues({}, obj), item), {}) : {}));
  return /* @__PURE__ */ React.createElement(Comp, __spreadValues(__spreadValues({
    ref
  }, bind()), props));
});
function computeStyle(style, data) {
  return style.map((s, idx) => `${s}${data[idx] || ""}`).join("");
}
function createStyledFunction(css, animated = false) {
  function createStyledCOmponent(type) {
    return function(style, ...data) {
      const DefaultType = type;
      const computedStyle = computeStyle(style, data);
      const cssComponent = css(computedStyle, true, null, animated);
      const styledComponent = React.forwardRef((props, ref) => {
        const Type = props && props.as || DefaultType;
        const forwardProps = __spreadValues(__spreadValues({}, cssComponent.props), props);
        forwardProps.ref = ref;
        forwardProps.className = [
          ...cssComponent == null ? void 0 : cssComponent.getClassNames(props),
          props.className
        ].filter(Boolean).join(" ");
        forwardProps.style = __spreadValues(__spreadValues({}, cssComponent == null ? void 0 : cssComponent.getDynamicStyles(props)), props.style);
        cssComponent.willAnimate = cssComponent.willAnimate || (forwardProps == null ? void 0 : forwardProps.onProximity);
        if (!cssComponent.willAnimate) {
          delete forwardProps.as;
        } else {
          forwardProps.as = forwardProps.as || Type;
          forwardProps.defaults = cssComponent.defaults;
          forwardProps.willAnimate = cssComponent.willAnimate;
          forwardProps.willProximity = cssComponent.willProximity;
          forwardProps.willTransition = cssComponent.willProximity;
          forwardProps.events = cssComponent.getEvents(props);
          forwardProps.proximity = forwardProps.proximity || cssComponent.getProximity(props);
          forwardProps.transitions = cssComponent.getTransitions(props);
        }
        delete forwardProps.disableanimationsifdisabled;
        if (props == null ? void 0 : props.ignore) {
          typeof props.ignore === "string" ? delete forwardProps[props.ignore] : props.ignore.forEach((p) => {
            delete forwardProps[p];
          });
          delete forwardProps.ignore;
        }
        if (cssComponent.willAnimate) {
          return React.createElement(AnimatedC, forwardProps);
        } else {
          return React.createElement(Type, forwardProps);
        }
      });
      styledComponent.displayName = `q-.${DefaultType.displayName || DefaultType.name || DefaultType}`;
      styledComponent.toString = () => cssComponent.toString();
      return styledComponent;
    };
  }
  return createStyledCOmponent;
}
var createStyledFunction$1 = createMemo(createStyledFunction);
function parse(obj, prefix = null) {
  return Object.keys(obj).map((k) => `${k}:${toCssVariables(k, obj[k], prefix)}`);
}
function createGlobalCSSFunction(config, sheet) {
  return function(style) {
    const className = hash(style);
    if (sheet.cache.has(className))
      return;
    sheet.cache.set(className, className);
    const compiled = astish(style);
    const rules = /* @__PURE__ */ new Set();
    const inlineRules = /* @__PURE__ */ new Set();
    for (let value in compiled) {
      if (typeof compiled[value] === "object" && value !== "*") {
        const parsed = parse(compiled[value], config.prefix).join(";");
        rules.add(`${value} {${parsed};}`);
      } else {
        const parsed = parse(typeof compiled[value] === "object" ? compiled[value] : { [value]: compiled[value] }, config.prefix);
        parsed.forEach((p) => inlineRules.add(p));
      }
    }
    inlineRules.size > 0 && rules.add(`* {${[...inlineRules].join(";")};}`);
    [...rules].forEach((rule) => {
      const h = hash(rule);
      if (!sheet.cache.has(h)) {
        sheet.cache.set(h, h);
        sheet.sheet.insertRule(rule, sheet.sheet.cssRules.length);
      }
    });
  };
}
var createGlobalCSSFunction$1 = createMemo(createGlobalCSSFunction);
function createCreateThemeFunction(config) {
  return function(theme) {
    const className = `${config.prefix && config.prefix + "-"}t-${hash(JSON.stringify(theme))}`;
    let themeObject = /* @__PURE__ */ new Map();
    const cssProps = [];
    for (const themeKey in theme) {
      for (const themeToken in theme[themeKey]) {
        const propertyName = `--${config.prefix && config.prefix + "-"}${themeKey}-${themeToken}`;
        const propertyValue = String(theme[themeKey][themeToken]);
        themeObject.set(`${themeKey}.${themeToken}`, {
          value: propertyValue,
          key: propertyName,
          type: themeKey,
          toString: () => `var(${propertyName})`
        });
        cssProps.push(`${propertyName}:${propertyValue}`);
      }
    }
    return {
      className,
      themeObject,
      cssProps,
      toString: () => `:root {${cssProps.join(";")}}`
    };
  };
}
function createApplyThemeFunction(defaultTheme, sheet) {
  return function(theme) {
    if (theme.cssProps.length) {
      let themeCssRule = null;
      if (sheet.cache.has(theme.className)) {
        const cachedTheme = sheet.cache.get(theme.className);
        themeCssRule = (cachedTheme == null ? void 0 : cachedTheme.themeCssRule) || null;
        sheet.cache.set(THEME_KEY, {
          theme,
          mergedThemeObject: cachedTheme == null ? void 0 : cachedTheme.mergedThemeObject,
          themeCssRule
        });
      }
      if (!sheet.cache.has(theme.className) || !themeCssRule) {
        const mergedCssProps = /* @__PURE__ */ new Set([
          ...defaultTheme.cssProps,
          ...theme.cssProps
        ]);
        const mergedThemeObject = new Map([
          ...defaultTheme.themeObject,
          ...theme.themeObject
        ]);
        themeCssRule = `:root {${[...mergedCssProps].join(";\n")}}`;
        sheet.cache.set(theme.className, {
          theme,
          mergedThemeObject,
          themeCssRule
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
var createCreateThemeFunction$1 = createMemo(createCreateThemeFunction);
function setup(config = {}) {
  config = __spreadProps(__spreadValues({}, config), {
    prefix: (config == null ? void 0 : config.prefix) || "",
    media: (config == null ? void 0 : config.media) || {},
    theme: (config == null ? void 0 : config.theme) || {}
  });
  const globSheet = createSheet("q-global");
  const themeSheet = createSheet("q-theme");
  const sheet = createSheet("q-styled");
  const mediaSheet = createSheet("q-media");
  const createTheme = createCreateThemeFunction$1(config);
  const defaultTheme = createTheme(config.theme);
  const applyTheme = createApplyThemeFunction(defaultTheme, themeSheet);
  applyTheme(defaultTheme);
  const toString = () => `${String(globSheet)}
${String(themeSheet)}
${String(sheet)}
${String(mediaSheet)}
`;
  const css = createCSSFunction$1(config, sheet, themeSheet);
  const globalCss = createGlobalCSSFunction$1(config, globSheet);
  const styledConstructor = createStyledFunction$1(css, false);
  const styled = styledConstructor;
  const animatedConstructor = createStyledFunction$1(css, true);
  const animated = animatedConstructor;
  DOM_ELEMENTS.forEach((element) => {
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
    toString
  };
}
var index = createMemo(setup);
export { index as default };
