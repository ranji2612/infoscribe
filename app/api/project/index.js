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
    console.log('Reached project getall');
    project.find({}, function(err, data){
        if(data.length===0)
            console.log('error : ',err);
        console.log(data);
        res.json(data);
    });
});

app.get('/:projectId', function(req,res) {
    console.log('Reached project find');
    project.find({"_id" : ObjectId(req.params.projectId)}, function(err, data){
        if(data.length===0)
            console.log('error : ',err);
        console.log(data);
        res.json(data);
    });

});

app.post('/create',upload.array(), function(req,res) {
    console.log('Reached project Create');
    console.log(req.body);
    project.create(req.body, function(err, data){
        if(data.length===0)
            console.log('error : ',err);
        console.log(data);
        res.send(200);
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