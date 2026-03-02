import type { APIRoute } from 'astro';
import {
  SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS,
  FROM_EMAIL, CONTACT_TO_EMAIL,
} from 'astro:env/server';
import nodemailer from 'nodemailer';

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 50;
const MAX_SUBJECT_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 5000;

/**
 * Safely reads and trims a string value from FormData.
 * @param {FormData} formData - Submitted form data.
 * @param {string} fieldName - Key in form data.
 * @param {number} maxLength - Maximum allowed string length.
 * @returns {string} Sanitized string value.
 */
function readField(formData: FormData, fieldName: string, maxLength: number): string {
  const rawValue = formData.get(fieldName);
  if (typeof rawValue !== 'string') {
    return '';
  }

  return rawValue.trim().slice(0, maxLength);
}

/**
 * Validates a basic email format.
 * @param {string} email - User email address.
 * @returns {boolean} True when email looks valid.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Escapes unsafe characters for HTML output.
 * @param {string} value - Raw user input.
 * @returns {string} HTML-safe text.
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Builds a redirect response to the contact section.
 * @param {Request} request - Incoming request object.
 * @param {'success' | 'error'} status - Result state for UI feedback.
 * @returns {Response} Redirect response.
 */
function redirectWithStatus(request: Request, status: 'success' | 'error'): Response {
  const redirectUrl = new URL('/#kontakt', request.url);
  redirectUrl.searchParams.set('status', status);
  return Response.redirect(redirectUrl, 303);
}

/**
 * Checks if the current request expects a JSON response.
 * @param {Request} request - Incoming request object.
 * @returns {boolean} True when the client indicates AJAX/JSON usage.
 */
function expectsJson(request: Request): boolean {
  const acceptHeader = request.headers.get('accept') ?? '';
  const requestedWith = request.headers.get('x-requested-with') ?? '';
  return acceptHeader.includes('application/json') || requestedWith === 'XMLHttpRequest';
}

/**
 * Creates a response that supports both JSON and redirect clients.
 * @param {Request} request - Incoming request object.
 * @param {'success' | 'error'} status - Result state for UI feedback.
 * @param {number} statusCode - HTTP status code for JSON responses.
 * @param {string} message - Human readable message.
 * @returns {Response} JSON response or redirect response.
 */
function createResponse(
  request: Request,
  status: 'success' | 'error',
  statusCode: number,
  message: string
): Response {
  if (expectsJson(request)) {
    return new Response(
      JSON.stringify({
        success: status === 'success',
        message,
      }),
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return redirectWithStatus(request, status);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Honeypot field for simple bot protection.
    const website = readField(formData, 'website', 200);
    if (website) {
      return createResponse(request, 'success', 200, 'Ihre Nachricht wurde erfolgreich versendet.');
    }

    const name = readField(formData, 'name', MAX_NAME_LENGTH);
    const email = readField(formData, 'email', MAX_EMAIL_LENGTH);
    const phone = readField(formData, 'telefon', MAX_PHONE_LENGTH);
    const subject = readField(formData, 'betreff', MAX_SUBJECT_LENGTH) || 'Neue Kontaktanfrage';
    const message = readField(formData, 'anliegen', MAX_MESSAGE_LENGTH);
    const privacyAccepted = formData.get('datenschutz') !== null;

    if (!name || !email || !message || !privacyAccepted || !isValidEmail(email)) {
      return createResponse(
        request,
        'error',
        400,
        'Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.'
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || '-');
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replaceAll('\n', '<br/>');

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      subject: `Kontaktformular: ${subject}`,
      replyTo: email,
      text: `Neue Kontaktanfrage\n\nName: ${name}\nE-Mail: ${email}\nTelefon: ${phone || '-'}\nBetreff: ${subject}\n\nNachricht:\n${message}`,
      html: `<h2>Neue Kontaktanfrage</h2>
<p><strong>Name:</strong> ${safeName}</p>
<p><strong>E-Mail:</strong> ${safeEmail}</p>
<p><strong>Telefon:</strong> ${safePhone}</p>
<p><strong>Betreff:</strong> ${safeSubject}</p>
<p><strong>Nachricht:</strong><br/>${safeMessage}</p>`,
    });

    return createResponse(request, 'success', 200, 'Ihre Nachricht wurde erfolgreich versendet.');
  } catch (error) {
    console.error('Failed to send contact form email.', error);
    return createResponse(
      request,
      'error',
      500,
      'Ihre Nachricht konnte nicht versendet werden. Bitte versuchen Sie es erneut.'
    );
  }
};
