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
                        // Exact Brand Colors from Palette
                        'coral-red': {
                                DEFAULT: '#D94436',
                                50: '#FDF2F1',
                                100: '#FCE4E2',
                                200: '#F9CDCA',
                                300: '#F5AAA5',
                                400: '#EE7A72',
                                500: '#D94436',
                                600: '#C53529',
                                700: '#A4291F',
                                800: '#87251D',
                                900: '#70241E'
                        },
                        'deep-red': {
                                DEFAULT: '#D94436',
                                50: '#FDF2F1',
                                100: '#FCE4E2',
                                200: '#F9CDCA',
                                300: '#F5AAA5',
                                400: '#EE7A72',
                                500: '#D94436',
                                600: '#C53529',
                                700: '#A4291F',
                                800: '#87251D',
                                900: '#70241E'
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
                                800: '#2E2E2E',
                                900: '#1A1A1A'
                        },
                        'success-green': {
                                DEFAULT: '#4CAF50',
                                50: '#E8F5E8',
                                100: '#C8E6C9',
                                200: '#A5D6A7',
                                300: '#81C784',
                                400: '#66BB6A',
                                500: '#4CAF50',
                                600: '#43A047',
                                700: '#388E3C',
                                800: '#2E7D32',
                                900: '#1B5E20'
                        },
                        
                        // Shadcn/UI Colors (updated with exact colors)
                        background: '#FFFFFF',
                        foreground: '#2E2E2E',
                        card: {
                                DEFAULT: '#FFFFFF',
                                foreground: '#2E2E2E'
                        },
                        popover: {
                                DEFAULT: '#FFFFFF',
                                foreground: '#2E2E2E'
                        },
                        primary: {
                                DEFAULT: '#D94436',
                                foreground: '#FFFFFF'
                        },
                        secondary: {
                                DEFAULT: '#EAEAEA',
                                foreground: '#2E2E2E'
                        },
                        muted: {
                                DEFAULT: '#F5F5F5',
                                foreground: '#737373'
                        },
                        accent: {
                                DEFAULT: '#F25C44',
                                foreground: '#FFFFFF'
                        },
                        destructive: {
                                DEFAULT: '#D94436',
                                foreground: '#FFFFFF'
                        },
                        border: '#EAEAEA',
                        input: '#EAEAEA',
                        ring: '#F25C44',
                        chart: {
                                '1': '#F25C44',
                                '2': '#4CAF50',
                                '3': '#D94436',
                                '4': '#737373',
                                '5': '#2E2E2E'
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