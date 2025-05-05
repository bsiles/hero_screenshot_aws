import { chromium } from "playwright";

export async function takeScreenshot(url: string, outPath: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(url, { waitUntil: "networkidle" });
  
  // Wait a bit for any dynamic content to load
  await page.waitForTimeout(1000);

  // Use JavaScript to find the hero section
  const dimensions = await page.evaluate(() => {
    // Find the hero section
    const hero = document.querySelector('section.bg-dark, section[class*="hero"], section:first-of-type');
    if (!hero) return null;

    const heroRect = hero.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    return {
      x: 0, // Start from the left edge
      y: scrollY + heroRect.top, // Account for scroll position
      width: document.documentElement.clientWidth, // Full width
      height: heroRect.height // Just the hero height
    };
  });

  if (dimensions) {
    await page.screenshot({
      path: outPath,
      clip: {
        x: dimensions.x,
        y: dimensions.y,
        width: dimensions.width,
        height: dimensions.height
      }
    });
  } else {
    // Fallback: full page screenshot
    await page.screenshot({ path: outPath, fullPage: true });
  }

  await browser.close();
}