---
title: Security and Airtable
description: Airtable offers a secure platform for managing and collaborating on data. Airproxy adds an additional layer of security for serving data directly to clients.
published: 2022-12-12T09:00:00+11:00
tags:
  - Secure data on Airtable
  - Control access to data
  - Encryption at rest
  - SSL encryption
  - Roles and SSO
  - Airproxy for serving data to clients
  - Per-base API keys
  - Secure data in transit
  - Protect sensitive information
images:
  - https://images.unsplash.com/photo-1480843669328-3f7e37d196ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80
next:
  slug: airtable-as-a-backend
  title: Airtable as as Backend
  description: Whether Airtable is a suitable backend for your website depends on a number of factors, including your website, your budget, and your technical capabilities.
  image: https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c2NhbGVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=700&q=60
---

Are you concerned about the security of your data on Airtable? As more and more businesses turn to online platforms to manage their data and collaborate with their teams, security has become a top concern. Fortunately, operating on the Airtable platform itself is very secure.

Airtable offers a number of features to help you protect your data and control who has access to it. For example, you can restrict editing of certain columns to specific roles, ensuring that only authorized users can make changes to sensitive information. Additionally, Airtable supports single sign-on (SSO) through popular identity providers like Google and Microsoft, allowing you to easily manage and control access to your Airtable account for your business users.

Another security feature of Airtable is its encryption at rest. This means that your data is automatically encrypted when it is stored on Airtable's servers, ensuring that it is protected from unauthorized access. Airtable also uses secure sockets layer (SSL) technology to encrypt data in transit, so your information is protected when it is being transmitted between your device and Airtable's servers.

However, it's important to note that the Airtable API is not designed for serving your business data directly to your clients. While the Airtable API is powerful and flexible, it is not intended for use in production environments where you need to control access to your data and ensure its security.

That's where Airproxy comes in. Airproxy is a service that enables you to safely and securely serve your Airtable data to your clients, without compromising its security. With Airproxy, you can easily control access to your data by using per-base API keys, ensuring that only authorized users can access your information. Additionally, Airproxy uses SSL technology to encrypt data in transit, so your data is protected as it is being transmitted between your clients and Airproxy's servers.

In conclusion, Airtable is a secure platform for managing and collaborating on your data. With its encryption at rest, SSL encryption, and control over access to your data through roles and SSO, Airtable offers a high level of security for your information. However, if you need to serve your data directly to your clients, Airproxy offers an additional layer of security and control over access to your data. Give it a try and see how it can help you protect your information and maintain control over who has access to it.
