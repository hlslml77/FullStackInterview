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
});
