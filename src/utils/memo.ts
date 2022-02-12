export default function createMemo(fn: (...args: any[]) => any): any {
	if (typeof fn !== "function") {
		throw new TypeError("fn Expected to be a function");
	}

	let cache: Map<string, any> = new Map();

	return (...args: any) => {
		const key: string = JSON.stringify(args);
		if (cache.has(key)) {
			return cache.get(key);
		} else {
			let result = fn.apply(null, args);
			cache.set(key, result);
			return result;
		}
	};
}
