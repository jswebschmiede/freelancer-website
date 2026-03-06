import * as Swetrix from 'swetrix';

type ApiResponse = {
  success: boolean;
  message?: string;
};

/**
 * Handles asynchronous contact form submission.
 */
export default class ContactForm {
  private form: HTMLFormElement;
  private submitButton: HTMLButtonElement | null;
  private submitLabel: HTMLElement | null;
  private submitIcon: HTMLElement | null;
  private submitSpinner: HTMLElement | null;
  private statusElement: HTMLElement | null;
  private defaultButtonText: string;
  private loadingButtonText: string;
  private hideStatusTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Creates a ContactForm instance.
   * @param {HTMLFormElement} form - Contact form element.
   */
  constructor(form: HTMLFormElement) {
    this.form = form;
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.submitLabel = this.form.querySelector('[data-submit-label]');
    this.submitIcon = this.form.querySelector('[data-submit-icon]');
    this.submitSpinner = this.form.querySelector('[data-submit-spinner]');
    this.statusElement = this.form.querySelector('[data-form-status]');
    this.defaultButtonText =
      this.submitLabel?.dataset.defaultText?.trim() ||
      this.submitLabel?.textContent?.trim() ||
      'Absenden';
    this.loadingButtonText = this.submitLabel?.dataset.loadingText?.trim() || 'Wird gesendet...';
    this.init();
  }

  /**
   * Initializes contact form listeners.
   * @returns {void}
   */
  init(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Updates status area text and style.
   * @param {'success' | 'error' | 'idle'} type - Status variant.
   * @param {string} message - Message for users.
   * @returns {void}
   */
  updateStatus(type: 'success' | 'error' | 'idle', message: string): void {
    if (!this.statusElement) {
      return;
    }

    if (this.hideStatusTimer) {
      clearTimeout(this.hideStatusTimer);
      this.hideStatusTimer = null;
    }

    this.statusElement.classList.remove('hidden', 'alert-success', 'alert-error', 'alert-info');
    this.statusElement.classList.add('alert');

    if (type === 'success') {
      this.statusElement.classList.add('alert-success');
    } else if (type === 'error') {
      this.statusElement.classList.add('alert-error');
    } else {
      this.statusElement.classList.add('alert-info');
    }

    this.statusElement.textContent = message;

    if (type === 'success' || type === 'error') {
      this.hideStatusTimer = setTimeout(() => {
        this.statusElement?.classList.add('hidden');
        this.hideStatusTimer = null;
      }, 3000);
    }
  }

  /**
   * Toggles loading state of the submit button.
   * @param {boolean} loading - Loading state.
   * @returns {void}
   */
  toggleLoading(loading: boolean): void {
    if (!this.submitButton) {
      return;
    }

    this.submitButton.disabled = loading;
    this.submitButton.setAttribute('aria-busy', String(loading));

    if (this.submitLabel) {
      this.submitLabel.textContent = loading ? this.loadingButtonText : this.defaultButtonText;
    }

    if (this.submitIcon) {
      this.submitIcon.classList.toggle('hidden', loading);
    }

    if (this.submitSpinner) {
      this.submitSpinner.classList.toggle('hidden', !loading);
    }
  }

  /**
   * Parses JSON body from API response.
   * @param {Response} response - Fetch response.
   * @returns {Promise<ApiResponse | null>} Parsed response or null.
   */
  async parseJson(response: Response): Promise<ApiResponse | null> {
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return null;
    }

    try {
      return (await response.json()) as ApiResponse;
    } catch {
      return null;
    }
  }

  /**
   * Handles async form submission.
   * @param {SubmitEvent} event - Native submit event.
   * @returns {Promise<void>}
   */
  async handleSubmit(event: SubmitEvent): Promise<void> {
    if (typeof window.fetch !== 'function') {
      return;
    }

    event.preventDefault();

    const formData = new FormData(this.form);
    this.toggleLoading(true);
    this.updateStatus('idle', 'Nachricht wird gesendet...');

    Swetrix.track({
      ev: 'CONTACT_FORM_SUBMITTED',
      meta: { source: 'contact_form' },
    });

    try {
      const response = await fetch(this.form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      const data = await this.parseJson(response);

      if (response.ok) {
        this.form.reset();
        this.updateStatus(
          'success',
          data?.message || 'Vielen Dank! Ihre Nachricht wurde erfolgreich versendet.'
        );
      } else {
        this.updateStatus(
          'error',
          data?.message || 'Der Versand ist fehlgeschlagen. Bitte versuchen Sie es erneut.'
        );
      }
    } catch {
      this.form.submit();
      return;
    } finally {
      this.toggleLoading(false);
    }
  }
}
