# To do...

## Today

- [ ] Create callback function for stripe
- [ ] Create subscriptions table
- [ ] Add the ability to reimport Airtable bases and tables
- [ ] Setup requests visualiser on the home page (random generate api on api for now)

## Tomorrow

<!-- API -->

- [ ] Protect API routes if Base has API key
- [ ] Add rate limiter
- [ ] Add ability to pass optional viewId to API
- [ ] Add ability to handle page? queries (how we can get around loading every page, just cache baseId:tableId:page1)

<!-- Final things -->

- [ ] Test mobile responsiveness
- [ ] Review the onboarding process
- [ ] Connect Sentry to Next JS deployment

## Sometime

- [ ] Launch to ProductHunt
- [ ] Advertise on TikTok

## Later

- [ ] Automate the process to reimport Airtable bases and tables on a cron job
- [ ] Fix how last chart value changes (gets lower over time) on the bar chart
- [ ] Add ability to delete account, wipe data from database
- [ ] Setup live demo page
- [ ] Chart request time
- [ ] Chart egress p/h
- [ ] Chart egress p/base and p/table
- [ ] Move from keys to OAuth https://airtable.com/developers/web/api/authentication#types-of-token
- [ ] Set allowed origins globally and per base
- [ ] Schema viewer; get a view of the fields for a particular api endpoint (like OpenAPI schema, but for airtable tables)

  - register to get an update via slack, email, etc. when a schema changes
  - generate fake data for frontend devs so you can mock up uis without needing real data (business)
  - Typescript type/interface generator

- [ ] [API] Notify client (SMS, Email, Discord, Slack) if there was an issue with fetching their table data (all, SMS business)
- [ ] Deep data fetching (fetching of linked data on tables - like CK Sports and what we do with Formatter) (hobbyist)
- [ ] Dark mode
- [ ] Teams (kind of like Forge Circles) (business)

  - share airtable keys, api keys, bases, tables with teams,
  - permissions like others can toggle active status, create keys, delete keys, update view

- [ ] Custom domains for API routes (business)
- [ ] Cache other APIs
- [ ] Webhooks (call it Live Updates) (business)

  - deliver updates from api to clients via webhooks (definitely a business feature)
