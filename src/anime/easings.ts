import { easingsExecRgx } from "./consts";

import { clamp, is, applyArguments } from "./helpers";

import { cache } from "./cache";

// Easings
clamp;
function parseEasingParameters(string: string) {
	const match = easingsExecRgx.exec(string);
	return match ? match[1].split(",").map((p) => parseFloat(p)) : [];
}

// Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring

function spring(string: string, duration: number | null = null) {
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

	function solver(t: number) {
		let progress = duration ? (duration * t) / 1000 : t;
		if (zeta < 1) {
			progress =
				Math.exp(-progress * zeta * w0) *
				(a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
		} else {
			progress = (a + b * progress) * Math.exp(-progress * w0);
		}

		return t === 0 || t === 1 ? t : 1 - progress;
	}

	function getDuration() {
		const cached = cache.springs[string];
		if (cached) return cached;
		const frame = 1 / 6;
		let elapsed = 0;
		let rest = 0;
		while (true) {
			elapsed += frame;
			if (solver(elapsed) === 1) {
				rest++;
				if (rest >= 16) break;
			} else {
				rest = 0;
			}
		}
		const duration = elapsed * frame * 1000;
		cache.springs[string] = duration;
		return duration;
	}

	return duration ? solver : getDuration;
}

// Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function

function steps(steps = 10) {
	return (t: number) => Math.ceil(clamp(t, 0.000001, 1) * steps) * (1 / steps);
}

// BezierEasing https://github.com/gre/bezier-easing

const bezier = (() => {
	const kSplineTableSize = 11;
	const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

	function A(aA1: number, aA2: number) {
		return 1.0 - 3.0 * aA2 + 3.0 * aA1;
	}
	function B(aA1: number, aA2: number) {
		return 3.0 * aA2 - 6.0 * aA1;
	}
	function C(aA1: number) {
		return 3.0 * aA1;
	}

	function calcBezier(aT: number, aA1: number, aA2: number) {
		return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
	}
	function getSlope(aT: number, aA1: number, aA2: number) {
		return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
	}

	function binarySubdivide(
		aX: number,
		aA: number,
		aB: number,
		mX1: number,
		mX2: number
	) {
		let currentX,
			currentT,
			i = 0;
		do {
			currentT = aA + (aB - aA) / 2.0;
			currentX = calcBezier(currentT, mX1, mX2) - aX;
			if (currentX > 0.0) {
				aB = currentT;
			} else {
				aA = currentT;
			}
		} while (Math.abs(currentX) > 0.0000001 && ++i < 10);
		return currentT;
	}

	function newtonRaphsonIterate(
		aX: number,
		aGuessT: number,
		mX1: number,
		mX2: number
	) {
		for (let i = 0; i < 4; ++i) {
			const currentSlope = getSlope(aGuessT, mX1, mX2);
			if (currentSlope === 0.0) return aGuessT;
			const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
			aGuessT -= currentX / currentSlope;
		}
		return aGuessT;
	}

	function bezier(mX1: number, mY1: number, mX2: number, mY2: number) {
		if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) return;
		let sampleValues = new Float32Array(kSplineTableSize);

		if (mX1 !== mY1 || mX2 !== mY2) {
			for (let i = 0; i < kSplineTableSize; ++i) {
				sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
			}
		}

		function getTForX(aX: number) {
			let intervalStart = 0;
			let currentSample = 1;
			const lastSample = kSplineTableSize - 1;

			for (
				;
				currentSample !== lastSample && sampleValues[currentSample] <= aX;
				++currentSample
			) {
				intervalStart += kSampleStepSize;
			}

			--currentSample;

			const dist =
				(aX - sampleValues[currentSample]) /
				(sampleValues[currentSample + 1] - sampleValues[currentSample]);
			const guessForT = intervalStart + dist * kSampleStepSize;
			const initialSlope = getSlope(guessForT, mX1, mX2);

			if (initialSlope >= 0.001) {
				return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
			} else if (initialSlope === 0.0) {
				return guessForT;
			} else {
				return binarySubdivide(
					aX,
					intervalStart,
					intervalStart + kSampleStepSize,
					mX1,
					mX2
				);
			}
		}

		return (x: number) => {
			if (mX1 === mY1 && mX2 === mY2) return x;
			if (x === 0 || x === 1) return x;
			return calcBezier(getTForX(x), mY1, mY2);
		};
	}

	return bezier;
})();

const penner = (() => {
	// Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
	const eases: any = { linear: () => (t: number) => t };

	const functionEasings: any = {
		Sine: () => (t: number) => 1 - Math.cos((t * Math.PI) / 2),
		Circ: () => (t: number) => 1 - Math.sqrt(1 - t * t),
		Back: () => (t: number) => t * t * (3 * t - 2),
		Bounce: () => (t: number) => {
			let pow2,
				b = 4;
			while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}
			return (
				1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2)
			);
		},
		Elastic: (amplitude = 1, period = 0.5) => {
			const a = clamp(amplitude, 1, 10);
			const p = clamp(period, 0.1, 2);
			return (t: number) => {
				return t === 0 || t === 1
					? t
					: -a *
							Math.pow(2, 10 * (t - 1)) *
							Math.sin(
								((t - 1 - (p / (Math.PI * 2)) * Math.asin(1 / a)) *
									(Math.PI * 2)) /
									p
							);
			};
		},
	};

	const baseEasings = ["Quad", "Cubic", "Quart", "Quint", "Expo"];

	baseEasings.forEach((name, i) => {
		functionEasings[name] = () => (t: number) => Math.pow(t, i + 2);
	});

	Object.keys(functionEasings).forEach((name) => {
		const easeIn = functionEasings[name];
		eases["easeIn" + name] = easeIn;
		eases["easeOut" + name] = (a: number, b: number) => (t: number) =>
			1 - easeIn(a, b)(1 - t);
		eases["easeInOut" + name] = (a: number, b: number) => (t: number) =>
			t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
		eases["easeOutIn" + name] = (a: number, b: number) => (t: number) =>
			t < 0.5
				? (1 - easeIn(a, b)(1 - t * 2)) / 2
				: (easeIn(a, b)(t * 2 - 1) + 1) / 2;
	});

	return eases;
})();

function parseEasings(easing: string, duration: number) {
	if (is.fnc(easing)) return easing;
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

export { parseEasings, penner, spring };
