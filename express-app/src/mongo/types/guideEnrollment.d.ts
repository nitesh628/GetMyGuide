import { Document, Types } from 'mongoose';

export default interface IGuideEnrollment extends Document {
	_id: Types.ObjectId;
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
	status: 'unverified' | 'payment-pending' | 'verified';
	createdAt: Date;
	updatedAt: Date;
}
