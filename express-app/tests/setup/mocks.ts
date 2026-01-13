// Mock email provider to prevent actual email sends
jest.mock('@provider/email', () => ({
	sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
	sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));

export {};
