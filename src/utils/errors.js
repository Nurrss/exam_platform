/**
 * Custom error classes with error codes for better error handling
 */

class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, fields = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.fields = fields;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Необходима аутентификация') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Недостаточно прав доступа') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Ресурс') {
    super(`${resource} не найден`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Конфликт данных') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Слишком много запросов') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Ошибка базы данных') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

class ExternalServiceError extends AppError {
  constructor(message = 'Ошибка внешнего сервиса') {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR');
  }
}

// Specific business logic errors
class ExamError extends AppError {
  constructor(message, code) {
    super(message, 400, code);
  }
}

class SessionError extends AppError {
  constructor(message, code) {
    super(message, 400, code);
  }
}

// Error codes enum
const ErrorCodes = {
  // Authentication & Authorization
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Resources
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EXAM_NOT_FOUND: 'EXAM_NOT_FOUND',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  QUESTION_NOT_FOUND: 'QUESTION_NOT_FOUND',

  // Conflicts
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
  ACTIVE_SESSION_EXISTS: 'ACTIVE_SESSION_EXISTS',

  // Exam specific
  EXAM_NOT_PUBLISHED: 'EXAM_NOT_PUBLISHED',
  EXAM_CLOSED: 'EXAM_CLOSED',
  EXAM_TIME_EXPIRED: 'EXAM_TIME_EXPIRED',
  MAX_ATTEMPTS_REACHED: 'MAX_ATTEMPTS_REACHED',

  // Session specific
  SESSION_NOT_ACTIVE: 'SESSION_NOT_ACTIVE',
  SESSION_LOCKED: 'SESSION_LOCKED',
  SESSION_ALREADY_COMPLETED: 'SESSION_ALREADY_COMPLETED',
  ANSWER_ALREADY_SUBMITTED: 'ANSWER_ALREADY_SUBMITTED',

  // Security
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',

  // System
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  ExamError,
  SessionError,
  ErrorCodes,
};
