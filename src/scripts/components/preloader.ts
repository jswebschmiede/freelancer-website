/**
 * Preloader - Handles page loading animation and removal
 * Provides a smooth transition from loading state to content display
 */
class Preloader {
	private static readonly PRELOADER_ID = 'loader';
	private static readonly DONE_CLASS = 'done';
	private static readonly INITIAL_DELAY = 500;
	private static readonly FADE_OUT_DELAY = 500;

	/**
	 * Initialize the preloader functionality
	 */
	public static init(): void {
		// Check if JavaScript is enabled
		const jsEnabled = document.documentElement?.classList.contains('js');
		if (!jsEnabled) return;

		// Start the preloader sequence after initial delay
		setTimeout(() => {
			this.showContent();
		}, this.INITIAL_DELAY);
	}

	/**
	 * Show the main content and remove preloader
	 */
	private static showContent(): void {
		const preloader = document.getElementById(this.PRELOADER_ID);

		if (!preloader) {
			console.warn('Preloader element not found');
			return;
		}

		// Mark preloader as done to trigger fade out animation
		preloader.classList.add(this.DONE_CLASS);

		// Remove preloader after fade out animation completes
		setTimeout(() => {
			preloader.remove();
		}, this.FADE_OUT_DELAY);
	}
}

// Initialize preloader when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => Preloader.init());
} else {
	Preloader.init();
}
