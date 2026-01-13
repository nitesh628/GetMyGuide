import { RESEND_API_KEY } from '@config/const';
import { error as logError } from 'node-be-utilities';
import { Resend } from 'resend';
import {
	GuideCredentialsTemplate,
	PasswordResetTemplate,
	PaymentLinkTemplate,
	WelcomeEmailTemplate,
} from './templates';

const resend = new Resend(RESEND_API_KEY);

export async function sendSimpleText(to: string, subject: string, value: string) {
	const { error } = await resend.emails.send({
		from: 'Info <no-reply@xyz.com>',
		to: [to],
		subject: subject,
		html: `<p>${value}</p>`,
	});

	if (error) {
		logError('Resend Error: Error Sending feedback message', error);
		return false;
	}
	return true;
}

export async function sendWelcomeEmail(to: string) {
	const { error } = await resend.emails.send({
		from: 'ABC <info@abc.com>',
		to: [to],
		subject: 'Welcome to ABC!',
		html: WelcomeEmailTemplate(to),
	});

	if (error) {
		logError('Resend Error: Error Sending welcome message', error);
		return false;
	}
	return true;
}

export async function sendPasswordResetEmail(to: string, token: string, resetUrl?: string) {
	// Construct reset link - if resetUrl is provided, append token, otherwise use token as full URL
	const resetLink = resetUrl ? `${resetUrl}?token=${token}` : token; // If no URL provided, token should be the full URL

	const { error } = await resend.emails.send({
		from: 'ABC <info@abc.com>',
		to: [to],
		subject: 'Password reset request for ABC',
		html: PasswordResetTemplate(resetLink),
	});

	if (error) {
		logError('Resend Error: Error Sending reset message', error);
		return false;
	}
	return true;
}

export async function sendGuideCredentialsEmail(to: string, email: string, password: string) {
	const { error } = await resend.emails.send({
		from: 'ABC <info@abc.com>',
		to: [to],
		subject: 'Your Guide Account Credentials - Get My Guide',
		html: GuideCredentialsTemplate(email, password),
	});

	if (error) {
		logError('Resend Error: Error Sending guide credentials email', error);
		return false;
	}
	return true;
}

export async function sendPaymentLinkEmail(to: string, name: string, paymentLink: string) {
	const { error } = await resend.emails.send({
		from: 'ABC <info@abc.com>',
		to: [to],
		subject: 'Guide Enrollment Payment Required - Get My Guide',
		html: PaymentLinkTemplate(paymentLink, name),
	});

	if (error) {
		logError('Resend Error: Error Sending payment link email', error);
		return false;
	}
	return true;
}
