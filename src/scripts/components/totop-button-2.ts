/**
 * ProgressToTopV2 - Manages scroll-to-top button with progress indicator
 */
class ProgressToTopV2 {
  private button: HTMLElement;
  private progressIndicator: SVGElement | null;
  private readonly SCROLL_THRESHOLD = 200;
  private readonly PROGRESS_MULTIPLIER = 214;
  private readonly STROKE_DASH_TOTAL = 400;

  /**
   * Creates a new ProgressToTopV2 instance
   * @param buttonElement - Optional button element, defaults to element with id 'scroll-top'
   */
  constructor(buttonElement?: HTMLElement | null) {
    this.button = buttonElement || (document.getElementById('scroll-top') as HTMLElement);
    if (!this.button) {
      throw new Error('Button element not found');
    }

    this.progressIndicator = document.querySelector('#progress-indicator') as SVGElement | null;
    this.init();
  }

  /**
   * Initializes the component by setting up event listeners and updating progress
   */
  private init(): void {
    this.setupEventListeners();
    this.updateProgress();
  }

  /**
   * Sets up scroll and click event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    this.button.addEventListener('click', this.handleScrollToTop.bind(this));
  }

  /**
   * Updates the progress indicator and button visibility based on scroll position
   */
  private updateProgress(): void {
    const scrollTop = window.scrollY;

    if (scrollTop > this.SCROLL_THRESHOLD) {
      this.button.classList.add('show');

      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollableHeight = documentHeight - windowHeight;

      if (scrollableHeight > 0) {
        const progress = (scrollTop / scrollableHeight) * this.PROGRESS_MULTIPLIER;

        if (this.progressIndicator) {
          this.progressIndicator.style.strokeDasharray = `${progress}, ${this.STROKE_DASH_TOTAL}`;
        }
      }
    } else {
      this.button.classList.remove('show');
    }
  }

  /**
   * Handles scroll events and updates progress
   */
  private handleScroll(): void {
    this.updateProgress();
  }

  /**
   * Handles click event to scroll to top of the page
   */
  private handleScrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

export default ProgressToTopV2;
