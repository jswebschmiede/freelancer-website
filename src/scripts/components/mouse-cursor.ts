/**
 * Mouse Cursor - Custom cursor implementation with interactive hover effects
 * Provides enhanced user experience with animated cursor elements
 */
class MouseCursor {
	private static readonly CURSOR_INNER_CLASS = '.cursor-inner';
	private static readonly CURSOR_OUTER_CLASS = '.cursor-outer';
	private static readonly CURSOR_CONTAINER_CLASS = '.mouse-cursor';
	private static readonly HOVER_SELECTORS = 'a, .cursor-pointer';

	// Cursor state
	private mouseX = 0;
	private mouseY = 0;
	private isMoving = false;

	// DOM elements
	private cursorInner: HTMLElement | null = null;
	private cursorOuter: HTMLElement | null = null;

	// Hover state classes
	private static readonly HOVER_CLASSES = [
		'!-ml-[40px]',
		'!-mt-[40px]',
		'!w-[80px]',
		'!h-[80px]',
		'!opacity-30'
	] as const;

	/**
	 * Initialize the mouse cursor functionality
	 */
	public static init(): void {
		const cursorInstance = new MouseCursor();
		cursorInstance.initialize();
	}

	/**
	 * Initialize cursor elements and event listeners
	 */
	private initialize(): void {
		const cursorContainer = document.querySelector(MouseCursor.CURSOR_CONTAINER_CLASS);

		if (!cursorContainer || !document.body) {
			console.warn('Mouse cursor container or document body not found');
			return;
		}

		// Get cursor elements
		this.cursorInner = document.querySelector(MouseCursor.CURSOR_INNER_CLASS);
		this.cursorOuter = document.querySelector(MouseCursor.CURSOR_OUTER_CLASS);

		if (!this.cursorInner || !this.cursorOuter) {
			console.warn('Cursor inner or outer elements not found');
			return;
		}

		// Make cursors visible
		this.showCursors();

		// Attach mouse move handler
		window.addEventListener('mousemove', this.handleMouseMove.bind(this));
	}

	/**
	 * Handle mouse movement events
	 * @param event - The mouse move event
	 */
	private handleMouseMove(event: MouseEvent): void {
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;

		// Update cursor positions
		this.updateCursorPosition();

		// Check for hover targets
		this.updateHoverState();
	}

	/**
	 * Update cursor element positions
	 */
	private updateCursorPosition(): void {
		if (!this.isMoving && this.cursorOuter) {
			this.cursorOuter.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
		}

		if (this.cursorInner) {
			this.cursorInner.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
		}
	}

	/**
	 * Update cursor hover state based on target element
	 */
	private updateHoverState(): void {
		if (!this.cursorInner || !this.cursorOuter) return;

		const target = document.elementFromPoint(this.mouseX, this.mouseY) as HTMLElement;

		if (target?.matches(MouseCursor.HOVER_SELECTORS)) {
			this.setHoverState();
		} else {
			this.clearHoverState();
		}
	}

	/**
	 * Apply hover state to cursor elements
	 */
	private setHoverState(): void {
		if (!this.cursorInner || !this.cursorOuter) return;

		this.cursorInner.classList.add(...MouseCursor.HOVER_CLASSES);
		this.cursorOuter.classList.add('opacity-0');
	}

	/**
	 * Clear hover state from cursor elements
	 */
	private clearHoverState(): void {
		if (!this.cursorInner || !this.cursorOuter) return;

		this.cursorInner.classList.remove(...MouseCursor.HOVER_CLASSES);
		this.cursorOuter.classList.remove('opacity-0');
	}

	/**
	 * Make cursor elements visible
	 */
	private showCursors(): void {
		if (this.cursorInner) {
			this.cursorInner.style.visibility = 'visible';
		}
		if (this.cursorOuter) {
			this.cursorOuter.style.visibility = 'visible';
		}
	}
}

// Initialize mouse cursor when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => MouseCursor.init());
} else {
	MouseCursor.init();
}
