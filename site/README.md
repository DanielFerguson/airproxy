# To do...

## Now

- [ ] Get request data from database and chart them
- [ ] Add ability to share/copy api route for base->table->view

- [ ] Setup stripe locally
- [ ] Create Stripe subscription product and prices
- [ ] Setup checkout link
- [ ] Create callback function for stripe
- [ ] Create subscriptions table

- [ ] Add rate limiter

- [ ] Create home page

## Later

- [ ] Move from keys to OAuth https://airtable.com/developers/web/api/authentication#types-of-token
- [ ] Deep data fetching (fetching of linked data on tables - like CK Sports and what we do with Formatter) (hobbyist)
- [ ] Schema viewer; get a view of the fields for a particular api endpoint (like OpenAPI schema, but for airtable tables)
  - register to get an update via slack, email, etc. when a schema changes
  - generate fake data for frontend devs so you can mock up uis without needing real data (business)
- [ ] Chart request time
- [ ] Chart egress p/h
- [ ] Chart egress p/base and p/table
- [ ] Show threshold level for req p/m on chart or in stats like PlanetScale (see if you're going to cap out)?
- [ ] Add Google, Github, Facebook SSO
- [ ] Mobile responsiveness
- [ ] Add ability to delete account, wipe data from database
- [ ] Dark mode
- [ ] API keys (ap to client, not airtable to ap) (business)
  - create, regenerate (and read), update and delete api keys
  - protect everything, base, table, view with api key
- [ ] Ability to set public or private status for bases and tables, whether they need an api key (hobbyist)
- [ ] Teams (kind of like Forge Circles) (business)
  - share airtable keys, api keys, bases, tables with teams,
  - permissions like others can toggle active status, create keys, delete keys, update view
- [ ] Custom domains for API routes (business)
- [ ] Webhooks (business)
  - deliver updates from api to clients via webhooks (definitely a business feature)
- [ ] Notify client (SMS, Email, Discord, Slack) if there was an issue with fetching their table data (all, SMS business)
- [ ] Add the ability for the API to fetch multiple pages (w/ Airtable offset) (hobbyist)
- [ ] Will need to set some sort of `fetching` flag somewhere on the API so multiple simultaneous request wont timeout Airtable's API
- [ ] Add ability to pass optional viewId to API
  - if none found, use the default
  - if found, check that its active status in the DB

## Done

- [ ] Ability to adjust TTL for bases, and per table (time selector, 1m, 5m, 10m, 15m, 30m, 1h, 4h, 12h, 1d, 1w, 1m, 1y)
- [ ] Implement API

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
