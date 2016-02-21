//Current rate collection
var projects  = require('./project.model');

var mongoose 	= require('mongoose');
var ObjectId 	= mongoose.Types.ObjectId;

// /api/project/
module.exports = function(app) {
    app.get('/:projectId', function(req,res) {
        /*
        projects.find({"_id" : ObjectId(req.params.projectId)}, function(err, data){
            if(data.length===0)
                console.log('error : ',err);
            console.log(data);
            res.send(200);
        });
        */
        console.log('Reached project find');
    });
    
    app.post('/create', function(req,res) {
        console.log('Reached project Create');
        /*
        projects.create(req.body, function(err, data){
            if(data.length===0)
                console.log('error : ',err);
            console.log(data);
            res.send(200);
        });
        */
    });
    
    app.put('/:projectId', function(req,res) {
        projects.update(req.body, function(err, data){
            if(data.length===0)
                console.log('error : ',err);
            console.log(data);
            res.send(200);
        });
    });
    
    app.delete('/project/:projectId', function(req,res) {
        
    });
};