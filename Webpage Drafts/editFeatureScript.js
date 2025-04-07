const layoutSelect = document.getElementById("layoutSelector");
const layoutPreview = document.getElementById("layoutPreview");
const buttonContainer = document.getElementById("buttonContainer");

layoutSelect.addEventListener("change", () => {
  const count = parseInt(layoutSelect.value);
  layoutPreview.innerHTML = ""; // clear previous layout

  // Do not do anything if user selects "Select"
  if (count === 0) {
    layoutPreview.innerHTML = "";
    buttonContainer.style.display = "none"; // Hide buttons
    return;
  }

  // Show the buttons after a valid selection
  buttonContainer.style.display = "flex";

  // Create layout preview based on the selected number
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
  dropZone.textContent = `Drag and Drop Image ${index + 1}`;
  dropZone.dataset.index = index;

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
      };
      reader.readAsDataURL(file);
    }
  });

  return dropZone;
}


function createDropZone(index, size) {
  const dropZone = document.createElement("div");
  dropZone.classList.add("drop-zone", size);
  dropZone.textContent = `Drop image ${index + 1}`;
  dropZone.dataset.index = index;

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
      };
      reader.readAsDataURL(file);
    }
  });

  return dropZone;
}
