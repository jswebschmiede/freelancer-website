/**
 * A class that enables scrollable background functionality based on mouse position.
 * The background scrolls up when mouse is in upper area, down when in lower area.
 * Scroll speed dynamically adjusts based on mouse distance from scroll zones.
 */
class ScrollableBackground {
	/** Array of all active ScrollableBackground instances for cleanup */
	static instances: ScrollableBackground[] = [];

	/** The container element that holds the scrollable background */
	container: HTMLElement;
	/** The background element that will be transformed during scrolling */
	background: HTMLElement | null;
	/** The custom cursor element that follows mouse movement */
	customCursor: HTMLElement | null;
	/** The cursor circle element */
	cursorCircle: HTMLElement | null;
	/** The cursor arrow element for directional indication */
	cursorArrow: HTMLElement | null;
	/** The up arrow element */
	arrowUp: HTMLElement | null;
	/** The neutral/both arrows element */
	arrowNeutral: HTMLElement | null;
	/** The down arrow element */
	arrowDown: HTMLElement | null;
	/** The scroll hint element */
	scrollHint: HTMLElement | null;

	/** Flag indicating if the component is active */
	isActive = false;
	/** Current Y position of the background element */
	currentY = 0;
	/** Target Y position for smooth animation */
	targetY = 0;
	/** Maximum scroll distance (negative value) */
	maxScroll = 0;
	/** Animation frame ID for the render loop */
	animationFrame = requestAnimationFrame(() => {});
	/** ResizeObserver to handle container size changes */
	resizeObserver = new ResizeObserver(() => this.updateDimensions());

	/** Scroll sensitivity multiplier (0.5-2.0) */
	scrollSensitivity = 1.0;
	/** Base scroll speed in pixels per frame */
	baseScrollSpeed = 8.0;
	/** Previous mouse Y position */
	lastMouseY = 0;
	/** Current mouse Y position */
	mouseY = 0;

	/** Flag indicating if currently scrolling up */
	isScrollingUp = false;
	/** Flag indicating if currently scrolling down */
	isScrollingDown = false;
	/** Dynamic scroll speed based on mouse position */
	scrollSpeed = 0;

	/**
	 * Creates a new ScrollableBackground instance.
	 * @param container - The container element that should contain the scrollable background
	 */
	constructor(container: HTMLElement) {
		this.container = container;
		this.background = container.querySelector('[data-scrollable-element]');
		this.customCursor = document.querySelector('[data-custom-cursor]');
		this.cursorCircle = container.querySelector('[data-cursor-circle]');
		this.cursorArrow = container.querySelector('[data-cursor-arrow]');
		this.arrowUp = container.querySelector('[data-arrow-up]');
		this.arrowNeutral = container.querySelector('[data-cursor-arrow]');
		this.arrowDown = container.querySelector('[data-arrow-down]');
		this.scrollHint = container.querySelector('[data-scroll-hint]');

		if (!this.background) return;

		// Get scroll sensitivity from data attribute
		const sensitivity = parseFloat(container.dataset.scrollSensitivity || '1.0');
		this.scrollSensitivity = sensitivity;

		this.resizeObserver.observe(this.container);
		this.updateDimensions();
		this.render = this.render.bind(this);
		this.animationFrame = requestAnimationFrame(this.render);

		this.initEvents();
		ScrollableBackground.instances.push(this);
	}

	/**
	 * Initializes all event listeners for mouse and touch interactions.
	 */
	initEvents() {
		this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e as MouseEvent));
		this.container.addEventListener('mouseenter', () => this.handleMouseEnter());
		this.container.addEventListener('mouseleave', () => this.handleMouseLeave());

		this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e as TouchEvent));
		this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e as TouchEvent));
		this.container.addEventListener('touchend', () => this.handleTouchEnd());
	}

	/**
	 * Handles mouse movement within the container to determine scroll direction and speed.
	 * Calculates dynamic scroll speed based on mouse distance from scroll zones.
	 * @param e - The mouse event
	 */
	handleMouseMove(e: MouseEvent) {
		if (!this.background || !this.customCursor) return;

		const rect = this.container.getBoundingClientRect();
		const mouseY = e.clientY - rect.top;
		const containerHeight = rect.height;

		// Track mouse position for smooth movement
		this.lastMouseY = this.mouseY;
		this.mouseY = mouseY;

		// Position custom cursor at mouse location
		this.customCursor.style.left = `${e.clientX}px`;
		this.customCursor.style.top = `${e.clientY}px`;

		// Normalize mouse position (0.0 to 1.0)
		const normalizedY = mouseY / containerHeight;
		const wasScrollingUp = this.isScrollingUp;
		const wasScrollingDown = this.isScrollingDown;
		let scrollDirection: 'up' | 'down' | 'neutral' = 'neutral';

		// Determine scroll direction and calculate speed based on mouse position
		if (normalizedY < 0.4) {
			// Upper scroll zone: closer to top = faster scrolling
			this.isScrollingUp = true;
			this.isScrollingDown = false;
			scrollDirection = 'up';

			// Speed calculation: (0.4 - normalizedY) / 0.4 creates factor 0.0-1.0
			// Example: at 0% height → factor = 1.0 (max speed)
			//         at 40% height → factor = 0.0 (min speed)
			const speedFactor = (0.4 - normalizedY) / 0.4;
			this.scrollSpeed = speedFactor * this.baseScrollSpeed * this.scrollSensitivity;
		} else if (normalizedY > 0.6) {
			// Lower scroll zone: closer to bottom = faster scrolling
			this.isScrollingUp = false;
			this.isScrollingDown = true;
			scrollDirection = 'down';

			// Speed calculation: (normalizedY - 0.6) / 0.4 creates factor 0.0-1.0
			// Example: at 60% height → factor = 0.0 (min speed)
			//         at 100% height → factor = 1.0 (max speed)
			const speedFactor = (normalizedY - 0.6) / 0.4;
			this.scrollSpeed = speedFactor * this.baseScrollSpeed * this.scrollSensitivity;
		} else {
			// Neutral zone: stop scrolling
			this.isScrollingUp = false;
			this.isScrollingDown = false;
			this.scrollSpeed = 0;
			scrollDirection = 'neutral';
		}

		if (this.isScrollingUp !== wasScrollingUp || this.isScrollingDown !== wasScrollingDown) {
			this.updateCursorAppearance(scrollDirection);
		}

		if (!this.isScrollingUp && !this.isScrollingDown) {
			this.updateCursorAppearance('neutral');
		}
	}

	/**
	 * Handles touch start for mobile devices.
	 * Resets scroll states when user begins touching.
	 * @param e - The touch event
	 */
	handleTouchStart(e: TouchEvent) {
		this.isActive = true;
		this.isScrollingUp = false;
		this.isScrollingDown = false;
		this.scrollSpeed = 0;
		// Show neutral cursor state (both arrows) when touching
		this.updateCursorAppearance('neutral');
	}

	/**
	 * Handles touch end for mobile devices.
	 * Resets all scroll states when user stops touching.
	 */
	handleTouchEnd() {
		this.isActive = false;
		this.isScrollingUp = false;
		this.isScrollingDown = false;
		this.scrollSpeed = 0;
	}

	/**
	 * Handles touch movement for mobile devices.
	 * Touch behavior is inverted compared to mouse movement for natural swipe gestures.
	 * Swiping up should scroll the image down, swiping down should scroll the image up.
	 * @param e - The touch event
	 */
	handleTouchMove(e: TouchEvent) {
		if (!this.background || !e.touches[0]) return;

		const rect = this.container.getBoundingClientRect();
		const touchY = e.touches[0].clientY - rect.top;
		const containerHeight = rect.height;
		const normalizedY = touchY / containerHeight;
		let scrollDirection: 'up' | 'down' | 'neutral' = 'neutral';

		// Inverted logic for touch: swiping up (touch in upper area) scrolls image down
		if (normalizedY < 0.4) {
			this.isScrollingUp = false;
			this.isScrollingDown = true;
			scrollDirection = 'down';
			const speedFactor = (0.4 - normalizedY) / 0.4;
			this.scrollSpeed = speedFactor * this.baseScrollSpeed * this.scrollSensitivity;
		} else if (normalizedY > 0.6) {
			// Swiping down (touch in lower area) scrolls image up
			this.isScrollingUp = true;
			this.isScrollingDown = false;
			scrollDirection = 'up';
			const speedFactor = (normalizedY - 0.6) / 0.4;
			this.scrollSpeed = speedFactor * this.baseScrollSpeed * this.scrollSensitivity;
		} else {
			this.isScrollingUp = false;
			this.isScrollingDown = false;
			this.scrollSpeed = 0;
			scrollDirection = 'neutral';
		}

		this.updateCursorAppearance(scrollDirection);
	}

	/**
	 * Updates the custom cursor appearance based on scroll direction.
	 * Shows different SVG icons for different states.
	 * @param scrollDirection - The scroll direction ('up', 'down', or 'neutral')
	 */
	updateCursorAppearance(scrollDirection: 'up' | 'down' | 'neutral') {
		if (!this.customCursor || !this.arrowUp || !this.arrowNeutral || !this.arrowDown) return;

		this.customCursor.style.opacity = '1';

		// Hide all arrows first
		this.arrowUp.style.display = 'none';
		this.arrowNeutral.style.display = 'none';
		this.arrowDown.style.display = 'none';

		if (scrollDirection === 'up') {
			this.arrowUp.style.display = 'block';
		} else if (scrollDirection === 'down') {
			this.arrowDown.style.display = 'block';
		} else {
			this.arrowNeutral.style.display = 'block';
		}
	}

	/**
	 * Handles mouse entering the container area.
	 * Activates the component for interaction and shows neutral cursor state.
	 */
	handleMouseEnter() {
		this.isActive = true;
		this.updateCursorAppearance('neutral');
	}

	/**
	 * Handles mouse leaving the container area.
	 * Deactivates scrolling and hides the custom cursor.
	 */
	handleMouseLeave() {
		this.isActive = false;
		this.isScrollingUp = false;
		this.isScrollingDown = false;
		this.scrollSpeed = 0;

		if (this.customCursor) {
			this.customCursor.style.opacity = '0';
		}
	}

	/**
	 * The main render loop that handles continuous scrolling and smooth animation.
	 * Runs at 60fps using requestAnimationFrame for optimal performance.
	 */
	render() {
		if (this.isScrollingUp || this.isScrollingDown) {
			const scrollAmount = this.scrollSpeed;

			if (this.isScrollingUp) {
				this.targetY = Math.min(0, this.currentY + scrollAmount);
			} else if (this.isScrollingDown) {
				this.targetY = Math.max(this.maxScroll, this.currentY - scrollAmount);
			}
		}

		this.currentY = this.lerp(this.currentY, this.targetY, 0.08);

		this.currentY = Math.round(this.currentY * 100) / 100;

		if (this.background) {
			this.background.style.transform = `translateY(${this.currentY}px)`;
		}

		this.animationFrame = requestAnimationFrame(this.render);
	}

	/**
	 * Performs linear interpolation between two values.
	 * Used for smooth animation transitions.
	 * @param start - The starting value
	 * @param end - The target value
	 * @param factor - The interpolation factor (0-1). Lower = smoother animation
	 * @returns The interpolated value
	 */
	lerp(start: number, end: number, factor: number): number {
		return (1 - factor) * start + factor * end;
	}

	/**
	 * Updates the dimensions and scroll constraints based on container size and image aspect ratio.
	 * Recalculates the maximum scroll distance when the container is resized.
	 */
	updateDimensions() {
		if (!this.background) return;

		// Calculate dimensions maintaining aspect ratio
		const containerWidth = this.container.clientWidth;
		const originalWidth = parseInt(this.background.dataset.imageWidth || '0');
		const originalHeight = parseInt(this.background.dataset.imageHeight || '0');
		const aspectRatio = originalWidth / originalHeight;

		const actualImageHeight = containerWidth / aspectRatio;
		const containerHeight = this.container.clientHeight;

		this.maxScroll = -(actualImageHeight - containerHeight);
		this.background.style.height = `${actualImageHeight}px`;

		// Ensure current position is within valid boundaries
		this.targetY = Math.min(0, Math.max(this.maxScroll, this.targetY));
		this.currentY = this.targetY;
	}

	/**
	 * Cleans up the ScrollableBackground instance by removing event listeners,
	 * canceling animation frames, and disconnecting the ResizeObserver.
	 * Should be called when the instance is no longer needed to prevent memory leaks.
	 */
	destroy() {
		cancelAnimationFrame(this.animationFrame);
		this.resizeObserver.disconnect();

		this.container.removeEventListener('mousemove', this.handleMouseMove);
		this.container.removeEventListener('mouseenter', this.handleMouseEnter);
		this.container.removeEventListener('mouseleave', this.handleMouseLeave);
		this.container.removeEventListener('touchmove', this.handleTouchMove);
		this.container.removeEventListener('touchstart', this.handleTouchStart);
		this.container.removeEventListener('touchend', this.handleTouchEnd);
	}

	/**
	 * Static method to clean up all active ScrollableBackground instances.
	 * Calls destroy() on each instance and clears the instances array.
	 * Useful for cleanup before page navigation or when components are unmounted.
	 */
	static cleanupAll() {
		ScrollableBackground.instances.forEach((instance) => instance.destroy());
		ScrollableBackground.instances = [];
	}
}

export default ScrollableBackground;
