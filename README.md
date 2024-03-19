<div align="center">
  <img src="https://yt3.googleusercontent.com/h07KGOH0L0GQgzQdDsPRKoyV6bD1koDcK1DOYmGXxTSQPe27gXLIL95CEMU8008Fdd7_8f_j-Ic=s900-c-k-c0x00ffffff-no-rj" alt="Split IO Police Logo" width="200px">
</div>

# Split IO Police

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/temitopeog/feature-flag-debt-manager/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/temitopeog/feature-flag-debt-manager?style=social)](https://github.com/temitopeog/feature-flag-debt-manager/stargazers)


Manage your feature flag debt effortlessly with Split IO Police!

## Overview
Split IO Police is a powerful tool designed to help development teams effectively manage their technical debt related to feature flags. By providing insights and integrations to enforce automated flag cleanup, ensuring a smooth development workflow.
- **Split base url:** https://api.split.io/internal/api/v2
- **Split admin api url:** https://docs.split.io/reference/introduction


## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Slack](#slack)
- [Teams](#teams)
- [Contact](#contact)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Get a list of feature flags per workspace:** - filter based on tags, groups and flags days activity.
- **Configure Slack / Teams:** based on Split's feature flags tags and groups.
- **Send notifications:** to Slack / Teams based on feature flags that needs to be cleaned up.
- **Add developer information:** to the notification sent to Slack / Teams.
- **Insights Dashboard:** Gain valuable insights into your feature flag usage and debt.
- **Customizable Reports:** Generate detailed reports tailored to your team's needs.
- **Integration Ready:** Seamlessly integrate with your existing Slacks/Teams channels and development notifications.
- **User-Friendly Interface:** Intuitive UI designed for ease of use and navigation.

## Requirements

- Angular 
- NodeJS
- Slack OAuth token (Bot User OAuth Token) for your slack workspace with the right ACL.
- Teams incoming webhook url for the corresponding Teams channel
- Split Admin API Key

## Installation

To get started with Split IO Police, follow these simple steps:

1. Clone this repository: `git clone https://github.com/temitopeog/feature-flag-debt-manager.git`
2. Install dependencies: `npm install`
3. Configure your angular settings: Modify/create the `environments/environment.ts` file to suit your environment with the `apiUrl` pointing to the NodeJS server.
4. Configure `.env` file to contain `splitAdminApikey`, `splitBaseUrl`, `teamsWebhookUrl` & `teamsHostName` & if you are using slack, `slackBaseUrl`, `slackAccessToken`
5. Start the angular app: `npm start`
6. Configure your server settings: Modify the `flag-debt-server/.env` file to suit your environment.
7. Install & Start the server application:  `npm install` & `npm start`
8. Start the server app, default is  `http://localhost:3000` & navigate to angular application

## Slack
- **Slack base URL:** https://slack.com/api/chat.postMessage
To get a Slack access token for sending messages to a Slack channel, you'll need to follow these steps:

1. Create a Slack App:
Go to the Slack API website: https://api.slack.com/apps.
Click on the "Create New App" button.
Enter a name for your app and select the workspace you want to deploy it to.

2. Configure Permissions:
In your app settings, navigate to "OAuth & Permissions" in the left sidebar.
Under "Scopes", add the necessary scopes required for your app. For sending messages, you'll need at least the chat:write scope.
Click on the "Save Changes" button.

3. Install the App to your Workspace:
Still in the "OAuth & Permissions" section, click on the "Install App to Workspace" button.
Authorize the app to access your workspace by clicking on the "Allow" button.
After authorization, you'll be redirected to a page where you'll find your OAuth Access Token. This token is what you'll use to authenticate requests to the Slack API.

4. Use the Access Token:
With the access token obtained in the previous step, you can now make requests to the Slack API on behalf of your app.
When sending messages, include this access token in the request header or as a parameter depending on the method you're using to interact with the API.

5. Test Your Integration:
Before deploying your app, it's a good practice to test your integration to ensure everything is working as expected.
Send a test message to your desired Slack channel using your app's access token.

6. Deploy Your App:
Once you've tested your integration and everything is working fine, you can deploy your app to your production environment.

## Teams
First, create a webhook in your Microsoft Teams channel by following these steps:

1. In your Teams channel, click on the ellipsis (...) next to the channel name and select "Connectors".
2. Search for "Incoming Webhook" and click on it.
3. Click on "Add" to add the webhook to your channel.
4. Customize the name and profile picture of the webhook, and click "Create".
5. Copy the webhook URL provided.
6. **VERY IMPORTANT** - Remove protocol from the hostname: When specifying the hostname in your request options, remove the protocol (https://) and only include the hostname (hooks.microsoft.com). The https module automatically uses HTTPS protocol.


## Contact
**Temi:** temitope.ogunrekun@split.io
