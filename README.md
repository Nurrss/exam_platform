# Exam Platform API

A comprehensive REST API backend for an online examination platform with role-based access control, real-time session management, security violation tracking, and analytics.

## Features

### Core Features
- **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Email verification on registration
  - Password reset via email
  - Role-based access control (ADMIN, TEACHER, STUDENT)
  - Secure HTTP-only cookies for refresh tokens

- **User Management**
  - CRUD operations for user accounts
  - Role-based permissions
  - Password hashing with bcrypt

- **Exam Management**
  - Create, edit, and delete exams (Teachers/Admins)
  - Unique exam codes for student access
  - Exam statuses: DRAFT, PUBLISHED, CLOSED
  - Support for multiple question types (MULTIPLE_CHOICE, TEXT, TRUE_FALSE)
  - **Time limits:** Configure exam duration (1-600 minutes)
  - **Attempt tracking:** Limit retakes (1-10 attempts per student)

- **Exam Sessions**
  - Students can join exams using exam codes
  - Real-time answer submission
  - Automatic scoring on completion
  - Session status tracking
  - **Auto-submit:** Sessions automatically complete when time expires
  - **Time tracking:** Real-time remaining time calculation
  - **Attempt validation:** Prevents joining after max attempts reached

- **Security Features**
  - Violation reporting system
  - Teacher approval workflow for violations
  - Temporary 60-second session locks
  - Auto-unlock background job (runs every 30 seconds)
  - Comprehensive violation tracking

- **Analytics Dashboard**
  - Exam completion statistics
  - Average scores and percentages
  - Student performance breakdown
  - Real-time session monitoring

- **Data Management**
  - Pagination support for all list endpoints
  - Request validation with Joi
  - Comprehensive error handling
  - Rate limiting on authentication endpoints
  - **Structured error codes:** Standardized error responses with error codes
  - **Database transactions:** Atomic operations for critical processes

- **Logging & Monitoring**
  - **Winston logger:** Professional logging with daily rotation
  - **3 log streams:** Application, error, and audit logs
  - **Request logging:** All HTTP requests logged with context
  - **Audit trail:** Categorized event tracking for compliance
  - **Log rotation:** Automatic cleanup with retention policies

- **API Documentation**
  - **Swagger/OpenAPI:** Interactive API documentation
  - **Live testing:** Try API endpoints directly from browser
  - **Schema definitions:** Complete request/response examples
  - **Access:** Available at `/api-docs` endpoint

## Technology Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js v5.1.0
- **Database:** PostgreSQL
- **ORM:** Prisma v6.17.1
- **Authentication:** JWT (jsonwebtoken v9.0.2)
- **Security:**
  - Helmet.js v8.1.0 (HTTP headers security)
  - bcrypt v6.0.0 (password hashing)
  - express-rate-limit v8.1.0 (rate limiting)
  - CORS v2.8.5
- **Validation:** Joi v17.13.3
- **Email:** Nodemailer v7.0.9
- **Development:** nodemon v3.1.10

## Prerequisites

- Node.js v18 or higher
- PostgreSQL v12 or higher
- npm or yarn package manager
- Gmail account for email notifications (or configure alternative SMTP)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd exam_server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
createdb exam_platform
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/exam_platform

# JWT Secrets (generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
JWT_SECRET=your_jwt_secret_here

# Token Expiration
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
JWT_EXPIRES_IN=1h

# Cookie Configuration
REFRESH_COOKIE_NAME=refreshToken

# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true

# Frontend URLs
FRONTEND_URL=http://localhost:3000
FRONTEND_ORIGIN=http://localhost:3000
```

**Gmail Setup:** Generate an App Password from your Google Account settings:
1. Enable 2-Factor Authentication
2. Go to Security → App Passwords
3. Generate a new app password for "Mail"
4. Use this password in `EMAIL_PASS`

### 5. Database Migration

Run Prisma migrations to create database tables:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 6. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Documentation

### Interactive API Documentation (Swagger)

Access the **interactive Swagger documentation** at:
```
http://localhost:3000/api-docs
```

Features:
- Browse all API endpoints with detailed descriptions
- View request/response schemas
- Try API calls directly from browser
- See authentication requirements
- View error codes and responses

### Base URL
```
http://localhost:3000/api
```

### Quick Start with API

1. **Register a user** (POST `/api/auth/register`)
2. **Login** (POST `/api/auth/login`) - Get access token
3. **Use token** in Authorization header: `Bearer <your_token>`
4. **Explore endpoints** via Swagger UI or direct API calls

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| GET | `/auth/verify-email/:token` | Verify email address | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/change-password` | Change password | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |

### User Management Endpoints

| Method | Endpoint | Description | Roles | Query Params |
|--------|----------|-------------|-------|--------------|
| GET | `/users` | List all users | ADMIN | `page`, `limit`, `role` |
| GET | `/users/:id` | Get user by ID | ADMIN or self | - |
| POST | `/users` | Create new user | ADMIN | - |
| PUT | `/users/:id` | Update user | ADMIN or self | - |
| DELETE | `/users/:id` | Delete user | ADMIN | - |

### Exam Endpoints

| Method | Endpoint | Description | Roles | Query Params |
|--------|----------|-------------|-------|--------------|
| POST | `/exams` | Create exam | TEACHER, ADMIN | - |
| GET | `/exams/my` | Get my exams | TEACHER, ADMIN | `page`, `limit` |
| GET | `/exams/:id` | Get exam by ID | All (based on access) | - |
| PUT | `/exams/:id` | Update exam | TEACHER, ADMIN | - |
| DELETE | `/exams/:id` | Delete exam | TEACHER, ADMIN | - |
| POST | `/exams/join/:examCode` | Join exam | STUDENT | - |
| GET | `/exams` | List all exams | ADMIN | `page`, `limit`, `status` |
| GET | `/exams/code/:examCode` | Get exam by code | All | - |

### Question Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/questions/:examId` | Create question | TEACHER, ADMIN |
| GET | `/questions/:examId` | Get questions (with answers) | TEACHER, ADMIN |
| GET | `/questions/:examId/student` | Get questions (student view) | STUDENT |
| PUT | `/questions/:id` | Update question | TEACHER, ADMIN |
| DELETE | `/questions/:id` | Delete question | TEACHER, ADMIN |

### Session Endpoints

| Method | Endpoint | Description | Roles | Query Params |
|--------|----------|-------------|-------|--------------|
| POST | `/sessions/join` | Join exam session | STUDENT | - |
| GET | `/sessions/my` | Get my sessions | STUDENT | `page`, `limit` |
| GET | `/sessions/:id` | Get session details | All (based on access) | - |
| POST | `/sessions/:id/answer` | Submit answer | STUDENT | - |
| POST | `/sessions/:id/finish` | Finish exam | STUDENT | - |
| GET | `/sessions/:id/result` | Get exam results | All (based on access) | - |
| GET | `/sessions/exam/:examId` | Get all sessions for exam | TEACHER, ADMIN | `page`, `limit`, `status` |

### Security Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/sessions/:id/violation` | Report violation | STUDENT |
| POST | `/sessions/:id/approve-violation` | Approve violation | TEACHER, ADMIN |
| POST | `/sessions/:id/force-finish` | Force finish exam | TEACHER, ADMIN |

### Analytics Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/analytics/:id` | Get exam analytics | TEACHER, ADMIN |

### Pagination

All list endpoints support pagination with the following query parameters:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

Example response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Request Validation

All endpoints validate incoming requests using Joi schemas. Invalid requests return:

```json
{
  "success": false,
  "message": "Ошибка валидации",
  "errors": [
    {
      "field": "body.email",
      "message": "Некорректный email"
    }
  ]
}
```

## Project Structure

```
exam_server/
├── src/
│   ├── config/
│   │   └── prismaClient.js         # Prisma database client
│   ├── controllers/                # Request handlers
│   │   ├── authController.js
│   │   ├── examController.js
│   │   ├── sessionController.js
│   │   ├── questionController.js
│   │   ├── userController.js
│   │   ├── analyticsController.js
│   │   └── securityController.js
│   ├── services/                   # Business logic
│   │   ├── authService.js
│   │   ├── examService.js
│   │   ├── sessionService.js
│   │   ├── questionService.js
│   │   ├── analyticsService.js
│   │   └── securityService.js
│   ├── repositories/               # Data access layer
│   │   ├── userRepository.js
│   │   ├── examRepository.js
│   │   ├── sessionRepository.js
│   │   ├── questionRepository.js
│   │   └── answerRepository.js
│   ├── routes/                     # API routes
│   │   ├── authRoutes.js
│   │   ├── examRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── userRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── authorizeRoles.js       # Role-based access control
│   │   └── validate.js             # Request validation
│   ├── validations/                # Joi validation schemas
│   │   ├── authValidation.js
│   │   ├── userValidation.js
│   │   ├── examValidation.js
│   │   ├── questionValidation.js
│   │   ├── sessionValidation.js
│   │   └── analyticsValidation.js
│   ├── utils/
│   │   ├── emailService.js         # Email sending
│   │   ├── tokenUtils.js           # JWT utilities
│   │   ├── catchAsync.js           # Async error handling
│   │   ├── gradeUtils.js           # Grade calculations
│   │   └── pagination.js           # Pagination utilities
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # Server initialization
│   └── index.js                    # Entry point
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── .env                            # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Security Features

### Authentication Security
- JWT tokens with short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days) stored securely
- Password hashing with bcrypt (10 rounds)
- Email verification required before account activation
- Secure HTTP-only cookies for refresh tokens

### API Security
- Helmet.js for HTTP header security
- CORS configuration with credentials
- Rate limiting on authentication endpoints (100 requests per 15 minutes)
- Input validation on all endpoints
- Role-based access control

### Exam Security
- Violation reporting system for suspicious behavior
- Teacher approval required for violation processing
- Temporary session locks (60 seconds) after violation approval
- Automatic unlock mechanism to prevent indefinite blocks
- Comprehensive violation tracking with timestamps

## Database Schema

### User Model
- id, email (unique), password (hashed)
- firstName, lastName, role
- isVerified, verificationToken
- timestamps (createdAt, updatedAt)

### Exam Model
- id, title, description
- examCode (unique), status
- teacherId (foreign key)
- timestamps

### Question Model
- id, examId (foreign key)
- text, type, options (JSON), correct (JSON)

### ExamSession Model
- id, examId, studentId (foreign keys)
- status, score
- locked, lockedUntil, lastViolation (JSON)
- timestamps (startedAt, finishedAt, createdAt, updatedAt)

### Answer Model
- id, questionId, sessionId (foreign keys)
- response (JSON), isCorrect
- timestamp (createdAt)

## Background Jobs

### Auto-Unlock Service
Runs every 30 seconds to automatically unlock expired session locks:
- Checks for sessions with `status = 'LOCKED'`
- Unlocks sessions where `lockedUntil` has passed
- Transitions status from `LOCKED` to `ACTIVE`

## Development

### Running Migrations
```bash
npx prisma migrate dev --name migration_name
```

### Viewing Database
```bash
npx prisma studio
```

### Testing API Endpoints
Use Postman, Thunder Client, or any REST client with the following:

1. **Register a user:**
   ```
   POST http://localhost:3000/api/auth/register
   Body: {
     "email": "teacher@example.com",
     "password": "password123",
     "firstName": "John",
     "lastName": "Doe",
     "role": "TEACHER"
   }
   ```

2. **Verify email** (check your email for verification link)

3. **Login:**
   ```
   POST http://localhost:3000/api/auth/login
   Body: {
     "email": "teacher@example.com",
     "password": "password123"
   }
   ```

4. **Use the returned `accessToken` in Authorization header:**
   ```
   Authorization: Bearer <your_access_token>
   ```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Check database credentials

### Email Not Sending
- Verify Gmail App Password is correct
- Check that 2FA is enabled on Gmail account
- Ensure EMAIL_USER and EMAIL_PASS are correct

### JWT Token Errors
- Regenerate JWT secrets using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Clear browser cookies and login again

### Migration Errors
- Reset database and migrations:
  ```bash
  npx prisma migrate reset
  npx prisma migrate dev
  ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
