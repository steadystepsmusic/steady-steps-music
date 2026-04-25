const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const jpegBase64 = fs.readFileSync(path.join(__dirname, 'public/images/nik-mathews-hero.jpeg')).toString('base64');

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; background: #0a0a0a; }
.photo {
  width: 1200px;
  height: 430px;
  overflow: hidden;
  position: relative;
}
.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 18%;
}
.photo::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 130px;
  background: linear-gradient(to bottom, transparent, #0a0a0a);
}
.bar {
  width: 1200px;
  height: 200px;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
}
.separator {
  width: 220px;
  height: 1px;
  background: #c9a84c;
  opacity: 0.7;
  margin: 10px 0 12px;
}
.name {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 30px;
  font-weight: 400;
  color: #c9a84c;
  letter-spacing: 6px;
}
.role {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 4px;
  opacity: 0.9;
  margin-top: 6px;
}
</style>
</head>
<body>
<div class="photo">
  <img src="data:image/jpeg;base64,${jpegBase64}" />
</div>
<div class="bar">
  <svg width="130" height="90" viewBox="0 35 320 215" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f0d478"/>
        <stop offset="45%" style="stop-color:#c9a84c"/>
        <stop offset="100%" style="stop-color:#9a7228"/>
      </linearGradient>
    </defs>
    <text x="105" y="147" text-anchor="middle"
      font-family="Georgia, serif" font-size="106" font-style="italic" font-weight="300"
      fill="#b0b0b0">N</text>
    <text x="221" y="244" text-anchor="middle"
      font-family="Georgia, serif" font-size="106" font-style="italic" font-weight="300"
      fill="#b0b0b0">M</text>
    <text x="160" y="200" text-anchor="middle"
      font-family="Georgia, serif" font-size="132" font-style="italic" font-weight="700"
      fill="url(#g)">M</text>
  </svg>
  <div class="separator"></div>
  <div class="name">NIK MATHEWS</div>
  <div class="role">SINGER &amp; GUITARIST</div>
</div>
</body>
</html>`;

  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, 'public/images/nmm-requests-og.png') });

  await browser.close();
  console.log('Requests OG generated');
})();
