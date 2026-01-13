import GuideService from '@services/guide';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, Respond } from 'node-be-utilities';
import {
	ConfirmPaymentValidationResult,
	EnrollValidationResult,
	UpdateStatusValidationResult,
} from './guide.validator';

async function enroll(req: Request, res: Response, next: NextFunction) {
	try {
		const data = req.locals.data as EnrollValidationResult;

		// Get uploaded files from multer (already processed by parseGuideEnrollmentFormData middleware)
		const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

		if (!files) {
			return next(new BadRequestError('Files are required'));
		}

		// Validate required files
		if (!files.licence || files.licence.length === 0) {
			return next(new BadRequestError('Licence PDF file is required'));
		}

		if (!files.aadhar || files.aadhar.length === 0) {
			return next(new BadRequestError('Aadhar PDF file is required'));
		}

		if (!files.photo || files.photo.length === 0) {
			return next(new BadRequestError('Photo image file is required'));
		}

		const licenceFile = files.licence[0];
		const aadharFile = files.aadhar[0];
		const photoFile = files.photo[0];

		// Validate file types
		if (licenceFile.mimetype !== 'application/pdf') {
			return next(new BadRequestError('Licence must be a PDF file'));
		}

		if (aadharFile.mimetype !== 'application/pdf') {
			return next(new BadRequestError('Aadhar must be a PDF file'));
		}

		const allowedImageTypes = ['image/png', 'image/webp', 'image/jpg', 'image/jpeg'];
		if (!allowedImageTypes.includes(photoFile.mimetype)) {
			return next(new BadRequestError('Photo must be a JPG, PNG, or WEBP image'));
		}

		// Create enrollment using service
		const result = await GuideService.enroll({
			...data,
			licence: licenceFile.filename,
			aadhar: aadharFile.filename,
			photo: photoFile.filename,
		});

		return Respond({
			res,
			status: 201,
			data: result,
		});
	} catch (error) {
		return next(error);
	}
}

async function listAll(req: Request, res: Response, next: NextFunction) {
	try {
		const enrollments = await GuideService.getAllEnrollments();

		return Respond({
			res,
			status: 200,
			data: {
				enrollments,
			},
		});
	} catch (error) {
		return next(error);
	}
}

async function getEnrollStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const enrollmentId = req.locals.id!;
		const enrollment = await GuideService.getEnrollmentById(enrollmentId);

		return Respond({
			res,
			status: 200,
			data: enrollment,
		});
	} catch (error) {
		return next(error);
	}
}

async function updateEnrollStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const enrollmentId = req.locals.id!;
		const data = req.locals.data as UpdateStatusValidationResult;

		const enrollment = await GuideService.updateEnrollmentStatus(enrollmentId, data.status);

		return Respond({
			res,
			status: 200,
			data: enrollment,
		});
	} catch (error) {
		return next(error);
	}
}

async function requestPaymentLink(req: Request, res: Response, next: NextFunction) {
	try {
		const enrollmentId = req.locals.id!;
		const result = await GuideService.requestPaymentLink(enrollmentId);

		return Respond({
			res,
			status: 200,
			data: result.data,
		});
	} catch (error) {
		return next(error);
	}
}

async function confirmPayment(req: Request, res: Response, next: NextFunction) {
	try {
		const enrollmentId = req.locals.id!;
		const data = req.locals.data as ConfirmPaymentValidationResult;

		const result = await GuideService.confirmPayment(enrollmentId, data.transaction_id);

		return Respond({
			res,
			status: 200,
			data: result,
		});
	} catch (error) {
		return next(error);
	}
}

const Controller = {
	enroll,
	listAll,
	getEnrollStatus,
	updateEnrollStatus,
	requestPaymentLink,
	confirmPayment,
};

export default Controller;
