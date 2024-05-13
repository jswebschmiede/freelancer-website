class ChangeUrl {
	private element: HTMLElement;
	private navLinks: NodeListOf<HTMLAnchorElement>;

	constructor(element) {
		this.element = element;
		this.navLinks = this.element.querySelectorAll("a[href^='#']");
		this.init();
	}

	init = () => {
		this.hasAnker();
		this.changeUrl();
	};

	hasAnker = () => {
		this.navLinks.forEach((link) => {
			const url = link.getAttribute('href');
			if (url.includes('#') && !url.match(/\/[^\/]+?\/#/)) {
				link.classList.add('has-anker');
			}
		});
	};

	changeUrl = () => {
		this.navLinks.forEach((link) => {
			if (!link.classList.contains('has-anker')) {
				return;
			}
			const url = link.getAttribute('href');

			// change url from #anker to /#anker
			link.setAttribute('href', `/${url}`);
		});
	};
}

export { ChangeUrl };
