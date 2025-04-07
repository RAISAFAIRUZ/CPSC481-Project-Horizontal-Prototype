function showPopupMessage(message, isError = false) {
  const container = document.createElement('div');
  container.className = `fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-md shadow-lg text-center max-w-xl z-50 border ${isError
      ? 'bg-red-100 text-red-700 border-red-300'
      : 'bg-green-100 text-green-700 border-green-300'
      }`;
  container.innerHTML = `<p class="font-semibold italic">${message}</p>`;
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 2500);
}



document.addEventListener("DOMContentLoaded", function() {
  // Ensure the button with ID 'saveBtn' is available
  const saveBtn = document.getElementById("saveBtn");

  // Check if saveBtn exists
  if (saveBtn) {
      saveBtn.addEventListener("click", function() {
          // Get all the text areas by their IDs
          const input1 = document.getElementById("input1");
          const input2 = document.getElementById("input2");
          const input3 = document.getElementById("input3");
          const input4 = document.getElementById("input4");
          const input5 = document.getElementById("input5");

          // Check if any of the inputs are empty
          if (input1.value.trim() === "" || input2.value.trim() === "" || input3.value.trim() === "" || input4.value.trim() === "" || input5.value.trim() === "") {
              // If any field is empty, show "Try Again" message
              alert("Please fill in all fields. Try again.");
          } else {
              // If all fields are filled, show "Success" message
              alert("Your changes have been saved successfully!");
          }
      });
  } else {
      console.log("Save button not found!");
  }
});



document.addEventListener("DOMContentLoaded", function() {
  const saveBtn = document.getElementById("cancelBtn");

  if (cancelBtn) {
      cancelBtn.addEventListener("click", function() {
          alert("Are you sure you want to cancel?");
      });
  } else {
      console.log("Cancel button not found!");
  }
});


document.addEventListener("DOMContentLoaded", function() {
  const saveBtn = document.getElementById("removeBtn");

  if (removeBtn) {
      removeBtn.addEventListener("click", function() {
          alert("Are you sure you want to remove?");
      });
  } else {
      console.log("Remove button not found!");
  }
});

// Drag and Drop functionality
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = "#e0f7fa";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.backgroundColor = "#ffffff";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = "#ffffff";

  const files = event.dataTransfer.files;
  handleFiles(files);
});

fileInput.addEventListener("change", () => {
  const files = fileInput.files;
  handleFiles(files);
});

function handleFiles(files) {
  const file = files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      dropArea.innerHTML = ""; // Clear current content
      dropArea.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

// Trigger file input when "Browse Files" button is clicked
const uploadButton = document.getElementById("upload-button");
uploadButton.addEventListener("click", () => {
  fileInput.click();
});

