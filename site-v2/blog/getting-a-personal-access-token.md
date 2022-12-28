---
title: Getting a Personal Access Token
description: Are you looking to integrate your Airtable data into other applications or services? We're going to show you how, using the new Personal Access Tokens.
published: 2022-12-04T09:00:00+11:00
tags:
  - api
  - airtable
  - access
  - token
  - personal
  - generate
images:
  - https://images.unsplash.com/photo-1623282033815-40b05d96c903?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80
next:
  slug: security-and-airtable
  title: Security and Airtable
  description: Airtable offers a secure platform for managing and collaborating on data. Airproxy adds an additional layer of security for serving data directly to clients.
  image: https://images.unsplash.com/photo-1480843669328-3f7e37d196ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80
---

Are you looking to integrate your Airtable account with other applications or services? One of the first steps in doing so is to generate a personal access token.

Here is a step-by-step guide on how to get a personal access token on Airtable:

1. Log into your Airtable account and click on your profile avatar in the top right corner. From the dropdown menu, select "Account".
2. Scroll down until you see the "API" section and click on the 'Try it now' link.
3. Next, click 'Create Token'. You will be prompted to enter a name for your API key. This is simply a label that will help you identify this key in the future.
4. Add the appropriate scopes - we recommend only giving the key access to the scopes that are absolutely necessary. For Airproxy, these are `data.records:read` and `schema.bases:read`.
5. Then, add the bases that you want the key to have access too. For Airproxy, we recommend you select `All current and future bases in all current and future workspaces` so that we can register all of your bases, and any you create in the future. Don't worry though, you have total control over what's made public on your [Airproxy Dashboard](https://www.airproxy.app/app).
6. Finally, click 'Create token'.

Your personal access token will be displayed on the screen. Copy this token and save it in a secure location.

To use your personal access token, you will need to provide it as a parameter when making requests to the Airtable API.

It is important to note that your personal access token grants access to all of the bases and tables that you gave it access to in step 5. Be sure to keep it secure and only share it with trusted individuals or services.

In addition, you can always revoke a personal access token by going back to the "API" section in your Airtable account settings and clicking on the "Revoke" button next to the key you want to revoke.

By following these steps, you can easily generate a personal access token on Airtable and take the first step towards integrating your Airtable account with other applications or services.
