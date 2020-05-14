var express = require('express');
var router = express.Router();

/* GET all documents. */
router.get('/alldocs', function(req, res, next) {
    var db = req.db;
    var collection = db.get('documents');

	collection.find({ },{ _id : 0},function(err,data){
        if(err){
            console.log("err", err);
			res.status(500).json({"err":err});
        }
        res.status(200).json(data);
    });
});

/* GET document date by document Id*/
router.get('/docdate/:docid', function(req, res, next) {
    var db = req.db;
    var collection = db.get('documents');
    var find = req.params.docid;

	collection.find({ "docID" : find },{ _id : 0},function(err,docs){
        if(err){
            console.log("err", err);
			res.status(500).json({"err":err});
        }
        res.status(200).json(docs[0].docDate);
    });
});

module.exports = router;
