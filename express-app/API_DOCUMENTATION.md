# API Documentation - GetMyGuide Express Backend

## Table of Contents
1. [Base URL and Authentication](#base-url-and-authentication)
2. [Common Response Formats](#common-response-formats)
3. [Session Module](#session-module)
4. [Blog Module](#blog-module)
5. [Booking Module](#booking-module)
6. [Guide Module](#guide-module)
7. [Package Module](#package-module)
8. [Media Endpoints](#media-endpoints)
9. [Error Codes](#error-codes)

## Base URL and Authentication

### Base URL
```
http://localhost:8000
```

All API endpoints are prefixed with the base URL. The API does not use a `/api` prefix - routes are mounted directly.

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in requests using one of these methods:

**Method 1: Authorization Header (Preferred)**
```
Authorization: Bearer <your-jwt-token>
```

**Method 2: Cookie**
```
Cookie: auth-cookie=<your-jwt-token>
```

### Getting a Token

Obtain a token by:
1. Signing up: `POST /session/signup`
2. Logging in: `POST /session/login`

Both endpoints return a `token` in the response that should be used for subsequent authenticated requests.

### User Roles

The API supports three user roles with different permission levels:

- **tourist** (Level 1): Can create bookings and view own bookings
- **guide** (Level 5): Can view assigned bookings/reservations
- **admin** (Level 10): Full access to all endpoints

## Common Response Formats

### Success Response

All successful responses follow this structure:

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response

Error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "message": "Error message description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

## Session Module

Base path: `/session`

### POST /session/signup

Register a new user account.

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "tourist"
}
```

**Field Validation:**
- `name`: Required, string, min 1 character, trimmed
- `email`: Required, valid email format, converted to lowercase
- `phone`: Required, string, min 1 character, trimmed
- `password`: Required, string, min 6 characters
- `role`: Optional, enum: `"tourist" | "guide" | "admin"`, defaults to `"tourist"`

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "tourist",
      "status": "non_verified"
    }
  }
}
```

**Error Responses:**
- `409`: User with this email already exists
- `400`: Validation error (missing/invalid fields)

---

### POST /session/login

Authenticate and login a user.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Field Validation:**
- `email`: Required, valid email format, converted to lowercase
- `password`: Required, string, min 1 character

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "tourist",
      "status": "non_verified"
    }
  }
}
```

**Error Responses:**
- `401`: Invalid email or password
- `401`: Account is deactivated
- `400`: Validation error

---

### POST /session/forgot-password

Request a password reset link via email.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Field Validation:**
- `email`: Required, valid email format, converted to lowercase

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "If an account with that email exists, a password reset link has been sent."
  }
}
```

**Note:** The response is the same whether the email exists or not (security best practice).

---

### POST /session/reset-password

Reset password using a reset token.

**Authentication:** Not required

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

**Field Validation:**
- `token`: Required, string, min 1 character (reset token from email)
- `password`: Required, string, min 6 characters

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "tourist",
      "status": "non_verified"
    }
  }
}
```

**Error Responses:**
- `401`: Invalid or expired reset token
- `404`: User not found
- `400`: Validation error

---

### GET /session/validate-auth

Validate the current authentication token and return user information.

**Authentication:** Required (Bearer token or cookie)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "role": "tourist",
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Responses:**
- `401`: Authentication token is required
- `401`: Invalid or expired token

---

### GET /session/validate-auth/admin

Validate authentication and verify admin role.

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "role": "admin",
      "email": "admin@example.com",
      "name": "Admin User"
    }
  }
}
```

**Error Responses:**
- `401`: Authentication token is required
- `401`: Invalid or expired token
- `401`: Insufficient permissions

---

### POST /session/logout

Logout endpoint (confirmation only, token removal is client-side).

**Authentication:** Required (Bearer token or cookie)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## Blog Module

Base path: `/blog`

### GET /blog

Get all blog posts, sorted by creation date (newest first).

**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "id": "507f1f77bcf86cd799439011",
        "videoFilename": "video123.mp4",
        "description": "Amazing tour experience",
        "hasImage": true,
        "imageFilename": "image123.jpg",
        "createdAt": "2025-01-14T10:00:00.000Z",
        "updatedAt": "2025-01-14T10:00:00.000Z"
      }
    ]
  }
}
```

---

### GET /blog/:id

Get a specific blog post by ID.

**Authentication:** Not required

**URL Parameters:**
- `id`: MongoDB ObjectId (required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "videoFilename": "video123.mp4",
    "description": "Amazing tour experience",
    "hasImage": true,
    "imageFilename": "image123.jpg",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid ID format
- `404`: Blog not found

---

### POST /blog

Create a new blog post.

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
- `description`: Required, string, min 1 character
- `hasImage`: Optional, boolean or string `"true"`/`"false"`, defaults to `false`
- `video`: Required, file (video MIME type)
- `image`: Required if `hasImage` is `true`, file (JPG, PNG, or WEBP)

**File Requirements:**
- Video: Any video MIME type (`video/*`)
- Image: `image/png`, `image/webp`, `image/jpg`, `image/jpeg`

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "videoFilename": "video123.mp4",
    "description": "Amazing tour experience",
    "hasImage": true,
    "imageFilename": "image123.jpg",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `401`: Insufficient permissions (not admin)
- `400`: Validation error
- `400`: Video file is required
- `400`: Image file is required when hasImage is true
- `400`: Only video files are allowed for video field
- `400`: Only JPG, PNG, WEBP images are allowed for image field

---

## Booking Module

Base path: `/booking`

### POST /booking/customised-booking

Create a customised tour booking.

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Tourist role or higher

**Request Body:**
```json
{
  "tourist_info": {
    "name": "John Doe",
    "gender": "male",
    "phone": "1234567890",
    "email": "john@example.com",
    "country": "India"
  },
  "travel_details": {
    "places": ["Taj Mahal", "Red Fort"],
    "city": "Agra",
    "date": "2025-02-15T10:00:00.000Z",
    "no_of_person": 2,
    "preferences": {
      "hotel": true,
      "taxi": false
    }
  },
  "guide_preferences": {
    "guide_language": ["English", "Hindi"],
    "gender": "male"
  },
  "booking_configuration": {
    "duration": "full-day",
    "foreign_language_required": true,
    "outstation": {
      "distance": 50,
      "over_night_stay": 1,
      "accomodation_meals": true,
      "special_excursion": ["Safari", "Boat Ride"]
    },
    "early_late_hours": false,
    "extra_city_allowances": true,
    "special_event_allowances": ["Festival", "Wedding"],
    "price": 5000
  }
}
```

**Field Validation:**

**tourist_info:**
- `name`: Required, string, min 1 character, trimmed
- `gender`: Required, enum: `"male" | "female" | "other"`
- `phone`: Required, string, min 1 character, trimmed
- `email`: Required, valid email, trimmed, lowercase
- `country`: Required, string, min 1 character, trimmed

**travel_details:**
- `places`: Required, array of strings, min 1 item, each trimmed
- `city`: Required, string, min 1 character, trimmed
- `date`: Required, valid date
- `no_of_person`: Required, number, min 1
- `preferences.hotel`: Required, boolean
- `preferences.taxi`: Required, boolean

**guide_preferences:**
- `guide_language`: Optional, array of strings, defaults to `[]`
- `gender`: Required, enum: `"male" | "female" | "none"`

**booking_configuration:**
- `duration`: Required, enum: `"half-day" | "full-day"`
- `foreign_language_required`: Required, boolean
- `outstation`: Optional object with:
  - `distance`: Required if outstation provided, number, min 0
  - `over_night_stay`: Required if outstation provided, number, min 0
  - `accomodation_meals`: Required if outstation provided, boolean
  - `special_excursion`: Optional, array of strings
- `early_late_hours`: Required, boolean
- `extra_city_allowances`: Required, boolean
- `special_event_allowances`: Optional, array of strings, defaults to `[]`
- `price`: Required, number, min 0

**Note:** Arrays can be sent as JSON strings or comma-separated strings (will be parsed).

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "tourist_info": {
      "name": "John Doe",
      "gender": "male",
      "phone": "1234567890",
      "email": "john@example.com",
      "country": "India"
    },
    "travel_details": {
      "places": ["Taj Mahal", "Red Fort"],
      "city": "Agra",
      "date": "2025-02-15T10:00:00.000Z",
      "no_of_person": 2,
      "preferences": {
        "hotel": true,
        "taxi": false
      }
    },
    "guide_preferences": {
      "guide_language": ["English", "Hindi"],
      "gender": "male"
    },
    "booking_configuration": {
      "duration": "full-day",
      "foreign_language_required": true,
      "outstation": {
        "distance": 50,
        "over_night_stay": 1,
        "accomodation_meals": true,
        "special_excursion": ["Safari", "Boat Ride"]
      },
      "early_late_hours": false,
      "extra_city_allowances": true,
      "special_event_allowances": ["Festival", "Wedding"],
      "price": 5000
    },
    "linked_to": "507f1f77bcf86cd799439012",
    "transaction_id": "txn_123456789",
    "status": "payment-pending",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `401`: Insufficient permissions
- `400`: Validation error

---

### GET /booking/my-bookings

Get all bookings for the authenticated tourist.

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Tourist role or higher

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "507f1f77bcf86cd799439011",
        "tourist_info": { /* ... */ },
        "travel_details": { /* ... */ },
        "guide_preferences": { /* ... */ },
        "booking_configuration": { /* ... */ },
        "linked_to": "507f1f77bcf86cd799439012",
        "transaction_id": "txn_123456789",
        "allocated_guide": "507f1f77bcf86cd799439013",
        "status": "allocated",
        "createdAt": "2025-01-14T10:00:00.000Z",
        "updatedAt": "2025-01-14T10:00:00.000Z"
      }
    ]
  }
}
```

---

### GET /booking

Get all bookings (admin only).

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "507f1f77bcf86cd799439011",
        "tourist_info": { /* ... */ },
        "travel_details": { /* ... */ },
        "guide_preferences": { /* ... */ },
        "booking_configuration": { /* ... */ },
        "linked_to": "507f1f77bcf86cd799439012",
        "transaction_id": "txn_123456789",
        "allocated_guide": "507f1f77bcf86cd799439013",
        "status": "allocated",
        "createdAt": "2025-01-14T10:00:00.000Z",
        "updatedAt": "2025-01-14T10:00:00.000Z"
      }
    ]
  }
}
```

---

### POST /booking/:id/allocate-guide

Allocate a guide to a booking (admin only).

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**URL Parameters:**
- `id`: Booking ID (MongoDB ObjectId, required)

**Request Body:**
```json
{
  "guide_id": "507f1f77bcf86cd799439013"
}
```

**Field Validation:**
- `guide_id`: Required, string, min 1 character, trimmed

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "tourist_info": { /* ... */ },
    "travel_details": { /* ... */ },
    "guide_preferences": { /* ... */ },
    "booking_configuration": { /* ... */ },
    "linked_to": "507f1f77bcf86cd799439012",
    "transaction_id": "txn_123456789",
    "allocated_guide": "507f1f77bcf86cd799439013",
    "status": "allocated",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `401`: Insufficient permissions
- `400`: Invalid booking ID format
- `404`: Booking not found
- `404`: Guide not found

---

### GET /booking/my-reservations

Get all reservations assigned to the authenticated guide.

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Guide role or higher

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "507f1f77bcf86cd799439011",
        "tourist_info": { /* ... */ },
        "travel_details": { /* ... */ },
        "guide_preferences": { /* ... */ },
        "booking_configuration": { /* ... */ },
        "linked_to": "507f1f77bcf86cd799439012",
        "transaction_id": "txn_123456789",
        "allocated_guide": "507f1f77bcf86cd799439013",
        "status": "allocated",
        "createdAt": "2025-01-14T10:00:00.000Z",
        "updatedAt": "2025-01-14T10:00:00.000Z"
      }
    ]
  }
}
```

---

### GET /booking/:id/transaction-status

Get transaction status for a booking.

**Authentication:** Required (Bearer token or cookie)

**URL Parameters:**
- `id`: Booking ID (MongoDB ObjectId, required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "transaction_id": "txn_123456789",
    "status": "completed",
    "amount": 5000,
    "currency": "INR",
    "createdAt": "2025-01-14T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `400`: Invalid booking ID format
- `404`: Booking not found
- `404`: Transaction not found

---

## Guide Module

Base path: `/guide`

### POST /guide/enroll

Submit a guide enrollment application.

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
- `name`: Required, string, min 1 character, trimmed
- `email`: Required, valid email format, trimmed
- `phone`: Required, string, min 1 character, trimmed
- `city`: Required, string, min 1 character, trimmed
- `type`: Required, enum: `"normal" | "escort"`
- `pan`: Required, string, min 1 character, trimmed
- `languages`: Required, array of strings, min 1 item (can be JSON string or comma-separated)
- `licence`: Required, file (PDF)
- `aadhar`: Required, file (PDF)
- `photo`: Required, file (JPG, PNG, or WEBP)

**File Requirements:**
- `licence`: PDF file (`application/pdf`)
- `aadhar`: PDF file (`application/pdf`)
- `photo`: Image file (`image/png`, `image/webp`, `image/jpg`, `image/jpeg`)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Enrollment submitted successfully. Your application is under review."
  }
}
```

**Error Responses:**
- `400`: Validation error
- `400`: Files are required
- `400`: Licence PDF file is required
- `400`: Aadhar PDF file is required
- `400`: Photo image file is required
- `400`: Licence must be a PDF file
- `400`: Aadhar must be a PDF file
- `400`: Photo must be a JPG, PNG, or WEBP image

---

### GET /guide/enroll-status/:id

Get enrollment status by enrollment ID.

**Authentication:** Not required

**URL Parameters:**
- `id`: Enrollment ID (MongoDB ObjectId, required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Guide",
    "email": "jane@example.com",
    "phone": "9876543210",
    "city": "Mumbai",
    "type": "normal",
    "pan": "ABCDE1234F",
    "licence": "licence123.pdf",
    "aadhar": "aadhar123.pdf",
    "languages": ["English", "Hindi", "Marathi"],
    "photo": "photo123.jpg",
    "status": "unverified",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T10:00:00.000Z"
  }
}
```

**Status Values:**
- `unverified`: Application submitted, under review
- `payment-pending`: Approved, waiting for payment
- `verified`: Payment confirmed, guide account created

**Error Responses:**
- `400`: Invalid ID format
- `404`: Enrollment not found

---

### POST /guide/enroll-status/:id

Update enrollment status (admin only).

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**URL Parameters:**
- `id`: Enrollment ID (MongoDB ObjectId, required)

**Request Body:**
```json
{
  "status": "payment-pending"
}
```

**Field Validation:**
- `status`: Required, enum: `"unverified" | "payment-pending" | "verified"`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Guide",
    "email": "jane@example.com",
    "phone": "9876543210",
    "city": "Mumbai",
    "type": "normal",
    "pan": "ABCDE1234F",
    "licence": "licence123.pdf",
    "aadhar": "aadhar123.pdf",
    "languages": ["English", "Hindi", "Marathi"],
    "photo": "photo123.jpg",
    "status": "payment-pending",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T10:00:00.000Z"
  }
}
```

**Note:** When status is set to `"payment-pending"`, a payment link email is automatically sent to the guide.

**Error Responses:**
- `401`: Authentication required
- `401`: Insufficient permissions
- `400`: Invalid ID format
- `400`: Validation error
- `404`: Enrollment not found

---

### GET /guide/request-payment-link/:id

Request a payment link for guide enrollment fee.

**Authentication:** Not required

**URL Parameters:**
- `id`: Enrollment ID (MongoDB ObjectId, required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "transaction_id": "txn_123456789",
    "razorpay_options": {
      "description": "Guide Enrollment Fee",
      "currency": "INR",
      "amount": 500,
      "name": "GetMyGuide",
      "order_id": "order_123456789",
      "prefill": {
        "name": "Jane Guide",
        "contact": "9876543210",
        "email": "jane@example.com"
      },
      "key": "rzp_test_123456789"
    }
  }
}
```

**Error Responses:**
- `400`: Invalid ID format
- `404`: Enrollment not found
- `500`: Failed to create payment link

---

### POST /guide/confirm-payment/:id

Confirm payment for guide enrollment.

**Authentication:** Not required

**URL Parameters:**
- `id`: Enrollment ID (MongoDB ObjectId, required)

**Request Body:**
```json
{
  "transaction_id": "txn_123456789"
}
```

**Field Validation:**
- `transaction_id`: Required, string, min 1 character, trimmed

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Payment confirmed. Guide account created successfully.",
    "account": {
      "id": "507f1f77bcf86cd799439014",
      "email": "jane@example.com",
      "name": "Jane Guide",
      "role": "guide"
    }
  }
}
```

**Error Responses:**
- `400`: Invalid ID format
- `400`: Validation error
- `404`: Enrollment not found
- `404`: Transaction not found
- `400`: Payment not completed
- `500`: Failed to create guide account

---

### GET /guide/list-all

Get all guide enrollments (admin only).

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Jane Guide",
        "email": "jane@example.com",
        "phone": "9876543210",
        "city": "Mumbai",
        "type": "normal",
        "pan": "ABCDE1234F",
        "licence": "licence123.pdf",
        "aadhar": "aadhar123.pdf",
        "languages": ["English", "Hindi", "Marathi"],
        "photo": "photo123.jpg",
        "status": "unverified",
        "createdAt": "2025-01-14T10:00:00.000Z",
        "updatedAt": "2025-01-14T10:00:00.000Z"
      }
    ]
  }
}
```

---

## Package Module

Base path: `/package`

### GET /package

Get all packages with optional filters.

**Authentication:** Optional (admin sees all packages regardless of status)

**Query Parameters:**
- `featured`: Optional, boolean string (`"true"` or `"false"`)
- `city`: Optional, string (filter by city)
- `status`: Optional, `"active" | "inactive"` (admin only)

**Example Requests:**
```
GET /package
GET /package?featured=true
GET /package?city=Mumbai
GET /package?status=active&city=Delhi  # Admin only
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Golden Triangle Tour",
        "city": "Delhi",
        "places": ["Taj Mahal", "Red Fort", "Qutub Minar"],
        "images": ["image1.jpg", "image2.jpg"],
        "shortDescription": "Explore the iconic Golden Triangle",
        "description": "A comprehensive tour of Delhi, Agra, and Jaipur...",
        "price": 15000,
        "inclusions": ["Guide", "Transportation", "Meals"],
        "exclusions": ["Hotel", "Personal expenses"],
        "featured": true,
        "status": "active",
        "createdAt": "2025-01-14T10:00:00.000Z",
        "updatedAt": "2025-01-14T10:00:00.000Z"
      }
    ]
  }
}
```

**Note:** Non-admin users only see packages with `status: "active"`. Admins can see all packages and filter by status.

---

### GET /package/available-cities

Get list of all cities that have packages.

**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "cities": ["Mumbai", "Delhi", "Agra", "Jaipur", "Goa"]
  }
}
```

---

### GET /package/:id

Get a specific package by ID.

**Authentication:** Optional (admin can see inactive packages)

**URL Parameters:**
- `id`: Package ID (MongoDB ObjectId, required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Golden Triangle Tour",
    "city": "Delhi",
    "places": ["Taj Mahal", "Red Fort", "Qutub Minar"],
    "images": ["image1.jpg", "image2.jpg"],
    "shortDescription": "Explore the iconic Golden Triangle",
    "description": "A comprehensive tour of Delhi, Agra, and Jaipur...",
    "price": 15000,
    "inclusions": ["Guide", "Transportation", "Meals"],
    "exclusions": ["Hotel", "Personal expenses"],
    "featured": true,
    "status": "active",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid ID format
- `404`: Package not found (or inactive and user is not admin)

---

### POST /package

Create a new package (admin only).

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
- `title`: Required, string, min 1 character, trimmed
- `city`: Required, string, min 1 character, trimmed
- `places`: Required, array of strings, min 1 item (can be JSON string or comma-separated)
- `price`: Required, number, min 0
- `shortDescription`: Optional, string, trimmed
- `description`: Optional, string, trimmed
- `inclusions`: Optional, array of strings (can be JSON string or comma-separated)
- `exclusions`: Optional, array of strings (can be JSON string or comma-separated)
- `featured`: Optional, boolean or string `"true"`/`"false"`, defaults to `false`
- `images`: Required, multiple files (JPG, PNG, or WEBP)

**File Requirements:**
- `images`: At least one image file required
- Allowed types: `image/png`, `image/webp`, `image/jpg`, `image/jpeg`

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Golden Triangle Tour",
    "city": "Delhi",
    "places": ["Taj Mahal", "Red Fort", "Qutub Minar"],
    "images": ["image1.jpg", "image2.jpg"],
    "shortDescription": "Explore the iconic Golden Triangle",
    "description": "A comprehensive tour...",
    "price": 15000,
    "inclusions": ["Guide", "Transportation"],
    "exclusions": ["Hotel"],
    "featured": false,
    "status": "inactive",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T10:00:00.000Z"
  }
}
```

**Note:** New packages are created with `status: "inactive"` by default. Use the update-status endpoint to activate them.

**Error Responses:**
- `401`: Authentication required
- `401`: Insufficient permissions
- `400`: Validation error
- `400`: At least one image file is required
- `400`: Only JPG, PNG, WEBP images are allowed

---

### PATCH /package/:id

Update an existing package (admin only).

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**Content-Type:** `multipart/form-data`

**URL Parameters:**
- `id`: Package ID (MongoDB ObjectId, required)

**Request Body (Form Data):**
All fields are optional. Only include fields you want to update:
- `title`: Optional, string, min 1 character, trimmed
- `city`: Optional, string, min 1 character, trimmed
- `places`: Optional, array of strings, min 1 item
- `price`: Optional, number, min 0
- `shortDescription`: Optional, string, trimmed
- `description`: Optional, string, trimmed
- `inclusions`: Optional, array of strings
- `exclusions`: Optional, array of strings
- `featured`: Optional, boolean or string `"true"`/`"false"`
- `images`: Optional, multiple files (JPG, PNG, or WEBP)

**File Requirements:**
- `images`: If provided, must be JPG, PNG, or WEBP
- Old images are deleted when new images are uploaded

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Golden Triangle Tour",
    "city": "Delhi",
    "places": ["Taj Mahal", "Red Fort", "Qutub Minar", "India Gate"],
    "images": ["new_image1.jpg", "new_image2.jpg"],
    "price": 18000,
    "featured": true,
    "status": "active",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `401`: Insufficient permissions
- `400`: Invalid ID format
- `400`: Validation error
- `400`: Only JPG, PNG, WEBP images are allowed
- `404`: Package not found

---

### DELETE /package/:id

Delete a package (admin only).

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**URL Parameters:**
- `id`: Package ID (MongoDB ObjectId, required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Package deleted successfully"
  }
}
```

**Note:** All associated images are deleted from the server when a package is deleted.

**Error Responses:**
- `401`: Authentication required
- `401`: Insufficient permissions
- `400`: Invalid ID format
- `404`: Package not found

---

### POST /package/:id/update-status

Update package status (admin only).

**Authentication:** Required (Bearer token or cookie)
**Authorization:** Admin role required

**URL Parameters:**
- `id`: Package ID (MongoDB ObjectId, required)

**Request Body:**
```json
{
  "status": "active"
}
```

**Field Validation:**
- `status`: Required, enum: `"inactive" | "active"`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Golden Triangle Tour",
    "city": "Delhi",
    "places": ["Taj Mahal", "Red Fort"],
    "images": ["image1.jpg"],
    "price": 15000,
    "featured": true,
    "status": "active",
    "createdAt": "2025-01-14T10:00:00.000Z",
    "updatedAt": "2025-01-14T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `401`: Insufficient permissions
- `400`: Invalid ID format
- `400`: Validation error
- `404`: Package not found

---

## Media Endpoints

### POST /upload-media

Upload a media file (image or video).

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
- `file`: Required, file (image or video)

**File Requirements:**
- Allowed types: Images (`image/png`, `image/webp`, `image/jpg`, `image/jpeg`) or Videos (`video/*`)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "name": "uploaded_file_1234567890.jpg"
  }
}
```

**Error Responses:**
- `400`: File upload failed
- `400`: Invalid file type

**Note:** Uploaded files are stored in `static/misc/` temporarily. They should be moved to appropriate directories after processing.

---

### GET /media/:path/:filename

Retrieve a media file.

**Authentication:** Not required

**URL Parameters:**
- `path`: Directory path (e.g., `blogs`, `packages`, `misc`)
- `filename`: File name

**Example Requests:**
```
GET /media/blogs/video123.mp4
GET /media/packages/image123.jpg
GET /media/misc/temp_file.jpg
```

**Success Response (200):**
Returns the file with appropriate Content-Type header.

**Error Responses:**
- `404`: File not found

---

## Error Codes

### Common Error Messages

**Authentication Errors:**
- `"Authentication token is required"` - No token provided
- `"Invalid or expired token"` - Token is invalid or expired
- `"Insufficient permissions"` - User role doesn't have required permissions

**Validation Errors:**
- `"Name is required"` - Required field missing
- `"Invalid email address"` - Email format is invalid
- `"Password must be at least 6 characters"` - Password too short
- `"Invalid date format"` - Date format is incorrect

**Resource Errors:**
- `"User not found"` - User ID doesn't exist
- `"Booking not found"` - Booking ID doesn't exist
- `"Package not found"` - Package ID doesn't exist
- `"Blog not found"` - Blog ID doesn't exist
- `"Enrollment not found"` - Enrollment ID doesn't exist
- `"File not found"` - Media file doesn't exist

**Conflict Errors:**
- `"User with this email already exists"` - Email is already registered

**Server Errors:**
- `"Database Connection Failed"` - Cannot connect to MongoDB
- `"Failed to send email"` - Email service error
- `"File upload failed"` - File upload error

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "message": "Descriptive error message",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

---

## Additional Notes

### Date Formats

All dates in the API use ISO 8601 format:
```
2025-01-14T10:00:00.000Z
```

### ID Formats

All MongoDB ObjectIds are 24-character hexadecimal strings:
```
507f1f77bcf86cd799439011
```

### Array Fields

Array fields can be sent in multiple formats:
1. JSON array: `["item1", "item2"]`
2. JSON string: `"[\"item1\", \"item2\"]"`
3. Comma-separated string: `"item1,item2"`

The API will parse and normalize all formats.

### File Uploads

When uploading files:
1. Use `multipart/form-data` content type
2. Ensure file MIME types match requirements
3. Files are initially stored in `static/misc/`
4. After validation, files are moved to appropriate directories
5. Access files via `/media/:path/:filename` endpoint

### Pagination

Currently, list endpoints return all results. Pagination may be added in future versions.

### Rate Limiting

Rate limiting is not currently implemented but may be added in production.

---

**Last Updated**: January 2025

