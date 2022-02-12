import React, { forwardRef, useRef } from "react";
import { useGesture } from "@use-gesture/react";

import mergeRefs from "../utils/refs";
import { useAnime } from "../hooks/anime";
import useProximtiyFeedback from "../hooks/proximity";
import { DEFAULT_ANIMATION } from "../utils/defaults";

const AnimatedC = forwardRef(
	(
		{
			as = "span",
			defaults = {},
			events,
			proximity,
			transitions,
			willAnimate,
			willProximity,
			willTransition,

			onBlur,
			onFocus,
			onMouseUp,
			onProximity,
			onMouseDown,
			...props
		}: any,
		forwardedRef: any
	) => {
		const Comp = as;
		const animeRef = useRef(null);

		const ref = mergeRefs(forwardedRef, animeRef);

		const api: any = useAnime(animeRef, {
			...DEFAULT_ANIMATION,
			...defaults,
		});

		// distance, proximity, isNearby, pos
		useProximtiyFeedback({
			ref: animeRef,
			threshold: proximity?.threshold || 250,
			active:
				willProximity || (onProximity !== null && onProximity !== undefined),
			callback: (e: any) => {
				onProximity(e);
				// if (animeRef.current && proximity?.action) {
				// api.current.to({
				// 	duration: 0,
				// 	easing: "easeOutElastic(1, .6)",
				// 	...proximity?.action(props, e, animeRef),
				// });
				// }
			},
		});

		const bind: any = useGesture({
			...(events
				? Object.keys(events)
						.map((k: any) => {
							return {
								[k]: events[k](
									api,
									{ ...props, onMouseUp, onMouseDown, onBlur, onFocus },
									animeRef
								),
							};
						})
						.reduce((obj, item) => ({ ...obj, ...item }), {})
				: {}),
		});

		return <Comp ref={ref} {...bind()} {...props} />;
	}
);

export default AnimatedC;
