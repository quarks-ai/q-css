import React, { Children } from "react";
// import { useGesture } from "@use-gesture/react";
// import useProximtiyFeedback from "../hooks/proximity";
// import { useSpring, useTransition, animated } from "react-spring";
import { useAnime } from "../hooks/anime";

function AnimatedC({
	as = "span",
	defaults = {},
	show = true,
	events,
	transitions,
	...props
}: any) {
	// const Base = animated(as);
	// const [over, set] = React.useState(!transitions);
	// const [style, api] = useSpring(() => defaults);
	// const transition = useTransition(show, {
	// 	...transitions,
	// 	onRest: () => set(!over),
	// });
	// console.log(
	// 	"props?.proximity : ",
	// 	props?.proximity,
	// 	over && props?.proximity
	// );
	// const { ref } = useProximtiyFeedback({
	// 	threshold: 200,
	// 	active: (over && props?.proximity) || false,
	// 	callback: ({ isNearby, pos }: any) => {
	// 		api.start({
	// 			x: isNearby ? 0.3 * pos[0] : 0,
	// 			y: isNearby ? 0.3 * pos[1] : 0,
	// 		});
	// 	},
	// });
	// const bind = useGesture({
	// 	...(events
	// 		? Object.keys(events)
	// 				.map((k: any) => {
	// 					return {
	// 						[k]: events[k](api, props),
	// 					};
	// 				})
	// 				.reduce((obj, item) => ({ ...obj, ...item }), {})
	// 		: {}),
	// });
	// return transition(
	// 	(styles, item) =>
	// 		item && (
	// 			<Base
	// 				// ref={ref}
	// 				{...bind()}
	// 				style={(over && show) || !transitions ? style : styles}
	// 				{...props}
	// 			>
	// 				{props?.children}
	// 			</Base>
	// 		)
	// );
}

export default AnimatedC;
