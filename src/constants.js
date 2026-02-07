/**
 * Application Constants
 * 
 * Centralized constants following clean code principles.
 * This prevents magic numbers and strings throughout the codebase.
 * 
 * @module constants
 */

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  PDF: {
    FORMAT: 'A4',
    SCALE: 0.95,
    PRINT_BACKGROUND: true,
    PREFER_CSS_PAGE_SIZE: false,
    DISPLAY_HEADER_FOOTER: false,
    OMIT_BACKGROUND: false,
    MARGIN: {
      TOP: '15mm',
      BOTTOM: '15mm',
      LEFT: '10mm',
      RIGHT: '10mm'
    }
  },
  VIEWPORT: {
    WIDTH: 1200,
    HEIGHT: 1600,
    DEVICE_SCALE_FACTOR: 2
  },
  TIMEOUTS: {
    PAGE_LOAD: 30000,
    IMAGE_RENDER: 1000
  },
  OUTPUT: {
    FILENAME: 'CV.pdf'
  }
};

/**
 * PDF styling constants
 */
const PDF_STYLES = {
  COLORS: {
    BACKGROUND: '#ffffff',
    TEXT_PRIMARY: '#000000',
    TEXT_SECONDARY: '#333333',
    TEXT_TERTIARY: '#555555',
    LINK: '#0066cc',
    BORDER: '#0066cc'
  },
  TYPOGRAPHY: {
    ORPHANS: 3,
    WIDOWS: 3,
    SECTION_ORPHANS: 4,
    SECTION_WIDOWS: 4
  },
  IMAGE: {
    WIDTH_PERCENT: '15%',
    HEIGHT_PERCENT: '15%',
    MARGIN_BOTTOM: '20px'
  },
  SECTION_TITLE: {
    BORDER_BOTTOM: '3px solid #0066cc',
    PADDING_BOTTOM: '10px',
    MARGIN_BOTTOM: '20px'
  }
};

/**
 * Puppeteer browser arguments
 */
const BROWSER_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox'
];

/**
 * File paths
 */
const PATHS = {
  CONFIG_FILE: 'pdf-config.json',
  HTML_FILE: 'index.html',
  OUTPUT_FILE: 'CV.pdf'
};

/**
 * Wait conditions for Puppeteer
 */
const WAIT_CONDITIONS = {
  DOM_CONTENT_LOADED: 'domcontentloaded',
  NETWORK_IDLE: 'networkidle0'
};

/**
 * Log messages
 */
const LOG_MESSAGES = {
  START: '🚀 Starting PDF conversion...',
  BROWSER_INIT: '✓ Browser initialized',
  CONTENT_LOADED: '✓ HTML content loaded',
  OPTIMIZATIONS_APPLIED: '✓ PDF optimizations applied',
  PDF_GENERATED: '✓ PDF generated successfully',
  COMPLETED: '✅ Conversion completed successfully!',
  ERROR: '❌ Error during PDF conversion:',
  WARNING_CONFIG: 'Warning: Could not load config from',
  WARNING_FALLBACK: 'using defaults',
  WARNING_FILE_URL: '⚠️  file:// URL failed, trying setContent method...',
  WARNING_IMAGES: '⚠️  Some images may not have loaded, continuing with PDF generation...'
};

/**
 * Error messages
 */
const ERROR_MESSAGES = {
  BROWSER_INIT: 'Failed to initialize browser',
  CONTENT_LOAD: 'Failed to load content',
  HTML_NOT_FOUND: 'HTML file not found',
  OPTIMIZATIONS: 'Failed to apply optimizations',
  PDF_GENERATION: 'Failed to generate PDF',
  CONFIG_LOAD: 'Failed to load configuration',
  CONFIG_INVALID: 'Invalid configuration format'
};

module.exports = {
  DEFAULT_CONFIG,
  PDF_STYLES,
  BROWSER_ARGS,
  PATHS,
  WAIT_CONDITIONS,
  LOG_MESSAGES,
  ERROR_MESSAGES
};
