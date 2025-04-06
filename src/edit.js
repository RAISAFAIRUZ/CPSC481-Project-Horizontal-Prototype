document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
    const photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    const photo = photos[index];

    // Set the photo image in the edit page
    document.getElementById('photo').src = photo.src;

    // Pre-fill the edit form with the photo data
    document.getElementById('name').value = photo.name;
    document.getElementById('place').value = photo.place;
    document.getElementById('price').value = photo.price;
    document.getElementById('description').value = photo.description;
    document.getElementById('motivation').value = photo.motivation;
    document.getElementById('hashtags').value = photo.hashtags;
    document.getElementById('category').value = photo.category;

    // Save changes when Save button is clicked
    document.getElementById('save').addEventListener('click', () => {
        const popup = createSaveConfirmationPopup();
        document.body.appendChild(popup);

        // Handle confirm save button
        document.getElementById('confirm-save').addEventListener('click', () => {
            savePhoto(index);  // Save the changes
            popup.remove();  // Remove the popup after saving
            window.location.href = `viewPhoto.html?index=${index}`; // Redirect to the view page
        });

        // Handle cancel button (close the popup)
        document.getElementById('cancel-save').addEventListener('click', () => {
            popup.remove(); // Remove the popup if user cancels the save action
        });
    });

    // Cancel edit button with confirmation popup
    document.getElementById('cancel-edit').addEventListener('click', () => {
        const popup = createCancelPopup();
        document.body.appendChild(popup);

        // Handle confirm cancel button
        document.getElementById('confirm-cancel').addEventListener('click', () => {
            window.location.href = `viewPhoto.html?index=${index}`; // Redirect back to the view page without changes
            popup.remove();  // Remove the popup after canceling
        });

        // Handle cancel button (close the popup)
        document.getElementById('cancel-cancel').addEventListener('click', () => {
            popup.remove(); // Remove the popup if user cancels the cancel action
        });
    });
});

// Function to save photo after editing
function savePhoto(index) {
    const name = document.getElementById('name').value.trim();
    const place = document.getElementById('place').value.trim();
    const price = document.getElementById('price').value.trim();
    const description = document.getElementById('description').value.trim();
    const motivation = document.getElementById('motivation').value.trim();
    const hashtags = document.getElementById('hashtags').value.trim();
    const category = document.getElementById('category').value.trim();

    // Validate inputs
    if (!name || !place || !price || !description || !motivation || !hashtags || !category) {
        alert("All fields must be filled out.");
        return;
    }

    if (!/^\$\d+(\.\d{2})?$/.test(price)) {
        alert("Price format is invalid. Example: $3.99");
        return;
    }

    let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    photos[index] = { name, place, price, description, motivation, hashtags, category, src: photos[index].src };

    localStorage.setItem('photoLibrary', JSON.stringify(photos));
}

// Function to create save confirmation popup
function createSaveConfirmationPopup() {
    const popup = document.createElement('div');
    popup.classList.add('popup-container');
    popup.innerHTML = `
        <h2>Are you sure you want to save these changes?</h2>
        <p>All previous unsaved changes will be applied.</p>
        <div class="popup-buttons">
            <button id="confirm-save">Yes, save changes</button>
            <button id="cancel-save">No, stay</button>
        </div>
    `;
    return popup;
}

// Function to create cancel confirmation popup
function createCancelPopup() {
    const popup = document.createElement('div');
    popup.classList.add('popup-container');
    popup.innerHTML = `
        <h2>Are you sure you want to cancel?</h2>
        <p>All saved changes will go away.</p>
        <div class="popup-buttons">
            <button id="confirm-cancel">Yes, cancel</button>
            <button id="cancel-cancel">No, stay</button>
        </div>
    `;
    return popup;
}
