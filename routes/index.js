var express = require('express');
var router = express.Router();

// Route to the login page of worker
router.get('/', function(req, res) {
	res.render('mainView', { title: 'CRICTO' });
});

router.get('/intstruction', function(req, res) {
	res.render('workerInstructions', { title: 'Instructions' });
});

module.exports = router;
