/*
  Controller for the web page itself. Renders the different tabs.
*/

var express = require("express");
var app = express();
var path = require("path");
console.log(path.join(__dirname+'//..//views//'))

module.exports = {

  // GET /patients, query parameters: practitionerId
  // patients: function(req, res, next) {
  //   res.render('home', { title: 'Nutrition App', page: 'layouts/summary.handlebars' });
  // },

  // GET /summary, query parameters: patientId, practitionerId
  summary: function(req, res, next) {
    res.locals.authenticated = true;
    res.render('layouts/summary.handlebars');
  },

  // GET /launchPatient
  launchPatient: function(req, res, next) {
    res.sendFile(path.join(__dirname+ '//..//views//launch-patient.html'));
  },
  
  // GET /launchProvider
  launchProvider: function(req, res, next) {
	  res.sendFile(path.join(__dirname+ '//..//views//launch.html'));
  },

  // GET /history
  history: function(req, res, next) {
    res.render('patient', { title: 'Nutrition App', page: 'partials/history' });
  },

  // GET /nutrients
  nutrients: function(req, res, next) {
    res.render('patient', { title: 'Nutrition App', page: 'partials/nutrients' });
  },

  // GET /goals
  goals: function(req, res, next) {
    res.render('patient', { title: 'Nutrition App', page: 'partials/goals' });
  },

  // GET /notes, query parameters: patientId, practitionerId
  notes: function(req, res, next) {
    res.render('patient', { title: 'Nutrition App', page: 'partials/notes'});
  }

};
