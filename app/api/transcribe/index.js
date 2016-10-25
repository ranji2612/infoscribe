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

app.post('/', function(req, res){
    transcribe.find({"transId":req.params.transId},function(err,data){
        if(err) res.send(err);
        res.json(data);
    });
});


module.exports = app;