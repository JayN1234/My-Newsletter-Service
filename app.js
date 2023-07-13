const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  // console.log(firstName, lastName, email);
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const JSONdata = JSON.stringify(data);
  const ListID = "982b831b33";
  const url = "https://us21.api.mailchimp.com/3.0/lists/" + ListID; // X=21 (from the API key generated)
  const options = {
    method: "POST",
    auth: "jayn25:06683468cb7620a3e9e76be2145db392-us21",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      //404
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(JSONdata);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

// for being compatible with heroku's server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server is running on ${port}.`);
});

// API Key
// 06683468cb7620a3e9e76be2145db392-us21

// Audience (List) ID
// 982b831b33
