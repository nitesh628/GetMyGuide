import JWTService, { JWTPayload } from '@services/jwt';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'node-be-utilities';

/**
 * Middleware to verify JWT token from Authorization header or cookie
 * Attaches user info to req.locals.user if valid
 */
export default function VerifySession(req: Request, res: Response, next: NextFunction) {
	// Extract token from Authorization header (Bearer token)
	let token: string | undefined;

	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		token = authHeader.substring(7);
	} else if (req.cookies && req.cookies['auth-cookie']) {
		// Fallback to cookie if Authorization header is not present
		token = req.cookies['auth-cookie'];
	}

	if (!token) {
		return next(new UnauthorizedError('Authentication token is required'));
	}

	// Verify token
	const payload = JWTService.verifyToken(token);
	if (!payload) {
		return next(new UnauthorizedError('Invalid or expired token'));
	}

	// Attach user info to request locals
	req.locals.user = payload;

	next();
}

/**
 * Middleware factory to verify minimum user level/role
 * @param minRole - Minimum role required ('tourist', 'guide', or 'admin')
 */
export function VerifyMinLevel(minRole: 'tourist' | 'guide' | 'admin') {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = req.locals.user as JWTPayload | undefined;

		if (!user) {
			return next(new UnauthorizedError('User information not found'));
		}

		// Role hierarchy: admin > guide > tourist
		const roleHierarchy: Record<string, number> = {
			tourist: 1,
			guide: 5,
			admin: 10,
		};

		const userRoleLevel = roleHierarchy[user.role] || 0;
		const minRoleLevel = roleHierarchy[minRole] || 0;

		if (userRoleLevel < minRoleLevel) {
			return next(new UnauthorizedError('Insufficient permissions'));
		}

		next();
	};
}
