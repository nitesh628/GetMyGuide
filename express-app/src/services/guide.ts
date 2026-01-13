import { GUIDE_PAYMENT_LINK_BASE_URL, RAZORPAY_GUIDE_ENROLLMENT_AMOUNT } from '@config/const';
import { AccountDB, GuideEnrollmentDB } from '@mongo';
import IGuideEnrollment from '@mongo/types/guideEnrollment';
import { sendGuideCredentialsEmail, sendPaymentLinkEmail } from '@provider/email';
import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { NotFoundError, ServerError } from 'node-be-utilities';
import TransactionService from './transaction';

interface EnrollData {
	name: string;
	email: string;
	phone: string;
	city: string;
	type: 'normal' | 'escort';
	pan: string;
	licence: string; // filename
	aadhar: string; // filename
	languages: string[];
	photo: string; // filename
}

interface TransformedEnrollment {
	id: string;
	name: string;
	email: string;
	phone: string;
	city: string;
	type: 'normal' | 'escort';
	pan: string;
	licence: string;
	aadhar: string;
	languages: string[];
	photo: string;
	status: 'unverified' | 'payment-pending' | 'verified';
	createdAt: Date;
	updatedAt: Date;
}

function transformEnrollment(enrollment: IGuideEnrollment): TransformedEnrollment {
	return {
		id: enrollment._id.toString(),
		name: enrollment.name,
		email: enrollment.email,
		phone: enrollment.phone,
		city: enrollment.city,
		type: enrollment.type,
		pan: enrollment.pan,
		licence: enrollment.licence,
		aadhar: enrollment.aadhar,
		languages: enrollment.languages,
		photo: enrollment.photo,
		status: enrollment.status,
		createdAt: enrollment.createdAt,
		updatedAt: enrollment.updatedAt,
	};
}

class GuideService {
	/**
	 * Create a new guide enrollment
	 */
	async enroll(data: EnrollData): Promise<{ message: string }> {
		await GuideEnrollmentDB.create({
			...data,
			status: 'unverified',
		});

		return {
			message: 'Enrollment submitted successfully. Your application is under review.',
		};
	}

	/**
	 * Get all enrollments (admin only)
	 */
	async getAllEnrollments(): Promise<TransformedEnrollment[]> {
		const enrollments = await GuideEnrollmentDB.find().sort({ createdAt: -1 }).lean();

		return enrollments.map((enrollment: IGuideEnrollment) => transformEnrollment(enrollment));
	}

	/**
	 * Get enrollment by ID
	 */
	async getEnrollmentById(enrollmentId: Types.ObjectId): Promise<TransformedEnrollment> {
		const enrollment = await GuideEnrollmentDB.findById(enrollmentId).lean();

		if (!enrollment) {
			throw new NotFoundError('Enrollment not found');
		}

		return transformEnrollment(enrollment as IGuideEnrollment);
	}

	/**
	 * Update enrollment status
	 * If status is set to payment-pending, send payment link email
	 */
	async updateEnrollmentStatus(
		enrollmentId: Types.ObjectId,
		status: 'unverified' | 'payment-pending' | 'verified'
	): Promise<TransformedEnrollment> {
		const enrollment = await GuideEnrollmentDB.findById(enrollmentId);

		if (!enrollment) {
			throw new NotFoundError('Enrollment not found');
		}

		enrollment.status = status;
		await enrollment.save();

		// If status is payment-pending, send payment link email
		if (status === 'payment-pending') {
			const paymentLink = `${GUIDE_PAYMENT_LINK_BASE_URL}/${enrollmentId.toString()}`;
			const emailSent = await sendPaymentLinkEmail(enrollment.email, enrollment.name, paymentLink);
			if (!emailSent) {
				throw new ServerError('Failed to send payment link email');
			}
		}

		return transformEnrollment(enrollment);
	}

	/**
	 * Request payment link - creates transaction using TransactionService
	 */
	async requestPaymentLink(enrollmentId: Types.ObjectId): Promise<{
		data: {
			transaction_id: string;
			razorpay_options: {
				description: string;
				currency: string;
				amount: number;
				name: string;
				order_id: string;
				prefill: {
					name: string;
					contact: string;
					email: string;
				};
				key: string;
			};
		};
	}> {
		const enrollment = await GuideEnrollmentDB.findById(enrollmentId);

		if (!enrollment) {
			throw new NotFoundError('Enrollment not found');
		}

		if (enrollment.status !== 'payment-pending') {
			throw new NotFoundError('Enrollment is not in payment-pending status');
		}

		// Create transaction using TransactionService
		const transaction = await TransactionService.createTransaction(
			{
				name: enrollment.name,
				email: enrollment.email,
				phone_number: enrollment.phone,
			},
			RAZORPAY_GUIDE_ENROLLMENT_AMOUNT,
			{
				reference_id: enrollmentId.toString(),
				reference_type: 'enrollment',
				data: {
					enrollment_id: enrollmentId.toString(),
				},
				description: 'Get My Guide Enrollment Payment',
			}
		);

		return {
			data: transaction,
		};
	}

	/**
	 * Confirm payment - verify payment status and create guide account
	 */
	async confirmPayment(
		enrollmentId: Types.ObjectId,
		transaction_id: string
	): Promise<{ message: string }> {
		// Get transaction first to verify it exists and belongs to this enrollment
		const transaction = await TransactionService.getTransaction(transaction_id);
		if (
			transaction.reference_id !== enrollmentId.toString() ||
			transaction.reference_type !== 'enrollment'
		) {
			throw new NotFoundError('Transaction not found for this enrollment');
		}

		// Get transaction status using TransactionService
		const transactionStatus = await TransactionService.getTransactionStatus(transaction_id);

		// Verify payment is completed
		if (transactionStatus.order_status !== 'paid') {
			throw new ServerError(
				'Payment not completed. Order status: ' + transactionStatus.order_status
			);
		}

		// Get enrollment
		const enrollment = await GuideEnrollmentDB.findById(enrollmentId);

		if (!enrollment) {
			throw new NotFoundError('Enrollment not found');
		}

		// Update enrollment status to verified
		enrollment.status = 'verified';
		await enrollment.save();

		// Generate random password
		const password = randomBytes(12).toString('base64').slice(0, 16);

		// Check if account already exists
		const existingAccount = await AccountDB.findOne({ email: enrollment.email.toLowerCase() });
		if (existingAccount) {
			throw new ServerError('Account with this email already exists');
		}

		// Create guide account with verified status
		await AccountDB.create({
			name: enrollment.name,
			email: enrollment.email.toLowerCase(),
			phone: enrollment.phone,
			password, // Will be hashed by pre-save hook
			role: 'guide',
			status: 'verified',
			isActive: true,
		});

		// Send credentials email
		const emailSent = await sendGuideCredentialsEmail(enrollment.email, enrollment.email, password);
		if (!emailSent) {
			throw new ServerError('Failed to send credentials email');
		}

		return {
			message:
				'Payment confirmed successfully. Your guide account has been created and credentials have been sent to your email.',
		};
	}
}

export default new GuideService();
