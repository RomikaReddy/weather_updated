var express = require('express');
var router = express.Router();
var User = require("../models/controllers/user/user");
router.post('/api/saveCity',User.sendDataToServer);
router.get('/api/getdata',User.getdata);

module.exports = router;
