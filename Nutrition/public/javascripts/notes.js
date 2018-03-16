$.getJSON("/fhir/notes", {patientId: 1}, function(res) {
  showNotes(res);
});


function showNotes(notes) {
  notes.forEach(function(note) {
    var html = `<div class="card">
              <div class="card-block">
                <h5 class="card-title">` + note.date + `</h5>
                <h6 class="card-subtitle mb-2 text-muted">` + note.provider + `</h6>
                <p class="card-text">` + note.content + `</p>
              </div>
            </div>`;

    $("#note-list").prepend(html);
  });  
}



