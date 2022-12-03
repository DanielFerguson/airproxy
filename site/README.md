# To do...

## Now

- [ ] Setup sitemap generator
- [ ] Create callback function for stripe
- [ ] Create subscriptions table
- [ ] Add the ability to reimport Airtable bases and tables
- [ ] Setup requests visualiser on the home page (random generate api on api for now)
- [ ] Setup blog index page (w/ seo metatags, via Airtable)
- [ ] Setup blog detail page (w/ seo metatags, via Airtable)

<!-- API -->

- [ ] Protect API routes if Base has API key
- [ ] Will need to set some sort of `fetching` flag somewhere on the API so multiple simultaneous request wont timeout Airtable's API
- [ ] Add rate limiter
- [ ] Add ability to pass optional viewId to API
- [ ] Add the ability for the API to fetch multiple pages (w/ Airtable offset) (hobbyist)
- [ ] Automate the process to reimport Airtable bases and tables on a cron job

<!-- App -->

- [ ] Fix how last chart value changes (gets lower over time) on the bar chart
- [ ] Add ability to delete account, wipe data from database

<!-- Final things -->

- [ ] Mobile responsiveness
- [ ] Review the onboarding process

<!-- Blog topics -->

- how to get airtable api key
- how to use airtable api
- where to find airtable api key
- how to find airtable api key
- how to get all records airtable api
- how to use api to import into airtable
- how fast is airtable api for app backend
- how to use api airtable curl on wordpres
- how to use airtable url api with express scripts
- how to upload file to airtable from api
- how to create multiple records airtable api
- how to use airtable as a project management tool

<!-- Keyword-based articles -->

- what is airtable
- airtable pricing (compare pricing/flexibility to other CMS strategies)
- airtable formulas, airtable formula (examples, list gist list from logsnag)
- airtable template, airtable templates (examples for CRMs, CMSs, team workflows, etc)
- airtable automations
- is airtable down
- airtable webhook
- airtable sync

## Later

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

# Pricing

- Free
  - 1 active base at a time
  - 1 active table at a time
  - 50k req p/m
- Hobby ($29 p/m)
  - 3 active bases at a time
  - 10 active tables at a time
  - 200k req p/m
  - API to bust cache manually (custom cache busting)
- Business ($99 p/m)
  - Data pre-fetching and pre-caching
  - 1m req p/m
  - Ability to set cron timeout for data
  - Strongly consistent reads (needs to use R2 over KV)
  - Protect bases with API keys
