/**
 * A class that enables draggable background functionality for images.
 * Allows users to drag and scroll through background images with smooth animations.
 * Supports both mouse and touch interactions.
 */
class DraggableBackground {
	/** Array of all active DraggableBackground instances for cleanup purposes */
	static instances: DraggableBackground[] = [];

	/** The container element that holds the draggable background */
	container: HTMLElement;
	/** The background element that will be transformed during dragging */
	background: HTMLElement | null;
	/** Flag indicating whether the user is currently dragging */
	isDragging = false;
	/** The Y coordinate where dragging started */
	startY = 0;
	/** The current Y position of the background element */
	currentY = 0;
	/** The target Y position for smooth animation */
	targetY = 0;
	/** The maximum scroll distance (negative value) */
	maxScroll = 0;
	/** Animation frame ID for the render loop */
	animationFrame = requestAnimationFrame(() => {});
	/** ResizeObserver to handle container size changes */
	resizeObserver = new ResizeObserver(() => this.updateDimensions());

	/**
	 * Creates a new DraggableBackground instance.
	 * @param container - The container element that should contain the draggable background
	 */
	constructor(container: HTMLElement) {
		this.container = container;
		this.background = container.querySelector('[data-draggable-element]') as HTMLElement | null;

		if (!this.background) return;

		this.resizeObserver.observe(this.container);

		this.updateDimensions();
		this.render = this.render.bind(this);
		this.animationFrame = requestAnimationFrame(this.render);

		this.initEvents();
		DraggableBackground.instances.push(this);
	}

	/**
	 * Initializes all event listeners for mouse and touch interactions.
	 * Sets up drag start, drag, and drag end handlers for both mouse and touch events.
	 * Also prevents default drag behavior on the container.
	 */
	initEvents() {
		// mouse events
		this.container.addEventListener('mousedown', (e) => this.startDragging(e as MouseEvent));
		window.addEventListener('mousemove', (e) => this.drag(e as MouseEvent));
		window.addEventListener('mouseup', () => this.stopDragging());

		// touch events
		this.container.addEventListener('touchstart', (e) => this.startDragging(e as TouchEvent));
		window.addEventListener('touchmove', (e) => this.drag(e as TouchEvent));
		window.addEventListener('touchend', () => this.stopDragging());

		// prevent default drag behavior
		this.container.addEventListener('dragstart', (e) => e.preventDefault());
	}

	/**
	 * Starts the dragging operation when user initiates a drag.
	 * Records the starting position and prepares the element for dragging.
	 * @param e - The mouse or touch event that initiated the drag
	 */
	startDragging(e: MouseEvent | TouchEvent) {
		if (!this.background) return;
		this.isDragging = true;
		this.startY = this.getY(e);
		this.currentY = this.getTransformY();

		this.background.style.transition = 'none';
	}

	/**
	 * Handles the dragging movement by calculating the new position based on user input.
	 * Applies a drag multiplier (1.25) for enhanced scrolling feel - higher values = more sensitive.
	 * Constrains the movement within bounds to prevent going beyond image limits.
	 * @param e - The mouse or touch event during dragging
	 */
	drag(e: MouseEvent | TouchEvent) {
		if (!this.isDragging) return;

		const currentY = this.getY(e);
		const deltaY = (currentY - this.startY) * 1.25; // 1.25 = drag sensitivity multiplier
		this.targetY = Math.min(0, Math.max(this.maxScroll, this.currentY + deltaY));
	}

	/**
	 * Stops the dragging operation and resets the dragging state.
	 * Called when the user releases the mouse button or lifts their finger.
	 */
	stopDragging() {
		if (!this.isDragging) return;
		this.isDragging = false;
	}

	/**
	 * The main render loop that runs on each animation frame.
	 * Smoothly interpolates between current and target positions using linear interpolation.
	 * Applies the transformation to the background element.
	 */
	render() {
		// smooth interpolation between current and target position
		// factor 0.1 = smooth animation, lower values = smoother but slower
		this.currentY = this.lerp(this.currentY, this.targetY, 0.05);

		// round to 2 decimal places for better performance
		this.currentY = Math.round(this.currentY * 100) / 100;

		if (this.background) {
			this.background.style.transform = `translateY(${this.currentY}px)`;
		}

		this.animationFrame = requestAnimationFrame(this.render);
	}

	/**
	 * Performs linear interpolation between two values.
	 * Lower factor values (e.g., 0.05) create smoother, slower animations.
	 * Higher factor values (e.g., 0.3) create more direct, faster animations.
	 * @param start - The starting value
	 * @param end - The target value
	 * @param factor - The interpolation factor (0-1). Lower = smoother animation
	 * @returns The interpolated value
	 */
	lerp(start: number, end: number, factor: number): number {
		return (1 - factor) * start + factor * end;
	}

	/**
	 * Cleans up the DraggableBackground instance by removing event listeners,
	 * canceling animation frames, and disconnecting the ResizeObserver.
	 * Should be called when the instance is no longer needed to prevent memory leaks.
	 */
	destroy() {
		cancelAnimationFrame(this.animationFrame);
		this.resizeObserver.disconnect();

		// remove event listeners
		this.container.removeEventListener('mousedown', this.startDragging);
		window.removeEventListener('mousemove', this.drag);
		window.removeEventListener('mouseup', this.stopDragging);
		this.container.removeEventListener('touchstart', this.startDragging);
		window.removeEventListener('touchmove', this.drag);
		window.removeEventListener('touchend', this.stopDragging);
	}

	/**
	 * Extracts the Y coordinate from a mouse or touch event.
	 * @param e - The mouse or touch event
	 * @returns The Y coordinate of the event
	 */
	getY(e: MouseEvent | TouchEvent): number {
		return e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
	}

	/**
	 * Parses the current Y translation value from the background element's transform style.
	 * @returns The current Y translation value, or 0 if not found
	 */
	getTransformY(): number {
		const transform = this.background?.style.transform;
		const match = transform?.match(/translateY\(([-\d.]+)px\)/);
		return match ? parseFloat(match[1]) : 0;
	}

	/**
	 * Updates the dimensions and constraints based on the container size and image aspect ratio.
	 * Calculates the maximum scroll distance and adjusts the background element height.
	 * Ensures the current position remains within valid bounds after resize.
	 */
	updateDimensions() {
		if (!this.background) return;

		const containerWidth = this.container.clientWidth;
		const originalWidth = parseInt(this.background?.dataset.imageWidth || '0');
		const originalHeight = parseInt(this.background?.dataset.imageHeight || '0');
		const aspectRatio = originalWidth / originalHeight;

		// calculate the actual image height based on the container width and the aspect ratio
		const actualImageHeight = containerWidth / aspectRatio;

		const containerHeight = this.container.clientHeight;
		this.maxScroll = -(actualImageHeight - containerHeight);

		this.background.style.height = `${actualImageHeight}px`;

		// ensure the current position is within the new boundaries
		this.targetY = Math.min(0, Math.max(this.maxScroll, this.targetY));
		this.currentY = this.targetY;
	}

	/**
	 * Static method to clean up all active DraggableBackground instances.
	 * Calls destroy() on each instance and clears the instances array.
	 * Useful for cleanup before page navigation or when the component is unmounted.
	 */
	static cleanupAll() {
		DraggableBackground.instances.forEach((instance) => instance.destroy());
		DraggableBackground.instances = [];
	}
}

export default DraggableBackground;
