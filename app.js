const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const shortUrl = require("./models/shortUrl");

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 3000 );
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/shortUrls");

app.get("/new/:urlToShorten(*)",(req,res)=>{

let regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
let {urlToShorten} = req.params;
  if(regex.test(urlToShorten)=== true){
    let short = Math.floor(Math.random()*100000).toString();

    let data = new shortUrl(
      {
        originalUrl: urlToShorten,
        shorterUrl: short
      }
    );
    data.save(err=>{
      if(err) return res.send("Error saving to database");
    })
    return res.json(data);
  }
  return res.json({urlToShorten: "Failed"});
});

app.get("/:newUrl", (req, res)=>{
  
  let {newUrl} = req.params;
  
  shortUrl.findOne({"shorterUrl" : newUrl}, (err, data)=>{
    if(err) return console.error;
    let reg = new RegExp("^(http|https)://","i");
    let checkStr = data.originalUrl;

    if(reg.test(checkStr)){
      res.redirect(301, data.originalUrl);
    } else{
      res.redirect(301, "http://" + data.originalUrl);
    }
  })
})