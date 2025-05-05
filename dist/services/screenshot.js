import { chromium } from "playwright";
export class ScreenshotService {
    async capture(url) {
        // Add https:// if protocol is missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        const browser = await chromium.launch();
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 } // Set a large viewport
        });
        const page = await context.newPage();
        try {
            // Navigate to the URL and wait for network to be idle
            await page.goto(url, { waitUntil: "networkidle" });
            // Wait longer for dynamic content
            await page.waitForTimeout(5000);
            // Find the hero section and calculate dimensions
            const dimensions = await page.evaluate(() => {
                // Try the most common hero section selectors
                const selectors = [
                    '.hero',
                    'header',
                    'main',
                    '.main-content',
                    '.hero-section',
                    '.hero-area',
                    '.banner',
                    '.header'
                ];
                let element = null;
                for (const selector of selectors) {
                    element = document.querySelector(selector);
                    if (element) {
                        console.log('Found element with selector:', selector);
                        break;
                    }
                }
                // If no element found, use the body
                if (!element) {
                    console.log('No hero element found, using body');
                    element = document.body;
                }
                const rect = element.getBoundingClientRect();
                console.log('Element dimensions:', {
                    top: rect.top,
                    height: rect.height,
                    scrollHeight: element.scrollHeight,
                    clientHeight: element.clientHeight
                });
                // Use the maximum of the different height measurements
                const height = Math.max(rect.height, element.scrollHeight, element.clientHeight, 800 // Minimum height
                );
                return {
                    x: 0,
                    y: 0,
                    width: document.documentElement.clientWidth,
                    height: height
                };
            });
            console.log('Screenshot dimensions:', dimensions);
            // Scroll to the top to ensure we're capturing from the beginning
            await page.evaluate(() => window.scrollTo(0, 0));
            // Take the screenshot
            const screenshot = await page.screenshot({
                clip: dimensions,
                fullPage: false
            });
            return screenshot;
        }
        finally {
            await browser.close();
        }
    }
}
