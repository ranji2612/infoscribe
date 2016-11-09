//Current rate collection
var transcribe  = require('./transcribe.model');

var mongoose 	= require('mongoose');
var ObjectId 	= mongoose.Types.ObjectId;

var express = require('express');
var app = express.Router();

//Multer - file upload
var multer  = require('multer')
var upload = multer({dest:'tmp/'});

app.get('/:transId', function(req, res){
    transcribe.find({"transId":req.params.transId},function(err,data){
        if(err) res.send(err);
        res.json(data);
    });
});

app.get('/user/:userId/project/:projectId/file/:fileId', function(req, res){
    var searchCond = {
      "projectId":req.params.projectId,
      "userId":req.params.userId,
      "transId": req.params.transId
    };
    console.log('asdasd');
    transcribe.find(searchCond, function(err,data){
        if(err) res.send(err);
        if(data.length===0) {
            res.json({"status":"error","error": "record doesn't exist"});
        } else {
          res.json({"status":"success","data":data});
        }
    });
});

app.post('/', function(req, res){
    var searchCond = {
      "projectId":req.body.projectId,
      "userId":req.body.userId,
      "fileId": req.body.fileId
    };
    var transData = req.body;
    transcribe.find(searchCond,function(err,data){
        if(err) res.send(err);
        if (data.length === 0) {
          // Write new - If its a new Transcription
          transcribe.create(transData, function(err,newData){
            if (err)
              res.json({"status":"error","error":err,"message":err.message});
            else
              res.json({"status":"Inserted New success","data":newData});
          });
        } else {
          // overwrite - If already transcibed
          transcribe.update({"_id": data[0]["_id"]}, transData, function(err,newData){
            if (err) {
              res.json({"status":"error","error":err,"message":err.message});
            } else {
              res.json({"status":"success","data":newData});
            }
          });
        }
    });
});


module.exports = app;
