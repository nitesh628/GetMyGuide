import express from 'express';
import { VerifyMinLevel, VerifySession } from '../../middleware';
import IDValidator from '../../middleware/idValidator';
import Controller from './guide.controller';
import { parseGuideEnrollmentFormData } from './guide.middleware';
import { ConfirmPaymentValidator, EnrollValidator, UpdateStatusValidator } from './guide.validator';

const router = express.Router();

// Public routes
router.route('/enroll').post(parseGuideEnrollmentFormData, EnrollValidator, Controller.enroll);

router
	.route('/enroll-status/:id')
	.get(IDValidator, Controller.getEnrollStatus)
	.post(
		VerifySession,
		VerifyMinLevel('admin'),
		IDValidator,
		UpdateStatusValidator,
		Controller.updateEnrollStatus
	);

router.route('/request-payment-link/:id').get(IDValidator, Controller.requestPaymentLink);

router
	.route('/confirm-payment/:id')
	.post(IDValidator, ConfirmPaymentValidator, Controller.confirmPayment);

// Admin-only routes
router.route('/list-all').get(VerifySession, VerifyMinLevel('admin'), Controller.listAll);

export default router;
