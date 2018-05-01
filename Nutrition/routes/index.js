var express = require('express');
var router = express.Router();
var cdsServices = require("../data/cds-services.json");

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

/* Get the homepage/login/register screen */
router.get('/', function(req, res) {
  res.render('layouts/index.handlebars');
})

router.get('/cds-services', function(req, res) {
  res.json(cdsServices)
})
;

module.exports = router;
