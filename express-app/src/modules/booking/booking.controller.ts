import BookingService from '@services/booking';
import { JWTPayload } from '@services/jwt';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { Respond } from 'node-be-utilities';
import { AllocateGuideValidationResult, CreateBookingValidationResult } from './booking.validator';

async function createCustomisedBooking(req: Request, res: Response, next: NextFunction) {
	try {
		const user = req.locals.user as JWTPayload;
		const data = req.locals.data as CreateBookingValidationResult;

		const result = await BookingService.createBooking(data, new Types.ObjectId(user.userId));

		return Respond({
			res,
			status: 201,
			data: result.data,
		});
	} catch (error) {
		return next(error);
	}
}

async function getMyBookings(req: Request, res: Response, next: NextFunction) {
	try {
		const user = req.locals.user as JWTPayload;

		const bookings = await BookingService.getMyBookings(new Types.ObjectId(user.userId));

		return Respond({
			res,
			status: 200,
			data: {
				bookings,
			},
		});
	} catch (error) {
		return next(error);
	}
}

async function getAllBookings(req: Request, res: Response, next: NextFunction) {
	try {
		const bookings = await BookingService.getAllBookings();

		return Respond({
			res,
			status: 200,
			data: {
				bookings,
			},
		});
	} catch (error) {
		return next(error);
	}
}

async function allocateGuide(req: Request, res: Response, next: NextFunction) {
	try {
		const bookingId = req.locals.id!;
		const data = req.locals.data as AllocateGuideValidationResult;

		const booking = await BookingService.allocateGuide(
			bookingId,
			new Types.ObjectId(data.guide_id)
		);

		return Respond({
			res,
			status: 200,
			data: booking,
		});
	} catch (error) {
		return next(error);
	}
}

async function getMyReservations(req: Request, res: Response, next: NextFunction) {
	try {
		const user = req.locals.user as JWTPayload;

		const bookings = await BookingService.getMyReservations(new Types.ObjectId(user.userId));

		return Respond({
			res,
			status: 200,
			data: {
				bookings,
			},
		});
	} catch (error) {
		return next(error);
	}
}

async function getTransactionStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const bookingId = req.locals.id!;

		const transactionStatus = await BookingService.getTransactionStatus(bookingId);

		return Respond({
			res,
			status: 200,
			data: transactionStatus,
		});
	} catch (error) {
		return next(error);
	}
}

const Controller = {
	createCustomisedBooking,
	getMyBookings,
	getAllBookings,
	allocateGuide,
	getMyReservations,
	getTransactionStatus,
};

export default Controller;
