import logger from '../loaders/logger.js';

/**
 * Utility helper functions
 */

/**
 * Sleep for a specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise<any>}
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const backoffDelay = delay * Math.pow(2, attempt - 1);
      logger.warn(
        `Retry attempt ${attempt}/${maxRetries} in ${backoffDelay}ms: ${error.message}`
      );
      await sleep(backoffDelay);
    }
  }
};

/**
 * Format error message
 * @param {Error} error - Error object
 * @returns {string}
 */
export const formatError = (error) => {
  return `${error.name}: ${error.message}`;
};

export default {
  sleep,
  retryWithBackoff,
  formatError
};
