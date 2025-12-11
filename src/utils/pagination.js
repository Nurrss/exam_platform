/**
 * Pagination utility functions
 */

/**
 * Calculate pagination parameters for Prisma queries
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} Object with skip and take properties
 */
const getPaginationParams = (page = 1, limit = 10) => {
  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;

  // Ensure positive values
  const safePage = Math.max(1, parsedPage);
  const safeLimit = Math.min(Math.max(1, parsedLimit), 100); // Max 100 items per page

  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
};

/**
 * Format paginated response with metadata
 * @param {Array} data - Array of items
 * @param {number} total - Total count of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Formatted response with data and pagination metadata
 */
const formatPaginatedResponse = (data, total, page = 1, limit = 10) => {
  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;
  const totalPages = Math.ceil(total / parsedLimit);

  return {
    success: true,
    data,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages,
      hasNextPage: parsedPage < totalPages,
      hasPreviousPage: parsedPage > 1,
    },
  };
};

module.exports = {
  getPaginationParams,
  formatPaginatedResponse,
};
