// Grab the articles as a json
$.getJSON("/articles", function (data) {

  // For each one
  let counter = 1;
  let rowCounter = 1;
  let newRow = $("<div>").addClass("row row-num-" + rowCounter);
  $("#article-cards").append(newRow);
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    if (counter > 4) {
      rowCounter++
      newRow = $("<div>").addClass("row row-num-" + rowCounter);
      $("#article-cards").append(newRow);
      counter = 1;
    }
    let newCard = `
    <div class="col s12 m3">
      <div class="card article">
        <div class="card-image">
          <img src="${data[i].img}">
          <a class="btn-floating halfway-fab waves-effect waves-light red" href="${data[i].url}"><i class="material-icons">info_outline</i></a>
        </div>
        <div class="card-content">
          <p><strong>${data[i].title}</strong></p>
          <p>${data[i].summary}</p>
        </div>
        <div class="card-action">
          <a class="add-note waves-effect waves-light btn modal-trigger" data-id="${data[i]._id}" href="#modal1">Add Note</a>
        </div>
      </div>
    `;
    $(".row-num-" + rowCounter).append(newCard);
    counter++
  }
});


// Whenever someone clicks an add note button
$(document).on("click", ".add-note", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      $('#savenote').attr('data-id', data._id);
      $('#modal-title').text(data.title);
      let noteModal = `
      <div id="modal1" class="modal">
        <div class="modal-content">
          <h4>${data.title}</h4>
          <input placeholder="Name of note" id="titleinput" type="text" name="title" class="validate">
          <div class="row">
            <form class="col s12">
              <div class="row">
                <div class="input-field col s12">
                  <textarea id="bodyinput" name="body" class="materialize-textarea"></textarea>
                  <label for="bodyinput">Note Body</label>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <a href="#!" id="savenote" class="modal-close waves-effect waves-green btn-flat" data-id="${data._id}">Save Note</a>
        </div>
      </div>`;
      $("#notes").append(noteModal);



      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});