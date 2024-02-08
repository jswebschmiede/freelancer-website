const SiteConfig = {
	siteName: 'Jörg Schöneburg - Full-Stack-Entwickler',
	defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
	textDirection: 'ltr',
	lang: 'de',
	links: [
		{
			name: 'Alle Leistungen',
			href: '#'
		},
		{
			name: 'Der Prozess',
			href: '#'
		},
		{
			name: 'Mein Portfolio',
			href: '#'
		},
		{
			name: 'Fragen?',
			href: '#'
		}
	],
	footerLinks: [
		{
			name: 'Impressum',
			href: '/impressum'
		},
		{
			name: 'Datenschutz',
			href: '/datenschutz'
		},
		{
			name: 'AGB',
			href: '/agb'
		}
	]
};

export const SITE = { ...SiteConfig };
