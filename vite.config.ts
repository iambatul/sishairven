import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3000,
		host: '0.0.0.0',
	},
	build: {
		// Generate source maps for production debugging
		sourcemap: true,
		// Optimize chunk size
		chunkSizeWarningLimit: 1000,
		// Minification options (using esbuild instead of terser)
		minify: 'esbuild',
	},
	// CSS optimization
	css: {
		devSourcemap: true,
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['svelte-i18n'],
	},
	// Define constants for build
	define: {
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
		__BUILD_TIME__: JSON.stringify(new Date().toISOString()),
	},
});
