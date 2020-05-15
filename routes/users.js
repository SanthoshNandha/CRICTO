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


/* 
  Add new woker or analyst if logged in 1st time
  else collect all the links created by the worker or analyst earlier
*/
router.post("/addNewWorker", function(req, res){

	var workerID = req.body.workerId
	var db = req.db;
	var collection = db.get('users');

  //Find if the worked ID already exsist
  collection.find({"workerId": workerID}, {}, function(err, results){
		if(!err){
			if(results.length == 0){
				document = {
					"workerId": workerID,
					"timeStamp": new Date().getTime()
				}

				collection.insert(document, function(err, result){
					res.json(
						{
							"error" : err,
							"updateResult" : result,
						}
					);
				});
			}
			else{
        // IF there are link created ealier
				if(results[0].link){
					var totalLinks = results[0].link.length
					res.json({"totalLinks": totalLinks});
        }
        // send there are zero links
				else{
					res.json({"totalLinks": 0});
				}
			}
		}
	});
});

module.exports = router;
