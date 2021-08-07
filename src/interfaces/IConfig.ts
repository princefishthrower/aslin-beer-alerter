export default interface IConfig {
  cronRegex: string;
  URL: string;
  beerTitleSelector: string;
  searchBeer: string;
  fromEmail: string;
  toEmail: string;
  mailjetAPIKeyPublic: string;
  mailjetAPIKeyPrivate: string;
  mailjetTemplateID: number;
}
