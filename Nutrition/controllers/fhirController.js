/*
  Controller for retrieving fhir info. Handles requests for fhir resources.
*/

// Import FHIR Library
var fhir = require('fhir.js');

// Client configuration
var client = fhir({
  baseUrl: 'http://hapi.fhir.org/baseDstu2'
  //baseUrl: 'http://fhirtest.uhn.ca/baseDstu2'
  //baseUrl: 'https://api4.hspconsortium.org/nutrition/open'
});

// myType is resource type, eg Observation.
// myQuery is a json of the query parameters, eg { 'patient._id': patientId}
function fhirRequest(myType, myQuery, resultsCallback){
  console.log("Making FHIR request...");
  console.log(myQuery);
  client
    .fetchAll( {type: myType, query: myQuery})
    .then(function(resFHIR){
      console.log("Got "+ resFHIR.length + " results!");
      resultsCallback(resFHIR); // Do the callback on our results ONLY once we've gotten them
    })
    .catch(function(resFHIR){
      //Error responses
      if (resFHIR.status){
        console.log('Error', resFHIR.status);
      }

      //Errors
      if (resFHIR.message){
        console.log('Error', resFHIR.message);
      }
    });
}

module.exports = {

  // Sends the patient fhir resource
  getPatient: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(result){
      res.send(result);
    }
    fhirRequest("Patient", {'_id': req.query.patientId}, resultsCallback);
  },


  // Sends a list of patients that have appointments with a practitioner.
  // Also sends a dictionary from patient to appointment time.
  getPractitionerPatients: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(results){

      formattedResults = {};
      var patients = [];
      var dates = {};
      results.forEach(function(result){

        // Remember the appointment date for this patient. If there are multiple, keep the most recent.
        if(result.resourceType == 'Appointment'){
          try{
            var appPatient = result.participant[0].actor.reference;
            var appDate = new Date(result.start);

            /*
              If there is a previously saved 'appointment time', we need to decide wether this appointment superseeds it.
              For example, if someone has an appointment tomorrow and an appointment 6 months from now, we only want to show
              one: the one tomorrow. We need to display the appointment closest to 'now'.
            */
            if(dates[appPatient]){

              var currentAppDifference = appDate - Date.now();
              var savedAppDifference = dates[appPatient] - Date.now();

              // If this appointment is closer to now than the saved one, save the current one.
              if(currentAppDifference < savedAppDifference){
                dates[appPatient] = appDate;
              }
            }
            else {
              dates[appPatient] = appDate;
            }
          }
          catch(err){
            console.log("Error occured, this may be an invalid resource, skipping...");
          }
        }

        if(result.resourceType == 'Patient'){
          patients.push(result);
        }
      });

      formattedResults["patients"] = patients;
      formattedResults["dates"] = dates;

      res.send(formattedResults);
    }
    //fhirRequest("Appointment", {'practitioner': req.query.practitionerId, 'date' : {$gt: '1970-01-01'}, "_include" : "Appointment:patient"}, resultsCallback);
    fhirRequest("Appointment", {'practitioner': req.query.practitionerId, "_include": "Appointment:patient"}, resultsCallback);
  },


  // Sends an array of weight readings and times
  getWeight: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(results){
      formattedResults = [];
      results.forEach(function(result){
        formattedResults.push({"time": result.effectiveDateTime, "weight": result.valueQuantity.value, "unit": result.valueQuantity.unit});
      });
      res.send(formattedResults);
    }
    fhirRequest("Observation", {'patient._id': req.query.patientId, "code": "http://loinc.org|3141-9"}, resultsCallback);
  },


  // Sends an array of respiratory rate readings and times
  getRespiratory: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(results){
      formattedResults = [];
      results.forEach(function(result){
        formattedResults.push({"time": result.effectiveDateTime, "respiratory rate": result.valueQuantity.value, "unit": result.valueQuantity.unit});
      });
      res.send(formattedResults);
    }
    fhirRequest("Observation", {'patient._id': req.query.patientId, "code": "http://loinc.org|9279-1"}, resultsCallback);
  },


  // sends an array of height readings and times
  getHeight: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(results){
      formattedResults = [];
      results.forEach(function(result){
        formattedResults.push({"time": result.effectiveDateTime, "height": result.valueQuantity.value, "unit": result.valueQuantity.unit});
      });
      res.send(formattedResults);
    }
    fhirRequest("Observation", {'patient._id': req.query.patientId, "code": "http://loinc.org|8302-2"}, resultsCallback);
  },


  // Sends an array of HDL readings and times
  getHDL: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(results){
      formattedResults = [];
      results.forEach(function(result){
        formattedResults.push({"time": result.effectiveDateTime, "HDL": result.valueQuantity.value, "unit": result.valueQuantity.unit});
      });
      res.send(formattedResults);
    }
    fhirRequest("Observation", {'patient._id': req.query.patientId, "code": "http://loinc.org|2085-9"}, resultsCallback);
  },


  // Sends an array of LDL readings and times
  // NOTE: Gatech's fhir server doesn't seem to have any records of this... but it is a thing!
  getLDL: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(results){
      formattedResults = [];
      results.forEach(function(result){
        formattedResults.push({"time": result.effectiveDateTime, "LDL": result.valueQuantity.value, "unit": result.valueQuantity.unit});
      });
      res.send(formattedResults);
    }
    fhirRequest("Observation", {'patient._id': req.query.patientId, "code": "http://loinc.org|2089-1"}, resultsCallback);
  },


  // Sends an array of LDL readings and times
  getCholesterol: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(results){
      formattedResults = [];
      results.forEach(function(result){
        formattedResults.push({"time": result.effectiveDateTime, "cholesterol": result.valueQuantity.value, "unit": result.valueQuantity.unit});
      });
      res.send(formattedResults);
    }
    fhirRequest("Observation", {'patient._id': req.query.patientId, "code": "http://loinc.org|2093-3"}, resultsCallback);
  },


  // Sends an array of LDL readings and times
  getHBA1C: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(results){
      formattedResults = [];
      results.forEach(function(result){
        formattedResults.push({"time": result.effectiveDateTime, "HBA1C": result.valueQuantity.value, "unit": result.valueQuantity.unit});
      });
      res.send(formattedResults);
    }
    fhirRequest("Observation", {'patient._id': req.query.patientId, "code": "http://loinc.org|4548-4"}, resultsCallback);
  },


  // Sends an array of LDL readings and times
  getBloodPH: function(req, res, next) {
    // Callback function to clean the results, after we get them from the FHIR request
    var resultsCallback = function(results){
      formattedResults = [];

      console.log(results);
      results.forEach(function(result){
        formattedResults.push({"time": result.effectiveDateTime, "Blood PH": result.valueQuantity.value, "unit": result.valueQuantity.unit});
      });
      res.send(formattedResults);
    }
    fhirRequest("Observation", {'patient._id': req.query.patientId, "code": "http://loinc.org|2744-1"}, resultsCallback);
  },

  // Sends an array of LDL readings and times
  getNotes: function(req, res, next) {

    // TODO: implement call to custom FHIR resource. Model after this format? :
    // http://wiki.hl7.org/index.php?title=ClinicalNote_FHIR_Resource_Proposal

    // PLACEHOLDER notes to send as a response
    notes = [
      {
        "content": "This is the first note.",
        "provider": "Carter, Macaulay N",
        "date": "2015-05-03 1:45pm"
      },
      {
        "content": "This is the second note.",
        "provider": "Shaw, Barbara J",
        "date": "2015-05-05 8:16am"
      },
      {
        "content": "Good nutrition this month!",
        "provider": "Carter, Macaulay N",
        "date": "2015-05-07 12:36pm"
      },
      {
        "content": "Low weight but low nutrition score...",
        "provider": "Sampson, Rafael D",
        "date": "2015-05-12 3:54pm"
      },
      {
        "content": "This is an example note, this is the most recent one. All notes must comply with the proposed FHIR Clinical Note format. This format must furthermore be supported by the destination FHIR server.",
        "provider": "Sampson, Rafael D",
        "date": "2015-05-28 2:25pm"
      },
    ];

    res.send(notes);
  }

};
