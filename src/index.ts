import cron from "node-cron";
import { config } from "./config/Config";
import AslinCrawlerService from "./services/AslinCrawlerService";

const mailjet = require("node-mailjet").connect(
  config.mailjetAPIKeyPublic,
  config.mailjetAPIKeyPrivate
);

const aslinCrawlerService = new AslinCrawlerService(config, mailjet);

if (process.env.NODE_ENV === "development") {
  aslinCrawlerService.run();
} else {
  // production behavior: run according to cron value in config
  cron.schedule(config.cronRegex, () => {
    aslinCrawlerService.run();
  });
}
