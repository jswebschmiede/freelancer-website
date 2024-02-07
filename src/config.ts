const SiteConfig = {
	siteName: 'Jörg Schöneburg - Full-Stack-Entwickler',
	defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
	textDirection: 'ltr',
	lang: 'de',
	links: [
		{
			name: 'Home',
			href: '/'
		},
		{
			name: 'Über mich',
			href: '/ueber-mich'
		},
		{
			name: 'Projekte',
			href: '/projekte'
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
