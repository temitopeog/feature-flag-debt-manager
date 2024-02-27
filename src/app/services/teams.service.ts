import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class TeamsService {

  // use the below for sending msg to a Teams channel
  private webhookUrl = 'YOUR_TEAMS_WEBHOOK_URL';

  // use the below for sending msgs to somebody on the Teams channel
  private graphApiUrl = 'https://graph.microsoft.com/v1.0';
  private accessToken = 'YOUR_ACCESS_TOKEN';

  constructor(private http: HttpClient) {}

  // use the below for sending msg to a Teams channel
  sendTeamsChannelMessage(message: string): Observable<any> {
    const payload = {
      text: message
    };

    const headers = {
      'Content-Type': 'application/json'
    };

    return this.http.post(this.webhookUrl, payload, { headers: headers });
  }

  // use the below for sending msgs to somebody on the Teams channel
  sendOneUserMessage(recipientId: string, message: string): Observable<any> {
    const payload = {
      message: {
        subject: 'New Message',
        body: {
          contentType: 'Text',
          content: message
        },
        toRecipients: [
          {
            emailAddress: {
              address: recipientId
            }
          }
        ]
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken}`
    });

    return this.http.post(`${this.graphApiUrl}/users/me/messages`, payload, { headers: headers });
  }
}

// FROM OUR FRIENDS @ CHATGPT3.5 WITH LOVE

// use the below for sending msg to a Teams channel
// Set Up an Incoming Webhook Connector in Microsoft Teams:

// Go to the channel where you want to post messages.
// Click on the ellipsis (...) next to the channel name and select "Connectors".
// Search for "Incoming Webhook" and add it.
// Follow the prompts to configure the connector, such as providing a name and an optional profile picture for the webhook.
// Get the Webhook URL:

// After configuring the webhook connector, you'll be provided with a unique URL. This URL is what you'll use in your Angular app to send messages to the Teams channel.
// Integrate the Webhook URL into Your Angular App:

// In your Angular app, you'll need to make HTTP POST requests to the webhook URL to send messages.
// You can use Angular's HttpClient module to send the POST requests.
// Construct the Message Payload:

// Construct a JSON payload containing the message you want to send to the Teams channel.
// This payload typically includes properties like text, title, summary, etc., depending on the message format you want to send.



// Use the below steps for sending msgs to somebody on the Teams channel
// Set Up Authentication:

// Register your application in the Azure Active Directory (Azure AD) portal and obtain an application ID and secret.
// Configure permissions for your application to access the Microsoft Graph API, including the necessary permissions to send messages to users in Microsoft Teams.
// Implement Authentication in Your Angular App:

// Use OAuth 2.0 authentication to obtain an access token for your application.
// This typically involves redirecting the user to the Microsoft identity platform login page, where they can authenticate and consent to the required permissions.
// Obtain User ID or User Principal Name (UPN):

// To send a message to a specific user, you'll need to know their user ID or user principal name (UPN).
// You can retrieve this information using Microsoft Graph API endpoints, such as /users or /me, depending on the context of your application.
// Construct the Message Payload:

// Construct a JSON payload containing the message you want to send.
// The payload typically includes properties such as subject, body, and toRecipients, which specify the recipient of the message.
