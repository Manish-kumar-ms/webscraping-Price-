import puppeteer from "puppeteer";


export const scrapePrice = async (url, options) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();


    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    let priceText;

    // If Amazon-style separate symbol & number
    if (options.type === "amazon") {
      const symbol = await page.$eval(options.symbolSelector, (el) => el.textContent.trim());
      const number = await page.$eval(options.numberSelector, (el) => el.textContent.trim());
      priceText = symbol + number; // combine into one string
    } else {
      // Flipkart-style: single element
      priceText = await page.$eval(options.selector, (el) => el.textContent.trim());
    }

    await browser.close();

    // Extract numeric price & currency
    const match = priceText.match(/([\₹\$\£])\s?([\d,]+)/);
    if (!match) return null;

    const currency = match[1];
    const price = parseFloat(match[2].replace(/,/g, ""));

    return { price, currency };
  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    return null;
  }
};
