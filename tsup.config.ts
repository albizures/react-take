import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.tsx'],
	splitting: false,
	format: ['cjs', 'esm'],
	sourcemap: true,
	dts: true,
	clean: true,
});
