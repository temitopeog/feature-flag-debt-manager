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

app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:4200" // allow CORS for 4200
})); // Add this line to enable CORS

const blocks = [
  {
      "type": "header",
      "text": {
          "type": "plain_text",
          "text": "Split IO Police"
      }
  },
  {
      "type": "context",
      "elements": [
          {
              "type": "mrkdwn",
              "text": "Hello there! This is a reminder to clean up / manage your feature flags"
          }
      ]
  },
  {
      "type": "section",
      "text": {
          "type": "mrkdwn",
          "text": ":wave:\n\n Below is the list of flags that requires your immediate attention."
      },
      "accessory": {
          "type": "image",
          "image_url": "https://media.giphy.com/media/bAQH7WXKqtIBrPs7sR/giphy.gif?cid=ecf05e47mqcqd2dnhxb3vr4ahr0jrlqh5op7n3gh689znkei&ep=v1_gifs_search&rid=giphy.gif&ct=g",
          "alt_text": ""
      }
  },
  {
      "type": "divider"
  },
  {
      "type": "rich_text",
      "elements": [
          {
              "type": "rich_text_section",
              "elements": [
                  {
                      "type": "emoji",
                      "name": "man"
                  },
                  {
                      "type": "text",
                      "text": " Engineer Name",
                      "style": {
                          "bold": true
                      }
                  }
              ]
          },
          {
              "type": "rich_text_list",
              "style": "bullet",
              "elements": [
                  {
                      "type": "rich_text_section",
                      "elements": [
                          {
                              "type": "text",
                              "text": "Flag name - blah blah"
                          }
                      ]
                  },
                  {
                      "type": "rich_text_section",
                      "elements": [
                          {
                              "type": "text",
                              "text": "Status is: "
                          },
                          {
                              "type": "link",
                              "text": "killed",
                              "url": "https://salesforcebenefits.com"
                          }
                      ]
                  },
                  {
                      "type": "rich_text_section",
                      "elements": [
                          {
                              "type": "text",
                              "text": "In status for: 100 days"
                          }
                      ]
                  }
              ]
          }
      ]
  },
  {
      "type": "divider"
  },
  {
      "type": "rich_text",
      "elements": [
          {
              "type": "rich_text_section",
              "elements": [
                  {
                      "type": "emoji",
                      "name": "man"
                  },
                  {
                      "type": "text",
                      "text": " Engineer Name",
                      "style": {
                          "bold": true
                      }
                  }
              ]
          },
          {
              "type": "rich_text_list",
              "style": "bullet",
              "elements": [
                  {
                      "type": "rich_text_section",
                      "elements": [
                          {
                              "type": "text",
                              "text": "Flag name - blah blah"
                          }
                      ]
                  },
                  {
                      "type": "rich_text_section",
                      "elements": [
                          {
                              "type": "text",
                              "text": "Status is: "
                          },
                          {
                              "type": "link",
                              "text": "100% released",
                              "url": "https://salesforcebenefits.com"
                          }
                      ]
                  },
                  {
                      "type": "rich_text_section",
                      "elements": [
                          {
                              "type": "text",
                              "text": "In status for: 100 days"
                          }
                      ]
                  }
              ]
          }
      ]
  },
  {
      "type": "divider"
  },
  {
      "type": "rich_text",
      "elements": [
          {
              "type": "rich_text_section",
              "elements": [
                  {
                      "type": "emoji",
                      "name": "man"
                  },
                  {
                      "type": "text",
                      "text": " Engineer Name",
                      "style": {
                          "bold": true
                      }
                  }
              ]
          },
          {
              "type": "rich_text_list",
              "style": "bullet",
              "elements": [
                  {
                      "type": "rich_text_section",
                      "elements": [
                          {
                              "type": "text",
                              "text": "Flag name - blah blah"
                          }
                      ]
                  },
                  {
                      "type": "rich_text_section",
                      "elements": [
                          {
                              "type": "text",
                              "text": "Status is: "
                          },
                          {
                              "type": "link",
                              "text": "ramping",
                              "url": "https://salesforcebenefits.com"
                          }
                      ]
                  },
                  {
                      "type": "rich_text_section",
                      "elements": [
                          {
                              "type": "text",
                              "text": "In status for: 100 days"
                          }
                      ]
                  }
              ]
          }
      ]
  },
  {
      "type": "divider"
  },
  {
      "type": "rich_text",
      "elements": [
          {
              "type": "rich_text_section",
              "elements": [
                  {
                      "type": "emoji",
                      "name": "speech_balloon"
                  },
                  {
                      "type": "text",
                      "text": " Inspirational quote of the day",
                      "style": {
                          "bold": true
                      }
                  }
              ]
          },
          {
              "type": "rich_text_quote",
              "elements": [
                  {
                      "type": "text",
                      "text": "Having no destination I am never lost. - Ikkyū."
                  }
              ]
          }
      ]
  }
];
app.post("/api/send-slack-notification", async (req, res) => {
  try {
    const { channel, text } = req.body;
    const postData = querystring.stringify({
      channel,
      "blocks": JSON.stringify(blocks)
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
