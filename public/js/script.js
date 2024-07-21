// Edit and Delete notes logic
document.addEventListener("DOMContentLoaded", () => {
  // Get the main container for all notes
  const notesList = document.querySelector(".notes__list");

  // Event listener for clicking on a note to edit
  notesList.addEventListener("click", (e) => {
    // Check if the clicked element is a note
    if (e.target.classList.contains("notes__note")) {
      // Find the parent list item of the clicked note
      const listItem = e.target.closest(".notes__list-item");
      // Get references to the note, edit form, and textarea
      const note = listItem.querySelector(".notes__note");
      const form = listItem.querySelector(".notes__edit-form");
      const textarea = form.querySelector(".notes__edit-textarea");

      // Hide the note text and show the edit form
      note.style.display = "none";
      form.style.display = "block";

      // Populate the textarea with the current note text
      textarea.value = note.textContent;
      // Focus on the textarea for immediate editing
      textarea.focus();
    }
  });

  // Event listener for edit and delete actions
  notesList.addEventListener("click", (e) => {
    // Handle edit button click
    if (e.target.classList.contains("notes__edit-btn")) {
      // Find the parent list item of the clicked button
      const listItem = e.target.closest(".notes__list-item");
      // Get references to the note, form, and textarea
      const note = listItem.querySelector(".notes__note");
      const form = listItem.querySelector(".notes__edit-form");
      const textarea = form.querySelector(".notes__edit-textarea");

      // Update the note text with the edited content
      note.textContent = textarea.value;
      // Show the updated note and hide the edit form
      note.style.display = "block";
      form.style.display = "none";
    }

    // Handle delete button click
    if (e.target.classList.contains("notes__delete-btn")) {
      // Find the parent list item of the clicked button
      const listItem = e.target.closest(".notes__list-item");
      // Remove the entire note item from the DOM
      listItem.remove();
    }
  });
});
