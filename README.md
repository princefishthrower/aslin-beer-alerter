# Aslin Beer Alerter!

Update August 7th, 2021: the functionality implemented in this project currently wont' work, since all of Aslin's ordering sites are down 🤷‍♂️

to be continued...

This repository contains a Puppeteer based scraper which visits Aslin Beer Co.'s Alexandria Location's website and find all titles of the products listed. If the desired title regex matches any of the product titles, (currently `juan de bolas`), it will send out an email alert via Mailjet!

# Installation

Install npm packages:

```bash
npm install
```

Run the service in development mode (runs once):

```bash
npm run dev
```

Run the service in production mode (runs continuously on cron):

```bash
npm run start
```

# Customization

Note you will need your own Mailjet credentials or your own email service to fully utilize the email alert fuctionality. To do that check the values of the following in `Config.ts`:

- `fromEmail` 
- `toEmail` 
- `mailjetAPIKeyPublic`
- `mailjetAPIKeyPrivate`
- `mailjetTemplateID`

Currently, `mailjetAPIKeyPublic` and `mailjetAPIKeyPrivate` receive values from environment variables.

Enjoy and cheers! :beer: