import { chromium } from 'playwright';
import { mkdir, rename } from 'fs/promises';
import { readdir } from 'fs/promises';

const OUT = '/opt/cursor/artifacts';
const URL = 'http://localhost:5173';

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: `${OUT}/video-tmp`, size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll through live matches
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(1500);

  // Schedule
  await page.click('button:has-text("Schedule")');
  await page.waitForTimeout(2000);

  // Groups - scroll
  await page.click('button:has-text("Groups")');
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(1500);

  // Bracket simulator
  await page.click('button:has-text("Bracket")');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Simulator")');
  await page.waitForTimeout(1000);

  // Pick winners
  const slots = page.locator('.bracket-slot.clickable');
  const count = await slots.count();
  for (let i = 0; i < Math.min(count, 12); i++) {
    await slots.nth(i).click();
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(2000);

  // Scroll bracket
  await page.evaluate(() => {
    const el = document.querySelector('.bracket-container');
    if (el) el.scrollLeft = 200;
  });
  await page.waitForTimeout(1500);

  // Back to live
  await page.click('button:has-text("Live")');
  await page.waitForTimeout(2000);

  await context.close();
  await browser.close();

  // Move video file
  const files = await readdir(`${OUT}/video-tmp`);
  const webm = files.find(f => f.endsWith('.webm'));
  if (webm) {
    await rename(`${OUT}/video-tmp/${webm}`, `${OUT}/world-cup-demo.webm`);
    console.log('Saved world-cup-demo.webm');
  }
}

main().catch(console.error);
