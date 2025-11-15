# Project Report Generation Instructions

## Steps to Generate PDF Report

### 1. Add the CubeAI Logo
Save the CubeAI Solutions logo as `cubeai-logo.png` in the `docs` folder:
- File path: `docs/cubeai-logo.png`
- Recommended size: 350px width (PNG format with transparent background)

### 2. Install Dependencies
```powershell
cd docs
npm install
```

### 3. Generate the PDF
```powershell
node generate-report-pdf.js
```

### 4. Output
The PDF will be generated as: `docs/Smart-Energy-Analytics-Project-Report.pdf`

## Alternative: Print to PDF from Browser

If you don't have Node.js/Puppeteer installed:

1. Open `docs/project-report.html` in Google Chrome or Microsoft Edge
2. Press `Ctrl + P` (Print)
3. Select "Save as PDF" as the destination
4. Set margins to "None"
5. Enable "Background graphics"
6. Click "Save"

## Report Features

✅ Professional cover page with CubeAI logo
✅ Corporate blue gradient theme
✅ Comprehensive 6-section structure
✅ Tables, charts, and visual elements
✅ Print-optimized layout with page breaks
✅ Industry-standard formatting
✅ Revenue projections with visual charts
✅ Scalability and competitive analysis

## Customization

To customize the report:
- Edit `docs/project-report.html`
- Modify colors in the `<style>` section (search for `#1e3c72` and `#2a5298`)
- Update content sections as needed
- Logo paths are referenced as `cubeai-logo.png`

## Note

Make sure the CubeAI logo file (`cubeai-logo.png`) is in the same directory as the HTML file before generating the PDF.
