const SiteConfig = {
  siteName: 'jswebforge - Full-Stack-Entwicklung & Webdesign',
  defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
  textDirection: 'ltr',
  lang: 'de',
  links: [
    {
      name: 'Alle Leistungen',
      href: '#leistungen',
    },
    {
      name: 'Der Prozess',
      href: '#prozess',
    },
    {
      name: 'Portfolio',
      href: '#portfolio',
    },
    {
      name: 'Fragen?',
      href: '#fragen',
    },
  ],
  footerLinks: [
    {
      name: 'Impressum',
      href: '/impressum',
    },
    {
      name: 'Datenschutz',
      href: '/datenschutz',
    },
    {
      name: 'AGB',
      href: '/agb',
    },
  ],
  faq: [
    {
      question: 'Was kostet eine Website?',
      answer:
        'Das ist abhängig von vielen Faktoren. Kontaktieren Sie mich für ein unverbindliches Angebot.',
    },
    {
      question: 'Wie lange dauert die Entwicklung einer Website?',
      answer: 'Das ist abhängig von vielen Faktoren. Kontaktieren Sie mich für eine Einschätzung.',
    },
    {
      question: 'Wie kann ich Sie kontaktieren?',
      answer:
        'Sie können mich per E-Mail oder Telefon kontaktieren. Alle Informationen finden Sie auf der Kontaktseite.',
    },
  ],
};

export const SITE = { ...SiteConfig };
