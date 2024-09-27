const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  // Launch a browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load your local HTML file
  const cvPath = path.join(__dirname, 'index.html'); // Specify the path to your CV HTML file
  const content = fs.readFileSync(cvPath, 'utf8');
  await page.setContent(content, { waitUntil: 'networkidle0' }); // Wait until all resources are loaded


  // Modify the size of the image dynamically using CSS
  await page.evaluate(() => {

    const titles = document.querySelectorAll(".section-title")

    // Headings
    titles.forEach((title) => {
      // Set the font size, color, margin, etc.
      title.style.borderBottom = '3px solid #007bff';         // Change the font size
      title.style.paddingBottom = '10px';            // Change the text color
      title.style.marginBottom = '20px';     // Adjust bottom margin
    });

    // Profile Image
    const image = document.querySelector('.profile-image'); // You can target specific images here

    // Set the desired width and height (you can adjust the values)
    image.style.width = '15%';   // Set the desired width
    image.style.height = '15%';   // Maintain aspect ratio
    
    // Set the bottom margin
    image.style.marginBottom = '20px';  // Set bottom margin to 20px

    // Set the border radius
    image.style.borderRadius = '50%'

    // Professional experience
    const sections = document.querySelectorAll('.professional-experience');  // Use the correct class or tag for your sections
    
    // Apply the page-break-inside: avoid CSS rule to each section
    sections.forEach((section) => {
      section.style.pageBreakInside = 'avoid';  // Prevents splitting the section across pages
    });

    // Footer
    const element = document.querySelector('.footer'); // Replace with your actual class, ID, or tag
    if (element) {
      element.style.display = 'none';  // Hide the element by setting display to none
    }

  });

  // Convert the HTML content to PDF
  await page.pdf({
    path: 'CV.pdf', // The output file name
    format: 'A4',   // Paper format
    printBackground: true,  // Ensures that CSS background is included in the PDF
    margin: {
      top: '70px',
      bottom: '25px',
      left: '10px',
      right: '10px'
    }
  });

  // Close the browser
  await browser.close();

  console.log('CV successfully converted to PDF.');
})();