app = module.parent.exports.app;

// Require controllers

var indexController = require('./controllers/indexController');
var fhirController = require('./controllers/fhirController');

// Index Routes

// app.get('/patients', indexController.patients);
app.get('/summary', indexController.summary);
app.get('/history', indexController.history);
app.get('/nutrients', indexController.nutrients);
app.get('/goals', indexController.goals);
app.get('/notes', indexController.notes);
app.get('/launchPatient', indexController.launchPatient);

// Fhir Routes

app.get('/fhir/practitioner/patients', fhirController.getPractitionerPatients);
app.get('/fhir/patient', fhirController.getPatient);
app.get('/fhir/weight', fhirController.getWeight);
app.get('/fhir/respiratory', fhirController.getRespiratory);
app.get('/fhir/height', fhirController.getHeight);
app.get('/fhir/hdl', fhirController.getHDL);
app.get('/fhir/ldl', fhirController.getLDL);
app.get('/fhir/cholesterol', fhirController.getCholesterol);
app.get('/fhir/HBA1C', fhirController.getHBA1C);
app.get('/fhir/bloodPH', fhirController.getBloodPH);
app.get('/fhir/notes', fhirController.getNotes);


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
