const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const envVars = require("dotenv").config().parsed;

const splitAdminApikey = process.env.splitAdminApikey;
const slackToken=envVars.slackAccessToken

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const querystring = require("querystring");

// Microsoft Teams webhook URL
const teamsWebhookUrl = process.env.teamsWebhookUrl;
const teamsHostName = process.env.teamsHostName;

app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:4200" // allow CORS for 4200
})); // Add this line to enable CORS

app.post("/send-slack-notification", async (req, res) => {
  try {
    const { data, channel } = req.body;
    const postData = querystring.stringify({
      channel,
      "blocks": JSON.stringify(data)
    });

    const options = {
      method: "POST",
      hostname: "slack.com",
      path: "/api/chat.postMessage",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${slackToken}`
      }
    };

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        res.json(JSON.parse(data));
      });
    });

    request.on("error", (error) => {
      console.error(error);
      res.status(500).json({ error: error.message });
    });

    request.write(postData);
    request.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sample data to send to Microsoft Teams channel
const sampleData = JSON.stringify({
  "type": "MessageCard",
  "title": "Split IO Police 👮‍♂️",
  "summary": "Hello there! This is a reminder to clean up / manage your feature flags \n",
  "sections": [
    {
      "startGroup": true,
      "images": [
        {
          "image": "https://media.giphy.com/media/bAQH7WXKqtIBrPs7sR/giphy.gif?cid=ecf05e47mqcqd2dnhxb3vr4ahr0jrlqh5op7n3gh689znkei&ep=v1_gifs_search&rid=giphy.gif&ct=g",
          "title": "Giphy"
        }
      ]
    },
    {
      "startGroup": true,
      "title": "\n **Below is the list of flags that requires your immediate attention**",
      "text": "- Line 1\n  - First bullet point\n- Line 2\n  - Second bullet point"
    },
    {
      "startGroup": true,
      "activityImage": "https://example.com/image.png",
      "activityTitle": "Additional Information",
      "facts": [
        {
          "name": "Key 1",
          "value": "Value 1"
        },
        {
          "name": "Key 2",
          "value": "Value 2"
        }
      ]
    }
  ]
});
// Route to send sample data to Microsoft Teams channel
app.post('/send-teams-notification', async (req, res) => {
  try {
    const { channel, text } = req.body;
    console.log('channel', channel);
    console.log('text', text);
    // Set request options
    const options = {
      hostname: `${teamsHostName}`, // make sure it's without the protocol (https://)
      path: `/${teamsWebhookUrl}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(sampleData)
      }
    };

    // Send request to Microsoft Teams webhook
    const request = https.request(options, (response) => {
      console.log(`Status code: ${response.statusCode}`);

      response.on('data', (data) => {
        console.log('Response:', data.toString());
      });

      response.on('end', () => {
        res.send('Sample data sent to Teams channel successfully.');
      });
    });

    request.on('error', (error) => {
      console.error('Error sending data to Teams channel:', error);
      res.status(500).send('Internal Server Error');
    });

    request.write(sampleData);
    request.end();
  } catch (error) {
    console.error('Error sending data to Teams channel:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/workspaces", (req, outRes) => {
  var options = {
    method: "GET",
    hostname: "api.split.io",
    path: "/internal/api/v2/workspaces",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${splitAdminApikey}`,
    },
    maxRedirects: 20,
  };
  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      var response = JSON.parse(body.toString());

      outRes.send(response);
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });
  req.end();
});


app.get("/list-feature-flags", (req, outRes) => {
  let workspaceId =  req.query.workspaceId;
  let offset = req.query.offset;
  var options = {
    method: "GET",
    hostname: "api.split.io",
    path: `/internal/api/v2/splits/ws/${workspaceId}?limit=20&offset=${offset}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${splitAdminApikey}`,
    },
    maxRedirects: 20,
  };

  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      var output = JSON.parse(body.toString())
      //console.log(output)
       outRes.send(output);
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });
  req.end();
});

app.get("/get-user", (req, outRes) => {
  let uid =  req.query.uid;
  var options = {
    method: "GET",
    hostname: "api.split.io",
    path: `/internal/api/v2/users/${uid}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${splitAdminApikey}`,
    },
    maxRedirects: 20,
  };

  var req = https.request(options, function (res) {
    var data;

    res.on("data", function (response) {
      data = response;
    });

    res.on("end", function (chunk) {
      var output = JSON.parse(data.toString())
       outRes.send(output);
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });
  req.end();
});

app.get("/get-group", (req, outRes) => {
  let uid =  req.query.uid;
  var options = {
    method: "GET",
    hostname: "api.split.io",
    path: `/internal/api/v2/groups/${uid}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${splitAdminApikey}`,
    },
    maxRedirects: 20,
  };

  var req = https.request(options, function (res) {
    var data;

    res.on("data", function (response) {
      data = response;
    });

    res.on("end", function (chunk) {
      var output = JSON.parse(data.toString())
       outRes.send(output);
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });
  req.end();
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
