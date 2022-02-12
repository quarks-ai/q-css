import React, { useRef, useLayoutEffect } from "react";
import anime from "../anime";

export const useAnime = (ref: any, animeParams: any) => {
	const animationController = useRef();

	useLayoutEffect(() => {
		if (!ref.current) {
			console.error("Please bind the anime ref while createAnime!!!");
			return;
		}
		animationController.current = anime({
			targets: ref.current,
			...animeParams,
		});
	});

	return animationController;
};
