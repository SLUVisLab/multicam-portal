var express = require('express');
var router = express.Router();

//redirect all traffic to the search form

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/search');
});

module.exports = router;
