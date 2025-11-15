const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

async function main() {
  const root = path.resolve(__dirname);
  const htmlPath = path.join(root, 'brochure.html');
  const outPath = path.join(root, 'SmartEnergy-Analytics-Product-Brochure.pdf');

  if (!fs.existsSync(htmlPath)) {
    console.error('Missing brochure.html at', htmlPath);
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
      margin: { top: '12mm', right: '12mm', bottom: '16mm', left: '12mm' }
    });

    console.log('PDF generated:', outPath);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
