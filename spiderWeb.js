const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 目标网站 URL
const targetURL = 'https://bizhi.vercel.app'; // 替换为你要爬取的网站

// 下载图片的目录
const downloadDir = path.join(__dirname, 'spider_Images');

// 创建目录
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

(async () => {
  // 启动 Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 打开目标网站
  await page.goto(targetURL, { waitUntil: 'networkidle2' });

  // 提取图片 URL
  const imageUrls = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => img.src);
  });

  console.log(`找到 ${imageUrls.length} 张图片`);

  // 下载图片
  const downloadImage = async (url, filepath) => {
    const writer = fs.createWriteStream(filepath);
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  };

  for (const [index, url] of imageUrls.entries()) {
    const imagePath = path.join(downloadDir, `image-${index + 1}${path.extname(url)}`);
    try {
      await downloadImage(url, imagePath);
      console.log(`下载: ${url}`);
    } catch (error) {
      console.error(`下载失败: ${url} - ${error.message}`);
    }
  }

  // 关闭 Puppeteer
  await browser.close();
})();
