/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			spacing: {
				'18': '4.5rem'
			},
			colors: {
				black: {
					DEFAULT: '#000000',
					soft: '#1a1a1a',
					light: '#2a2a2a'
				},
				gray: {
					dark: '#4a4a4a',
					medium: '#6b6b6b',
					light: '#e5e5e5'
				},
				pink: {
					light: '#ffb6d9',
					medium: '#ff69b4',
					bright: '#ff1493',
					soft: '#ffe4f0',
					dark: '#c71585'
				},
				gold: {
					light: '#f4d03f',
					DEFAULT: '#d4af37',
					bright: '#ffd700'
				},
				red: {
					call: '#dc2626',
					callHover: '#b91c1c'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Playfair Display', 'serif'],
				handwritten: ['Dancing Script', 'Great Vibes', 'cursive']
			}
		}
	},
	plugins: []
};
