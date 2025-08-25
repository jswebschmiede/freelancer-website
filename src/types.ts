export interface MetaSEO {
	title?: string;
	description?: string;
	canonical?: string | URL;
	noindex?: boolean;
	nofollow?: boolean;
	ogTitle?: string;
	ogType?: string;
	ogImage?: string;
}

/**
 * Utility functions for DOM manipulation and browser feature detection
 */
export interface UtilFunctions {
	addClass: (el: Element, className: string) => void;
	removeClass: (el: Element, className: string) => void;
	getIndexInArray: <T>(array: T[], el: T) => number;
	osHasReducedMotion: () => boolean;
}

/**
 * Configuration options for reveal effects
 */
export interface RevealEffectConfig {
	revealDelta: number;
	elements: Element[];
	delays: number[];
	deltas: number[];
}

/**
 * State management for reveal effects
 */
export interface RevealEffectState {
	viewportHeight: number;
	checking: boolean;
	revealedItems: number[];
	observers: IntersectionObserver[];
}

export interface CountUpOptions {
	separator: boolean;
	duration: number;
	decimal: boolean;
	initial: number;
	delta: number;
}
