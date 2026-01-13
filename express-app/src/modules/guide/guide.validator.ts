import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from 'node-be-utilities';
import { z } from 'zod';

export type EnrollValidationResult = {
	name: string;
	email: string;
	phone: string;
	city: string;
	type: 'normal' | 'escort';
	pan: string;
	languages: string[];
};

export async function EnrollValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim().min(1, 'Name is required'),
		email: z.string().trim().email('Invalid email format'),
		phone: z.string().trim().min(1, 'Phone is required'),
		city: z.string().trim().min(1, 'City is required'),
		type: z.enum(['normal', 'escort'], {
			message: 'Type must be either normal or escort',
		}),
		pan: z.string().trim().min(1, 'PAN is required'),
		languages: z
			.preprocess(
				(val) => {
					if (typeof val === 'string') {
						try {
							return JSON.parse(val);
						} catch {
							return val.split(',').map((s) => s.trim());
						}
					}
					return Array.isArray(val) ? val : [val];
				},
				z.array(z.string().trim().min(1)).min(1, 'At least one language is required')
			)
			.transform((val) => (Array.isArray(val) ? val : [val])),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	const message = reqValidatorResult.error.issues
		.map((err) => `${err.path.join('.')}: ${err.message}`)
		.join(', ');

	return next(new BadRequestError(message));
}

export type UpdateStatusValidationResult = {
	status: 'unverified' | 'payment-pending' | 'verified';
};

export async function UpdateStatusValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		status: z.enum(['unverified', 'payment-pending', 'verified'], {
			message: 'Status must be one of: unverified, payment-pending, verified',
		}),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	const message = reqValidatorResult.error.issues
		.map((err) => `${err.path.join('.')}: ${err.message}`)
		.join(', ');

	return next(new BadRequestError(message));
}

export type ConfirmPaymentValidationResult = {
	transaction_id: string;
};

export async function ConfirmPaymentValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		transaction_id: z.string().trim().min(1, 'Transaction ID is required'),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	const message = reqValidatorResult.error.issues
		.map((err) => `${err.path.join('.')}: ${err.message}`)
		.join(', ');

	return next(new BadRequestError(message));
}
