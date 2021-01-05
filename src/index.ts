import cron from "node-cron";
import AslinCrawlerService from "./services/AslinCrawlerService";

const aslinCrawlerService = new AslinCrawlerService();

if (process.env.NODE_ENV === "development") {
  aslinCrawlerService.run();
} else {
  // production behavior: run once every hour
  cron.schedule("0 * * * *", () => {
    aslinCrawlerService.run();
  });
}
