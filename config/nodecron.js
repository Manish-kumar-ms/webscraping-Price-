import cron from "node-cron";
import { runScraper } from "../controller/AddUrl.controller.js"; 

// Run every hour (at minute 0)
export const startPriceCron = () => {
  cron.schedule("0 * * * *", async () => {
    console.log(" Running hourly price fetch job at:", new Date().toLocaleString());

    try {
      await runScraper(); // call your scraping logic
      console.log("Price data fetched successfully!");
    } catch (error) {
      console.error("Error running hourly scrape:", error.message);
    }
  });
};
