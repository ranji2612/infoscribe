//Current rate collection
var project  = require('./project.model');
var transcribe = require('./../transcribe/transcribe.model');

var mongoose 	= require('mongoose');
var ObjectId 	= mongoose.Types.ObjectId;
var json2csv = require('json2csv');

var express = require('express');
var app = express.Router();

//Multer - file upload
var multer  = require('multer')
var upload = multer({dest:'tmp/'});

// /api/project/


app.get('/all', function(req,res) {
    project.find({}, function(err, data){
        if(data.length===0)
            console.log('error : ',err);
        res.json(data);
    });
});


app.get('/:projectId', function(req,res) {
    project.find({"_id" : ObjectId(req.params.projectId)}, function(err, data){
        if(data.length===0)
            console.log('error : ',err);
        res.json(data);
    });

});

app.get('/:projectId/download', function(req,res) {
    // Download data as csv
    var reqFields = {"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1};
    transcribe.find({"projectId": ObjectId(req.params.projectId)}, reqFields, function(err, data){
      if(data.length !== 0) {
        var fields = ['0', '1', '2', '3','4','5','6','7'];
        var csv = json2csv({ data: JSON.parse(JSON.stringify(data)) });
        res.attachment('download.csv');
        res.status(200).send(csv);
        res.end();
      } else {
        res.status(500);
        res.end();
      }
    });
});

//Creating a new project
app.post('/', function(req,res) {
    //Validate req.body - Pending

    if(req.params.projectId != req.body.projectId) {
        res.json({"status":"error","error":"Project Id didnt match"});
    }
    //Check if already exists
    project.find({name:req.body.name},function(err,data){
        //Find errored
        if (err)
            res.json({"status":"error","error":err, "message":"Project Name already exists"});

        //If Project name already exists
        if (data.length>0)
            res.json({"status":"error","message":"Project Name already exists"});
        else {
            var newProject = req.body;
            newProject["nod"] = 0;
            newProject["notd"] = 0;
            newProject["status"] = "draft";
            //If passes the conditions then create a new project
            project.create(newProject,function(err,newData){
                if (err)
                    res.json({"status":"error","error":err,"message":err.message});
                else
                    res.json({"status":"success","data":newData});
            });
        }
    });
});


app.put('/:projectId', function(req,res) {
    var updatedData = req.body;
    // TODO : validate update data
    if ("schema" in updatedData) {
      updatedData['status'] = 'ready';
    }
    project.update({"_id": ObjectId(req.params.projectId)}, updatedData, function(err, data){
        if(data.length===0) {
            res.json({"status":"error","error":err,"message":err.message});
        } else {
          res.json({"status":"success","data":data});
        }
    });
});

app.delete('/:projectId', function(req,res) {
    project.remove({"_id" : ObjectId(req.params.projectId)}, function(err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });
});


module.exports = app;
