var express = require('express');
var router = express.Router();
const firebase = require('firebase-admin')
const db = firebase.firestore();

var info_controller = require('../controllers/infoController');

router.get('/', info_controller.get_info);

module.exports = router;