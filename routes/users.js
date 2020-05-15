var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Get the details of a user*/
router.get('/get/:userId', function(req, res){

	var userId = req.params.userId;
	var db = req.db;
	var collection = db.get('users');

	collection.find({"userId": userId}, {}, function(err, results){
		if(err){
			console.log("Error in fetching user", err);
			res.status(500).json({"err":err});
		}
		if( results.length == 0 ){
			res.status(404).send("user not found");
		}
		else{
			res.status(200).json(results[0]);
		}
	});
});

/* add a new user by user ID */
router.post('/add/:userId', function(req, res){

	var userId = req.params.userId;
	var db = req.db;
	var collection = db.get('users');

	var document = {
		"userId": userId,
		"timeStamp": new Date().getTime(),
		"links":[]
	}

	collection.insert(document, function(err, result){
		if(err){
			console.log("err", err);
			res.status(500).json({"err":err});
		}

		res.status(200).send("user added");
	});
});

/* add links */
router.post('/addlink/:userId', function(req,res) {

	var db = req.db;
	var collection = db.get('users');

	collection.update(
		{ 	userId: req.params.userId },
		{
			$push: { links : JSON.parse(req.body.link) } 
		},
		{
			upsert : true
		},
		function(err, count, results) {
			if(err){
				console.log("err", err);
				res.status(500).json({"err":err});
			}
			res.status(200).json({
				"updateCount" : count,
				"updateResult" : results
			});
		}
	);
});

/* Get the filtered links */
router.get('/getLinks/:workerIds/:docIds/:keywords/:removedKeywords',function(req,res){
	
	var workerIds=[];
	var docIds=[];
	var keywords=[];
	var removedKeywords=[];
	var isRemoved;

	var db = req.db;
	var collection = db.get('users'); 
	
	if(req.params.workerIds != undefined || req.params.workerIds != null)
			workerIds=req.params.workerIds.split(",");
	
	if(req.params.docIds != undefined || req.params.docIds != null)
		docIds=req.params.docIds.split(",");
	
	if(req.params.keywords != undefined || req.params.keywords != null)
		keywords=req.params.keywords.split(",");
	
	if(req.params.removedKeywords != undefined || req.params.removedKeywords != null)
		removedKeywords=req.params.removedKeywords.split(",");
	
	collection.find({},{},function(e,docs){
		docs.forEach(function( val, key ) {
			if(val.userId != undefined){
				if(workerIds.indexOf(val.userId) == -1){					
					if(val.links != undefined){
						for(var i=val.links.length-1;i >=0;i--){
							isRemoved = false;
							if((keywords.indexOf(val.links[i].sourceNode.node) == -1 && keywords.indexOf(val.links[i].targetNode.node) == -1) 
								&& (docIds.indexOf(val.links[i].sourceNode.docID) == -1 && docIds.indexOf(val.links[i].targetNode.docID) == -1)){

								isRemoved = true
								val.links.splice(i, 1);
							}
							if(!isRemoved){
								if(removedKeywords.indexOf(val.links[i].sourceNode.node) != -1 || removedKeywords.indexOf(val.links[i].targetNode.node) != -1){
									val.links.splice(i, 1);
								}
							}
						}
					}
				}
				else{
					if(val.links != undefined){
						for(var i=val.links.length-1;i >=0;i--){
							if(removedKeywords.indexOf(val.links[i].sourceNode.node) != -1 || removedKeywords.indexOf(val.links[i].targetNode.node) != -1){
								val.links.splice(i, 1);
							}
						}
					}
				}
			}
		});
		res.status(200).json(docs);		
	});
});


module.exports = router;
