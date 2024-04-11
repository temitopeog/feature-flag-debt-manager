const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const envVars = require("dotenv").config().parsed;
const nodeRequest = require('request'); // or use fetch module

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

// API endpoint to send flags slack notifications to a configured channel
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

// API endpoint to send flags notification to Microsoft Teams channel
app.post('/send-teams-notification', async (req, res) => {
  try {
    const { data, channel } = req.body;
    console.log(JSON.stringify(data, undefined, 2));
    // Set request options
    const options = {
      hostname: `${teamsHostName}`, // make sure it's without the protocol (https://)
      path: `/${teamsWebhookUrl}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
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

    request.write(JSON.stringify(data));
    request.end();
  } catch (error) {
    console.error('Error sending data to Teams channel:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint to get all the Split workspaces
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

// API endpoint to get a list of Split feature flags per workspace
app.get("/list-feature-flags", (req, outRes) => {
  let workspaceId =  req.query.workspaceId;
  let offset = req.query.offset;
  var options = {
    method: "GET",
    hostname: "api.split.io",
    path: `/internal/api/v2/splits/ws/${workspaceId}?limit=50&offset=${offset}`,
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

// API endpoint to get user information per flags created
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

// API endpoint to get group information per flags created
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

// API endpoint to delete feature flag information
app.post("/delete-flag", (req, outRes) => {
  const { split_name, wid } = req.body;
  console.log("split_name", split_name);
  console.log("wid", wid)
  var options = {
    method: "DELETE",
    hostname: "api.split.io",
    path: `/internal/api/v2/splits/ws/${wid}/${split_name}`,
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

app.get("/envs", (req, outRes) => {
  let workspace =  req.query.workspace;
  console.log("workspace", workspace);
  var options = {
      method: "GET",
      hostname: "api.split.io",
      path: `/internal/api/v2/environments/ws/${workspace}`,
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

      outRes.send(response.map((env) => { return {'id': env.id, 'name': env.name}}));
      });

      res.on("error", function (error) {
      console.error(error);
      });
    });
    req.end();
  });

app.get("/splitDefs", (req, outRes) => {
  let workspace =  req.query.workspace;
  let offset =  req.query.offset;
  let env =  req.query.environment;
  var options = {
    method: "GET",
    hostname: "api.split.io",
    path: `/internal/api/v2/splits/ws/${workspace}/environments/${env}?offset=${offset}&limit=30`,
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
      var result = {};
      result.offset = output.offset;
      result.limit = output.limit;
      result.totalCount = output.totalCount
      result.flags = output.objects.map((split) => { return {'name': split.name,  'lastUpdateTime': calculateDiff(split.lastUpdateTime), 'lastTrafficReceivedAt': calculateDiff(split.lastTrafficReceivedAt), creator: "", group: "", tag: "", status: ""}});
      outRes.send(result);
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });
  req.end();
});

app.get("/updateFlag", (req, outRes) => {
  let workspace =  req.query.workspace;
  let split =  req.query.split;
  var options = {
    method: "GET",
    hostname: "api.split.io",
    path: `/internal/api/v2/splits/ws/${workspace}/${split}`,
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

    res.on("end", async function (chunk) {
      var output = JSON.parse(data.toString())
      var result = {};
      result.status = output?.rolloutStatus?.name;
      // if(output.owners && output.owners.length > 0){
        output.owners.forEach(async function (user, index) {
          if(user.type = "user"){
              // Call the second API endpoint with parameters
              await nodeRequest(`http://localhost:3000/get-user?uid=${user.id}`, (error, response, body) => {
                if (error) {
                  console.error(error);
                  response.status(500).send('Error occurred');
                } else {
                  result.owners = body.name;
                  result.email = body.email;
                  console.log('response response', body);
                  outRes.send(result);
                }
              });
          }
        })
        outRes.end();
        console.log('outRes outRes', result);
    });
    res.on("error", function (error) {
      console.error(error);
    });
  });
  req.end();
});

  // Convert EPOCH timestamp to local days/time format
 function calculateDiff(dateSent){
    // Convert the timestamp to a Date object
  const timestamp1 = dateSent; // Milliseconds since epoch
  const date1 = new Date(timestamp1);
  // Get the current date
  const currentDate = new Date();
  // Calculate the difference in milliseconds between the two dates
  const differenceInMilliseconds = currentDate.getTime() - date1.getTime();
  // Convert milliseconds to days
  const millisecondsInADay = 1000 * 60 * 60 * 24; // 1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  const differenceInDays = Math.floor(differenceInMilliseconds / millisecondsInADay);
  return differenceInDays;
  }

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
