/**
 * hash frunction from https://github.com/cristianbote/goober
 */

export default function hash(str: string): string {
	let i = 0;
	let out = 11;
	while (i < str.length) {
		out = (101 * out + str.charCodeAt(i++)) >>> 0;
	}
	return "q-" + out;
}
