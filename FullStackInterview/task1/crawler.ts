import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { IBlogConfig } from '../types';

// 代理池配置
const PROXY_POOL = [
  'http://user1:pass@proxy1.example.com:8080',
  'http://user2:pass@proxy2.example.com:8080',
  'http://user3:pass@proxy3.example.com:8080'
];

puppeteer.use(StealthPlugin());

export class AdvancedCrawler {
  private currentProxyIndex = 0;

  private getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private rotateProxy(): string {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % PROXY_POOL.length;
    return PROXY_POOL[this.currentProxyIndex];
  }

  async humanLikeInteraction(page: puppeteer.Page) {
    // 随机鼠标移动
    await page.mouse.move(
      Math.random() * 800,
      Math.random() * 600
    );
    
    // 模拟随机滚动
    await page.evaluate(() => {
      window.scrollBy({
        top: Math.random() * 1000,
        behavior: 'smooth'
      });
    });
    
    // 随机等待时间
    await page.waitForTimeout(this.getRandomDelay(2000, 5000));
  }

  async scrapeBlog(config: IBlogConfig) {
    const proxyUrl = this.rotateProxy();
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        `--proxy-server=${proxyUrl}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });
      
      // 设置随机User-Agent
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/' + 
        (Math.floor(Math.random() * 4) + 97) + 
        '.0.4692.99 Safari/537.36'
      );

      await page.goto(config.blogUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await this.humanLikeInteraction(page);

      // 执行页面特定抓取逻辑
      const articles = await page.evaluate((selectorConfig) => {
        const elements = Array.from(
          document.querySelectorAll(selectorConfig.articleSelector)
        );
        return elements.map(el => ({
          title: el.querySelector(selectorConfig.titleSelector)?.textContent?.trim(),
          url: el.querySelector(selectorConfig.linkSelector)?.href
        }));
      }, config.selectors);

      return articles.filter(article => article.url);

    } finally {
      await browser.close();
    }
  }
}
