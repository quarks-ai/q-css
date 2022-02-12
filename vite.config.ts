import path from "path";

import { defineConfig } from "vite";
import dts from "vite-dts";

const isExternal = (id: string) => !id.startsWith(".") && !path.isAbsolute(id);

export default defineConfig(() => ({
	esbuild: {},
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			formats: ["es"],
		},
		rollupOptions: {
			external: isExternal,
		},
	},
	plugins: [dts()],
}));
