/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			// Custom Brand Colors from Palette
  			'coral-red': {
  				DEFAULT: '#FF6B47',
  				50: '#FFF5F3',
  				100: '#FFE8E3',
  				200: '#FFD0C7',
  				300: '#FFB4A3',
  				400: '#FF8B6F',
  				500: '#FF6B47',
  				600: '#D94436',
  				700: '#B33125',
  				800: '#8D261D',
  				900: '#6B1E17'
  			},
  			'deep-red': {
  				DEFAULT: '#C73E2A',
  				50: '#FDEAE8',
  				100: '#FBD5D1',
  				200: '#F6AAA2',
  				300: '#F08074',
  				400: '#EB5545',
  				500: '#C73E2A',
  				600: '#A03322',
  				700: '#782719',
  				800: '#511C11',
  				900: '#291008'
  			},
  			'app-gray': {
  				50: '#FAFAFA',
  				100: '#F5F5F5',
  				200: '#EAEAEA',
  				300: '#D5D5D5',
  				400: '#A3A3A3',
  				500: '#737373',
  				600: '#525252',
  				700: '#404040',
  				800: '#262626',
  				900: '#171717'
  			},
  			'success-green': {
  				DEFAULT: '#10B981',
  				50: '#ECFDF5',
  				100: '#D1FAE5',
  				200: '#A7F3D0',
  				300: '#6EE7B7',
  				400: '#34D399',
  				500: '#10B981',
  				600: '#059669',
  				700: '#047857',
  				800: '#065F46',
  				900: '#064E3B'
  			},
  			
  			// Shadcn/UI Colors (keeping for compatibility)
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: '#FF6B47',
  				foreground: '#FFFFFF'
  			},
  			secondary: {
  				DEFAULT: '#EAEAEA',
  				foreground: '#262626'
  			},
  			muted: {
  				DEFAULT: '#F5F5F5',
  				foreground: '#737373'
  			},
  			accent: {
  				DEFAULT: '#FF6B47',
  				foreground: '#FFFFFF'
  			},
  			destructive: {
  				DEFAULT: '#C73E2A',
  				foreground: '#FFFFFF'
  			},
  			border: '#EAEAEA',
  			input: '#EAEAEA',
  			ring: '#FF6B47',
  			chart: {
  				'1': '#FF6B47',
  				'2': '#10B981',
  				'3': '#C73E2A',
  				'4': '#737373',
  				'5': '#262626'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};