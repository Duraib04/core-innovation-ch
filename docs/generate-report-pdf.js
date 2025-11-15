const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

async function main() {
  const root = path.resolve(__dirname);
  const htmlPath = path.join(root, 'project-report.html');
  const outPath = path.join(root, 'Smart-Energy-Analytics-Project-Report.pdf');

  if (!fs.existsSync(htmlPath)) {
    console.error('Missing project-report.html at', htmlPath);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    const fileUrl = 'file://' + htmlPath.replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: true
    });

    console.log('✅ Project Report PDF generated successfully:', outPath);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});
