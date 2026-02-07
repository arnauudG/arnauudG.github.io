/**
 * Configuration Validator
 * 
 * Validates configuration objects to ensure they meet required structure and types.
 * Follows the Fail-Fast principle and provides clear validation errors.
 * 
 * @module ConfigValidator
 */

const { ValidationError } = require('../errors/CustomErrors');
const { DEFAULT_CONFIG } = require('../constants');

/**
 * Validates PDF configuration
 * @param {Object} config - Configuration object to validate
 * @throws {ValidationError} If configuration is invalid
 */
function validatePDFConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new ValidationError('PDF configuration must be an object', 'pdf');
  }

  if (config.format && typeof config.format !== 'string') {
    throw new ValidationError('PDF format must be a string', 'pdf.format');
  }

  if (config.scale !== undefined && (typeof config.scale !== 'number' || config.scale <= 0 || config.scale > 1)) {
    throw new ValidationError('PDF scale must be a number between 0 and 1', 'pdf.scale');
  }

  if (config.margin) {
    validateMargin(config.margin);
  }
}

/**
 * Validates margin configuration
 * @param {Object} margin - Margin object
 * @throws {ValidationError} If margin is invalid
 */
function validateMargin(margin) {
  const marginKeys = ['top', 'bottom', 'left', 'right'];
  for (const key of marginKeys) {
    if (margin[key] && typeof margin[key] !== 'string') {
      throw new ValidationError(`Margin ${key} must be a string (e.g., '15mm')`, `pdf.margin.${key}`);
    }
  }
}

/**
 * Validates viewport configuration
 * @param {Object} viewport - Viewport configuration
 * @throws {ValidationError} If viewport is invalid
 */
function validateViewport(viewport) {
  if (!viewport || typeof viewport !== 'object') {
    throw new ValidationError('Viewport configuration must be an object', 'viewport');
  }

  if (viewport.width !== undefined && (typeof viewport.width !== 'number' || viewport.width <= 0)) {
    throw new ValidationError('Viewport width must be a positive number', 'viewport.width');
  }

  if (viewport.height !== undefined && (typeof viewport.height !== 'number' || viewport.height <= 0)) {
    throw new ValidationError('Viewport height must be a positive number', 'viewport.height');
  }

  if (viewport.deviceScaleFactor !== undefined && 
      (typeof viewport.deviceScaleFactor !== 'number' || viewport.deviceScaleFactor < 1 || viewport.deviceScaleFactor > 3)) {
    throw new ValidationError('Device scale factor must be a number between 1 and 3', 'viewport.deviceScaleFactor');
  }
}

/**
 * Validates timeout configuration
 * @param {Object} timeouts - Timeout configuration
 * @throws {ValidationError} If timeouts are invalid
 */
function validateTimeouts(timeouts) {
  if (!timeouts || typeof timeouts !== 'object') {
    throw new ValidationError('Timeouts configuration must be an object', 'timeouts');
  }

  if (timeouts.pageLoad !== undefined && (typeof timeouts.pageLoad !== 'number' || timeouts.pageLoad <= 0)) {
    throw new ValidationError('Page load timeout must be a positive number', 'timeouts.pageLoad');
  }

  if (timeouts.imageRender !== undefined && (typeof timeouts.imageRender !== 'number' || timeouts.imageRender < 0)) {
    throw new ValidationError('Image render timeout must be a non-negative number', 'timeouts.imageRender');
  }
}

/**
 * Validates output configuration
 * @param {Object} output - Output configuration
 * @throws {ValidationError} If output is invalid
 */
function validateOutput(output) {
  if (!output || typeof output !== 'object') {
    throw new ValidationError('Output configuration must be an object', 'output');
  }

  if (output.filename && typeof output.filename !== 'string') {
    throw new ValidationError('Output filename must be a string', 'output.filename');
  }
}

/**
 * Validates complete configuration object
 * @param {Object} config - Complete configuration object
 * @throws {ValidationError} If configuration is invalid
 */
function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new ValidationError('Configuration must be an object');
  }

  if (config.pdf) {
    validatePDFConfig(config.pdf);
  }

  if (config.viewport) {
    validateViewport(config.viewport);
  }

  if (config.timeouts) {
    validateTimeouts(config.timeouts);
  }

  if (config.output) {
    validateOutput(config.output);
  }
}

/**
 * Merges user configuration with defaults
 * @param {Object} userConfig - User-provided configuration
 * @param {Object} defaultConfig - Default configuration
 * @returns {Object} Merged configuration
 */
function mergeWithDefaults(userConfig, defaultConfig) {
  const merged = JSON.parse(JSON.stringify(defaultConfig)); // Deep clone

  if (userConfig.pdf) {
    merged.pdf = { ...merged.pdf, ...userConfig.pdf };
    if (userConfig.pdf.margin) {
      merged.pdf.margin = { ...merged.pdf.margin, ...userConfig.pdf.margin };
    }
  }

  if (userConfig.viewport) {
    merged.viewport = { ...merged.viewport, ...userConfig.viewport };
  }

  if (userConfig.timeouts) {
    merged.timeouts = { ...merged.timeouts, ...userConfig.timeouts };
  }

  if (userConfig.output) {
    merged.output = { ...merged.output, ...userConfig.output };
  }

  return merged;
}

module.exports = {
  validateConfig,
  validatePDFConfig,
  validateViewport,
  validateTimeouts,
  validateOutput,
  mergeWithDefaults
};
