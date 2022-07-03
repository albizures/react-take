import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.tsx', 'src/struct.tsx'],
	splitting: false,
	format: ['cjs', 'esm'],
	sourcemap: true,
	dts: true,
	clean: true,
});
