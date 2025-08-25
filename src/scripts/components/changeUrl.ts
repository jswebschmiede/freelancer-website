/**
 * ChangeUrl - Handles URL modifications for anchor links
 * Converts relative anchor links (#anchor) to absolute paths (/#anchor)
 */
class ChangeUrl {
	private element: HTMLElement;
	private navLinks: NodeListOf<HTMLAnchorElement>;

	/**
	 * Create a new ChangeUrl instance
	 * @param element - The container element containing anchor links to process
	 */
	constructor(element: HTMLElement) {
		this.element = element;
		this.navLinks = this.element.querySelectorAll("a[href^='#']");
		this.init();
	}

	/**
	 * Initialize the URL changing functionality
	 */
	private init(): void {
		this.markAnchorLinks();
		this.updateAnchorUrls();
	}

	/**
	 * Mark links that contain anchor references
	 */
	private markAnchorLinks(): void {
		this.navLinks.forEach((link) => {
			const href = link.getAttribute('href');
			if (href && href.includes('#') && !href.match(/\/[^\/]+?\/#/)) {
				link.classList.add('has-anker');
			}
		});
	}

	/**
	 * Update anchor URLs to use absolute paths
	 */
	private updateAnchorUrls(): void {
		this.navLinks.forEach((link) => {
			if (!link.classList.contains('has-anker')) {
				return;
			}

			const href = link.getAttribute('href');
			if (href) {
				// Change URL from #anchor to /#anchor
				link.setAttribute('href', `/${href}`);
			}
		});
	}
}

export { ChangeUrl };
