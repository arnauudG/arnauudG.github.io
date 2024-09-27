const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  // Launch a browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load your local HTML file
  const cvPath = path.join(__dirname, 'CV.html'); // Specify the path to your CV HTML file
  const content = fs.readFileSync(cvPath, 'utf8');
  await page.setContent(content, { waitUntil: 'networkidle0' }); // Wait until all resources are loaded


  // Convert the HTML content to PDF
  await page.pdf({
    path: 'CV.pdf', // The output file name
    format: 'A4',   // Paper format
    printBackground: true,  // Ensures that CSS background is included in the PDF
    margin: {
      top: '25px',
      bottom: '30px',
      left: '10px',
      right: '10px'
    }
  });

  // Close the browser
  await browser.close();

  console.log('CV successfully converted to PDF.');
})();