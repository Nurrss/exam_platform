const { auditLogger } = require('../config/logger');

/**
 * Audit log service for tracking critical operations
 */
class AuditLog {
  /**
   * Log user authentication events
   */
  static auth(action, userId, email, metadata = {}) {
    auditLogger.info('AUTH_EVENT', {
      action, // 'LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_RESET'
      userId,
      email,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  /**
   * Log exam-related events
   */
  static exam(action, userId, examId, metadata = {}) {
    auditLogger.info('EXAM_EVENT', {
      action, // 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'CLOSE'
      userId,
      examId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  /**
   * Log session-related events
   */
  static session(action, userId, sessionId, metadata = {}) {
    auditLogger.info('SESSION_EVENT', {
      action, // 'START', 'FINISH', 'SUBMIT_ANSWER', 'VIOLATION', 'FORCE_FINISH'
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  /**
   * Log user management events
   */
  static user(action, performedBy, targetUserId, metadata = {}) {
    auditLogger.info('USER_EVENT', {
      action, // 'CREATE', 'UPDATE', 'DELETE', 'ROLE_CHANGE'
      performedBy,
      targetUserId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  /**
   * Log security-related events
   */
  static security(action, userId, metadata = {}) {
    auditLogger.warn('SECURITY_EVENT', {
      action, // 'VIOLATION_REPORTED', 'VIOLATION_APPROVED', 'SESSION_LOCKED', 'MULTIPLE_LOGIN_ATTEMPTS'
      userId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  /**
   * Log data access events (for GDPR compliance)
   */
  static dataAccess(action, userId, resourceType, resourceId, metadata = {}) {
    auditLogger.info('DATA_ACCESS', {
      action, // 'READ', 'EXPORT', 'DELETE'
      userId,
      resourceType, // 'USER', 'EXAM', 'SESSION', 'ANSWERS'
      resourceId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  /**
   * Log system events
   */
  static system(action, metadata = {}) {
    auditLogger.info('SYSTEM_EVENT', {
      action, // 'STARTUP', 'SHUTDOWN', 'AUTO_UNLOCK', 'SCHEDULED_JOB'
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }
}

module.exports = AuditLog;
