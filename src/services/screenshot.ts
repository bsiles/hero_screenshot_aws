import { chromium } from "playwright";

export class ScreenshotService {
  async capture(url: string): Promise<Buffer> {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Navigate to the URL
      await page.goto(url, { waitUntil: "networkidle" });
      
      // Wait for dynamic content
      await page.waitForTimeout(2000);

      // Find the hero section and calculate dimensions
      const dimensions = await page.evaluate(() => {
        const hero = document.querySelector('header') || document.querySelector('.hero') || document.querySelector('main');
        if (!hero) return null;

        const rect = hero.getBoundingClientRect();
        return {
          x: 0,
          y: rect.top + window.scrollY,
          width: document.documentElement.clientWidth,
          height: rect.height
        };
      });

      if (!dimensions) {
        throw new Error('Could not find hero section');
      }

      // Take the screenshot
      const screenshot = await page.screenshot({
        clip: dimensions
      });

      return screenshot;
    } finally {
      await browser.close();
    }
  }
}