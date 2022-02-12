import React from "react";

import createMemo from "../utils/memo";
import AnimatedContainer from "../animated";

// function computeStyleOld(style: any, data: any, props: any) {
// 	return style
// 		.map(
// 			(s: string, idx: number) =>
// 				`${s}${
// 					typeof data[idx] === "function" ? data[idx](props) : data[idx] || ""
// 				}`
// 		)
// 		.join("");
// }

function computeStyle(style: any, data: any) {
	return style
		.map((s: string, idx: number) => `${s}${data[idx] || ""}`)
		.join("");
}

function createStyledFunction(css: any, animated: boolean = false) {
	function createStyledCOmponent(type: any): any {
		return function (style: any, ...data: any) {
			const DefaultType: any = type;
			const computedStyle = computeStyle(style, data);
			const cssComponent = css(computedStyle, true, null, animated);

			const styledComponent: any = React.forwardRef((props: any, ref: any) => {
				const Type = (props && props.as) || DefaultType;
				const forwardProps = { ...cssComponent.props, ...props };

				forwardProps.ref = ref;

				forwardProps.className = [
					...cssComponent?.getClassNames(props),
					props.className,
				]
					.filter(Boolean)
					.join(" ");

				forwardProps.style = {
					...cssComponent?.getDynamicStyles(props),
					...props.style,
				};

				cssComponent.willAnimate =
					cssComponent.willAnimate || forwardProps?.onProximity;
				if (!cssComponent.willAnimate) {
					delete forwardProps.as;
				} else {
					forwardProps.as = forwardProps.as || Type;
					forwardProps.defaults = cssComponent.defaults;

					forwardProps.willAnimate = cssComponent.willAnimate;
					forwardProps.willProximity = cssComponent.willProximity;
					forwardProps.willTransition = cssComponent.willProximity;

					forwardProps.events = cssComponent.getEvents(props);
					forwardProps.proximity =
						forwardProps.proximity || cssComponent.getProximity(props);
					forwardProps.transitions = cssComponent.getTransitions(props);
				}

				delete forwardProps.disableanimationsifdisabled;

				if (props?.ignore) {
					typeof props.ignore === "string"
						? delete forwardProps[props.ignore]
						: props.ignore.forEach((p: string) => {
								delete forwardProps[p];
						  });

					delete forwardProps.ignore;
				}

				if (cssComponent.willAnimate) {
					return React.createElement(AnimatedContainer, forwardProps);
				} else {
					return React.createElement(Type, forwardProps);
				}
			});

			styledComponent.displayName = `q-.${
				DefaultType.displayName || DefaultType.name || DefaultType
			}`;
			styledComponent.toString = () => cssComponent.toString();

			return styledComponent;
		};
	}

	return createStyledCOmponent;
}

export default createMemo(createStyledFunction);
