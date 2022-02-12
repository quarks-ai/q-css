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
import React, { useRef, useLayoutEffect, forwardRef } from "react";
import { useGesture } from "@use-gesture/react";
import throttle from "lodash.throttle";
import { observeElementInViewport } from "observe-element-in-viewport";
function createSheet(id) {
  const root = globalThis.document || null;
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
  const sheet = root ? Object.assign((root.head || root).appendChild(document.createElement("style")), {
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
  let cache2 = /* @__PURE__ */ new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache2.has(key)) {
      return cache2.get(key);
    } else {
      let result = fn.apply(null, args);
      cache2.set(key, result);
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
const defaultInstanceSettings = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: "normal",
  autoplay: true,
  timelineOffset: 0
};
const defaultTweenSettings = {
  duration: 1e3,
  delay: 0,
  endDelay: 0,
  easing: "easeOutElastic(1, .5)",
  round: 0
};
const settings = {
  speed: 1,
  suspendWhenDocumentHidden: true
};
const validTransforms = [
  "translateX",
  "translateY",
  "translateZ",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "skew",
  "skewX",
  "skewY",
  "perspective",
  "matrix",
  "matrix3d"
];
const hexTestRgx = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i;
const rgbTestRgx = /^rgb/i;
const hslTestRgx = /^hsl/i;
const rgbExecRgx = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/i;
const hslExecRgx = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i;
const hslaExecRgx = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
const springTestRgx = /^spring/;
const easingsExecRgx = /\(([^)]+)\)/;
const unitsExecRgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/;
const digitWithExponentRgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
const lowerCaseRgx = /([a-z])([A-Z])/g;
const transformsExecRgx = /(\w+)\(([^)]*)\)/g;
const relativeValuesExecRgx = /^(\*=|\+=|-=)/;
const whiteSpaceTestRgx = /\s/g;
const pi = Math.PI;
const emptyString = "";
function selectString(str) {
  try {
    let nodes = document.querySelectorAll(str);
    return nodes;
  } catch (e) {
    return [];
  }
}
function stringContains(str, text) {
  return str.indexOf(text) > -1;
}
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
function round(val, base = 1) {
  return Math.round(val * base) / base;
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const is = {
  arr: (a) => Array.isArray(a),
  obj: (a) => stringContains(Object.prototype.toString.call(a), "Object"),
  pth: (a) => is.obj(a) && a.hasOwnProperty("totalLength"),
  svg: (a) => a instanceof SVGElement,
  inp: (a) => a instanceof HTMLInputElement,
  dom: (a) => a.nodeType || is.svg(a),
  str: (a) => typeof a === "string",
  fnc: (a) => typeof a === "function",
  und: (a) => typeof a === "undefined",
  nil: (a) => is.und(a) || a === null,
  hex: (a) => hexTestRgx.test(a),
  rgb: (a) => rgbTestRgx.test(a),
  hsl: (a) => hslTestRgx.test(a),
  col: (a) => is.hex(a) || is.rgb(a) || is.hsl(a),
  key: (a) => !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== "targets" && a !== "keyframes"
};
function filterArray(arr, callback) {
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
function flattenArray(arr) {
  return arr.reduce((a, b) => a.concat(is.arr(b) ? flattenArray(b) : b), []);
}
function toArray(o) {
  if (is.arr(o))
    return o;
  if (is.str(o))
    o = selectString(o) || o;
  if (o instanceof NodeList || o instanceof HTMLCollection)
    return [].slice.call(o);
  return [o];
}
function arrayContains(arr, val) {
  return arr.some((a) => a === val);
}
function cloneObject(o) {
  const clone = {};
  for (let p in o)
    clone[p] = o[p];
  return clone;
}
function replaceObjectProps(o1, o2) {
  const o = cloneObject(o1);
  for (let p in o1)
    o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
  return o;
}
function mergeObjects(o1, o2) {
  const o = cloneObject(o1);
  for (let p in o2)
    o[p] = is.und(o1[p]) ? o2[p] : o1[p];
  return o;
}
function applyArguments(func, args) {
  return func.apply(null, args);
}
const isBrowser = !is.und(window) && !is.und(window.document);
function isDocumentHidden() {
  return isBrowser && document.hidden;
}
const cache = {
  CSS: {},
  springs: {}
};
function parseEasingParameters(string) {
  const match = easingsExecRgx.exec(string);
  return match ? match[1].split(",").map((p) => parseFloat(p)) : [];
}
function spring(string, duration = null) {
  const params = parseEasingParameters(string);
  const mass = is.und(params[0]) ? 1 : clamp(params[0], 0.1, 100);
  const stiffness = is.und(params[1]) ? 100 : clamp(params[1], 0.1, 100);
  const damping = is.und(params[2]) ? 10 : clamp(params[2], 0.1, 100);
  const velocity = is.und(params[3]) ? 0.1 : clamp(params[3], 0.1, 100);
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  const a = 1;
  const b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;
  function solver(t) {
    let progress = duration ? duration * t / 1e3 : t;
    if (zeta < 1) {
      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
      progress = (a + b * progress) * Math.exp(-progress * w0);
    }
    return t === 0 || t === 1 ? t : 1 - progress;
  }
  function getDuration() {
    const cached = cache.springs[string];
    if (cached)
      return cached;
    const frame = 1 / 6;
    let elapsed = 0;
    let rest = 0;
    while (true) {
      elapsed += frame;
      if (solver(elapsed) === 1) {
        rest++;
        if (rest >= 16)
          break;
      } else {
        rest = 0;
      }
    }
    const duration2 = elapsed * frame * 1e3;
    cache.springs[string] = duration2;
    return duration2;
  }
  return duration ? solver : getDuration;
}
function steps(steps2 = 10) {
  return (t) => Math.ceil(clamp(t, 1e-6, 1) * steps2) * (1 / steps2);
}
const bezier = (() => {
  const kSplineTableSize = 11;
  const kSampleStepSize = 1 / (kSplineTableSize - 1);
  function A(aA1, aA2) {
    return 1 - 3 * aA2 + 3 * aA1;
  }
  function B(aA1, aA2) {
    return 3 * aA2 - 6 * aA1;
  }
  function C(aA1) {
    return 3 * aA1;
  }
  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }
  function getSlope(aT, aA1, aA2) {
    return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
  }
  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    let currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > 1e-7 && ++i < 10);
    return currentT;
  }
  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (let i = 0; i < 4; ++i) {
      const currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0)
        return aGuessT;
      const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
  function bezier2(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1))
      return;
    let sampleValues = new Float32Array(kSplineTableSize);
    if (mX1 !== mY1 || mX2 !== mY2) {
      for (let i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }
    function getTForX(aX) {
      let intervalStart = 0;
      let currentSample = 1;
      const lastSample = kSplineTableSize - 1;
      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;
      const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      const guessForT = intervalStart + dist * kSampleStepSize;
      const initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= 1e-3) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }
    return (x) => {
      if (mX1 === mY1 && mX2 === mY2)
        return x;
      if (x === 0 || x === 1)
        return x;
      return calcBezier(getTForX(x), mY1, mY2);
    };
  }
  return bezier2;
})();
const penner = (() => {
  const eases = { linear: () => (t) => t };
  const functionEasings = {
    Sine: () => (t) => 1 - Math.cos(t * Math.PI / 2),
    Circ: () => (t) => 1 - Math.sqrt(1 - t * t),
    Back: () => (t) => t * t * (3 * t - 2),
    Bounce: () => (t) => {
      let pow2, b = 4;
      while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {
      }
      return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
    },
    Elastic: (amplitude = 1, period = 0.5) => {
      const a = clamp(amplitude, 1, 10);
      const p = clamp(period, 0.1, 2);
      return (t) => {
        return t === 0 || t === 1 ? t : -a * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - p / (Math.PI * 2) * Math.asin(1 / a)) * (Math.PI * 2) / p);
      };
    }
  };
  const baseEasings = ["Quad", "Cubic", "Quart", "Quint", "Expo"];
  baseEasings.forEach((name, i) => {
    functionEasings[name] = () => (t) => Math.pow(t, i + 2);
  });
  Object.keys(functionEasings).forEach((name) => {
    const easeIn = functionEasings[name];
    eases["easeIn" + name] = easeIn;
    eases["easeOut" + name] = (a, b) => (t) => 1 - easeIn(a, b)(1 - t);
    eases["easeInOut" + name] = (a, b) => (t) => t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
    eases["easeOutIn" + name] = (a, b) => (t) => t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : (easeIn(a, b)(t * 2 - 1) + 1) / 2;
  });
  return eases;
})();
function parseEasings(easing, duration) {
  if (is.fnc(easing))
    return easing;
  const name = easing.split("(")[0];
  const ease = penner[name];
  const args = parseEasingParameters(easing);
  switch (name) {
    case "spring":
      return spring(easing, duration);
    case "cubicBezier":
      return applyArguments(bezier, args);
    case "steps":
      return applyArguments(steps, args);
    default:
      return applyArguments(ease, args);
  }
}
function getUnit(val) {
  const split = unitsExecRgx.exec(val);
  if (split)
    return split[1];
}
function getTransformUnit(propName) {
  if (stringContains(propName, "translate") || propName === "perspective")
    return "px";
  if (stringContains(propName, "rotate") || stringContains(propName, "skew"))
    return "deg";
  return "";
}
function convertPxToUnit(el, value, unit) {
  const valueUnit = getUnit(value);
  if (arrayContains([unit, "deg", "rad", "turn"], valueUnit))
    return value;
  const cached = cache.CSS[value + unit];
  if (!is.und(cached))
    return cached;
  const baseline = 100;
  const tempEl = document.createElement(el.tagName);
  const parentNode = el.parentNode;
  const parentEl = parentNode && parentNode !== document ? parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = "absolute";
  tempEl.style.width = baseline + unit;
  const factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  const convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}
function rgbToRgba(rgbValue) {
  const rgb = rgbExecRgx.exec(rgbValue);
  return rgb ? `rgba(${rgb[1]},1)` : rgbValue;
}
function hexToRgba(hexValue) {
  const hexLength = hexValue.length;
  const isShort = hexLength === 4 || hexLength === 5;
  const isAlpha = hexLength === 5 || hexLength === 9;
  const hexPrefix = "0x";
  const r = +(hexPrefix + hexValue[1] + hexValue[isShort ? 1 : 2]);
  const g = +(hexPrefix + hexValue[isShort ? 2 : 3] + hexValue[isShort ? 2 : 4]);
  const b = +(hexPrefix + hexValue[isShort ? 3 : 5] + hexValue[isShort ? 3 : 6]);
  const a = isAlpha ? +((hexPrefix + hexValue[isShort ? 4 : 7] + hexValue[isShort ? 4 : 8]) / 255).toFixed(3) : 1;
  return `rgba(${r},${g},${b},${a})`;
}
function hueToRgb(p, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslToRgba(hslValue) {
  const hsl = hslExecRgx.exec(hslValue) || hslaExecRgx.exec(hslValue);
  const h = hsl[1] / 360;
  const s = hsl[2] / 100;
  const l = hsl[3] / 100;
  const a = hsl[4] || 1;
  let r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }
  return `rgba(${round(r * 255)},${round(g * 255)},${round(b * 255)},${a})`;
}
function normalizeColorToRgba(colorValue) {
  if (is.rgb(colorValue))
    return rgbToRgba(colorValue);
  if (is.hex(colorValue))
    return hexToRgba(colorValue);
  if (is.hsl(colorValue))
    return hslToRgba(colorValue);
}
function getFunctionValue(val, animatable) {
  if (!is.fnc(val))
    return val;
  return val(animatable.target, animatable.id, animatable.total);
}
function getCSSValue(el, prop, unit) {
  if (prop in el.style) {
    const uppercasePropName = prop.replace(lowerCaseRgx, "$1-$2").toLowerCase();
    const value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || "0";
    return unit ? convertPxToUnit(el, value, unit) : value;
  }
}
function getAnimationType(el, prop) {
  if (is.dom(el) && !is.inp(el) && (!is.nil(el.getAttribute(prop)) || is.svg(el) && el[prop]))
    return "attribute";
  if (is.dom(el) && arrayContains(validTransforms, prop))
    return "transform";
  if (is.dom(el) && prop !== "transform" && getCSSValue(el, prop, ""))
    return "css";
  if (!is.nil(el[prop]))
    return "object";
}
function getElementTransforms(el) {
  if (!is.dom(el))
    return;
  const str = el.style.transform;
  const transforms = /* @__PURE__ */ new Map();
  if (!str)
    return transforms;
  let t;
  while (t = transformsExecRgx.exec(str)) {
    transforms.set(t[1], t[2]);
  }
  return transforms;
}
function getTransformValue(el, propName, animatable, unit) {
  var _a;
  const defaultVal = stringContains(propName, "scale") ? 1 : 0 + getTransformUnit(propName);
  const value = ((_a = getElementTransforms(el)) == null ? void 0 : _a.get(propName)) || defaultVal;
  if (animatable) {
    animatable.transforms.list.set(propName, value);
    animatable.transforms.last = propName;
  }
  return unit ? convertPxToUnit(el, value, unit) : value;
}
function getOriginalTargetValue(target, propName, unit, animatable) {
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
function getRelativeValue(to, from) {
  const operator = relativeValuesExecRgx.exec(to);
  if (!operator)
    return to;
  const u = getUnit(to) || 0;
  const x = parseFloat(from);
  const y = parseFloat(to.replace(operator[0], emptyString));
  switch (operator[0][0]) {
    case "+":
      return x + y + u;
    case "-":
      return x - y + u;
    case "*":
      return x * y + u;
  }
}
function validateValue(val, unit) {
  if (is.col(val))
    return normalizeColorToRgba(val);
  if (whiteSpaceTestRgx.test(val))
    return val;
  const originalUnit = getUnit(val);
  const unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
  if (unit)
    return unitLess + unit;
  return unitLess;
}
function decomposeValue(val, unit) {
  var _a;
  const value = validateValue(is.pth(val) ? val.totalLength : val, unit) + emptyString;
  return {
    original: value,
    numbers: value.match(digitWithExponentRgx) ? (_a = value.match(digitWithExponentRgx)) == null ? void 0 : _a.map(Number) : [0],
    strings: is.str(val) || unit ? value.split(digitWithExponentRgx) : []
  };
}
const setValueByType = {
  css: (t, p, v) => t.style[p] = v,
  attribute: (t, p, v) => t.setAttribute(p, v),
  object: (t, p, v) => t[p] = v,
  transform: (t, p, v, transforms, manual) => {
    transforms.list.set(p, v);
    if (p === transforms.last || manual) {
      transforms.string = emptyString;
      transforms.list.forEach((value, prop) => {
        transforms.string += `${prop}(${value})${emptyString}`;
      });
      t.style.transform = transforms.string;
    }
  }
};
function convertPropertyValueToTweens(propertyValue, tweenSettings) {
  let value = propertyValue;
  let settings2 = cloneObject(tweenSettings);
  if (springTestRgx.test(settings2.easing)) {
    settings2.duration = spring(settings2.easing);
  }
  if (is.arr(value)) {
    const l = value.length;
    const isFromTo = l === 2 && !is.obj(value[0]);
    if (!isFromTo) {
      if (!is.fnc(tweenSettings.duration)) {
        settings2.duration = tweenSettings.duration / l;
      }
    } else {
      value = { value };
    }
  }
  const valuesArray = is.arr(value) ? value : [value];
  return valuesArray.map((v, i) => {
    const obj = is.obj(v) && !is.pth(v) ? v : { value: v };
    if (is.und(obj.delay)) {
      obj.delay = !i ? tweenSettings.delay : 0;
    }
    if (is.und(obj.endDelay)) {
      obj.endDelay = i === valuesArray.length - 1 ? tweenSettings.endDelay : 0;
    }
    return obj;
  }).map((k) => mergeObjects(k, settings2));
}
function flattenParamsKeyframes(keyframes) {
  const properties = {};
  const propertyNames = filterArray(flattenArray(keyframes.map((key) => Object.keys(key))), (p) => is.key(p)).reduce((a, b) => {
    if (a.indexOf(b) < 0) {
      a.push(b);
    }
    return a;
  }, []);
  for (let i = 0; i < propertyNames.length; i++) {
    const propName = propertyNames[i];
    properties[propName] = keyframes.map((key) => {
      const newKey = {};
      for (let p in key) {
        if (is.key(p)) {
          if (p == propName) {
            newKey.value = key[p];
          }
        } else {
          newKey[p] = key[p];
        }
      }
      return newKey;
    });
  }
  return properties;
}
function getKeyframesFromProperties(tweenSettings, params) {
  const keyframes = [];
  const paramsKeyframes = params.keyframes;
  if (paramsKeyframes) {
    params = mergeObjects(flattenParamsKeyframes(paramsKeyframes), params);
  }
  for (let p in params) {
    if (is.key(p)) {
      keyframes.push({
        name: p,
        tweens: convertPropertyValueToTweens(params[p], tweenSettings)
      });
    }
  }
  return keyframes;
}
function parseTargets(targets) {
  const targetsArray = targets ? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets)) : [];
  return filterArray(targetsArray, (item, pos, self) => self.indexOf(item) === pos);
}
function getAnimatables(targets) {
  const parsed = parseTargets(targets);
  return parsed.map((t, i) => {
    return {
      target: t,
      id: i,
      total: parsed.length,
      transforms: {
        list: getElementTransforms(t),
        last: null,
        string: emptyString
      }
    };
  });
}
function normalizeTweenValues(tween, animatable) {
  const t = {};
  for (let p in tween) {
    let value = getFunctionValue(tween[p], animatable);
    if (is.arr(value)) {
      value = value.map((v) => getFunctionValue(v, animatable));
      if (value.length === 1) {
        value = value[0];
      }
    }
    t[p] = value;
  }
  t.duration = parseFloat(t.duration);
  t.delay = parseFloat(t.delay);
  return t;
}
function normalizeTweens(prop, animatable) {
  let previousTween;
  return prop.tweens.map((t) => {
    const tween = normalizeTweenValues(t, animatable);
    const tweenValue = tween.value;
    let to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
    const toUnit = getUnit(to);
    const originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
    const previousValue = previousTween ? previousTween.to.original : originalValue;
    const from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
    const fromUnit = getUnit(from) || getUnit(originalValue);
    const unit = toUnit || fromUnit;
    if (is.und(to))
      to = previousValue;
    tween.from = decomposeValue(from, unit);
    tween.to = decomposeValue(getRelativeValue(to, from), unit);
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = is.pth(tweenValue);
    tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
    tween.isColor = is.col(tween.from.original);
    if (tween.isColor) {
      tween.round = 1;
    }
    previousTween = tween;
    return tween;
  });
}
function createAnimation(animatable, prop) {
  const animType = getAnimationType(animatable.target, prop.name);
  if (animType) {
    const tweens = normalizeTweens(prop, animatable);
    const firstTween = tweens[0];
    const lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
      property: prop.name,
      animatable,
      tweens,
      delay: firstTween.delay,
      duration: lastTween.end,
      endDelay: lastTween.endDelay,
      timelineOffset: 0
    };
  }
}
function getAnimations(animatables, properties) {
  const animations = [];
  for (let a = 0, aLength = animatables.length; a < aLength; a++) {
    const animatable = animatables[a];
    if (animatable) {
      for (let p = 0, pLength = properties.length; p < pLength; p++) {
        const animation = createAnimation(animatable, properties[p]);
        if (animation) {
          animations.push(createAnimation(animatable, properties[p]));
        }
      }
    }
  }
  return animations;
}
function getTimingsFromAnimations(animations, tweenSettings) {
  const animationsLength = animations.length;
  const { delay, duration, endDelay } = tweenSettings;
  if (!animationsLength) {
    return {
      delay,
      duration: delay + duration + endDelay,
      endDelay
    };
  }
  const timings = {};
  for (let i = 0; i < animationsLength; i++) {
    const anim = animations[i];
    const animTlOffset = anim.timelineOffset;
    const delay2 = animTlOffset + anim.delay;
    if (!timings.delay || delay2 < timings.delay) {
      timings.delay = delay2;
    }
    const duration2 = animTlOffset + anim.duration;
    if (!timings.duration || duration2 > timings.duration) {
      timings.duration = duration2;
    }
    const endDelay2 = animTlOffset + anim.duration - anim.endDelay;
    if (!timings.endDelay || endDelay2 > timings.endDelay) {
      timings.endDelay = endDelay2;
    }
  }
  timings.endDelay = timings.duration - timings.endDelay;
  return timings;
}
let instancesId = 0;
function createInstance(params) {
  const instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  const tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  const properties = getKeyframesFromProperties(tweenSettings, params);
  const animatables = getAnimatables(params.targets);
  const animations = getAnimations(animatables, properties);
  const timings = getTimingsFromAnimations(animations, tweenSettings);
  const id = params.id || instancesId++;
  return mergeObjects(instanceSettings, {
    id,
    children: [],
    animatables,
    animations,
    delay: timings.delay,
    duration: timings.duration,
    endDelay: timings.endDelay
  });
}
const activeInstances$1 = [];
let raf$1;
function startEngine$1() {
  let _getTime = Date.now;
  let _lagThreshold = 500;
  let _adjustedLag = 33;
  let _startTime = _getTime();
  let _lastUpdate = _startTime;
  let _gap = 1e3 / 240;
  let _nextTime = _gap;
  let _i;
  function tick2(t) {
    let elapsed = _getTime() - _lastUpdate;
    let manual = t === true;
    let overlap;
    let dispatch;
    let time;
    elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
    _lastUpdate += elapsed;
    time = _lastUpdate - _startTime;
    overlap = time - _nextTime;
    if (overlap > 0 || manual) {
      time = time / 1e3;
      _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
      dispatch = 1;
    }
    if (dispatch) {
      for (_i = 0; _i < activeInstances$1.length; _i++) {
        if (!activeInstances$1[_i].paused) {
          activeInstances$1[_i].tick(t);
          if (activeInstances$1[_i].next) {
            activeInstances$1[_i].paused = true;
          }
        } else {
          activeInstances$1.splice(_i, 1);
        }
      }
    }
    raf$1 = activeInstances$1.length > 0 ? requestAnimationFrame(tick2) : void 0;
  }
  if (!raf$1 && (!isDocumentHidden() || !settings.suspendWhenDocumentHidden) && activeInstances$1.length > 0) {
    raf$1 = requestAnimationFrame(tick2);
    tick2(2);
  }
}
function handleVisibilityChange$1() {
  if (isDocumentHidden()) {
    raf$1 = cancelAnimationFrame(raf$1);
  } else {
    activeInstances$1.forEach((instance) => instance._onDocumentVisibility());
    startEngine$1();
  }
}
if (isBrowser) {
  document.addEventListener("visibilitychange", handleVisibilityChange$1);
}
function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
function getCircleLength(el) {
  return pi * 2 * el.getAttribute("r");
}
function getRectLength(el) {
  return el.getAttribute("width") * 2 + el.getAttribute("height") * 2;
}
function getLineLength(el) {
  return getDistance({ x: el.getAttribute("x1"), y: el.getAttribute("y1") }, { x: el.getAttribute("x2"), y: el.getAttribute("y2") });
}
function getPolylineLength(el) {
  const points = el.points;
  if (is.und(points))
    return 0;
  let totalLength = 0;
  let previousPos;
  for (let i = 0; i < points.numberOfItems; i++) {
    const currentPos = points.getItem(i);
    if (i > 0)
      totalLength += getDistance(previousPos, currentPos);
    previousPos = currentPos;
  }
  return totalLength;
}
function getPolygonLength(el) {
  const points = el.points;
  if (is.und(points))
    return;
  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
}
function getTotalLength(el) {
  if (el.getTotalLength)
    return el.getTotalLength();
  switch (el.tagName.toLowerCase()) {
    case "circle":
      return getCircleLength(el);
    case "rect":
      return getRectLength(el);
    case "line":
      return getLineLength(el);
    case "polyline":
      return getPolylineLength(el);
    case "polygon":
      return getPolygonLength(el);
  }
}
function setDashoffset(el) {
  const pathLength = getTotalLength(el);
  el.setAttribute("stroke-dasharray", pathLength);
  return pathLength;
}
function getParentSvgEl(el) {
  let parentEl = el.parentNode;
  while (is.svg(parentEl)) {
    const parentNode = parentEl.parentNode;
    if (!is.svg(parentNode))
      break;
    parentEl = parentNode;
  }
  return parentEl;
}
function getParentSvg(pathEl, svgData = {}) {
  const svg = svgData;
  const parentSvgEl = svg.el || getParentSvgEl(pathEl);
  const rect = parentSvgEl.getBoundingClientRect();
  const viewBoxAttr = parentSvgEl.getAttribute("viewBox");
  const width = rect.width;
  const height = rect.height;
  const viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(" ") : [0, 0, width, height]);
  return {
    el: parentSvgEl,
    viewBox,
    x: viewBox[0] / 1,
    y: viewBox[1] / 1,
    w: width,
    h: height,
    vW: viewBox[2],
    vH: viewBox[3]
  };
}
function getPath(path, percent) {
  const pathEl = is.str(path) ? selectString(path)[0] || path : path;
  const p = percent || 100;
  return function(property) {
    return {
      property,
      el: pathEl,
      svg: getParentSvg(pathEl),
      totalLength: getTotalLength(pathEl) * (p / 100)
    };
  };
}
function getPathPoint(pathEl, progress, offset = 0) {
  const length = progress + offset >= 1 ? progress + offset : 0;
  return pathEl.getPointAtLength(length);
}
function getPathProgress(pathObject, progress, isPathTargetInsideSVG) {
  const pathEl = pathObject.el;
  const parentSvg = getParentSvg(pathEl, pathObject.svg);
  const p = getPathPoint(pathEl, progress, 0);
  const p0 = getPathPoint(pathEl, progress, -1);
  const p1 = getPathPoint(pathEl, progress, 1);
  const scaleX = isPathTargetInsideSVG ? 1 : parentSvg.w / parentSvg.vW;
  const scaleY = isPathTargetInsideSVG ? 1 : parentSvg.h / parentSvg.vH;
  switch (pathObject.property) {
    case "x":
      return (p.x - parentSvg.x) * scaleX;
    case "y":
      return (p.y - parentSvg.y) * scaleY;
    case "angle":
      return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / pi;
  }
}
function animate(params = {}) {
  let startTime = 0, lastTime = 0, now = 0;
  let children;
  let childrenLength = 0;
  let resolve = null;
  function makePromise(instance2) {
    const promise2 = window.Promise && new Promise((_resolve) => resolve = _resolve);
    instance2.finished = promise2;
    return promise2;
  }
  let instance = createInstance(params);
  makePromise(instance);
  function toggleInstanceDirection() {
    const direction = instance.direction;
    if (direction !== "alternate") {
      instance.direction = direction !== "normal" ? "normal" : "reverse";
    }
    instance.reversed = !instance.reversed;
    children.forEach((child) => child.reversed = instance.reversed);
  }
  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }
  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / settings.speed);
  }
  function seekChild(time, child) {
    if (child)
      child.seek(time - child.timelineOffset);
  }
  function syncInstanceChildren(time) {
    if (!instance.reversePlayback) {
      for (let i = 0; i < childrenLength; i++)
        seekChild(time, children[i]);
    } else {
      for (let i = childrenLength; i--; )
        seekChild(time, children[i]);
    }
  }
  function setAnimationsProgress(insTime) {
    let i = 0;
    const animations = instance.animations;
    const animationsLength = animations.length;
    while (i < animationsLength) {
      const anim = animations[i];
      const animatable = anim.animatable;
      const tweens = anim.tweens;
      const tweenLength = tweens.length - 1;
      let tween = tweens[tweenLength];
      if (tweenLength)
        tween = filterArray(tweens, (t) => insTime < t.end)[0] || tween;
      const elapsed = clamp(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
      const eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
      const strings = tween.to.strings;
      const round2 = tween.round;
      const numbers = [];
      const toNumbersLength = tween.to.numbers.length;
      let progress;
      for (let n = 0; n < toNumbersLength; n++) {
        let value;
        const toNumber = tween.to.numbers[n];
        const fromNumber = tween.from.numbers[n] || 0;
        if (!tween.isPath) {
          value = fromNumber + eased * (toNumber - fromNumber);
        } else {
          value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);
        }
        if (round2) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round2) / round2;
          }
        }
        numbers.push(value);
      }
      const stringsLength = strings.length;
      if (!stringsLength) {
        progress = numbers[0];
      } else {
        progress = strings[0];
        for (let s = 0; s < stringsLength; s++) {
          strings[s];
          const b = strings[s + 1];
          const n = numbers[s];
          if (!isNaN(n)) {
            if (!b) {
              progress += n + " ";
            } else {
              progress += n + b;
            }
          }
        }
      }
      setValueByType[anim.type](animatable.target, anim.property, progress, animatable.transforms);
      anim.currentValue = progress;
      i++;
    }
  }
  function setCallback(cb) {
    if (instance[cb] && !instance.passThrough)
      instance[cb](instance);
  }
  function countIteration() {
    if (instance.remainingLoops && instance.remainingLoops !== true) {
      instance.remainingLoops--;
    }
  }
  function setInstanceProgress(engineTime) {
    const insDuration = instance.duration;
    const insDelay = instance.delay;
    const insEndDelay = insDuration - instance.endDelay;
    const insTime = adjustTime(engineTime);
    instance.progress = clamp(insTime / insDuration, 0, 1);
    instance.reversePlayback = insTime < instance.currentTime;
    if (children) {
      syncInstanceChildren(insTime);
    }
    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      setCallback("begin");
    }
    if (!instance.loopBegan && instance.currentTime > 0) {
      instance.loopBegan = true;
      setCallback("loopBegin");
    }
    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }
    if (insTime >= insEndDelay && instance.currentTime !== insDuration || !insDuration) {
      setAnimationsProgress(insDuration);
    }
    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        setCallback("changeBegin");
      }
      setCallback("change");
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        setCallback("changeComplete");
      }
    }
    instance.currentTime = clamp(insTime, 0, insDuration);
    if (instance.began)
      setCallback("update");
    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();
      if (!instance.remainingLoops) {
        instance.paused = true;
        if (!instance.completed) {
          instance.completed = true;
          setCallback("loopComplete");
          setCallback("complete");
          if (!instance.passThrough && "Promise" in window) {
            resolve();
            makePromise(instance);
          }
        }
      } else {
        startTime = now;
        setCallback("loopComplete");
        instance.loopBegan = false;
        if (instance.direction === "alternate") {
          toggleInstanceDirection();
        }
      }
    }
  }
  instance.reset = function() {
    const direction = instance.direction;
    instance.passThrough = false;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.loopBegan = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === "reverse";
    instance.remainingLoops = instance.loop;
    children = instance.children;
    childrenLength = children.length;
    for (let i = childrenLength; i--; )
      instance.children[i].reset();
    if (instance.reversed && instance.loop !== true || direction === "alternate" && instance.loop === 1)
      instance.remainingLoops++;
    setAnimationsProgress(instance.reversed ? instance.duration : 0);
  };
  instance._onDocumentVisibility = resetTime;
  instance.tick = function(t) {
    now = t;
    if (!startTime)
      startTime = now;
    setInstanceProgress((now + (lastTime - startTime)) * settings.speed);
  };
  instance.seek = function(time) {
    setInstanceProgress(adjustTime(time));
  };
  instance.pause = function() {
    instance.paused = true;
    resetTime();
  };
  instance.play = function() {
    if (!instance.paused)
      return;
    if (instance.completed)
      instance.reset();
    instance.paused = false;
    activeInstances$1.push(instance);
    resetTime();
    startEngine$1();
  };
  instance.reverse = function() {
    toggleInstanceDirection();
    instance.completed = instance.reversed ? false : true;
    resetTime();
  };
  instance.restart = function() {
    instance.reset();
    instance.play();
  };
  instance.remove = function(targets) {
    const targetsArray = parseTargets(targets);
    removeTargetsFromInstance(targetsArray, instance);
  };
  instance.next = null;
  instance.to = function(opts) {
    instance = animate(__spreadProps(__spreadValues(__spreadValues({}, params), opts), {
      id: instance.id,
      autoplay: false
    }));
    instance.paused = false;
    let foundSame = false;
    let activeInstancesLength = activeInstances$1.length;
    if (activeInstancesLength > 0) {
      let i = 0;
      while (i < activeInstances$1.length) {
        const activeInstance = activeInstances$1[i];
        if (activeInstance.id === instance.id) {
          activeInstances$1[i].paused = true;
          activeInstances$1.push(instance);
          foundSame = true;
          break;
        }
        i++;
      }
    }
    if (!foundSame || activeInstances$1.length === 0) {
      activeInstances$1.push(instance);
    }
    startEngine$1();
  };
  instance.reset();
  if (instance.autoplay) {
    instance.play();
  }
  return instance;
}
const activeInstances = [];
let raf;
function tick(t) {
  console.log("tick : ", t);
  let activeInstancesLength = activeInstances.length;
  let i = 0;
  while (i < activeInstancesLength) {
    const activeInstance = activeInstances[i];
    if (!activeInstance.paused) {
      activeInstance.tick(t);
      i++;
    } else {
      activeInstances.splice(i, 1);
      activeInstancesLength--;
    }
  }
  raf = i > 0 ? requestAnimationFrame(tick) : void 0;
}
function startEngine() {
  if (!raf && (!isDocumentHidden() || !settings.suspendWhenDocumentHidden) && activeInstances.length > 0) {
    raf = requestAnimationFrame(tick);
  }
}
function handleVisibilityChange() {
  if (isDocumentHidden()) {
    raf = cancelAnimationFrame(raf);
  } else {
    activeInstances.forEach((instance) => instance._onDocumentVisibility());
    startEngine();
  }
}
if (isBrowser) {
  document.addEventListener("visibilitychange", handleVisibilityChange);
}
function removeTargetsFromAnimations(targetsArray, animations) {
  for (let a = animations.length; a--; ) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}
function removeTargetsFromInstance(targetsArray, instance) {
  const animations = instance.animations;
  const children = instance.children;
  removeTargetsFromAnimations(targetsArray, animations);
  for (let c = children.length; c--; ) {
    const child = children[c];
    const childAnimations = child.animations;
    removeTargetsFromAnimations(targetsArray, childAnimations);
    if (!childAnimations.length && !child.children.length)
      children.splice(c, 1);
  }
  if (!animations.length && !children.length)
    instance.pause();
}
function removeTargetsFromActiveInstances(targets) {
  const targetsArray = parseTargets(targets);
  for (let i = activeInstances.length; i--; ) {
    const instance = activeInstances[i];
    removeTargetsFromInstance(targetsArray, instance);
  }
}
function stagger(val, params = {}) {
  const direction = params.direction || "normal";
  const easing = params.easing ? parseEasings(params.easing, params.duration || 1e3) : null;
  const grid = params.grid;
  const axis = params.axis;
  let fromIndex = params.from || 0;
  const fromFirst = fromIndex === "first";
  const fromCenter = fromIndex === "center";
  const fromLast = fromIndex === "last";
  const isRange = is.arr(val);
  const val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
  const val2 = isRange ? parseFloat(val[1]) : 0;
  const unit = getUnit(isRange ? val[1] : val) || 0;
  const start = params.start || 0 + (isRange ? val1 : 0);
  let values = [];
  let maxValue = 0;
  return (el, i, t) => {
    if (fromFirst)
      fromIndex = 0;
    if (fromCenter)
      fromIndex = (t - 1) / 2;
    if (fromLast)
      fromIndex = t - 1;
    if (!values.length) {
      for (let index2 = 0; index2 < t; index2++) {
        if (!grid) {
          values.push(Math.abs(fromIndex - index2));
        } else {
          const fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
          const fromY = !fromCenter ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
          const toX = index2 % grid[0];
          const toY = Math.floor(index2 / grid[0]);
          const distanceX = fromX - toX;
          const distanceY = fromY - toY;
          let value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (axis === "x")
            value = -distanceX;
          if (axis === "y")
            value = -distanceY;
          values.push(value);
        }
        maxValue = Math.max(...values);
      }
      if (easing)
        values = values.map((val3) => easing(val3 / maxValue) * maxValue);
      if (direction === "reverse")
        values = values.map((val3) => axis ? val3 < 0 ? val3 * -1 : -val3 : Math.abs(maxValue - val3));
    }
    const spacing = isRange ? (val2 - val1) / maxValue : val1;
    return start + spacing * (Math.round(values[i] * 100) / 100) + unit;
  };
}
function getInstanceTimings(animations, tweenSettings) {
  const animLength = animations.length;
  const getTlOffset = (anim) => anim.timelineOffset ? anim.timelineOffset : 0;
  const timings = {};
  timings.duration = animLength ? Math.max.apply(Math, animations.map((anim) => getTlOffset(anim) + anim.duration)) : tweenSettings.duration;
  timings.delay = animLength ? Math.min.apply(Math, animations.map((anim) => getTlOffset(anim) + anim.delay)) : tweenSettings.delay;
  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map((anim) => getTlOffset(anim) + anim.duration - anim.endDelay)) : tweenSettings.endDelay;
  return timings;
}
function timeline(params = {}) {
  let tl = animate(params);
  tl.duration = 0;
  tl.add = function(instanceParams, timelineOffset) {
    const tlIndex = activeInstances.indexOf(tl);
    const children = tl.children;
    if (tlIndex > -1)
      activeInstances.splice(tlIndex, 1);
    function passThrough(ins2) {
      ins2.passThrough = true;
    }
    for (let i = 0; i < children.length; i++)
      passThrough(children[i]);
    let insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    const tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    passThrough(tl);
    tl.seek(insParams.timelineOffset);
    const ins = animate(insParams);
    passThrough(ins);
    ins.duration + insParams.timelineOffset;
    children.push(ins);
    const timings = getInstanceTimings(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seek(0);
    tl.reset();
    if (tl.autoplay)
      tl.play();
    return tl;
  };
  return tl;
}
function setTargetsValue(targets, properties) {
  const animatables = getAnimatables(targets);
  animatables.forEach((animatable) => {
    for (let property in properties) {
      const value = getFunctionValue(properties[property], animatable);
      const target = animatable.target;
      const valueUnit = getUnit(value);
      const originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      const unit = valueUnit || getUnit(originalValue);
      const to = getRelativeValue(validateValue(value, unit), originalValue);
      const animType = getAnimationType(target, property);
      setValueByType[animType](target, property, to, animatable.transforms, true);
    }
  });
}
const anime = animate;
anime.version = "__packageVersion__";
anime.speed = 1;
anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeTargetsFromActiveInstances;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;
anime.clamp = clamp;
anime.random = random;
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
const DEFAULT_ANIMATION = {
  duration: 400,
  easing: "easeOutElastic(1, .6)"
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
function getTargets(ref, key) {
  const refs = ref.current.querySelectorAll(key);
  return (refs == null ? void 0 : refs.length) > 0 ? refs : document.querySelectorAll(key);
}
function callCallback(key, api, event, t, componentProps, props, targets, themeMap, ref, off = false, defaultState = {}) {
  api.current.to(getDefaultEventsProps(props[`&:${key}${off ? ":off" : ""}`] || defaultState || {}, themeMap)(componentProps, event, t) || {});
  targets.forEach((target) => {
    const targetKey = `&:${key}${off ? ":off" : ""} ${target}`;
    if (props[targetKey]) {
      anime(__spreadValues(__spreadValues({
        targets: getTargets(ref, target)
      }, DEFAULT_ANIMATION), getDefaultEventsProps(props[targetKey] || defaultState || {}, themeMap)(componentProps, event, t) || {})).play();
    }
  });
}
function getEvent(compiled, key, parent, cssObject, themeMap, t, defaultToHover = false) {
  const events = {};
  const filtered = Object.keys(compiled).filter((k) => k.includes(key));
  if (filtered.length > 0) {
    const targets = filtered.filter((k) => k.trim().split(" ").length > 1).map((k) => k.trim().split(" ").slice(1).join(" "));
    const props = filtered.reduce((a, b) => __spreadProps(__spreadValues({}, a), {
      [b]: __spreadValues(__spreadValues({}, (parent == null ? void 0 : parent.compiled[b]) || {}), compiled[b])
    }), {});
    const defaultState = filtered.reduce((a, b) => __spreadProps(__spreadValues({}, a), {
      [b]: __spreadValues(__spreadValues({}, defaultToHover ? (parent == null ? void 0 : parent.defaultCSSHovered) || {} : (parent == null ? void 0 : parent.defaultCSS) || {}), Object.keys(props[b]).reduce((c, d) => __spreadProps(__spreadValues({}, c), {
        [d]: defaultToHover && (cssObject == null ? void 0 : cssObject.defaultCSSHovered[d]) ? cssObject == null ? void 0 : cssObject.defaultCSSHovered[d] : cssObject.defaultCSS[d] || "0"
      }), {}))
    }), {});
    const ev = EVENTS[`&:${key}`];
    events[ev.on] = (api, componentProps, ref) => (event) => {
      var _a;
      if (api.current && ref.current) {
        callCallback(key, api, event, t, componentProps, props, targets, themeMap, ref, ev.haveActiveProp && !(event == null ? void 0 : event.active), defaultState[`&:${key}`]);
      }
      (_a = componentProps[ev.on]) == null ? void 0 : _a.call(componentProps, event);
    };
    if (ev.off) {
      events[ev.off] = (api, componentProps, ref) => (event) => {
        var _a;
        if (api.current && ref.current) {
          callCallback(key, api, event, t, componentProps, props, targets, themeMap, ref, true, defaultState[`&:${key}`]);
        }
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
    events = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, events), getEvent(compiled, "hovered", parent, cssObject, themeMap, t)), getEvent(compiled, "clicked", parent, cssObject, themeMap, t, true)), getEvent(compiled, "focused", parent, cssObject, themeMap, t)), getEvent(compiled, "drag", parent, cssObject, themeMap, t)), getEvent(compiled, "move", parent, cssObject, themeMap, t)), getEvent(compiled, "pinch", parent, cssObject, themeMap, t)), getEvent(compiled, "wheel", parent, cssObject, themeMap, t)), getEvent(compiled, "scroll", parent, cssObject, themeMap, t));
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
      if ((api == null ? void 0 : api.current) && (ref == null ? void 0 : ref.current) && !componentProps.disabled) {
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
      (_a = componentProps[ev.on]) == null ? void 0 : _a.call(componentProps, event);
    };
    if (ev.off) {
      events[ev.off] = (api, componentProps, ref) => (event) => {
        var _a;
        if (api.current && ref.current && !componentProps.disabled) {
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
const useAnime = (ref, animeParams) => {
  const animationController = useRef();
  useLayoutEffect(() => {
    if (!ref.current) {
      console.error("Please bind the anime ref while createAnime!!!");
      return;
    }
    animationController.current = anime(__spreadValues({
      targets: ref.current
    }, animeParams));
  });
  return animationController;
};
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
    if ((ref == null ? void 0 : ref.current) !== null) {
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
    if (ref.current !== null && active) {
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
  const api = useAnime(animeRef, __spreadValues(__spreadValues({}, DEFAULT_ANIMATION), defaults));
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
      [k]: events[k](api, __spreadProps(__spreadValues({}, props), { onMouseUp, onMouseDown, onBlur, onFocus }), animeRef)
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
