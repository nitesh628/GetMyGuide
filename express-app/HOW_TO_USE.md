# How to Use - GetMyGuide Express Backend

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Development Workflow](#development-workflow)
6. [Project Structure](#project-structure)
7. [Database Setup](#database-setup)
8. [Authentication](#authentication)
9. [File Uploads](#file-uploads)
10. [Testing](#testing)
11. [Contributing Guidelines](#contributing-guidelines)
12. [Troubleshooting](#troubleshooting)

## Project Overview

GetMyGuide is an Express.js backend application built with TypeScript that provides APIs for a tour guide booking platform. The application supports three user roles (tourist, guide, admin) and handles bookings, guide enrollments, package management, blog posts, and payment processing.

**Key Features:**

- JWT-based authentication with role-based access control
- MongoDB database with Mongoose ODM
- File uploads (images, videos, PDFs) using Multer
- Payment integration with Razorpay
- Email notifications using Resend
- Comprehensive test coverage (unit and integration tests)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **pnpm**: Package manager (install via `npm install -g pnpm`)
- **MongoDB**: Either MongoDB Atlas (cloud) or local MongoDB instance
- **Git**: For version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd express-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .example.env .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables) section below).

### 4. Build the Project

```bash
pnpm build
```

### 5. Start the Development Server

```bash
pnpm dev
```

The server will start on the port specified in your `.env` file (default: 8000).

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Required Variables

```env
# Server Configuration
NODE_ENV=development                    # development | production
PORT=8000                               # Server port number
OS=mac                                  # mac | WINDOWS (for path handling)

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Configuration
JWT_SECRET=your-secret-key-here         # Secret key for JWT tokens
JWT_EXPIRE=3minutes                     # Token expiration time

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key      # API key from Resend

# Payment Gateway (Razorpay)
RAZORPAY_API_KEY=your-razorpay-key      # Razorpay API key
RAZORPAY_API_SECRET=your-razorpay-secret # Razorpay API secret

# Optional Configuration
GUIDE_PAYMENT_LINK_BASE_URL=localhost/system/guide-verification-payment
COOKIE_DOMAIN_VALUE=.yourdomain.com     # For production cookie domain
```

### Environment Variable Details

- **DATABASE_URL**: MongoDB connection string. For local MongoDB: `mongodb://localhost:27017/getmyguide`
- **JWT_SECRET**: Use a strong, random string for production (minimum 32 characters recommended)
- **JWT_EXPIRE**: Token expiration format (e.g., `3minutes`, `1hour`, `7days`)
- **RESEND_API_KEY**: Get from [Resend Dashboard](https://resend.com)
- **RAZORPAY_API_KEY** & **RAZORPAY_API_SECRET**: Get from [Razorpay Dashboard](https://razorpay.com)

## Development Workflow

### Running the Server

**Development mode** (with hot reload via nodemon):

```bash
pnpm dev
```

**Production mode**:

```bash
pnpm build
pnpm start
```

### Building the Project

The build process compiles TypeScript to JavaScript and resolves path aliases:

```bash
pnpm build
```

This runs:

1. TypeScript compilation (`tsc`)
2. Path alias resolution (`tsc-alias`)

Output is generated in the `build/` directory.

### Running Tests

**Run all tests:**

```bash
pnpm test
```

**Run only unit tests:**

```bash
pnpm test:unit
```

**Run only integration tests:**

```bash
pnpm test:integration
```

**Run tests in watch mode:**

```bash
pnpm test:watch
```

**Generate coverage report:**

```bash
pnpm test:coverage
```

Coverage reports are generated in the `coverage/` directory. The project maintains 80% coverage threshold for branches, functions, lines, and statements.

### Code Quality

**Linting:**

```bash
pnpm lint              # Check for linting errors
pnpm lint:fix          # Auto-fix linting errors
```

**Formatting:**

```bash
pnpm format            # Format all files
pnpm format:check      # Check formatting without making changes
```

**Lint and format together:**

```bash
pnpm lint:format
```

## Project Structure

```
express-app/
├── src/
│   ├── config/           # Configuration constants
│   │   └── const.ts      # Environment variables and constants
│   ├── middleware/       # Express middleware
│   │   ├── VerifySession.ts    # JWT authentication middleware
│   │   └── idValidator.ts      # MongoDB ID validation
│   ├── modules/          # Feature modules
│   │   ├── session/      # Authentication endpoints
│   │   ├── blog/         # Blog management
│   │   ├── booking/      # Booking management
│   │   ├── guide/        # Guide enrollment
│   │   └── package/      # Package management
│   ├── mongo/            # Database layer
│   │   ├── repo/         # Mongoose models
│   │   └── types/        # TypeScript interfaces
│   ├── provider/         # External service integrations
│   │   ├── email/        # Email service (Resend)
│   │   └── razorpay/     # Payment gateway
│   ├── services/         # Business logic layer
│   ├── utils/            # Utility functions
│   │   └── files/        # File upload utilities
│   ├── server-config.ts  # Express app configuration
│   └── server.ts         # Application entry point
├── tests/                # Test files
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── setup/           # Test configuration
├── static/              # Static file storage
│   ├── blogs/          # Blog media files
│   ├── packages/       # Package images
│   └── misc/          # Temporary uploads
├── coverage/           # Test coverage reports
└── build/             # Compiled JavaScript output
```

### Module Structure

Each module follows a consistent structure:

```
module-name/
├── module-name.controller.ts  # Request handlers
├── module-name.route.ts        # Route definitions
├── module-name.validator.ts    # Request validation (Zod schemas)
└── module-name.middleware.ts   # Module-specific middleware (optional)
```

## Database Setup

### MongoDB Connection

The application uses Mongoose to connect to MongoDB. The connection string is configured via the `DATABASE_URL` environment variable.

**Connection Types:**

- **MongoDB Atlas** (Cloud): `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- **Local MongoDB**: `mongodb://localhost:27017/getmyguide`

### Database Models

The application uses the following Mongoose models:

- **Account**: User accounts (tourist, guide, admin)
- **Booking**: Tour bookings
- **GuideEnrollment**: Guide registration and verification
- **Package**: Tour packages
- **Blog**: Blog posts
- **Transaction**: Payment transactions
- **Storage**: Key-value storage for temporary data (e.g., password reset tokens)

### Schema Features

- Automatic password hashing (bcrypt) for Account model
- Timestamps (createdAt, updatedAt) on all models
- Soft deletes via `isActive` flag where applicable
- Indexes on frequently queried fields

## Authentication

### JWT Authentication

The application uses JSON Web Tokens (JWT) for authentication. Tokens are sent via:

1. **Authorization Header** (preferred):

   ```
   Authorization: Bearer <token>
   ```

2. **Cookie** (fallback):
   ```
   Cookie: auth-cookie=<token>
   ```

### User Roles

The application supports three user roles with hierarchical permissions:

| Role    | Level | Description                           |
| ------- | ----- | ------------------------------------- |
| Tourist | 1     | Default role, can create bookings     |
| Guide   | 5     | Can view assigned bookings            |
| Admin   | 10    | Full access, can manage all resources |

### Authentication Flow

1. **Signup/Login**: User authenticates and receives a JWT token
2. **Protected Routes**: Include token in Authorization header
3. **Token Verification**: Middleware validates token and attaches user info to `req.locals.user`
4. **Role Verification**: `VerifyMinLevel` middleware checks user role permissions

### Example: Using Authentication

```typescript
// In your frontend/client
const token = 'your-jwt-token';

// Make authenticated request
fetch('http://localhost:8000/api/booking/my-bookings', {
	headers: {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	},
});
```

## File Uploads

### Upload Endpoints

**General Media Upload:**

- `POST /upload-media` - Upload any media file (images/videos)

**Module-Specific Uploads:**

- Blog creation includes video and optional image uploads
- Package creation includes multiple image uploads
- Guide enrollment includes PDF (license, Aadhar) and photo uploads

### File Upload Process

1. Files are initially uploaded to `static/misc/` (temporary)
2. After validation and processing, files are moved to appropriate directories:
   - Blog files → `static/blogs/`
   - Package images → `static/packages/`
   - Guide documents → `static/misc/` (or custom location)

### Supported File Types

**Images:**

- JPG/JPEG
- PNG
- WEBP

**Videos:**

- All video MIME types (`video/*`)

**Documents:**

- PDF (for guide enrollment documents)

### File Size Limits

- Request body limit: 2048MB (configured in `server-config.ts`)
- Individual file limits depend on Multer configuration

### Accessing Uploaded Files

Uploaded files can be accessed via:

```
GET /media/:path/:filename
```

Example:

```
GET /media/packages/image123.jpg
GET /media/blogs/video456.mp4
```

## Testing

### Test Structure

- **Unit Tests**: Test individual functions/services in isolation
- **Integration Tests**: Test complete API endpoints with database

### Writing Tests

**Unit Test Example:**

```typescript
// tests/unit/services/auth.test.ts
import AuthService from '@services/auth';

describe('AuthService', () => {
	it('should create a new user', async () => {
		const userData = {
			name: 'Test User',
			email: 'test@example.com',
			password: 'password123',
			phone: '1234567890',
		};

		const result = await AuthService.signup(userData);
		expect(result.user.email).toBe('test@example.com');
	});
});
```

**Integration Test Example:**

```typescript
// tests/integration/session.test.ts
import request from 'supertest';
import app from '../../src/server';

describe('POST /session/signup', () => {
	it('should create a new user', async () => {
		const response = await request(app).post('/session/signup').send({
			name: 'Test User',
			email: 'test@example.com',
			password: 'password123',
			phone: '1234567890',
		});

		expect(response.status).toBe(201);
		expect(response.body.data.user).toBeDefined();
	});
});
```

### Test Database

Integration tests use `mongodb-memory-server` for an in-memory MongoDB instance, ensuring tests don't affect your development database.

### Running Specific Tests

```bash
# Run tests for a specific file
pnpm test tests/unit/services/auth.test.ts

# Run tests matching a pattern
pnpm test --testNamePattern="should create user"
```

## Contributing Guidelines

### Code Style

- **TypeScript**: Strict mode enabled, all files must be properly typed
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Code formatting is enforced via Prettier
- **Naming Conventions**:
  - Files: `kebab-case.ts` (e.g., `blog.controller.ts`)
  - Classes: `PascalCase` (e.g., `AuthService`)
  - Functions/Variables: `camelCase` (e.g., `getUserById`)

### Git Workflow

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure:
   - All tests pass (`pnpm test`)
   - Code is linted (`pnpm lint`)
   - Code is formatted (`pnpm format`)

3. **Commit your changes:**

   ```bash
   git commit -m "feat: add new feature description"
   ```

4. **Push and create Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Pull Request Process

1. Ensure your branch is up to date with `main`
2. Run all tests and ensure they pass
3. Update documentation if needed
4. Create a descriptive PR with:
   - What changes were made
   - Why the changes were needed
   - How to test the changes

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New features have corresponding tests
- [ ] Documentation is updated
- [ ] No console.logs or debug code
- [ ] Error handling is appropriate
- [ ] Security considerations addressed

## Troubleshooting

### Common Issues

**1. Database Connection Failed**

```
Error: Database Connection Failed
```

**Solution:**

- Verify `DATABASE_URL` in `.env` is correct
- Check MongoDB is running (if local)
- Verify network connectivity (if Atlas)
- Check MongoDB credentials

**2. Port Already in Use**

```
Error: listen EADDRINUSE: address already in use :::8000
```

**Solution:**

- Change `PORT` in `.env` to a different port
- Or kill the process using the port:

  ```bash
  # macOS/Linux
  lsof -ti:8000 | xargs kill

  # Windows
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F
  ```

**3. Module Not Found Errors**

```
Error: Cannot find module '@services/auth'
```

**Solution:**

- Ensure path aliases are configured in `tsconfig.json`
- Run `pnpm build` to resolve path aliases
- Check `tsconfig.json` paths configuration

**4. JWT Token Invalid**

```
Error: Invalid or expired token
```

**Solution:**

- Verify `JWT_SECRET` matches between server restarts
- Check token expiration time
- Ensure token is sent in correct format (Bearer token)

**5. File Upload Fails**

```
Error: File upload failed
```

**Solution:**

- Check file size limits
- Verify file type is allowed
- Ensure `static/` directory exists and is writable
- Check Multer configuration

**6. Test Failures**

```
Error: Timeout - Async callback was not invoked
```

**Solution:**

- Increase test timeout in `jest.config.js`
- Check database connection in test setup
- Ensure test database is properly cleaned between tests

### Getting Help

If you encounter issues not covered here:

1. Check the [API Documentation](./API_DOCUMENTATION.md) for endpoint details
2. Review test files for usage examples
3. Check existing issues in the repository
4. Create a new issue with:
   - Error message and stack trace
   - Steps to reproduce
   - Environment details (Node version, OS, etc.)

### Development Tips

- **Use TypeScript**: Leverage type safety to catch errors early
- **Check Logs**: Application logs are in `logs/` directory
- **Use Debugger**: Set breakpoints in VS Code for debugging
- **Test Locally First**: Always test changes locally before pushing
- **Read Error Messages**: Error messages from `node-be-utilities` are descriptive

---

**Last Updated**: January 2025
