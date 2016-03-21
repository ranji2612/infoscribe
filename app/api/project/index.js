//Current rate collection
var project  = require('./project.model');

var mongoose 	= require('mongoose');
var ObjectId 	= mongoose.Types.ObjectId;

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
        console.log(data);
        res.json(data);
    });
});


app.get('/:projectId', function(req,res) {
    console.log(req.user);
    project.find({"_id" : ObjectId(req.params.projectId)}, function(err, data){
        if(data.length===0)
            console.log('error : ',err);
        console.log(data);
        res.json(data);
    });

});

app.post('/',upload.array(), function(req,res) {
    console.log(req.user);
    //Validate req.body - Pending
    
    project.find({name:req.body.name},function(err,data){
        
        //If Project name already exists
        if (data.length>0)
            res.json({"status":"error","message":"Project Name already exists"});
        else {
            var newProject = req.body;
            newProject["nod"] = 0;
            newProject["notd"] = 0;
            newProject["status"] = "draft";
            console.log(newProject);
            project.create(newProject,function(err,newData){
                if (err)
                    res.json({"status":"error","error":err,"message":err.message});
                res.json({"status":"success","data":newData});
            });
        }
    });
});

app.put('/:projectId', function(req,res) {
    
    projects.update(req.body, function(err, data){
        if(data.length===0)
            console.log('error : ',err);
        console.log(data);
        res.json(data);
    });
});

app.delete('/:projectId', function(req,res) {
    console.log('reached delete ');
    project.remove({"_id" : ObjectId(req.params.projectId)}, function(err, data) {
        if (err) {
            console.log(err);
            res.send(err);   
        }
        res.json(data);
    });
});


module.exports = app;