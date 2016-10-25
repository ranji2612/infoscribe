//Model for uploaded images
var uploadColl  = require('./upload.model');

var mongoose 	= require('mongoose');
var ObjectId 	= mongoose.Types.ObjectId;

var express = require('express');
var app = express.Router();

//Multer - file upload
var multer  = require('multer')
var upload = multer({dest:'tmp/'});

// /api/project/
process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('./flow-node.js')('tmp');

// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = false;


// Handle uploads through Flow.js
app.post('/upload', multipartMiddleware, function(req, res) {
  flow.post(req, function(status, filename, original_filename, identifier) {
      console.log('POST', status, original_filename, identifier);
      if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
        res.header("Access-Control-Allow-Origin", "*");
      }
      res.status(status).send();
  });
});


app.options('/upload', function(req, res){
  if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.status(200).send();
});


//Delete an uploaded file
app.delete('/upload',function(req, res) {

});

// Handle status checks on chunks through Flow.js
app.get('/upload', function(req, res) {
  flow.get(req, function(status, filename, original_filename, identifier) {
    console.log('GET', status);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }
    if (status == 'found') {
      status = 200;
    } else {
      status = 204;
    }
    res.status(status).send();
  });
});

app.get('/download/:identifier', function(req, res) {
  console.log('======== Reached /download get');
  flow.write(req.params.identifier, res);
});

module.exports = app;
