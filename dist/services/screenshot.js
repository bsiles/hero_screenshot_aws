import { chromium } from "playwright";
export async function takeScreenshot(url, outPath) {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.screenshot({ path: outPath, fullPage: true });
    await browser.close();
}
