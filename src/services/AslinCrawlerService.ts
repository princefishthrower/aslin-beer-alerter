import puppeteer from "puppeteer";
const mailjet = require("node-mailjet").connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
export default class AslinCrawlerService {
  public async run() {
    (async () => {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--disable-web-security",
          "--disable-features=IsolateOrigins,site-per-process",
        ],
      });
      const page = await browser.newPage();
      await page.goto(
        "https://www.aslinbeer.com/online-ordering/Alexandria-Curbside-Pickup-c48248472"
      );

      await this.delay(5000);
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      await page.waitForSelector("iframe");
      const elementHandle = await page.$("iframe");
      if (elementHandle) {
        const frame = await elementHandle.contentFrame();
        if (frame) {
          const beerTitles = await frame.evaluate(() => {
            let test: Array<string> = [];
            let elements = Array.from(
              document.getElementsByClassName("grid-product__title-inner")
            );
            for (let element of elements) {
              element.textContent && test.push(element.textContent);
            }
            return test;
          });

          if (beerTitles.length === 0) {
            throw new Error(
              "No beer titles found. This is likely an error with how the Puppeteer scraper is implemented."
            );
          } else {
            console.log(beerTitles)
            const regex = /juan de bolas/gim;
            if (beerTitles.some((e) => regex.test(e))) {
              this.sendEmail();
            } else {
              console.log("Ouch, Juan De Bolas wasn't found in the list of beer titles!");
            }
          }
        }
      }

      await browser.close();
    })();
  }

  private delay(time: number) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  private sendEmail() {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "hi@fullstackcraft.com",
            Name: "Aslin Beer Detected",
          },
          To: [
            {
              Email: "frewin.christopher@gmail.com",
              Name: "Chris",
            },
          ],
          TemplateID: 2151280,
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
