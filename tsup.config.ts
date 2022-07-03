import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.tsx', 'src/struct.ts'],
	splitting: false,
	format: ['cjs', 'esm'],
	sourcemap: true,
	dts: true,
	clean: true,
});
