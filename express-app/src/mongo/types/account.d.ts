import { Document, Types } from 'mongoose';

export default interface IAccount extends Document {
	_id: Types.ObjectId;
	name: string;
	email: string;
	phone: string;
	password: string;
	role: 'tourist' | 'guide' | 'admin';
	isActive: boolean;
	status: 'non_verified' | 'verified';
	createdAt: Date;
	updatedAt: Date;

	verifyPassword(password: string): Promise<boolean>;
}
