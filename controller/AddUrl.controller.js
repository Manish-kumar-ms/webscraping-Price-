// import { Price } from "../model/Price.model";
import { scrapePrice } from "../config/puppeteer.js";
import { Price } from "../model/Price.model.js";
import { Product } from "../model/Product.model.js";

export const AddUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Url is required" });
    }

    const existingProduct = await Product.findOne({ url });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const newProduct = await Product.create({ url });

    return res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Core scraping logic

export const runScraper = async () => {
  try {
    const targets = await Product.find();
    if (!targets.length)
      return console.error("No targets found");

    const results = [];

    // Define selectors per site
    const siteSelectors = {
      "amazon.in": {
        type: "amazon",
        symbolSelector: ".a-price-symbol",
        numberSelector: ".a-price-whole",
      },
      "flipkart.com": {
        type: "flipkart",
        selector: ".Nx9bqj.CxhGGd",
      },
    };

    for (const target of targets) {
      let siteConfig;

      // Find selector based on URL hostname
      for (const site in siteSelectors) {
        if (target.url.includes(site)) {
          siteConfig = siteSelectors[site];
          break;
        }
      }

      if (!siteConfig) {
        results.push({
          url: target.url,
          error: "No selector configured for this site",
        });
        continue;
      }

      const data = await scrapePrice(target.url, siteConfig);

      if (data) {
        // Save to MongoDB
        const priceEntry = new Price({
          ProductId: target._id,
          price: data.price,
          currency: data.currency,
        });
 
        await priceEntry.save();

        // Keep only the latest 10 entries per product
        const allPrices = await Price.find({ ProductId: target._id })
          .sort({ timestamp: -1 }) // newest first
          .skip(10); // skip the 10 newest, get the older ones

        if (allPrices.length > 0) {
          const idsToDelete = allPrices.map((p) => p._id);
          await Price.deleteMany({ _id: { $in: idsToDelete } });
          console.log(
            ` Cleaned old price data for Product ${target._id} (${idsToDelete.length} old entries removed)`
          );
        }

        results.push({ url: target.url, ...data });
      } else {
        results.push({ url: target.url, error: "Failed to scrape" });
      }
    }

   console.log(` Scraping completed for ${results.length} products.`);
    return results;
  } catch (err) {
    console.error("Error in runScraper:", err);
  }
};


export const scrapeNow = async (req, res) => {
  try {
    const results = await runScraper();
     return res.status(200).json({
      message: "Scrape completed successfully",
      results,
    });
    
  } catch (error) {
    console.error("Error in scrapeNow:", error);
    return res.status(500).json({ message: "Internal server error while scraping" });
  }
}





export const getPrices = async (req, res) => {
  try {
    const { url } = req.query;

    const product = await Product.findOne({ url });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch last 10 prices
    const prices = await Price.find({ ProductId: product._id })
      .sort({ timestamp: -1 })
      .limit(10);

    if (prices.length == 0) {
      return res
        .status(404)
        .json({ message: "No prices found for this product" });
    }

    return res.status(200).json({ product: product.url, prices });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error in getPrices" });
  }
};
