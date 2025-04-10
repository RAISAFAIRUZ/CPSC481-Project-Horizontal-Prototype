const layoutSelect = document.getElementById("layoutSelector");
const layoutPreview = document.getElementById("layoutPreview");
const buttonContainer = document.getElementById("buttonContainer");

let isDirty = false; // Track unsaved changes

layoutSelect.addEventListener("change", () => {
  isDirty = true;
  const count = parseInt(layoutSelect.value);
  layoutPreview.innerHTML = "";

  if (count === 0) {
    layoutPreview.innerHTML = "";
    buttonContainer.style.display = "none";
    return;
  }

  buttonContainer.style.display = "flex";

  if (count >= 1) {
    const largeBox = createDropZone(0, "large");
    layoutPreview.appendChild(largeBox);
  }

  if (count > 1) {
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    for (let i = 1; i < count; i++) {
      const smallBox = createDropZone(i, "small");
      gridContainer.appendChild(smallBox);
    }

    layoutPreview.appendChild(gridContainer);
  }
});

function createDropZone(index, size) {
  const dropZone = document.createElement("div");
  dropZone.classList.add("drop-zone", size);
  dropZone.textContent = `Click to Upload or Drag and Drop Image ${index + 1}`;
  dropZone.dataset.index = index;

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";

  dropZone.appendChild(fileInput);

  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = "#e0f7fa";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.backgroundColor = "#f9f9f9";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.style.width = "100%";
        img.style.height = "100%";
        dropZone.innerHTML = "";
        dropZone.appendChild(img);
        isDirty = true;
      };
      reader.readAsDataURL(file);
    }
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.style.width = "100%";
        img.style.height = "100%";
        dropZone.innerHTML = "";
        dropZone.appendChild(img);
        isDirty = true;
      };
      reader.readAsDataURL(file);
    }
  });

  return dropZone;
}

// Popup message
function showPopup(message, isError = false) {
  const container = document.createElement('div');
  container.className = 'popup-message';
  if (isError) container.classList.add('error');
  container.textContent = message;
  document.body.appendChild(container);

  setTimeout(() => {
    container.remove();
  }, 2500);
}

// Cancel confirmation popup
function showCancelPopup() {
  const popup = document.createElement('div');
  popup.className = 'popup-container';
  popup.innerHTML = `
    <p class="text-lg font-semibold mb-4">Are you sure you want to cancel?</p>
    <div class="flex justify-center gap-4">
      <button id="confirmCancelYes" class="popup-btn-yes">Yes</button>
      <button id="confirmCancelNo" class="popup-btn-no">No</button>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById('confirmCancelYes').addEventListener('click', () => {
    window.location.href = 'editFeautureMain.html';
    popup.remove();
  });

  document.getElementById('confirmCancelNo').addEventListener('click', () => {
    popup.remove();
  });
}

// Leave confirmation popup with Save
function showLeavePopup(onLeave) {
  const popup = document.createElement('div');
  popup.className = 'popup-container';
  popup.innerHTML = `
    <p class="text-lg font-semibold mb-4">Are you sure you want to leave? Ensure your progress is saved.</p>
    <div class="flex justify-center gap-4">
      <button id="confirmLeave" class="popup-btn-yes">Leave</button>
      <button id="confirmSave" class="popup-btn-no">Save</button>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById('confirmLeave').addEventListener('click', () => {
    popup.remove();
    if (typeof onLeave === 'function') onLeave();
  });

  document.getElementById('confirmSave').addEventListener('click', () => {
    document.getElementById('saveButton').click();
    popup.remove();
  });
}

// Cancel button
document.addEventListener('DOMContentLoaded', () => {
  const cancelBtn = document.getElementById('cancelButton');
  cancelBtn.addEventListener('click', () => {
    showCancelPopup();
  });
});

// Save button
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveButton');

  saveBtn.addEventListener('click', () => {
    const featureDescription = document.getElementById('featureDescription').value.trim();
    const selectedValue = layoutSelect.value;
    const numberOfPictures = parseInt(selectedValue, 10);
    const dropArea = document.getElementById('layoutPreview');
    const uploadedFiles = dropArea.querySelectorAll('img');

    if (!featureDescription && uploadedFiles.length !== numberOfPictures) {
      showPopup('Please fill out description field and upload images.', true);
      return;
    }

    if (featureDescription && uploadedFiles.length === numberOfPictures) {
      showPopup('Changes have been successfully saved.');
      isDirty = false;

      setTimeout(() => {
        window.location.href = 'editFeatureMain.html';
      }, 2000);

      return;
    } else {
      showPopup('Please upload all of the pictures in the zones.', true);
    }
  });
});

// Intercept nav links if unsaved
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      if (isDirty) {
        e.preventDefault();
        showLeavePopup(() => {
          window.location.href = link.href;
        });
      }
    });
  });
});


// Ensure there's an initial state push when the page loads
history.pushState(null, null, window.location.href);


// Prevent browser's back button and show leave popup
window.addEventListener('popstate', (e) => {
  if (isDirty) {
    e.preventDefault();
    history.pushState(null, null, window.location.href);  // Keep user on the page
    showLeavePopup(() => {
      window.location.href = 'adminHomepage.html'; // Redirect after confirmation
    });
  }
});