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

	private static triggerReadyAnimation(): void {
		const elements = document.querySelectorAll('.js-fade-on-ready');
		elements.forEach((el) => {
			el.classList.remove('opacity-0');
			el.classList.add('opacity-100');
			el.classList.remove('translate-y-2');
			el.classList.add('translate-y-0');
		});
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

			// Wait 300ms after preloader removal before triggering ready animation
			setTimeout(() => {
				this.triggerReadyAnimation();
			}, 100);
		}, this.FADE_OUT_DELAY);
	}
}

// Initialize preloader when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => Preloader.init());
} else {
	Preloader.init();
}
