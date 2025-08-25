/**
 * Extracts the domain name from a URL by removing protocol and trailing slashes
 * @param url - The URL to extract domain from
 * @returns The clean domain name without protocol or trailing slashes
 * @example
 * extractDomain('https://www.example.com/') // returns 'www.example.com'
 * extractDomain('http://example.com/path') // returns 'example.com'
 */
export function extractDomain(url: string): string {
	if (!url) return '';

	// Remove protocol (http:// or https://)
	let domain = url.replace(/^https?:\/\//, '');

	// Remove trailing slashes
	domain = domain.replace(/\/+$/, '');

	// Remove any path or query parameters after the domain
	domain = domain.split('/')[0];

	return domain;
}

/**
 * Extracts the root domain (without subdomains) from a URL
 * @param url - The URL to extract root domain from
 * @returns The root domain name
 * @example
 * extractRootDomain('https://www.example.com/path') // returns 'example.com'
 * extractRootDomain('https://sub.domain.co.uk/') // returns 'domain.co.uk'
 */
export function extractRootDomain(url: string): string {
	const domain = extractDomain(url);
	if (!domain) return '';

	// Split by dots and get the last two parts (for most common TLDs)
	const parts = domain.split('.');
	if (parts.length >= 2) {
		// Handle common multi-part TLDs
		const tlds = ['co.uk', 'com.au', 'org.uk', 'net.au', 'gov.uk'];
		const lastTwo = parts.slice(-2).join('.');

		if (tlds.includes(lastTwo) && parts.length > 2) {
			return parts.slice(-3).join('.');
		}

		return lastTwo;
	}

	return domain;
}

/**
 * Formats a date string from 'YYYY-MM-DD' to 'MM/YYYY' format
 * @param dateString - The date string in 'YYYY-MM-DD' format
 * @returns The formatted date string in 'MM/YYYY' format
 */
export function formatDateForDisplay(dateString: string): string {
	const date = new Date(dateString);
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${month}/${year}`;
}
