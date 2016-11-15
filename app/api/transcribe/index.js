//Current rate collection
var transcribe  = require('./transcribe.model');
var project  = require('./../project/project.model');

var mongoose 	= require('mongoose');
var ObjectId 	= mongoose.Types.ObjectId;

var express = require('express');
var app = express.Router();

//Multer - file upload
var multer  = require('multer')
var upload = multer({dest:'tmp/'});

app.get('/project/:projectId/file/:fileId', function(req, res){
    var searchCond = {
      "projectId": ObjectId(req.params.projectId),
      "userId": req.user['_id'],
      "transId": ObjectId(req.params.transId)
    };

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
    if (!req.body || !req.user || !req.user['_id'] || !req.body.projectId || !req.body.fileId) {
      res.json({"status":"error","error":"the requested resourse doesnot exist"});
    } else {
      var searchCond = {
        "projectId": ObjectId(req.body.projectId),
        "userId": req.user['_id'],
        "fileId": ObjectId(req.body.fileId)
      };
      // Maintian the transcription data
      var transData = req.body;
      transData['userId'] = req.user['_id'];
      transData['projectId'] = ObjectId(req.body.projectId);
      transData['fileId'] = ObjectId(req.body.fileId);
      // Search for existing
      transcribe.find(searchCond,function(err,data){
          if(err) res.send(err);
          if (data.length === 0) {
            // Write new - If its a new Transcription
            transcribe.create(transData, function(err,newData){
              if (err)
                res.json({"status":"error","error":err,"message":err.message});
              else {
                project.findOneAndUpdate(
                  {'_id' : transData.projectId},
                  { $inc: { 'notd' : 1 }}
                , function(err, updateRes) {
                  console.log("==>",updateRes);
                  if(err) {
                    console.log(err);
                    res.json({"status":"error","error":err,"message":"did not update projects"});
                  } else {
                    res.json({"status":"success","data":newData});
                  }
                });
              }
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
    }
});


module.exports = app;
