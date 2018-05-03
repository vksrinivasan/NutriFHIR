var express = require('express');
var router = express.Router();

/* Get the homepage/login/register screen */
router.get('/', function(req, res) {
  res.render('layouts/index.handlebars');
});

module.exports = router;
