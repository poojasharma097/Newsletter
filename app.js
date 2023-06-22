const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
require('dotenv').config()
const client = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){
    client.setConfig({
        apiKey: process.env.API_KEY,
        server: "us17",
    });
    const run = async () => {
        const response = await client.lists.batchListMembers(process.env.LIST_ID, {
          members: [{
            email_address: req.body.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.fName,
                    LNAME: req.body.lName
                }
          }],
        });
        console.log(response);
        if (response.total_created === 1)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }
      };
      
    run();
})

app.post("/failure", function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.listen(process.env.PORT || 4000, function(){
    console.log("Server is running on port 4000");
})