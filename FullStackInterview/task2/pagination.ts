import puppeteer from 'puppeteer';

export class PaginationHandler {
  static async handlePagination(
    page: puppeteer.Page,
    maxPages: number,
    nextButtonSelector: string
  ) {
    let currentPage = 1;
    const collectedData: any[] = [];

    while (currentPage <= maxPages) {
      // 提取当前页数据
      const pageData = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.article')).map(el => ({
          title: el.querySelector('h2')?.textContent,
          content: el.querySelector('.content')?.textContent
        }));
      });

      collectedData.push(...pageData);

      try {
        await page.waitForSelector(nextButtonSelector, { timeout: 10000 });
        await page.click(nextButtonSelector);
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        currentPage++;
      } catch (error) {
        console.log('Pagination ended or error occurred:', error);
        break;
      }
    }

    return collectedData;
  }

  static async handleInfiniteScroll(page: puppeteer.Page) {
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxAttempts = 10;

    while (scrollAttempts < maxAttempts) {
      const currentHeight = await page.evaluate('document.body.scrollHeight');
      if (currentHeight === previousHeight) break;

      previousHeight = currentHeight;
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForTimeout(3000); // 等待新内容加载
      scrollAttempts++;
    }

    return page.evaluate(() => {
      return Array.from(document.querySelectorAll('.post')).map(post => ({
        title: post.querySelector('h3')?.textContent,
        excerpt: post.querySelector('.excerpt')?.textContent
      }));
    });
  }
}
