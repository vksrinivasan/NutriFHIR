var practitionerId = getParameterByName("practitionerId");

// JSON for patient info
$.getJSON("/fhir/practitioner/patients", {practitionerId: practitionerId}, function(res){
  console.log("patients");
  console.log(res);
  showPatients(res["patients"], res["dates"]);
});


function showPatients(patients, dates){
  var upcomingPatientsExist = false;
  var pastPatientsExist = false;
  
  patients.forEach(function(patient) {
    appDate = dates["Patient/"+patient.id];
    if(appDate < Date.now()){
      // this is an upcoming patient
      upcomingPatientsExist = true;
      showPatient(patient, appDate, 88, "#upcoming-patient-list");
    }
    else{
      // this is a past patient
      pastPatientsExist = true;
      showPatient(patient, appDate, 74, "#past-patient-list");
    }
  }); 

  if(!upcomingPatientsExist){
    $("#loading-upcoming .card-title").text("No upcoming patients.");
  }
  else{
    $("#loading-upcoming").remove();
  }
  if(!pastPatientsExist){
    $("#loading-past .card-title").text("No past patients.");  
  }
  else{
    $("#loading-past").remove();
  }
}


function showPatient(patient, appDate, nutritionScore, divId) {
  var name = getPatientName(patient);
  var appDateText = formatDate(new Date(appDate));

  if(patient.birthDate){
    var currentDate = new Date();
    var age = currentDate.getFullYear() - patient.birthDate.split("-")[0];
  }

  var html = `
  <div class="card">
    <div class="card-block">
      <h5 class="card-title">` + name + `</h5>
      <h6 class="card-subtitle mb-3 text-muted">Appointment Time: ` + appDateText + `</h6>
      <h6 class="card-subtitle text-muted">Current Nutrition Score: ` + nutritionScore + `</p>
      <button class="btn btn-primary" onclick="viewPatientSummary(`+ patient.id+`)">View Nutrition Summary</button>
    </div>
  </div>`;

  $(divId).prepend(html);
}

function viewPatientSummary(patientId){
  window.location = "/summary?practitionerId=" + practitionerId + "&patientId=" + patientId;
}
