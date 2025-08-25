/**
 * Enhanced Email Obfuscation - Multiple protection layers against email harvesting bots
 * Combines Base64 encoding, character replacement, and timing-based rendering
 *
 * NUTZUNG:
 *
 * 1. HTML-Aufbau:
 *    <span data-obfuscate-email data-email-b64="BASE64_ENCODED_EMAIL"></span>
 *
 * 2. Verschiedene Methoden:
 *    - data-email-b64: Base64-verschlüsselte E-Mail (sicherste Methode)
 *    - data-email-char: Zeichen-ersetzte E-Mail (z.B. user[at]domain[dot]com)
 *    - data-username + data-domain: Original-Methode (für Kompatibilität)
 *    - KEIN data-display nötig: E-Mail wird aus verschlüsselten Daten dekodiert
 *
 * 3. Encoder verwenden:
 *    - ObfuscateEmail.encodeEmail('user@example.com') => Base64
 *    - ObfuscateEmail.createCharReplacedEmail('user@example.com') => user[at]example[dot]com
 *    - ObfuscateEmail.generateHtmlExamples('user@example.com') => Alle Varianten
 *
 * 4. Automatische Initialisierung erfolgt über das Script-Import
 *
 * SICHERHEIT:
 * - E-Mail ist NUR EINMAL verschlüsselt im HTML (keine Duplikation)
 * - Base64-Verschlüsselung schützt vor einfachen Bots
 * - Zeitverzögerte Generierung erschwert automatisierte Erkennung
 * - Keine lesbare E-Mail-Adresse im HTML-Quellcode
 */
class ObfuscateEmail {
	private static readonly SELECTOR = '[data-obfuscate-email]';
	private elements: HTMLElement[];

	constructor() {
		this.elements = Array.from(document.querySelectorAll(ObfuscateEmail.SELECTOR));
		this.init();
	}

	/**
	 * Initialize email obfuscation for all elements
	 */
	private init(): void {
		if (this.elements.length === 0) return;

		// Add small delay to avoid immediate bot detection
		setTimeout(() => {
			this.processElements();
		}, 100);
	}

	/**
	 * Process all email elements with enhanced obfuscation
	 */
	private processElements(): void {
		this.elements.forEach((element, index) => {
			// Add additional delay for each element
			setTimeout(() => {
				this.createObfuscatedEmailLink(element);
			}, index * 50);
		});
	}

	/**
	 * Create an obfuscated email link with multiple protection layers
	 * @param element - The HTML element containing email data
	 */
	private createObfuscatedEmailLink(element: HTMLElement): void {
		try {
			const emailData = this.extractEmailData(element);
			if (!emailData) return;

			const { email, displayText } = emailData;
			const link = this.createEmailLink(email, displayText);
			element.appendChild(link);
		} catch (error) {
			console.warn('Failed to obfuscate email:', error);
		}
	}

	/**
	 * Extract and decode email data from element attributes
	 * @param element - The HTML element containing encoded email data
	 * @returns Decoded email data or null if invalid
	 */
	private extractEmailData(element: HTMLElement): { email: string; displayText: string } | null {
		// Method 1: Base64 encoded email (most secure)
		const base64Email = element.dataset.emailB64;
		if (base64Email) {
			try {
				const decoded = atob(base64Email);
				return {
					email: decoded,
					displayText: decoded // Use decoded email as display text
				};
			} catch (error) {
				console.warn('Invalid Base64 email data');
			}
		}

		// Method 2: Character-replaced email (fallback)
		const charReplaced = element.dataset.emailChar;
		if (charReplaced) {
			const decoded = this.decodeCharacterReplacement(charReplaced);
			return {
				email: decoded,
				displayText: decoded // Use decoded email as display text
			};
		}

		// Method 3: Original method (least secure, for backwards compatibility)
		const username = element.dataset.username;
		const domain = element.dataset.domain;
		if (username && domain) {
			const email = `${username}@${domain}`;
			return {
				email,
				displayText: email // Use assembled email as display text
			};
		}

		return null;
	}

	/**
	 * Decode character-replaced email (e.g., "user[at]domain[dot]com")
	 * @param encoded - The encoded email string
	 * @returns Decoded email address
	 */
	private decodeCharacterReplacement(encoded: string): string {
		return encoded
			.replace(/\[at\]/gi, '@')
			.replace(/\[dot\]/gi, '.')
			.replace(/\[dash\]/gi, '-')
			.replace(/\[underscore\]/gi, '_')
			.replace(/\[plus\]/gi, '+');
	}

	/**
	 * Create a secure mailto link with additional protections
	 * @param email - The email address
	 * @param displayText - Text to display for the link
	 * @returns The created anchor element
	 */
	private createEmailLink(email: string, displayText: string): HTMLAnchorElement {
		const link = document.createElement('a');
		link.href = `mailto:${email}`;
		link.textContent = displayText;

		// Add additional protection attributes
		link.setAttribute('data-anti-bot', 'true');

		// Add click handler to prevent automated clicks
		link.addEventListener('click', (e) => {
			// Basic bot detection: check for rapid clicks
			const now = Date.now();
			const lastClick = parseInt(link.dataset.lastClick || '0');

			if (now - lastClick < 500) {
				e.preventDefault();
				return false;
			}

			link.dataset.lastClick = now.toString();
		});

		return link;
	}

	/**
	 * Static method to encode emails for use in HTML
	 * @param email - The email to encode
	 * @returns Encoded email string for data attributes
	 */
	public static encodeEmail(email: string): string {
		return btoa(email);
	}

	/**
	 * Static method to create character-replaced email
	 * @param email - The email to encode
	 * @returns Character-replaced email string
	 */
	public static createCharReplacedEmail(email: string): string {
		return email
			.replace('@', '[at]')
			.replace(/\./g, '[dot]')
			.replace(/-/g, '[dash]')
			.replace(/_/g, '[underscore]')
			.replace(/\+/g, '[plus]');
	}

	/**
	 * Utility method to generate HTML examples
	 * @param email - The email to encode
	 * @returns Object with different HTML encoding methods
	 */
	public static generateHtmlExamples(email: string): {
		base64: string;
		charReplaced: string;
		original: string;
	} {
		return {
			base64: `<span data-obfuscate-email data-email-b64="${this.encodeEmail(email)}"></span>`,
			charReplaced: `<span data-obfuscate-email data-email-char="${this.createCharReplacedEmail(email)}"></span>`,
			original: `<span data-obfuscate-email data-username="${email.split('@')[0]}" data-domain="${email.split('@')[1]}"></span>`
		};
	}
}

// Demo usage examples (entfernen Sie das für die Produktion)
/*
// Browser-Konsole testen:
console.log('=== ObfuscateEmail Demo ===');
const email = 'contact@example.com';

// Verschiedene Encodierungsmethoden testen
console.log('Base64:', ObfuscateEmail.encodeEmail(email));
console.log('Char Replaced:', ObfuscateEmail.createCharReplacedEmail(email));

// HTML Beispiele generieren (E-Mail wird automatisch als Text verwendet)
const examples = ObfuscateEmail.generateHtmlExamples(email);
console.log('HTML Examples:', examples);

// Initialisierung (wird automatisch beim Laden gemacht)
new ObfuscateEmail();
*/

export { ObfuscateEmail };
