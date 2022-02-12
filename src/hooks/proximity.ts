import React from "react";
import throttle from "lodash.throttle";
import { observeElementInViewport } from "observe-element-in-viewport";

function getMousePosition(mouseEvent: any) {
	const x =
		mouseEvent.clientX +
		document.body.scrollLeft +
		document.documentElement.scrollLeft;
	const y =
		mouseEvent.clientY +
		document.body.scrollTop +
		document.documentElement.scrollTop;

	return { x, y };
}

function distancePoints(x1: number, y1: number, x2: number, y2: number) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function precisionRound(number: number, precision: number) {
	const factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}

function lineEq(
	y2: number,
	y1: number,
	x2: number,
	x1: number,
	currentVal: number
) {
	const m = (y2 - y1) / (x2 - x1);
	const b = y1 - m * x1;
	const y = m * currentVal + b;
	return y > 1 ? 1 : precisionRound(y, 2);
}

function callOnMouseMove({ callback, ref, threshold }: any) {
	return function (event: any) {
		if (ref?.current !== null) {
			requestAnimationFrame(function run() {
				const mousePosition = getMousePosition(event);
				const documentScrolls = {
					left: document.body.scrollLeft + document.documentElement.scrollLeft,
					top: document.body.scrollTop + document.documentElement.scrollTop,
				};
				const elementRectangle = ref.current.getBoundingClientRect();
				const elementCoordinates = {
					x1: elementRectangle.left + documentScrolls.left,
					x2:
						elementRectangle.width +
						elementRectangle.left +
						documentScrolls.left,
					y1: elementRectangle.top + documentScrolls.top,
					y2:
						elementRectangle.height +
						elementRectangle.top +
						documentScrolls.top,
				};
				const closestPoint = {
					x: mousePosition.x,
					y: mousePosition.y,
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

				const distance = Math.floor(
					distancePoints(
						mousePosition.x,
						mousePosition.y,
						closestPoint.x,
						closestPoint.y
					)
				);
				const proximity =
					Math.round((1 - lineEq(0, 1, 0, threshold, distance)) * 100) / 100;

				const pos = [
					Math.round(
						mousePosition.x -
							(elementRectangle.width / 2 +
								elementRectangle.left +
								documentScrolls.left)
					),
					Math.round(
						mousePosition.y -
							(elementRectangle.height / 2 +
								elementRectangle.top +
								documentScrolls.top)
					),
				];

				callback({
					distance,
					proximity,
					isNearby: distance <= threshold,
					pos,
				});
			});
		}
	};
}

const defaultOptions = {
	threshold: 200,
	throttleInMs: 50,
	active: true,
};

const THROTTLE = 1000 / 60;
export default function useProximtiyFeedback(options: any) {
	const { threshold, active, callback, ref }: any = {
		...defaultOptions,
		...options,
	};
	const [isInViewport, setIsInViewport] = React.useState(false);

	const onMouseMove = React.useCallback(
		callOnMouseMove({
			threshold,
			ref,
			callback: ({ distance, proximity, isNearby, pos }: any) => {
				callback({ distance, proximity, isNearby, pos });
			},
		}),
		[ref, threshold]
	);

	var throttledOnMouseMove = throttle(onMouseMove, THROTTLE);

	React.useEffect(
		function () {
			if (ref.current !== null && active) {
				return observeElementInViewport(
					ref.current,
					function () {
						setIsInViewport(true);
					},
					function () {
						setIsInViewport(false);
					},
					{
						viewport: null,
					}
				);
			} else {
				return undefined;
			}
		},
		[ref, active]
	);

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
