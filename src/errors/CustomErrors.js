/**
 * Custom Error Classes
 * 
 * Provides specific error types for better error handling and debugging.
 * Follows the Error Handling pattern from clean code principles.
 * 
 * @module CustomErrors
 */

/**
 * Base class for application-specific errors
 */
class ApplicationError extends Error {
  constructor(message, code = 'APPLICATION_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Configuration-related errors
 */
class ConfigurationError extends ApplicationError {
  constructor(message, originalError = null) {
    super(message, 'CONFIGURATION_ERROR');
    this.originalError = originalError;
  }
}

/**
 * File system related errors
 */
class FileSystemError extends ApplicationError {
  constructor(message, filePath = null) {
    super(message, 'FILE_SYSTEM_ERROR');
    this.filePath = filePath;
  }
}

/**
 * Browser/Puppeteer related errors
 */
class BrowserError extends ApplicationError {
  constructor(message, originalError = null) {
    super(message, 'BROWSER_ERROR');
    this.originalError = originalError;
  }
}

/**
 * PDF generation related errors
 */
class PDFGenerationError extends ApplicationError {
  constructor(message, originalError = null) {
    super(message, 'PDF_GENERATION_ERROR');
    this.originalError = originalError;
  }
}

/**
 * Validation errors
 */
class ValidationError extends ApplicationError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }
}

module.exports = {
  ApplicationError,
  ConfigurationError,
  FileSystemError,
  BrowserError,
  PDFGenerationError,
  ValidationError
};
