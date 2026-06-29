import { chromium } from 'playwright';

const OUT = '/opt/cursor/artifacts/screenshots';
const URL = process.env.DEMO_URL || 'http://localhost:4173';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/demo-01-live.png`, fullPage: true });
  console.log('demo-01-live.png');

  await page.click('button:has-text("Schedule")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/demo-02-schedule.png`, fullPage: true });
  console.log('demo-02-schedule.png');

  await page.click('button:has-text("Groups")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/demo-03-groups.png`, fullPage: true });
  console.log('demo-03-groups.png');

  await page.click('button:has-text("Bracket")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/demo-04-bracket.png`, fullPage: true });
  console.log('demo-04-bracket.png');

  await page.click('button:has-text("Simulator")');
  await page.waitForTimeout(500);
  const slots = page.locator('.bracket-slot.clickable');
  for (let i = 0; i < Math.min(await slots.count(), 6); i++) {
    await slots.nth(i).click();
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/demo-05-simulator.png`, fullPage: true });
  console.log('demo-05-simulator.png');

  await browser.close();
}

main().catch(console.error);
