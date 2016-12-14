//Current rate collection
var uploadColl  = require('./files.model');
var project  = require('./../project/project.model');

var mongoose 	= require('mongoose');
var ObjectId 	= mongoose.Types.ObjectId;

var express = require('express');
var app = express.Router();

//Multer - file upload
var multer  = require('multer')
var upload = multer({dest:'tmp/'});

app.post('/', function(req,res){
    //Update in DB and then send..
    uploadColl.create(req.body,function(err,data){
        if(err) res.send(err);
        project.findOneAndUpdate(
          {'_id' : req.body.projectId},
          { $inc: { 'nod' : 1 }}
        , function(err, updateRes) {
            if(err) {
              console.log(err);
              res.json({"status":"error","error":err,"message":"did not update projects"});
            } else {
              res.json(data);
            }
        });

    });

});

app.get('/:projectId', function(req, res){
    uploadColl.find({"projectId":req.params.projectId},function(err,data){
        if(err) res.send(err);
        res.json(data);
    });
});

app.get('/:projectId/file/:fileId', function(req, res){
    uploadColl.find({"_id":ObjectId(req.params.fileId),"projectId":req.params.projectId},function(err,data){
        if(err) res.send(err);
        res.json(data[0]);
    });
});

app.put('/:projectId', function(req, res) {
    uploadColl.update({"projectId": req.params.projectId, "identifier": req.body.identifier},{"projectId":""}, function(err, data){
        if(err) res.send(err);
        res.json(data);
    });
});
module.exports = app;
