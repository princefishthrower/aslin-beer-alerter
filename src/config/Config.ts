export const config = {
  cronRegex: "0 * * * *",
  URL: "https://www.aslinbeer.com/online-ordering/Alexandria-Curbside-Pickup-c48248472",
  beerTitleSelector: "grid-product__title-inner",
  searchBeer: "juan de bolas",
  fromEmail: "hi@fullstackcraft.com",
  toEmail: "frewin.christopher@gmail.com",
  mailjetAPIKeyPublic: process.env.MJ_APIKEY_PUBLIC || "",
  mailjetAPIKeyPrivate: process.env.MJ_APIKEY_PRIVATE || "",
  mailjetTemplateID: 2151280,
};
