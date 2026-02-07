/**
 * Logger Utility
 * 
 * Provides structured logging with different log levels.
 * Can be extended to support file logging, remote logging, etc.
 * 
 * @module Logger
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

/**
 * Simple logger implementation
 * Follows the Single Responsibility Principle
 */
class Logger {
  constructor(level = LOG_LEVELS.INFO) {
    this.level = level;
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {Object} [data] - Additional data
   */
  debug(message, data = null) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      const output = data ? `${message} ${JSON.stringify(data)}` : message;
      console.debug(`[DEBUG] ${output}`);
    }
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {Object} [data] - Additional data
   */
  info(message, data = null) {
    if (this.level <= LOG_LEVELS.INFO) {
      const output = data ? `${message} ${JSON.stringify(data)}` : message;
      console.log(`[INFO] ${output}`);
    }
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {Object} [data] - Additional data
   */
  warn(message, data = null) {
    if (this.level <= LOG_LEVELS.WARN) {
      const output = data ? `${message} ${JSON.stringify(data)}` : message;
      console.warn(`[WARN] ${output}`);
    }
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {Error} [error] - Error object
   */
  error(message, error = null) {
    if (this.level <= LOG_LEVELS.ERROR) {
      if (error) {
        console.error(`[ERROR] ${message}`, error);
      } else {
        console.error(`[ERROR] ${message}`);
      }
    }
  }

  /**
   * Set log level
   * @param {number} level - Log level
   */
  setLevel(level) {
    this.level = level;
  }
}

// Export singleton instance
const logger = new Logger(process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : LOG_LEVELS.INFO);

module.exports = {
  Logger,
  logger,
  LOG_LEVELS
};
