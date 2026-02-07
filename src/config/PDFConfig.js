/**
 * Configuration class for PDF generation settings
 * Uses Strategy pattern for configuration management
 * 
 * @module PDFConfig
 */

const fs = require('fs');
const path = require('path');
const { DEFAULT_CONFIG, PATHS, ERROR_MESSAGES, LOG_MESSAGES } = require('../constants');
const { ConfigurationError, FileSystemError } = require('../errors/CustomErrors');
const { logger } = require('../utils/Logger');
const { validateConfig, mergeWithDefaults } = require('../utils/ConfigValidator');

/**
 * PDF Configuration Manager
 * Handles loading, validation, and access to PDF generation configuration
 */
class PDFConfig {
  /**
   * @param {string} [configPath=pdf-config.json] - Path to configuration file
   */
  constructor(configPath = PATHS.CONFIG_FILE) {
    this.configPath = path.join(__dirname, '../../', configPath);
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from file with fallback to defaults
   * @returns {Object} Configuration object
   * @throws {ConfigurationError} If configuration is invalid
   */
  loadConfig() {
    try {
      if (!fs.existsSync(this.configPath)) {
        logger.warn(`${LOG_MESSAGES.WARNING_CONFIG} ${this.configPath}, ${LOG_MESSAGES.WARNING_FALLBACK}`);
        return this.getDefaultConfig();
      }

      const configData = fs.readFileSync(this.configPath, 'utf8');
      const userConfig = JSON.parse(configData);
      
      // Validate configuration
      try {
        validateConfig(userConfig);
      } catch (validationError) {
        throw new ConfigurationError(
          `${ERROR_MESSAGES.CONFIG_INVALID}: ${validationError.message}`,
          validationError
        );
      }

      // Merge with defaults
      const mergedConfig = mergeWithDefaults(userConfig, DEFAULT_CONFIG);
      logger.debug('Configuration loaded successfully', { path: this.configPath });
      
      return mergedConfig;
    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error;
      }
      
      if (error instanceof SyntaxError) {
        throw new ConfigurationError(
          `Invalid JSON in configuration file: ${error.message}`,
          error
        );
      }

      logger.warn(`${LOG_MESSAGES.WARNING_CONFIG} ${this.configPath}, ${LOG_MESSAGES.WARNING_FALLBACK}`);
      return this.getDefaultConfig();
    }
  }

  /**
   * Get default configuration
   * @returns {Object} Default configuration object
   */
  getDefaultConfig() {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG)); // Deep clone
  }

  /**
   * Get PDF-specific options
   * @returns {Object} PDF options
   */
  getPDFOptions() {
    return this.config.pdf;
  }

  /**
   * Get viewport options
   * @returns {Object} Viewport options
   */
  getViewportOptions() {
    return this.config.viewport;
  }

  /**
   * Get timeout settings
   * @returns {Object} Timeout settings
   */
  getTimeouts() {
    return this.config.timeouts;
  }

  /**
   * Get output file path
   * @returns {string} Full path to output file
   */
  getOutputPath() {
    const filename = this.config.output?.filename || PATHS.OUTPUT_FILE;
    return path.join(__dirname, '../../', filename);
  }
}

module.exports = PDFConfig;
