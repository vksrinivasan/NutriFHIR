var express = require('express');
var router = express.Router();

/* Get the homepage/login/register screen */
router.get('/register', function(req, res) {
  res.render('layouts/register.handlebars');
});

router.get('/login', function(req, res) {
  res.render('layouts/login.handlebars');
});

/* Register user */
router.post('/register', function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  var telNum = req.body.telNumber;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Now we need to validate the inputs
  req.checkBody('fName', 'First Name is required').notEmpty();
  req.checkBody('lName', 'Last Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('telNumber', 'Phone Number is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  // Check if any of those validations fail
  var errors = req.validationErrors();
  console.log(errors);
  if(errors) {
    res.render('layouts/register.handlebars', {
      errors: errors
    });
  } else {

  }

});

module.exports = router;
