require('dotenv').config();
var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var dns = require("dns");
//const mySecret = process.env['MONGO_URI'];
const ShortUrl = require('./models/url');
const { validate } = require('./models/url');
var cors = require("cors");
var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// app.post("/api/shorturl", function(req, res) {
//   //console.log(req.body);
//   const { url } = req.body;

//   let noHTTPSurl = url.replace(/^https?:\/\// , "");
//   //console.log(url);
//   var dnsLookup = new Promise(function(resolve, reject) {
//     dns.lookup(noHTTPSurl, function(err, addresses, family) {
//       if (err) reject(err);
//       resolve(addresses);
//     });
//   });

//   dnsLookup
//     .then(function() {
//       return checkIfExists(url);
//     })
//     .then(function(data) {
//       if (data.status) {
//         return res.json({ original_url: url, short_url: data.short_url });
//       } else {
//         var shortUrl = shorterUrl();
//         var urlMapping = new UrlMapping({
//           original_url: url,
//           short_url: shortUrl
//         });
//         return saveUrlMapping(urlMapping);
//       }
//     })
//     .then(function(original_url) {
//       var shortUrl = shortUrl();
//       return res.json({ original_url: url, short_url: shortUrl });
//     });
//   dnsLookup.catch(function(reason) {
//     return res.json({ error: "invalid url" });
//   });
// });

// app.get("/api/shorturl/:shortUrl", function(req, res) {
//   var redirectPromise = redirectToOriginalUrl(req.params.shortUrl);
//   redirectPromise.then(function(original_url) {
//     return res.redirect(original_url);
//   }).catch(function(e) {
//     return res.json({ error: e });
//   });
// });

// function redirectToOriginalUrl(short_url) {
//   return new Promise(function(resolve, reject) {
//     UrlMapping.findOne({ short_url: short_url }, function(err, doc) {
//       if (err || doc === null) return reject(err);
//       else return resolve(doc.original_url);
//     });
//   });
// }

// function checkIfExists(original_url) {
//   return new Promise(function(resolve, reject) {
//     UrlMapping.findOne({ original_url: original_url }, function(err, doc) {
//       if (doc === null || err) resolve({ status: false });
//       else resolve({ status: true, short_url: doc.short_url });
//     });
//   });
// }

// function saveUrlMapping(mapping) {
//   return new Promise(function(resolve, reject) {
//     mapping.save(function(err, data) {
//       if (err) return reject(err);
//       else return resolve(null, data);
//     });
//   });
// }

// //
// function shorterUrl() {
//   var text = "";
//   // var possible =
//   //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   var possible =
//     "0123456789";
//   for (var i = 0; i < 5; i++)
//     text += possible.charAt(Math.floor(Math.random() * possible.length));

//   return parseInt(text);
// }

app.post('/api/shorturl', async (req, res) => {
  const url = new ShortUrl({ original_url: req.body.url })
  const httpRegex = /^(http|https)(:\/\/)/

  if (!httpRegex.test(url.original_url)) {
    return res.json({ error: 'invalid url' })
  }

  const validateUrl = async () => {
    return new Promise((resolve, reject) => {
      const urlObject = new URL(url.original_url)

      dns.lookup(urlObject.hostname, (error, address, family) => {
        if (error) reject({ error: 'invalid url' })
        resolve(url.original_url)
      })
    })
  }

  try {
    const original_url = await validateUrl()
    const { short_url } = await url.save()

    res.json({ original_url, short_url })
  } catch (error) {
    res.send(error)
  }
})

// use short url to redirect to original url endpoint
app.get('/api/shorturl/:short_url', async (req, res) => {
  const short_url = req.params.short_url
  const url = await ShortUrl.findOne({ short_url })

  if (!url) {
    return res.json({ error: 'invalid url' })
  }

  res.redirect(url.original_url)
})


app.listen(port, function() {
  console.log("Node.js listening ...");
});