document.getElementById("copyrightYear").innerHTML = new Date().getFullYear();

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
      textarea.value = note.textContent.trim();
      // Focus on the textarea for immediate editing
      textarea.focus();
    }
  });

  // Event listener for edit and delete actions
  notesList.addEventListener("click", (e) => {
    if (e.target.classList.contains("notes__edit-btn")) {
      handleEditButtonClick(e);
    } else if (e.target.classList.contains("notes__delete-btn")) {
      handleDeleteButtonClick(e);
    }
  });

  function handleEditButtonClick(e) {
    const listItem = e.target.closest(".notes__list-item");
    const note = listItem.querySelector(".notes__note");
    const form = listItem.querySelector(".notes__edit-form");
    const textarea = form.querySelector(".notes__edit-textarea");
    const noteId = e.target.dataset.noteId;
    const newContent = textarea.value;

    if (newContent.trim() === "") {
      alert("Note cannot be empty");
      return;
    }

    updateNote(noteId, newContent).then((success) => {
      if (success) {
        note.textContent = newContent;
        updateUI(note, form);
      }
    });
  }

  function handleDeleteButtonClick(e) {
    const noteId = e.target.dataset.noteId;
    deleteNote(noteId).then((success) => {
      if (success) {
        window.location.reload();
      }
    });
  }

  function updateNote(noteId, newContent) {
    return fetch(`/editNote/${noteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Note updated successfully");
          return true;
        } else {
          console.error("Failed to update note");
          alert(data.message);
          return false;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        return false;
      });
  }

  function deleteNote(noteId) {
    return fetch(`/deleteNote/${noteId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Note deleted successfully");
          return true;
        } else {
          console.error("Failed to delete note");
          alert(data.message);
          return false;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        return false;
      });
  }

  function updateUI(note, form) {
    note.style.display = "block";
    form.style.display = "none";
  }
});
