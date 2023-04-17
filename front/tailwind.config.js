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
				gray: {
					900: '#0D1613',
					800: '#27302D',
					700: '#424A47',
					600: '#5C6461',
					500: '#767E7B',
					400: '#919795',
					300: '#ACB1AF',
					200: '#C7CAC9',
					100: '#F3F4F3',
					50: '#FDFDFD',
				},
				error: '#F5593D',
				warning: '#F5CD3D',
				neutral: "#27302D",
				success: '#00D890',
				textarea: '#F5F5DC',
			},
		}
	},
	plugins: [
		require('tailwind-scrollbar-hide'),
	],
}