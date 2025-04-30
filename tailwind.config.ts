
import type { Config } from "tailwindcss";

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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				shield: {
					DEFAULT: '#0EA5E9', // Primary blue
					secondary: '#10B981', // Accent green
					light: '#E0F2FE', // Light blue
					dark: '#0C4A6E', // Dark blue
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '65ch',
						color: 'var(--tw-prose-body)',
						'[class~="lead"]': {
							color: 'var(--tw-prose-lead)',
						},
						a: {
							color: 'var(--tw-prose-links)',
							textDecoration: 'underline',
							fontWeight: '500',
						},
						strong: {
							color: 'var(--tw-prose-bold)',
							fontWeight: '600',
						},
						'ol[type="A"]': {
							listStyleType: 'upper-alpha',
						},
						'ol[type="a"]': {
							listStyleType: 'lower-alpha',
						},
						'ol[type="A" s]': {
							listStyleType: 'upper-alpha',
						},
						'ol[type="a" s]': {
							listStyleType: 'lower-alpha',
						},
						'ol[type="I"]': {
							listStyleType: 'upper-roman',
						},
						'ol[type="i"]': {
							listStyleType: 'lower-roman',
						},
						'ol[type="I" s]': {
							listStyleType: 'upper-roman',
						},
						'ol[type="i" s]': {
							listStyleType: 'lower-roman',
						},
						'ol[type="1"]': {
							listStyleType: 'decimal',
						},
						'ul > li': {
							position: 'relative',
							paddingLeft: '1.75em',
						},
						'ol > li': {
							position: 'relative',
							paddingLeft: '1.75em',
						},
						'ul > li::before': {
							content: '""',
							width: '0.5em',
							height: '0.5em',
							borderRadius: '50%',
							backgroundColor: 'var(--tw-prose-bullets)',
							position: 'absolute',
							left: '0.75em',
							top: '0.75em',
						},
						'ol > li::before': {
							content: 'counter(list-item) "."',
							position: 'absolute',
							fontWeight: '400',
							color: 'var(--tw-prose-counters)',
							left: '0',
						},
						'h1, h2, h3, h4, h5, h6': {
							color: 'var(--tw-prose-headings)',
							fontWeight: '600',
							marginTop: '1.25em',
							marginBottom: '0.75em',
						},
						'h1': {
							fontSize: '2.25em',
							lineHeight: '1.3',
							marginTop: '0',
							marginBottom: '0.8em',
						},
						'h2': {
							fontSize: '1.5em',
							lineHeight: '1.4',
							marginTop: '1.5em',
							marginBottom: '0.5em',
						},
						'h3': {
							fontSize: '1.25em',
							lineHeight: '1.5',
							marginTop: '1.5em',
							marginBottom: '0.5em',
						},
						'h4': {
							lineHeight: '1.5',
							marginTop: '1.5em',
							marginBottom: '0.5em',
						},
						'figure': {
							marginTop: '1.5em',
							marginBottom: '1.5em',
						},
						'figure > *': {
							marginTop: '0',
							marginBottom: '0',
						},
						'figcaption': {
							color: 'var(--tw-prose-captions)',
							fontSize: '0.875em',
							lineHeight: '1.4285714',
							marginTop: '0.8571429em',
						},
						'code': {
							color: 'var(--tw-prose-code)',
							fontWeight: '500',
							fontSize: '0.875em',
						},
						'code::before': {
							content: '"`"',
						},
						'code::after': {
							content: '"`"',
						},
						'pre': {
							color: 'var(--tw-prose-pre-code)',
							backgroundColor: 'var(--tw-prose-pre-bg)',
							overflowX: 'auto',
							fontWeight: '400',
							fontSize: '0.875em',
							lineHeight: '1.7142857',
							margin: '1.7142857em 0',
							padding: '1.1428571em 1.3333333em',
						},
						'pre code': {
							backgroundColor: 'transparent',
							borderWidth: '0',
							borderRadius: '0',
							padding: '0',
							fontWeight: 'inherit',
							color: 'inherit',
							fontSize: 'inherit',
							fontFamily: 'inherit',
							lineHeight: 'inherit',
						},
						'pre code::before': {
							content: 'none',
						},
						'pre code::after': {
							content: 'none',
						},
					}
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config;
