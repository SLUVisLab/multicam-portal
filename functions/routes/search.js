var express = require('express');
var router = express.Router();
// const firebase = require('firebase-admin')
// const db = firebase.firestore();

// Require controller modules.
var search_controller = require('../controllers/searchController');

/* GET search form. */
router.get('/', function(req, res, next) {

  res.render('search', { title: 'Search'})
});

/* POST Image Search. */
router.post('/', search_controller.image_search);

module.exports = router;
