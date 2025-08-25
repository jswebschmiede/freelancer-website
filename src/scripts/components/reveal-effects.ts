import type { UtilFunctions, RevealEffectConfig, RevealEffectState } from '../../types';

/**
 * Utility functions for DOM manipulation and browser feature detection
 */
const Util: UtilFunctions = {
	/**
	 * Adds one or more CSS classes to an element
	 * @param el - The DOM element to add classes to
	 * @param className - Space-separated string of class names to add
	 */
	addClass: (el: Element, className: string): void => {
		const classList = className.split(' ');
		el.classList.add(classList[0]);
		if (classList.length > 1) {
			Util.addClass(el, classList.slice(1).join(' '));
		}
	},

	/**
	 * Removes one or more CSS classes from an element
	 * @param el - The DOM element to remove classes from
	 * @param className - Space-separated string of class names to remove
	 */
	removeClass: (el: Element, className: string): void => {
		const classList = className.split(' ');
		el.classList.remove(classList[0]);
		if (classList.length > 1) {
			Util.removeClass(el, classList.slice(1).join(' '));
		}
	},

	/**
	 * Gets the index of an element in an array
	 * @param array - The array to search in
	 * @param el - The element to find
	 * @returns The index of the element, or -1 if not found
	 */
	getIndexInArray: <T>(array: T[], el: T): number => {
		return Array.prototype.indexOf.call(array, el);
	},

	/**
	 * Checks if the user has enabled reduced motion in their OS settings
	 * @returns True if reduced motion is enabled, false otherwise
	 */
	osHasReducedMotion: (): boolean => {
		if (!window.matchMedia) return false;
		const matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
		return matchMediaObj?.matches ?? false;
	}
};

/**
 * Reveal Effects - Progressive enhancement for element animations on scroll
 * Based on CodyHouse reveal effects pattern
 */
class RevealEffects {
	private config: RevealEffectConfig;
	private state: RevealEffectState;
	private intersectionObserverSupported: boolean;

	constructor() {
		const fxElements = document.getElementsByClassName('reveal-fx');

		this.intersectionObserverSupported =
			'IntersectionObserver' in window &&
			'IntersectionObserverEntry' in window &&
			'intersectionRatio' in window.IntersectionObserverEntry.prototype;

		if (fxElements.length === 0) return;

		// Deactivate effect if Reduced Motion is enabled or Intersection Observer not supported
		if (Util.osHasReducedMotion() || !this.intersectionObserverSupported) {
			this.removeClasses();
			return;
		}

		// On small devices, do not animate elements -> reveal all
		if (this.isDisabled(fxElements[0])) {
			this.revealAll();
			return;
		}

		const elements = Array.from(fxElements) as Element[];
		const revealDelta = 120; // amount (in pixel) the element needs to enter the viewport to be revealed

		this.config = {
			revealDelta: revealDelta,
			elements: elements,
			delays: this.getDelays(elements),
			deltas: this.getDeltas(elements, revealDelta)
		};

		this.state = {
			viewportHeight: window.innerHeight,
			checking: false,
			revealedItems: [],
			observers: []
		};

		this.init();
	}

	/**
	 * Initialize the reveal effects system
	 */
	private init(): void {
		// Add event listeners
		window.addEventListener('load', () => this.reveal());
		window.addEventListener('resize', () => this.handleResize());
		window.addEventListener('restartAll', () => this.restart());

		// Initialize observers
		this.initObservers();
	}

	/**
	 * Initialize Intersection Observers for each element
	 */
	private initObservers(): void {
		for (let i = 0; i < this.config.elements.length; i++) {
			this.state.observers[i] = new IntersectionObserver(
				(entries, observer) => {
					if (entries[0].isIntersecting) {
						this.revealItemObserver(entries[0].target);
						observer.unobserve(entries[0].target);
					}
				},
				{ rootMargin: `0px 0px -${this.config.deltas[i]}px 0px` }
			);

			this.state.observers[i].observe(this.config.elements[i]);
		}
	}

	/**
	 * Reveal all elements immediately (for small devices)
	 */
	private revealAll(): void {
		for (let i = 0; i < this.config.elements.length; i++) {
			Util.addClass(this.config.elements[i], 'reveal-fx--is-visible');
		}
	}

	/**
	 * Handle window resize events
	 */
	private handleResize(): void {
		if (this.state.checking) return;
		this.state.checking = true;

		const reset = () => {
			this.state.viewportHeight = window.innerHeight;
			this.reveal();
		};

		if (!window.requestAnimationFrame) {
			setTimeout(reset, 250);
		} else {
			window.requestAnimationFrame(reset);
		}
	}

	/**
	 * Reset viewport height and reveal visible elements
	 */
	private reset(): void {
		this.state.viewportHeight = window.innerHeight;
		this.reveal();
	}

	/**
	 * Reveal all visible elements in the viewport
	 */
	private reveal(): void {
		for (let i = 0; i < this.config.elements.length; i++) {
			if (this.state.revealedItems.includes(i)) continue;

			if (this.isElementVisible(this.config.elements[i], i)) {
				this.revealItem(i);
				this.state.revealedItems.push(i);
			}
		}

		this.resetEvents();
		this.state.checking = false;
	}

	/**
	 * Reveal a specific item with optional delay
	 * @param index - The index of the element to reveal
	 */
	private revealItem(index: number): void {
		const delay = this.config.delays[index];

		if (delay && delay !== 0) {
			setTimeout(() => {
				Util.addClass(this.config.elements[index], 'reveal-fx--is-visible');
			}, delay);
		} else {
			Util.addClass(this.config.elements[index], 'reveal-fx--is-visible');
		}
	}

	/**
	 * Handle reveal for an element observed by Intersection Observer
	 * @param item - The DOM element that became visible
	 */
	private revealItemObserver(item: Element): void {
		const index = Util.getIndexInArray(this.config.elements, item);

		if (this.state.revealedItems.includes(index)) return;

		this.revealItem(index);
		this.state.revealedItems.push(index);
		this.resetEvents();
		this.state.checking = false;
	}

	/**
	 * Get animation delays from data attributes
	 * @param elements - Array of elements to get delays for
	 * @returns Array of delay values for each element
	 */
	private getDelays(elements: Element[]): number[] {
		const delays: number[] = [];

		for (let i = 0; i < elements.length; i++) {
			const delayAttr = elements[i].getAttribute('data-reveal-fx-delay');
			delays.push(delayAttr ? parseInt(delayAttr, 10) : 0);
		}

		return delays;
	}

	/**
	 * Get reveal delta values from data attributes
	 * @param elements - Array of elements to get deltas for
	 * @param revealDelta - Default delta value to use if no data attribute is found
	 * @returns Array of delta values for each element
	 */
	private getDeltas(elements: Element[], revealDelta: number): number[] {
		const deltas: number[] = [];

		for (let i = 0; i < elements.length; i++) {
			const deltaAttr = elements[i].getAttribute('data-reveal-fx-delta');
			deltas.push(deltaAttr ? parseInt(deltaAttr, 10) : revealDelta);
		}

		return deltas;
	}

	/**
	 * Check if reveal effects are disabled for an element
	 * @param element - The element to check
	 * @returns True if effects are disabled, false otherwise
	 */
	private isDisabled(element: Element): boolean {
		const content = window
			.getComputedStyle(element, '::before')
			.getPropertyValue('content')
			.replace(/['"]/g, '');

		return content !== 'reveal-fx';
	}

	/**
	 * Check if an element is visible in the viewport
	 * @param element - The element to check
	 * @param index - The index of the element
	 * @returns True if the element is visible, false otherwise
	 */
	private isElementVisible(element: Element, index: number): boolean {
		return (
			this.getElementPosition(element) <= this.state.viewportHeight - this.config.deltas[index]
		);
	}

	/**
	 * Get the top position of an element relative to the viewport
	 * @param element - The element to measure
	 * @returns The top position in pixels
	 */
	private getElementPosition(element: Element): number {
		return element.getBoundingClientRect().top;
	}

	/**
	 * Reset event listeners if all elements have been revealed
	 */
	private resetEvents(): void {
		if (this.config.elements.length > this.state.revealedItems.length) return;

		window.removeEventListener('load', () => this.reveal());
		window.removeEventListener('resize', () => this.handleResize());
	}

	/**
	 * Remove all reveal effect classes (for reduced motion or unsupported browsers)
	 */
	private removeClasses(): void {
		while (this.config.elements[0]) {
			const element = this.config.elements[0];
			const classes =
				element
					.getAttribute('class')
					?.split(' ')
					.filter((c) => !c.startsWith('reveal-fx--')) ?? [];

			element.setAttribute('class', classes.join(' ').trim());
			Util.removeClass(element, 'reveal-fx');
		}
	}

	/**
	 * Restart the reveal effects system
	 */
	private restart(): void {
		if (
			Util.osHasReducedMotion() ||
			!this.intersectionObserverSupported ||
			this.isDisabled(this.config.elements[0])
		) {
			return;
		}

		// Re-add event listeners if needed
		if (this.config.elements.length <= this.state.revealedItems.length) {
			window.addEventListener('load', () => this.reveal());
			window.addEventListener('resize', () => this.handleResize());
		}

		// Disconnect existing observers
		this.state.observers.forEach((observer) => {
			if (observer) observer.disconnect();
		});

		// Reset state
		this.state.observers = [];
		this.state.revealedItems = [];

		// Remove visible classes
		for (let i = 0; i < this.config.elements.length; i++) {
			Util.removeClass(this.config.elements[i], 'reveal-fx--is-visible');
		}

		// Re-initialize observers
		this.initObservers();
	}
}

// Initialize the reveal effects when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => new RevealEffects());
} else {
	new RevealEffects();
}
