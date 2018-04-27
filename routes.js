app = module.parent.exports.app;

// Require controllers

var indexController = require('./controllers/indexController');

// Index Routes

// app.get('/patients', indexController.patients);
app.get('/summary', indexController.summary);
app.get('/history', indexController.history);
app.get('/nutrients', indexController.nutrients);
app.get('/goals', indexController.goals);
app.get('/notes', indexController.notes);
app.get('/launchPatient', indexController.launchPatient);
app.get('/launchProvider', indexController.launchProvider);

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
