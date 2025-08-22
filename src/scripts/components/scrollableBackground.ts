/**
 * A class that enables scrollable background functionality based on mouse position.
 * The background scrolls up when mouse is in upper area, down when in lower area.
 * Includes smooth transitions and custom cursor with directional arrows.
 */
class ScrollableBackground {
	static instances: ScrollableBackground[] = [];

	container: HTMLElement;
	background: HTMLElement | null;
	customCursor: HTMLElement | null;
	cursorCircle: HTMLElement | null;
	cursorArrow: HTMLElement | null;
	scrollHint: HTMLElement | null;

	isActive = false;
	currentY = 0;
	targetY = 0;
	maxScroll = 0;
	animationFrame = requestAnimationFrame(() => {});
	resizeObserver = new ResizeObserver(() => this.updateDimensions());

	// Scroll configuration
	scrollSensitivity = 1.0;
	scrollSpeed = 8.0; // pixels per frame - increased for better responsiveness
	lastMouseX = 0;
	lastMouseY = 0;
	mouseX = 0;
	mouseY = 0;

	// Scroll state
	isScrollingUp = false;
	isScrollingDown = false;

	constructor(container: HTMLElement) {
		this.container = container;
		this.background = container.querySelector('[data-scrollable-element]') as HTMLElement | null;
		this.customCursor = document.querySelector('[data-custom-cursor]');
		this.cursorCircle = container.querySelector('[data-cursor-circle]');
		this.cursorArrow = container.querySelector('[data-cursor-arrow]');
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
	 * Initializes all event listeners for mouse movement and container interaction.
	 */
	initEvents() {
		// Mouse movement tracking
		this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e as MouseEvent));
		this.container.addEventListener('mouseenter', () => this.handleMouseEnter());
		this.container.addEventListener('mouseleave', () => this.handleMouseLeave());

		// Touch support
		this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e as TouchEvent));
		this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e as TouchEvent));
		this.container.addEventListener('touchend', () => this.handleTouchEnd());
	}

	/**
	 * Handles mouse movement within the container to determine scroll direction.
	 * @param e - The mouse event
	 */
	handleMouseMove(e: MouseEvent) {
		if (!this.background || !this.customCursor) return;

		const rect = this.container.getBoundingClientRect();
		const mouseY = e.clientY - rect.top;
		const mouseX = e.clientX - rect.left;
		const containerHeight = rect.height;
		const containerWidth = rect.width;

		// Update mouse position for cursor tracking
		this.lastMouseX = this.mouseX;
		this.lastMouseY = this.mouseY;
		this.mouseX = mouseX;
		this.mouseY = mouseY;

		// Position the custom cursor
		this.customCursor.style.left = `${e.clientX}px`;
		this.customCursor.style.top = `${e.clientY}px`;

		// Calculate normalized position (0 to 1)
		const normalizedY = mouseY / containerHeight;
		const normalizedX = mouseX / containerWidth;

		// Determine scroll direction based on vertical position
		const wasScrollingUp = this.isScrollingUp;
		const wasScrollingDown = this.isScrollingDown;
		let rotation = 0;

		if (normalizedY < 0.4) {
			// Upper area - scroll up
			this.isScrollingUp = true;
			this.isScrollingDown = false;
			rotation = -90; // Arrow points up
		} else if (normalizedY > 0.6) {
			// Lower area - scroll down
			this.isScrollingUp = false;
			this.isScrollingDown = true;
			rotation = 90; // Arrow points down
		} else {
			// Neutral area - stop scrolling
			this.isScrollingUp = false;
			this.isScrollingDown = false;
		}

		// Update cursor appearance only if scroll state changed
		if (this.isScrollingUp !== wasScrollingUp || this.isScrollingDown !== wasScrollingDown) {
			this.updateCursorAppearance(rotation);
		}
	}

	/**
	 * Handles touch start for mobile devices.
	 * @param e - The touch event
	 */
	handleTouchStart(e: TouchEvent) {
		this.isActive = true;
		// Reset scroll flags on touch start
		this.isScrollingUp = false;
		this.isScrollingDown = false;
	}

	/**
	 * Handles touch end for mobile devices.
	 */
	handleTouchEnd() {
		this.isActive = false;
		this.isScrollingUp = false;
		this.isScrollingDown = false;
	}

	/**
	 * Handles touch movement for mobile devices.
	 * @param e - The touch event
	 */
	handleTouchMove(e: TouchEvent) {
		if (!this.background || !e.touches[0]) return;

		const rect = this.container.getBoundingClientRect();
		const touch = e.touches[0];
		const touchY = touch.clientY - rect.top;
		const containerHeight = rect.height;

		// Calculate normalized position (0 to 1)
		const normalizedY = touchY / containerHeight;

		// Determine scroll direction based on vertical position
		if (normalizedY < 0.4) {
			// Upper area - scroll up
			this.isScrollingUp = true;
			this.isScrollingDown = false;
		} else if (normalizedY > 0.6) {
			// Lower area - scroll down
			this.isScrollingUp = false;
			this.isScrollingDown = true;
		} else {
			// Neutral area - stop scrolling
			this.isScrollingUp = false;
			this.isScrollingDown = false;
		}
	}

	/**
	 * Updates the custom cursor appearance and rotation.
	 * @param rotation - Rotation angle in degrees
	 */
	updateCursorAppearance(rotation: number) {
		if (!this.customCursor || !this.cursorArrow) return;

		// Always show custom cursor when mouse is over container
		this.customCursor.style.opacity = '1';

		// Rotate arrow based on direction
		this.cursorArrow.style.transform = `rotate(${rotation}deg)`;
	}

	/**
	 * Handles mouse entering the container area.
	 */
	handleMouseEnter() {
		this.isActive = true;
	}

	/**
	 * Handles mouse leaving the container area.
	 */
	handleMouseLeave() {
		this.isActive = false;
		this.isScrollingUp = false;
		this.isScrollingDown = false;

		if (this.customCursor) {
			this.customCursor.style.opacity = '0';
		}
	}

	/**
	 * The main render loop that smoothly interpolates between current and target positions.
	 */
	render() {
		// Handle continuous scrolling based on scroll state
		if (this.isScrollingUp || this.isScrollingDown) {
			// Calculate scroll amount for this frame
			const scrollAmount = this.scrollSpeed * this.scrollSensitivity;

			if (this.isScrollingUp) {
				// Scroll up (towards 0)
				this.targetY = Math.min(0, this.currentY + scrollAmount);
			} else if (this.isScrollingDown) {
				// Scroll down (towards maxScroll)
				this.targetY = Math.max(this.maxScroll, this.currentY - scrollAmount);
			}
		}

		// Smooth interpolation - lower factor = smoother animation
		this.currentY = this.lerp(this.currentY, this.targetY, 0.08);

		// Round to 2 decimal places for better performance
		this.currentY = Math.round(this.currentY * 100) / 100;

		if (this.background) {
			this.background.style.transform = `translateY(${this.currentY}px)`;
		}

		this.animationFrame = requestAnimationFrame(this.render);
	}

	/**
	 * Performs linear interpolation between two values.
	 * Lower factor values create smoother, slower animations.
	 * @param start - The starting value
	 * @param end - The target value
	 * @param factor - The interpolation factor (0-1). Lower = smoother animation
	 * @returns The interpolated value
	 */
	lerp(start: number, end: number, factor: number): number {
		return (1 - factor) * start + factor * end;
	}

	/**
	 * Updates the dimensions and constraints based on container size and image aspect ratio.
	 */
	updateDimensions() {
		if (!this.background) return;

		const containerWidth = this.container.clientWidth;
		const originalWidth = parseInt(this.background?.dataset.imageWidth || '0');
		const originalHeight = parseInt(this.background?.dataset.imageHeight || '0');
		const aspectRatio = originalWidth / originalHeight;

		// Calculate the actual image height based on container width and aspect ratio
		const actualImageHeight = containerWidth / aspectRatio;
		const containerHeight = this.container.clientHeight;

		this.maxScroll = -(actualImageHeight - containerHeight);
		this.background.style.height = `${actualImageHeight}px`;

		// Ensure current position is within new boundaries
		this.targetY = Math.min(0, Math.max(this.maxScroll, this.targetY));
		this.currentY = this.targetY;
	}

	/**
	 * Cleans up the ScrollableBackground instance by removing event listeners,
	 * canceling animation frames, and disconnecting the ResizeObserver.
	 */
	destroy() {
		cancelAnimationFrame(this.animationFrame);
		this.resizeObserver.disconnect();

		// Remove event listeners
		this.container.removeEventListener('mousemove', this.handleMouseMove);
		this.container.removeEventListener('mouseenter', this.handleMouseEnter);
		this.container.removeEventListener('mouseleave', this.handleMouseLeave);
		this.container.removeEventListener('touchmove', this.handleTouchMove);
		this.container.removeEventListener('touchstart', this.handleMouseEnter);
		this.container.removeEventListener('touchend', this.handleMouseLeave);
	}

	/**
	 * Static method to clean up all active ScrollableBackground instances.
	 */
	static cleanupAll() {
		ScrollableBackground.instances.forEach((instance) => instance.destroy());
		ScrollableBackground.instances = [];
	}
}

export default ScrollableBackground;
