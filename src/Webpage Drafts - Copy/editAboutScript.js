let isDirty = false; // Tracks if form was changed

// Show small alert popup
function showPopup(message, isError = false) {
  const container = document.createElement('div');
  container.className = 'popup-message';
  if (isError) container.classList.add('error');
  container.textContent = message;
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 2500);
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
    window.location.href = 'adminHomepageSignIn.html';
    popup.remove();
  });

  document.getElementById('confirmCancelNo').addEventListener('click', () => {
    popup.remove();
  });
}

// Leave confirmation popup (custom override)
function showLeavePopup() {
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
    isDirty = false; // prevent looping
    window.location.href = 'adminHomepageSignIn.html'; // or history.back() if needed
  });

  document.getElementById('confirmSave').addEventListener('click', () => {
    document.getElementById('saveBtn').click();
    popup.remove();
  });
}

// Watch for unsaved changes
function markDirty() {
  isDirty = true;
}

document.addEventListener('DOMContentLoaded', () => {
  const inputs = ['input1', 'input2', 'input3', 'input4', 'input5'].map(id => document.getElementById(id));
  inputs.forEach(input => input.addEventListener('input', markDirty));

  const cancelBtn = document.getElementById('cancelBtn');
  cancelBtn.addEventListener('click', () => {
    showCancelPopup();
  });

  const saveBtn = document.getElementById('saveBtn');
  saveBtn.addEventListener('click', () => {
    const input1 = document.getElementById('input1').value.trim();
    const input2 = document.getElementById('input2').value.trim();
    const input3 = document.getElementById('input3').value.trim();
    const input4 = document.getElementById('input4').value.trim();
    const input5 = document.getElementById('input5').value.trim();

    if (!input1 || !input2 || !input3 || !input4 || !input5) {
      showPopup('Please fill out all fields.', true);
      return;
    }

    const fileInput = document.getElementById('fileInput');
    if (fileInput && fileInput.files.length === 0) {
      showPopup('Please upload a file.', true);
      return;
    }

    const dropArea = document.getElementById('drop-area');
    const uploadedFiles = dropArea.querySelectorAll('img');
    if (uploadedFiles.length === 0) {
      showPopup('Please upload a picture.', true);
      return;
    }

    showPopup('Changes have been successfully saved.');
    isDirty = false; // Reset after successful save

    setTimeout(() => {
      window.location.href = 'adminHomepageSignIn.html'; 
    }, 2000); 

  });

  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("file-input");

  dropArea.addEventListener("click", () => fileInput.click());
  dropArea.addEventListener("dragover", e => {
    e.preventDefault();
    dropArea.style.backgroundColor = "#e0f7fa";
  });
  dropArea.addEventListener("dragleave", () => dropArea.style.backgroundColor = "#ffffff");
  dropArea.addEventListener("drop", e => {
    e.preventDefault();
    dropArea.style.backgroundColor = "#ffffff";
    handleFiles(e.dataTransfer.files);
    markDirty();
  });

  fileInput.addEventListener("change", () => {
    handleFiles(fileInput.files);
    markDirty();
  });

  const removeBtn = document.getElementById("removeBtn");
  removeBtn.addEventListener("click", () => {
    if (dropArea.innerHTML.trim() === "" || dropArea.innerHTML.includes("Click Box")) return;
    showConfirmPopup();
    markDirty();
  });

  function handleFiles(files) {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.src = e.target.result;
        img.style.maxWidth = "100%";
        img.style.maxHeight = "100%";
        dropArea.innerHTML = "";
        dropArea.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }

  function showConfirmPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup-container';
    popup.innerHTML = `
      <p>Are you sure you want to remove the image?</p>
      <div class="button-container">
        <button id="confirmYes" class="popup-btn-yes">Yes</button>
        <button id="confirmNo" class="popup-btn-no">No</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('confirmYes').addEventListener('click', () => {
      dropArea.innerHTML = "Click Box to Upload or Drag & Drop Image Here";
      fileInput.value = "";
      popup.remove();
    });

    document.getElementById('confirmNo').addEventListener('click', () => {
      popup.remove();
    });
  }

  // Intercept all page link clicks if form is dirty
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      if (isDirty) {
        e.preventDefault();
        showLeavePopup();
      }
    });
  });


  // Add an initial dummy state so back button triggers popstate
  history.pushState(null, null, window.location.href);

  // Handle custom back button confirmation
  window.addEventListener('popstate', (e) => {
    if (isDirty) {
      // Re-push state to cancel back navigation
      history.pushState(null, null, window.location.href);
      showLeavePopup(); // show your custom popup
    }
  });
  
});
