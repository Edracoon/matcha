import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import tailwindcss from 'tailwindcss';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: [
		preprocess({
			postcss: { plugins: [tailwindcss('./tailwind.config.js')] },
		}),
	]
};

export default config;
