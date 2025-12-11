const prisma = require('../config/prismaClient');

/**
 * Soft Delete Middleware for Prisma
 * Automatically filters out soft-deleted records from queries
 *
 * Models with soft delete: User, Exam, Question
 */

const modelsWithSoftDelete = ['user', 'exam', 'question'];

/**
 * Setup soft delete middleware
 * This intercepts Prisma queries and adds deletedAt: null filter
 */
function setupSoftDeleteMiddleware() {
  prisma.$use(async (params, next) => {
    // Only apply to models with soft delete support
    if (!modelsWithSoftDelete.includes(params.model?.toLowerCase())) {
      return next(params);
    }

    // Handle findUnique and findFirst
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst';
      params.args.where = {
        ...params.args.where,
        deletedAt: null,
      };
    }

    // Handle findMany
    if (params.action === 'findMany') {
      if (params.args.where) {
        if (params.args.where.deletedAt === undefined) {
          params.args.where.deletedAt = null;
        }
      } else {
        params.args.where = { deletedAt: null };
      }
    }

    // Handle update
    if (params.action === 'update') {
      params.action = 'updateMany';
      params.args.where = {
        ...params.args.where,
        deletedAt: null,
      };
    }

    // Handle updateMany
    if (params.action === 'updateMany') {
      if (params.args.where) {
        params.args.where.deletedAt = null;
      } else {
        params.args.where = { deletedAt: null };
      }
    }

    // Handle delete - convert to soft delete (update deletedAt)
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }

    // Handle deleteMany - convert to soft delete
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      if (params.args.data) {
        params.args.data.deletedAt = new Date();
      } else {
        params.args.data = { deletedAt: new Date() };
      }
    }

    // Handle count
    if (params.action === 'count') {
      if (params.args.where) {
        if (params.args.where.deletedAt === undefined) {
          params.args.where.deletedAt = null;
        }
      } else {
        params.args.where = { deletedAt: null };
      }
    }

    return next(params);
  });
}

module.exports = { setupSoftDeleteMiddleware };
