import { FAQS } from './faqs';

const SiteConfig = {
  siteName: 'jswebforge',
  defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
  textDirection: 'ltr',
  lang: 'de',
  links: [
    {
      name: 'Was ich anbiete',
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
  faq: FAQS,
};

export const SITE = { ...SiteConfig };
