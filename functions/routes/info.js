var express = require('express');
var router = express.Router();
const firebase = require('firebase-admin')
const db = firebase.firestore();

var info_controller = require('../controllers/infoController');

router.get('/sites', info_controller.get_sites);

router.get('/sessions', info_controller.get_sessions);

module.exports = router;