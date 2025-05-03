import { AdvancedCrawler } from '../src/crawler/crawler';
import { PuppeteerEnvironment } from 'jest-environment-puppeteer';

describe('Advanced Crawler Test Suite', () => {
  let crawler: AdvancedCrawler;

  beforeAll(() => {
    crawler = new AdvancedCrawler();
  });

  test('Should successfully scrape Coinbase Blog', async () => {
    const mockConfig = {
      blogUrl: 'https://blog.coinbase.com',
      selectors: {
        articleSelector: '.post',
        titleSelector: 'h3',
        linkSelector: 'a.read-more'
      }
    };

    const results = await crawler.scrapeBlog(mockConfig);
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('url');
  });

  test('Should handle 404 errors gracefully', async () => {
    const invalidConfig = {
      blogUrl: 'https://invalid.blog.url',
      selectors: { /*...*/ }
    };

    await expect(crawler.scrapeBlog(invalidConfig))
      .rejects
      .toThrow('Navigation timeout');
  });

  // 选择器失效测试
test('Should detect selector changes', async () => {
  const outdatedConfig = {
    blogUrl: 'https://blog.coinbase.com',
    selectors: {
      articleSelector: '.obsolete-selector',
      // ...其他错误选择器
    }
  };

  await expect(crawler.scrapeBlog(outdatedConfig))
    .rejects
    .toThrow('Selector not found');
});

// 反爬机制处理测试
test('Should handle 403 Forbidden', async () => {
  const antiBotConfig = {
    blogUrl: 'https://website-with-anti-crawling.com',
    // ...
  };

  await expect(crawler.scrapeBlog(antiBotConfig))
    .rejects
    .toThrow('Access denied');
});
});
