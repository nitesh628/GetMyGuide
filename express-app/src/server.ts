import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import configServer from './server-config';

import { DATABASE_URL, PORT } from '@config/const';
import connectDB from '@mongo';
import { error, info } from 'node-be-utilities';

//  ------------------------- Setup Variables
const app = express();

configServer(app);
connectDB(DATABASE_URL)
	.then(async () => {
		info('Database connected');
	})
	.catch((err) => {
		error('Database Connection Failed', err);
		process.exit();
	});

const server = app.listen(PORT, async () => {
	info(`Server started on port ${PORT}`);
});

process.setMaxListeners(0);
process.on('unhandledRejection', (err: Error) => {
	error('Unhandled rejection', err);
	server.close(() => process.exit(1));
});
