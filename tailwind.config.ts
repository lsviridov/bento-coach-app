import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '0.75rem',
				sm: '1rem',
				md: '1.5rem',
				lg: '2rem'
			},
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'display': ['var(--font-display)', 'sans-serif'],
				'sans': ['var(--font-sans)', 'sans-serif'],
			},
			colors: {
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
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent-color))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				'muted-semantic': {
					DEFAULT: 'hsl(var(--muted-bg))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				// Новые базовые цвета
				bg: 'hsl(var(--bg))',
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					50: 'hsl(var(--surface-50))',
					100: 'hsl(var(--surface-100))',
					200: 'hsl(var(--surface-200))',
					300: 'hsl(var(--surface-300))',
					400: 'hsl(var(--surface-400))',
					500: 'hsl(var(--surface-500))',
					600: 'hsl(var(--surface-600))',
					700: 'hsl(var(--surface-700))',
					800: 'hsl(var(--surface-800))',
					900: 'hsl(var(--surface-900))'
				},
				ink: 'hsl(var(--ink))',
				'muted-scale': {
					DEFAULT: 'hsl(var(--muted))',
					50: 'hsl(var(--muted-50))',
					100: 'hsl(var(--muted-100))',
					200: 'hsl(var(--muted-200))',
					300: 'hsl(var(--muted-300))',
					400: 'hsl(var(--muted-400))',
					500: 'hsl(var(--muted-500))',
					600: 'hsl(var(--muted-600))',
					700: 'hsl(var(--muted-700))',
					800: 'hsl(var(--muted-800))',
					900: 'hsl(var(--muted-900))'
				},
				// Обновленные brand цвета
				brand: { 
					DEFAULT: 'hsl(var(--brand))', 
					50: 'hsl(var(--brand-50))',
					100: 'hsl(var(--brand-100))',
					200: 'hsl(var(--brand-200))',
					300: 'hsl(var(--brand-300))',
					400: 'hsl(var(--brand-400))',
					500: 'hsl(var(--brand-500))',
					600: 'hsl(var(--brand-600))',
					700: 'hsl(var(--brand-700))',
					800: 'hsl(var(--brand-800))',
					900: 'hsl(var(--brand-900))'
				},
				// Обновленные accent цвета
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					50: 'hsl(var(--accent-50))',
					100: 'hsl(var(--accent-100))',
					200: 'hsl(var(--accent-200))',
					300: 'hsl(var(--accent-300))',
					400: 'hsl(var(--accent-400))',
					500: 'hsl(var(--accent-500))',
					600: 'hsl(var(--accent-600))',
					700: 'hsl(var(--accent-700))',
					800: 'hsl(var(--accent-800))',
					900: 'hsl(var(--accent-900))'
				},
				// Обновленные status цвета
				success: {
					DEFAULT: 'hsl(var(--success))',
					50: 'hsl(var(--success-50))',
					100: 'hsl(var(--success-100))',
					200: 'hsl(var(--success-200))',
					300: 'hsl(var(--success-300))',
					400: 'hsl(var(--success-400))',
					500: 'hsl(var(--success-500))',
					600: 'hsl(var(--success-600))',
					700: 'hsl(var(--success-700))',
					800: 'hsl(var(--success-800))',
					900: 'hsl(var(--success-900))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					50: 'hsl(var(--warning-50))',
					100: 'hsl(var(--warning-100))',
					200: 'hsl(var(--warning-200))',
					300: 'hsl(var(--warning-300))',
					400: 'hsl(var(--warning-400))',
					500: 'hsl(var(--warning-500))',
					600: 'hsl(var(--warning-600))',
					700: 'hsl(var(--warning-700))',
					800: 'hsl(var(--warning-800))',
					900: 'hsl(var(--warning-900))'
				},
				danger: {
					DEFAULT: 'hsl(var(--danger))',
					50: 'hsl(var(--danger-50))',
					100: 'hsl(var(--danger-100))',
					200: 'hsl(var(--danger-200))',
					300: 'hsl(var(--danger-300))',
					400: 'hsl(var(--danger-400))',
					500: 'hsl(var(--danger-500))',
					600: 'hsl(var(--danger-600))',
					700: 'hsl(var(--danger-700))',
					800: 'hsl(var(--danger-800))',
					900: 'hsl(var(--danger-900))'
				},
				// Text color tokens
				'text-ink': 'hsl(var(--text-ink))',
				'text-muted': 'hsl(var(--text-muted))',
				'text-accent': 'hsl(var(--text-accent))',
				'text-brand': 'hsl(var(--text-brand))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'pill': 'var(--radius-pill)'
			},
			spacing: {
				'xs': 'var(--spacing-xs)',
				'sm': 'var(--spacing-sm)', 
				'md': 'var(--spacing-md)',
				'lg': 'var(--spacing-lg)',
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
				'neon': 'var(--shadow-neon)',
				'accent': 'var(--shadow-accent)',
				'soft-dark': '0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)',
				'md-dark': '0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.4)',
				'lg-dark': '0 8px 25px rgba(0, 0, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.5)',
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
				},
				'pulse-ring': {
					'0%': {
						transform: 'scale(1)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1.1)',
						opacity: '0'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-4px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-brand-dark': 'linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(var(--brand-600)) 100%)',
				'gradient-accent-dark': 'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-600)) 100%)',
				'gradient-surface-dark': 'linear-gradient(135deg, hsl(var(--surface)) 0%, hsl(var(--surface-200)) 100%)',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;