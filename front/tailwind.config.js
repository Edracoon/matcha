/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'dark': '#28292d',
				'pink': '#FF6D7F',
				'darkpink': '#f04156',
				'greenButton': '#00AB66',
			},
		}
	},
	plugins: [],
}