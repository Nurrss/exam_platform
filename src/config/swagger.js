const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Exam Platform API',
      version: '2.0.0',
      description: 'A comprehensive REST API for an online examination platform with role-based access control, real-time session management, security violation tracking, and analytics.',
      contact: {
        name: 'API Support',
        email: 'support@examplatform.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.examplatform.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Ошибка валидации',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'body.email',
                  },
                  message: {
                    type: 'string',
                    example: 'Некорректный email',
                  },
                },
              },
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {},
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
                total: {
                  type: 'integer',
                  example: 45,
                },
                totalPages: {
                  type: 'integer',
                  example: 5,
                },
                hasNextPage: {
                  type: 'boolean',
                  example: true,
                },
                hasPreviousPage: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'TEACHER', 'STUDENT'],
              example: 'STUDENT',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Exam: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            title: {
              type: 'string',
              example: 'Mathematics Final Exam',
            },
            description: {
              type: 'string',
              example: 'Final examination for Math 101',
            },
            examCode: {
              type: 'string',
              example: '123456',
            },
            duration: {
              type: 'integer',
              nullable: true,
              description: 'Duration in minutes (null = no time limit)',
              example: 60,
            },
            maxAttempts: {
              type: 'integer',
              example: 2,
              description: 'Maximum attempts allowed per student',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
              example: 'PUBLISHED',
            },
            teacherId: {
              type: 'integer',
              example: 2,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ExamSession: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            examId: {
              type: 'integer',
              example: 1,
            },
            studentId: {
              type: 'integer',
              example: 3,
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'ACTIVE', 'BLOCKED_WAITING', 'LOCKED', 'COMPLETED', 'COMPLETED_BY_TEACHER'],
              example: 'ACTIVE',
            },
            score: {
              type: 'number',
              nullable: true,
              example: 85.5,
            },
            startedAt: {
              type: 'string',
              format: 'date-time',
            },
            finishedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            remainingTimeMinutes: {
              type: 'integer',
              nullable: true,
              description: 'Remaining time in minutes (only for active sessions with time limit)',
              example: 45,
            },
            locked: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Exams',
        description: 'Exam creation and management',
      },
      {
        name: 'Questions',
        description: 'Question CRUD operations',
      },
      {
        name: 'Sessions',
        description: 'Exam session management',
      },
      {
        name: 'Analytics',
        description: 'Exam analytics and statistics',
      },
      {
        name: 'Security',
        description: 'Security violation handling',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
