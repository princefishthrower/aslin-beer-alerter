import puppeteer from "puppeteer";
import IConfig from "../interfaces/IConfig";
import { delay } from "../utils/delay";

export default class AslinCrawlerService {
  private readonly config: IConfig;
  private readonly mailjet: any;

  constructor(config: IConfig, mailjet: any) {
    this.config = config;
    this.mailjet = mailjet;
  }

  public async run() {
    // establish browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });
    // navigate to Aslin page
    const page = await browser.newPage();
    await page.goto("https://www.aslinbeer.com/online-ordering/Alexandria-Curbside-Pickup-c48248472");
    await delay(5000);
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await page.waitForSelector("iframe");
    const elementHandle = await page.$("iframe");
    if (elementHandle) {
      const frame = await elementHandle.contentFrame();
      if (frame) {
        const beerTitles = await frame.evaluate(() => {
          const elements = Array.from(
            document.getElementsByClassName("grid-product__title-inner")
          );
          console.log(elements)
          // get all texts - only if textContent evals as truthy
          const texts = elements.filter((element) => element.textContent !== null).map(element => element.textContent || "");
          return texts;
        });

        if (beerTitles.length === 0) {
          throw new Error(
            "No beer titles found. This is likely an error with how the Puppeteer scraper is implemented."
          );
        } else {
          console.log(beerTitles);
          const regex = new RegExp(`/juan de bolas/`, "gim");
          if (beerTitles.some((e) => regex.test(e))) {
            // The function call here probably won't work because of 'this'
            this.sendEmail();
          } else {
            console.log(
              `Ouch, your query 'juan de bolas' wasn't found in the list of beer titles!`
            );
          }
        }
      }
    }
    // close browser
    await browser.close();
  }

  private sendEmail() {
    const request = this.mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: this.config.fromEmail,
            Name: "Aslin Beer Detected",
          },
          To: [
            {
              Email: this.config.toEmail,
              Name: "Chris",
            },
          ],
          TemplateID: this.config.mailjetTemplateID,
          TemplateLanguage: true,
          Subject: "Aslin Beer Detected!",
          Variables: {},
        },
      ],
    });
    request
      .then((result: { body: any }) => {
        console.log(result.body);
      })
      .catch((err: { statusCode: any }) => {
        console.log(err.statusCode);
      });
  }
}
