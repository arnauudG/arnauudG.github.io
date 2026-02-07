/**
 * CV to PDF Converter
 * 
 * This module converts the CV HTML file to a high-quality PDF using Puppeteer.
 * It applies PDF-specific styling optimizations and ensures proper rendering.
 * 
 * @module convertToPDF
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Configuration class for PDF generation settings
 * Uses Strategy pattern for configuration management
 */
class PDFConfig {
  constructor(configPath = 'pdf-config.json') {
    this.configPath = path.join(__dirname, configPath);
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.warn(`Warning: Could not load config from ${this.configPath}, using defaults`);
      return this.getDefaultConfig();
    }
  }

  getDefaultConfig() {
    return {
      pdf: {
        format: 'A4',
        scale: 0.95,
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: false,
        omitBackground: false,
        margin: {
          top: '15mm',
          bottom: '15mm',
          left: '10mm',
          right: '10mm'
        }
      },
      viewport: {
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2
      },
      timeouts: {
        pageLoad: 30000,
        imageRender: 1000
      },
      output: {
        filename: 'CV.pdf'
      }
    };
  }

  getPDFOptions() {
    return this.config.pdf;
  }

  getViewportOptions() {
    return this.config.viewport;
  }

  getTimeouts() {
    return this.config.timeouts;
  }

  getOutputPath() {
    return path.join(__dirname, this.config.output.filename);
  }
}

/**
 * DOM Manipulator class
 * Applies PDF-specific styling optimizations using Template Method pattern
 */
class DOMManipulator {
  /**
   * Apply all PDF-specific styling optimizations
   */
  static applyPDFOptimizations() {
    this.styleSectionTitles();
    this.styleProfileImage();
    this.applyPageBreakRules();
    this.expandCollapsibleContent();
    this.hideFooter();
    this.optimizeLinks();
    this.optimizeImages();
  }

  /**
   * Style section titles for PDF rendering
   */
  static styleSectionTitles() {
    const titles = document.querySelectorAll('.section-title');
    titles.forEach((title) => {
      title.style.borderBottom = '3px solid #007bff';
      title.style.paddingBottom = '10px';
      title.style.marginBottom = '20px';
    });
  }

  /**
   * Style profile image for PDF rendering
   */
  static styleProfileImage() {
    const image = document.querySelector('.profile-image');
    if (image) {
      image.style.width = '15%';
      image.style.height = '15%';
      image.style.marginBottom = '20px';
      image.style.borderRadius = '50%';
    }
  }

  /**
   * Apply page break rules to prevent awkward splits
   */
  static applyPageBreakRules() {
    // Professional experience sections
    const professionalSections = document.querySelectorAll('.professional-experience');
    professionalSections.forEach((section) => {
      section.style.pageBreakInside = 'avoid';
    });

    // All sections
    const allSections = document.querySelectorAll('section');
    allSections.forEach((section) => {
      section.style.pageBreakInside = 'avoid';
    });

    // Company and project content
    const contentElements = document.querySelectorAll('.company-content, .project-content');
    contentElements.forEach((content) => {
      content.style.pageBreakInside = 'avoid';
    });
  }

  /**
   * Expand all collapsible content for PDF
   */
  static expandCollapsibleContent() {
    const collapsibleContents = document.querySelectorAll(
      '.section-content, .company-content, .project-content, .skill-content'
    );
    collapsibleContents.forEach((content) => {
      content.style.maxHeight = 'none';
      content.style.opacity = '1';
      content.classList.add('expanded');
    });
  }

  /**
   * Hide footer element if present
   */
  static hideFooter() {
    const footer = document.querySelector('.footer');
    if (footer) {
      footer.style.display = 'none';
    }
  }

  /**
   * Optimize link styling for PDF
   */
  static optimizeLinks() {
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      link.style.color = '#007bff';
    });
  }

  /**
   * Optimize image rendering for PDF
   */
  static optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    });
  }
}

/**
 * PDF Generator class
 * Handles PDF generation using Facade pattern to simplify Puppeteer operations
 */
class PDFGenerator {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.page = null;
  }

  /**
   * Initialize browser and page
   */
  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      await this.page.setViewport(this.config.getViewportOptions());
    } catch (error) {
      throw new Error(`Failed to initialize browser: ${error.message}`);
    }
  }

  /**
   * Load HTML content into the page
   */
  async loadContent(htmlPath) {
    try {
      const fullPath = path.join(__dirname, htmlPath);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`HTML file not found: ${fullPath}`);
      }

      const timeouts = this.config.getTimeouts();
      
      // Try using file:// URL first (better for local resources)
      const fileUrl = `file://${fullPath}`;
      
      try {
        // Navigate to the file with less strict wait conditions
        // 'domcontentloaded' is faster and doesn't wait for all network resources
        await this.page.goto(fileUrl, {
          waitUntil: 'domcontentloaded',
          timeout: timeouts.pageLoad
        });
      } catch (gotoError) {
        // Fallback: use setContent if file:// URL doesn't work
        console.warn('⚠️  file:// URL failed, trying setContent method...');
        const content = fs.readFileSync(fullPath, 'utf8');
        await this.page.setContent(content, {
          waitUntil: 'domcontentloaded',
          timeout: timeouts.pageLoad
        });
      }

      // Wait for critical resources (images) to load with a reasonable timeout
      try {
        // Check if images exist in the DOM
        const hasImages = await this.page.evaluate(() => {
          return document.querySelectorAll('img').length > 0;
        });
        
        if (hasImages) {
          // Wait for images to load, but don't fail if they don't
          await Promise.race([
            this.page.waitForFunction(
              () => {
                const images = Array.from(document.querySelectorAll('img'));
                return images.every(img => img.complete || img.naturalWidth > 0);
              },
              { timeout: 15000 }
            ).catch(() => null), // Don't throw if timeout
            new Promise(resolve => setTimeout(resolve, timeouts.imageRender))
          ]);
        } else {
          // No images, just wait a bit for other resources
          await this.page.waitForTimeout(timeouts.imageRender);
        }
      } catch (imgError) {
        // If images don't load, continue anyway - PDF will still generate
        console.warn('⚠️  Some images may not have loaded, continuing with PDF generation...');
        await this.page.waitForTimeout(timeouts.imageRender);
      }
    } catch (error) {
      throw new Error(`Failed to load content: ${error.message}`);
    }
  }

  /**
   * Apply PDF optimizations to the DOM
   */
  async applyOptimizations() {
    try {
      await this.page.evaluate(() => {
        // Convert absolute GitHub Pages URLs to relative paths for PDF generation
        const allImages = document.querySelectorAll('img');
        allImages.forEach((img) => {
          if (img.src && img.src.includes('arnauudg.github.io/assets/')) {
            // Extract the filename from the absolute URL
            const filename = img.src.split('/assets/')[1];
            // Convert to relative path
            img.src = `assets/${filename}`;
          }
        });

        // Change background to white for PDF
        document.body.style.backgroundColor = '#ffffff';
        const container = document.querySelector('.container');
        if (container) {
          container.style.backgroundColor = '#ffffff';
          container.style.border = 'none';
        }

        // Style section titles - dark colors for readability
        const titles = document.querySelectorAll('.section-title');
        titles.forEach((title) => {
          title.style.color = '#000000';
          title.style.borderBottom = '3px solid #0066cc';
          title.style.paddingBottom = '10px';
          title.style.marginBottom = '20px';
        });

        // Style headers - black for readability
        const headers = document.querySelectorAll('header h1, h1');
        headers.forEach((header) => {
          header.style.color = '#000000';
        });

        const h4Elements = document.querySelectorAll('h4');
        h4Elements.forEach((h4) => {
          h4.style.color = '#000000';
        });

        const h5Elements = document.querySelectorAll('h5');
        h5Elements.forEach((h5) => {
          h5.style.color = '#333333';
        });

        // Change body text to dark color
        document.body.style.color = '#000000';

        // Change lead text
        const leads = document.querySelectorAll('.lead');
        leads.forEach((lead) => {
          lead.style.color = '#333333';
        });

        // Change paragraph text
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach((p) => {
          if (!p.closest('header')) {
            p.style.color = '#000000';
          }
        });

        // Change strong/bold text to black
        const strongElements = document.querySelectorAll('strong');
        strongElements.forEach((strong) => {
          strong.style.color = '#000000';
        });

        // Change em/italic text
        const emElements = document.querySelectorAll('em');
        emElements.forEach((em) => {
          em.style.color = '#333333';
        });

        // Change small text
        const smallElements = document.querySelectorAll('small');
        smallElements.forEach((small) => {
          small.style.color = '#555555';
        });

        // Change list items color
        const listItemsForColor = document.querySelectorAll('li');
        listItemsForColor.forEach((li) => {
          li.style.color = '#000000';
        });

        // Style all paragraphs in skills section for better PDF readability
        const skillsSections = document.querySelectorAll('section');
        skillsSections.forEach((section) => {
          const sectionTitle = section.querySelector('.section-title');
          if (sectionTitle && sectionTitle.textContent.includes('Technical Skills')) {
            const paragraphs = section.querySelectorAll('p');
            paragraphs.forEach((p) => {
              p.style.color = '#000000';
              p.style.marginBottom = '4px';
              p.style.lineHeight = '1.5';
            });
            const strongTags = section.querySelectorAll('strong');
            strongTags.forEach((strong) => {
              strong.style.color = '#000000';
            });
          }
        });

        // Change skill category text (old format)
        const skillCategories = document.querySelectorAll('.collapsible-skill-category');
        skillCategories.forEach((category) => {
          category.style.color = '#000000';
        });

        // Style skills section paragraphs and divs (new format)
        const allSectionsForSkills = document.querySelectorAll('section');
        allSectionsForSkills.forEach((section) => {
          const sectionTitle = section.querySelector('.section-title');
          if (sectionTitle && sectionTitle.textContent.includes('Technical Skills')) {
            // Style paragraphs
            const paragraphs = section.querySelectorAll('p');
            paragraphs.forEach((p) => {
              p.style.color = '#000000';
              p.style.lineHeight = '1.6';
            });
            // Style divs containing sub-categories (AWS, Azure, Collibra)
            const skillDivs = section.querySelectorAll('div[style*="line-height"]');
            skillDivs.forEach((div) => {
              div.style.color = '#000000';
              const innerDivs = div.querySelectorAll('div');
              innerDivs.forEach((innerDiv) => {
                innerDiv.style.color = '#000000';
                // Style spans within sub-categories
                const spans = innerDiv.querySelectorAll('span');
                spans.forEach((span) => {
                  span.style.color = '#000000';
                });
                // Ensure proper alignment for inline-block labels
                const strongTags = innerDiv.querySelectorAll('strong');
                strongTags.forEach((strong) => {
                  if (strong.style.display === 'inline-block') {
                    strong.style.color = '#0066cc';
                  }
                });
              });
            });
            // Style strong tags in skills section (sub-category labels)
            const strongTags = section.querySelectorAll('strong');
            strongTags.forEach((strong) => {
              if (strong.textContent.includes(':') || strong.textContent.includes('AWS') || strong.textContent.includes('Azure') || strong.textContent.includes('Collibra')) {
                strong.style.color = '#0066cc'; // Dark blue for sub-category labels
              }
            });
          }
        });

        // Change inline spans with colors
        const coloredSpans = document.querySelectorAll('span[style*="color"]');
        coloredSpans.forEach((span) => {
          const style = span.getAttribute('style');
          if (style && style.includes('color')) {
            span.style.color = '#000000';
          }
        });

        // Style profile image
        const image = document.querySelector('.profile-image');
        if (image) {
          image.style.width = '15%';
          image.style.height = '15%';
          image.style.marginBottom = '20px';
          image.style.borderRadius = '50%';
        }

        // Apply smart page break rules for better PDF layout
        // Use CSS orphans and widows for better text flow
        document.body.style.orphans = '3';
        document.body.style.widows = '3';

        // Prevent breaking section titles from their content
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach((title) => {
          title.style.pageBreakAfter = 'avoid';
          title.style.breakAfter = 'avoid';
        });

        // For company entries: keep header, date, and first project together
        const companyHeaders = document.querySelectorAll('.collapsible-company');
        companyHeaders.forEach((header) => {
          header.style.pageBreakAfter = 'avoid';
          header.style.breakAfter = 'avoid';
          
          // Find and style the date paragraph
          let next = header.nextElementSibling;
          while (next) {
            if (next.tagName === 'P' && next.querySelector('em')) {
              next.style.pageBreakAfter = 'avoid';
              next.style.breakAfter = 'avoid';
              next.style.marginBottom = '5px';
            }
            if (next.classList.contains('company-content')) {
              // Keep first project with company header
              const firstProject = next.querySelector('li:first-child');
              if (firstProject) {
                firstProject.style.pageBreakBefore = 'avoid';
                firstProject.style.breakBefore = 'avoid';
                
                // Also keep the project header and its first content item together
                const projectHeader = firstProject.querySelector('.collapsible-project');
                if (projectHeader) {
                  projectHeader.style.pageBreakAfter = 'avoid';
                  projectHeader.style.breakAfter = 'avoid';
                  
                  const projectContent = firstProject.querySelector('.project-content');
                  if (projectContent) {
                    const firstContentItem = projectContent.querySelector('li:first-child');
                    if (firstContentItem) {
                      firstContentItem.style.pageBreakBefore = 'avoid';
                      firstContentItem.style.breakBefore = 'avoid';
                    }
                  }
                }
              }
              break;
            }
            next = next.nextElementSibling;
          }
        });

        // For project entries: keep entire project together (header + content)
        const projectHeaders = document.querySelectorAll('.collapsible-project');
        projectHeaders.forEach((header) => {
          header.style.pageBreakAfter = 'avoid';
          header.style.breakAfter = 'avoid';
          
          // Find the project content div
          let next = header.nextElementSibling;
          while (next) {
            if (next.classList.contains('project-content')) {
              // Keep the entire project content together
              next.style.pageBreakInside = 'avoid';
              next.style.breakInside = 'avoid';
              
              // Also keep first list item with header
              const firstItem = next.querySelector('li:first-child');
              if (firstItem) {
                firstItem.style.pageBreakBefore = 'avoid';
                firstItem.style.breakBefore = 'avoid';
              }
              break;
            }
            next = next.nextElementSibling;
          }
        });

        // List items: prevent orphans but allow breaking long items
        const listItems = document.querySelectorAll('li');
        listItems.forEach((li) => {
          // Check if this is a project list item (contains collapsible-project)
          const isProjectItem = li.querySelector('.collapsible-project');
          if (isProjectItem) {
            // Keep project items together - don't break inside
            li.style.pageBreakInside = 'avoid';
            li.style.breakInside = 'avoid';
          } else {
            // For regular list items, allow breaking but prevent orphans
            li.style.pageBreakInside = 'auto';
            li.style.orphans = '3';
            li.style.widows = '3';
          }
        });

        // Sections: allow breaking but prefer not to break small sections
        const allSections = document.querySelectorAll('section');
        allSections.forEach((section) => {
          section.style.pageBreakInside = 'auto';
          section.style.orphans = '4';
          section.style.widows = '4';
        });

        // Expand collapsible content
        const collapsibleContents = document.querySelectorAll(
          '.section-content, .company-content, .project-content, .skill-content'
        );
        collapsibleContents.forEach((content) => {
          content.style.maxHeight = 'none';
          content.style.opacity = '1';
          content.classList.add('expanded');
        });

        // Hide footer
        const footer = document.querySelector('.footer');
        if (footer) {
          footer.style.display = 'none';
        }

        // Hide PDF download button (only show in HTML version)
        const downloadButton = document.querySelector('.btn-download-pdf');
        if (downloadButton) {
          downloadButton.style.display = 'none';
          // Also hide the parent paragraph containing the download button
          const parent = downloadButton.parentElement;
          if (parent && parent.tagName === 'P') {
            parent.style.display = 'none';
          }
        }

        // Optimize links - darker blue for PDF
        const links = document.querySelectorAll('a');
        links.forEach((link) => {
          link.style.color = '#0066cc';
        });

        // Change header border if exists
        const header = document.querySelector('header');
        if (header) {
          header.style.borderBottomColor = '#000000';
        }

        // Optimize images
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
        });
      });
    } catch (error) {
      throw new Error(`Failed to apply optimizations: ${error.message}`);
    }
  }

  /**
   * Generate PDF from the current page
   */
  async generatePDF() {
    try {
      const outputPath = this.config.getOutputPath();
      const pdfOptions = this.config.getPDFOptions();

      await this.page.pdf({
        path: outputPath,
        ...pdfOptions
      });

      return outputPath;
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

/**
 * Main conversion function
 * Uses async/await with proper error handling
 */
async function convertToPDF() {
  const config = new PDFConfig();
  const generator = new PDFGenerator(config);

  try {
    console.log('🚀 Starting PDF conversion...');
    
    await generator.initialize();
    console.log('✓ Browser initialized');

    await generator.loadContent('index.html');
    console.log('✓ HTML content loaded');

    await generator.applyOptimizations();
    console.log('✓ PDF optimizations applied');

    const outputPath = await generator.generatePDF();
    console.log(`✓ PDF generated successfully: ${outputPath}`);
    
    await generator.cleanup();
    console.log('✅ Conversion completed successfully!');
    
    return outputPath;
  } catch (error) {
    console.error('❌ Error during PDF conversion:', error.message);
    await generator.cleanup();
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  convertToPDF();
}

module.exports = { convertToPDF, PDFGenerator, PDFConfig, DOMManipulator };
