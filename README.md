# CV Website & PDF Generator

A professional CV website with automated PDF export functionality. This project demonstrates modern web development practices, clean architecture, and software engineering best practices.

## 🌐 Live Website

The CV is hosted on GitHub Pages and can be accessed at: [https://arnauudg.github.io](https://arnauudg.github.io)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Architecture & Design Patterns](#-architecture--design-patterns)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project consists of:

1. **HTML/CSS CV Website**: A responsive, interactive CV with collapsible sections
2. **PDF Generator**: Automated PDF conversion using Puppeteer with optimized rendering
3. **Configuration Management**: JSON-based configuration for easy customization

The CV features a modern dark theme inspired by GitHub's design system, with interactive collapsible sections for better user experience.

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CV Website System                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐         ┌──────────────┐              │
│  │  index.html  │────────▶│  style.css   │              │
│  │   (Source)   │         │  (Styling)   │              │
│  └──────────────┘         └──────────────┘              │
│         │                                                 │
│         │                 ┌──────────────┐              │
│         └────────────────▶│  PDF Config  │              │
│                           │  (Settings)  │              │
│                           └──────────────┘              │
│                                 │                        │
│                           ┌─────▼──────┐                │
│                           │ PDFGenerator│                │
│                           │  (Facade)   │                │
│                           └─────┬──────┘                │
│                                 │                        │
│                    ┌────────────┴────────────┐          │
│                    │                         │          │
│            ┌───────▼──────┐        ┌─────────▼──────┐   │
│            │ PDFConfig    │        │ DOMManipulator│   │
│            │ (Strategy)   │        │ (Template)    │   │
│            └──────────────┘        └───────────────┘   │
│                                                           │
│                           ┌──────────────┐              │
│                           │   Puppeteer   │              │
│                           │   (Browser)   │              │
│                           └──────────────┘              │
│                                                           │
│                           ┌──────────────┐              │
│                           │    CV.pdf    │               │
│                           │   (Output)   │               │
│                           └──────────────┘              │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

The PDF generation system follows a modular architecture with clear separation of concerns:

1. **PDFConfig** (`src/config/PDFConfig.js`): Configuration management using Strategy pattern
2. **DOMManipulator**: DOM manipulation utilities (Template Method pattern) - inlined in `convertToPDF.js`
3. **PDFGenerator**: Main facade for PDF generation operations - in `convertToPDF.js`
4. **convertToPDF**: Entry point with error handling
5. **Logger** (`src/utils/Logger.js`): Structured logging utility
6. **ConfigValidator** (`src/utils/ConfigValidator.js`): Configuration validation
7. **CustomErrors** (`src/errors/CustomErrors.js`): Application-specific error classes
8. **Constants** (`src/constants.js`): Centralized application constants

## ✨ Features

### Website Features

- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
- ✅ **Dark Theme**: Modern GitHub-inspired color scheme
- ✅ **Interactive Sections**: Collapsible sections for better UX
- ✅ **PDF Download Button**: Direct download link for the CV PDF
- ✅ **Print Optimization**: CSS media queries for print/PDF
- ✅ **Accessibility**: Semantic HTML and proper ARIA attributes

### PDF Generation Features

- ✅ **High-Quality Rendering**: 2x device scale factor for crisp output
- ✅ **Smart Page Breaks**: Prevents awkward content splits
- ✅ **Auto-Expansion**: Automatically expands all collapsible content
- ✅ **Optimized Styling**: PDF-specific CSS optimizations
- ✅ **Image Path Conversion**: Automatically converts absolute URLs to relative paths for local PDF generation
- ✅ **Download Button Hidden**: PDF download button is automatically hidden in the generated PDF
- ✅ **Configurable**: JSON-based configuration for easy customization
- ✅ **Error Handling**: Comprehensive error handling and logging

## 📁 Project Structure

```
.
├── index.html                      # Main CV HTML file
├── convertToPDF.js                 # PDF generation entry point
├── pdf-config.json                 # PDF configuration file
├── package.json                    # Node.js dependencies and scripts
├── package-lock.json               # Dependency lock file
├── .gitignore                      # Git ignore rules
├── .eslintrc.json                  # ESLint configuration
├── .eslintignore                   # ESLint ignore patterns
├── .prettierrc.json                # Prettier configuration
├── README.md                       # This file (comprehensive documentation)
├── CHANGELOG.md                    # Change log
├── CV.pdf                          # Generated PDF (tracked for GitHub Pages)
├── src/                            # Source code directory
│   ├── config/                     # Configuration classes
│   │   └── PDFConfig.js           # PDF configuration manager
│   ├── errors/                     # Custom error classes
│   │   └── CustomErrors.js        # Application-specific errors
│   ├── utils/                      # Utility modules
│   │   ├── Logger.js              # Structured logging utility
│   │   └── ConfigValidator.js     # Configuration validator
│   └── constants.js                # Application constants
├── assets/                         # Static assets (images, icons)
│   ├── profile-picture.jpeg        # Profile photo
│   ├── linkedin-mark.png           # LinkedIn icon
│   ├── github-mark.png             # GitHub icon
│   ├── substack-mark.png           # Substack icon
│   └── favicon.svg                 # Website favicon
└── styles/                         # Stylesheets
    └── style.css                   # Main stylesheet
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)

### Checking Your Versions

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

## 🚀 Installation

1. **Clone the repository**:

```bash
git clone https://github.com/arnauudG/arnauudG.github.io.git
cd arnauudG.github.io
```

2. **Install dependencies**:

```bash
npm install
```

This will install Puppeteer and its dependencies (including Chromium).

## 💻 Usage

### Generating PDF

To convert the CV HTML to PDF, run:

```bash
npm run build:pdf
```

Or directly:

```bash
node convertToPDF.js
```

The generated PDF will be saved as `CV.pdf` in the project root directory.

### Making PDF Available on GitHub Pages

To enable the PDF download button on your GitHub Pages site:

1. **Generate the PDF** (if not already done):
   ```bash
   npm run build:pdf
   ```

2. **Commit and push the PDF file**:
   ```bash
   git add CV.pdf
   git commit -m "Add CV.pdf for download on GitHub Pages"
   git push
   ```

3. **Verify availability**: After pushing, the PDF will be accessible at:
   - `https://arnauudg.github.io/CV.pdf`
   - The download button on the website will work automatically

**Note**: The `.gitignore` file is configured to track `CV.pdf` while ignoring other PDF files. This allows the CV PDF to be available on GitHub Pages while keeping other generated PDFs out of version control.

### Viewing the Website Locally

You can view the CV website locally by:

1. Opening `index.html` directly in your browser, or
2. Using a local web server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then navigate to `http://localhost:8000` in your browser.

## ⚙️ Configuration

PDF generation settings can be customized in `pdf-config.json`:

```json
{
  "pdf": {
    "format": "A4",              // Paper format (A4, Letter, etc.)
    "scale": 0.95,               // Scale factor (0-1)
    "printBackground": true,      // Include background colors/images
    "margin": {
      "top": "15mm",
      "bottom": "15mm",
      "left": "10mm",
      "right": "10mm"
    }
  },
  "viewport": {
    "width": 1200,
    "height": 1600,
    "deviceScaleFactor": 2       // Higher = better quality
  },
  "timeouts": {
    "pageLoad": 30000,           // Page load timeout (ms)
    "imageRender": 1000          // Image render delay (ms)
  },
  "output": {
    "filename": "CV.pdf"         // Output filename
  }
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `format` | PDF paper format | `A4` |
| `scale` | Content scaling factor | `0.95` |
| `printBackground` | Include CSS backgrounds | `true` |
| `deviceScaleFactor` | Rendering quality (1-3) | `2` |
| `margin.*` | Page margins in mm | `15mm/10mm` |
| `timeouts.pageLoad` | Page load timeout (ms) | `60000` |
| `timeouts.imageRender` | Image render delay (ms) | `2000` |

### Network Resources & Image Handling

The CV HTML file includes external resources (Bootstrap CDN, images from GitHub Pages). The PDF generator handles these gracefully:

**Image Path Handling**:
- **HTML Version**: Images use absolute GitHub Pages URLs (`https://arnauudg.github.io/assets/...`) for proper loading on the website
- **PDF Generation**: Images are automatically converted to relative paths (`./assets/...`) during PDF generation to work with the `file://` protocol
- This ensures images load correctly in both the web version and the generated PDF

**Resource Loading**:
- Uses `domcontentloaded` wait condition (faster, less strict than `networkidle0`)
- Automatically converts image URLs for local file access during PDF generation
- Continues PDF generation even if some external resources fail to load
- Uses `file://` URL for better local file handling
- Falls back to `setContent()` if file URL doesn't work

**PDF-Specific Optimizations**:
- Download button is automatically hidden in the generated PDF (only visible in HTML version)
- Images are optimized for print quality
- All styling is adjusted for PDF readability

If you experience timeout issues, you can:
1. Increase `timeouts.pageLoad` in `pdf-config.json`
2. Increase `timeouts.imageRender` in `pdf-config.json` for slower image loading
3. Ensure you have internet connectivity for external resources (Bootstrap CDN)
4. The PDF will still generate even if some external resources don't load (images are loaded from local files)

## 🎨 Architecture & Design Patterns

### Design Patterns

This project implements several software engineering design patterns:

#### 1. **Facade Pattern** (`PDFGenerator`)
   - Simplifies complex Puppeteer operations
   - Provides a clean interface for PDF generation
   - Hides implementation details from the client
   ```javascript
   const generator = new PDFGenerator(config);
   await generator.initialize();
   await generator.loadContent('index.html');
   await generator.generatePDF();
   ```

#### 2. **Strategy Pattern** (`PDFConfig`)
   - Allows runtime configuration selection
   - Enables easy switching between different PDF settings
   - Supports default fallback configuration
   ```javascript
   const config = new PDFConfig('pdf-config.json');
   // Or with defaults
   const config = new PDFConfig(); // Uses defaults if file not found
   ```

#### 3. **Template Method Pattern** (`DOMManipulator`)
   - Defines skeleton of DOM manipulation algorithm
   - Ensures consistent optimization workflow
   - Easy to extend with new optimizations

#### 4. **Singleton Pattern** (`Logger`)
   - Single logger instance throughout application
   - Consistent logging interface

### SOLID Principles

- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Extensible through configuration without modification
- **Liskov Substitution**: Custom error classes can substitute base Error
- **Interface Segregation**: Classes expose only necessary methods
- **Dependency Inversion**: Depend on abstractions (config, logger)

### Code Quality Principles

- **Meaningful Names**: Descriptive variables and functions
- **Small Functions**: Each function does one thing
- **DRY**: No code duplication, reusable utilities
- **KISS**: Simple, clear solutions
- **Constants**: Magic numbers extracted to `src/constants.js`
- **Error Handling**: Custom error classes with meaningful messages
- **Logging**: Structured logging with appropriate levels
- **Documentation**: Comprehensive JSDoc comments

## 🔧 Development

### Code Structure

The codebase follows clean code principles and software engineering best practices:

- **Modularity**: Separate classes and modules for different concerns
- **Error Handling**: Custom error classes with meaningful messages
- **Logging**: Structured logging utility with different levels
- **Configuration**: Externalized, validated configuration
- **Documentation**: Comprehensive JSDoc comments
- **Constants**: Centralized constants to avoid magic numbers
- **Validation**: Configuration validation with clear error messages

### Development Scripts

```bash
# Generate PDF
npm run build:pdf

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check code formatting
npm run format:check

# Validate code (lint + format check)
npm run validate
```

### Adding New Features

1. **Modify PDF Settings**: Edit `pdf-config.json`
2. **Add DOM Optimizations**: Extend the `applyOptimizations` method
3. **Customize Styling**: Modify `styles/style.css` or inline styles in `index.html`

### Best Practices

- ✅ Use semantic HTML
- ✅ Follow accessibility guidelines
- ✅ Keep configuration externalized
- ✅ Handle errors gracefully with custom error classes
- ✅ Document code with JSDoc
- ✅ Use meaningful variable names
- ✅ Extract constants to avoid magic numbers
- ✅ Use structured logging
- ✅ Validate configuration
- ✅ Follow SOLID principles
- ✅ Apply design patterns appropriately
- ✅ Maintain clean code principles

### Development Tools

- **ESLint**: Code linting for quality and consistency
- **Prettier**: Code formatting for consistent style
- **Custom Error Classes**: Better error handling and debugging
- **Logger Utility**: Structured logging with levels
- **Config Validator**: Configuration validation and error messages

### Data Flow

```
1. User runs convertToPDF()
   │
   ├─▶ PDFConfig loads configuration
   │   └─▶ Falls back to defaults if file missing
   │
   ├─▶ PDFGenerator initialized with config
   │   ├─▶ Browser launched
   │   └─▶ Page created with viewport
   │
   ├─▶ HTML content loaded
   │   ├─▶ File read from disk
   │   ├─▶ Content set in page
   │   └─▶ Wait for resources to load
   │
   ├─▶ DOM optimizations applied
   │   ├─▶ Section titles styled
   │   ├─▶ Profile image optimized
   │   ├─▶ Page breaks configured
   │   ├─▶ Collapsible content expanded
   │   └─▶ Links and images optimized
   │
   ├─▶ PDF generated
   │   └─▶ Saved to disk
   │
   └─▶ Resources cleaned up
       └─▶ Browser closed
```

### Error Handling

- **Custom Error Classes**: Specific error types (`ConfigurationError`, `FileSystemError`, `BrowserError`, etc.)
- **Error Propagation**: Errors caught at appropriate levels with context
- **Error Recovery**: Configuration errors fall back to defaults, browser errors clean up resources
- **Logging**: Structured logging with different levels (DEBUG, INFO, WARN, ERROR)

## 📚 Documentation

This project includes comprehensive documentation:

- **[README.md](README.md)** - This file, complete documentation and overview
- **[CHANGELOG.md](CHANGELOG.md)** - History of changes and versions

All source files include JSDoc comments for code documentation.

## 🤝 Contributing

This is a personal CV project. If you have suggestions or improvements, feel free to open an issue or submit a pull request.

### Code Style

- Use 2 spaces for indentation
- Follow ESLint and Prettier configurations
- Add JSDoc comments for public APIs
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Arnaud Gueulette**

- Website: [https://arnauudg.github.io](https://arnauudg.github.io)
- LinkedIn: [https://www.linkedin.com/in/arnaud-gueulette/](https://www.linkedin.com/in/arnaud-gueulette/)
- GitHub: [https://github.com/arnauudG](https://github.com/arnauudG)

## 🙏 Acknowledgments

- [Puppeteer](https://pptr.dev/) for PDF generation
- [Bootstrap](https://getbootstrap.com/) for responsive design
- GitHub for hosting via GitHub Pages

---

**Note**: This project is actively maintained. For issues or questions, please open an issue on GitHub.
