//Current rate collection
var projects  = require('./project.model');

var mongoose 	= require('mongoose');
var ObjectId 	= mongoose.Types.ObjectId;

// /api/project/
module.exports = function(app) {
    app.get('/project/:projectId', function(req,res) {
        projects.find({"_id" : ObjectId(req.params.projectId)}, function(err, data){
            if(data.length===0)
                console.log('error : ',err);
            console.log(data);
            res.send(200);
        });
    });
    
    app.post('/project/create/:projectId', function(req,res) {
        projects.create(req.body, function(err, data){
            if(data.length===0)
                console.log('error : ',err);
            console.log(data);
            res.send(200);
        });
    });
    
    app.put('/project/:projectId', function(req,res) {
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