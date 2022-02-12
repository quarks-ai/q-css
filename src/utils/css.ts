//astish converts a css style string into an object.
//another function stolen from from https://github.com/cristianbote/goober
let newRule = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/g;
let ruleClean = /\/\*[^]*?\*\/|\s\s+|\n/g;

export default function astish(str: string) {
	let tree: any = [{}];
	let block;

	while ((block = newRule.exec(str.replace(ruleClean, "")))) {
		// Remove the current entry
		if (block[4]) {
			tree.shift();
		}

		if (block[3]) {
			tree.unshift((tree[0][block[3]] = tree[0][block[3]] || {}));
		} else if (!block[4]) {
			tree[0][block[1]] = block[2];
		}
	}

	return tree[0];
}
