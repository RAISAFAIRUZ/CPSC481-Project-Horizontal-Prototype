document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
    const photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    const photo = photos[index];

    // Set the photo image
    document.getElementById('photo').src = photo.src;

    // Fill input fields
    document.getElementById('name').value = photo.name;
    document.getElementById('place').value = photo.place;
    document.getElementById('price').value = photo.price;
    document.getElementById('description').value = photo.description;
    document.getElementById('motivation').value = photo.motivation;
    document.getElementById('hashtags').value = photo.hashtags;

    // Populate category dropdown and pre-select value
    const select = document.getElementById('category');
    const savedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    select.innerHTML = '<option value="">Select Category</option>';
    savedCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    select.value = photo.category;

    // Handle Save
    document.getElementById('save').addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const place = document.getElementById('place').value.trim();
        const price = document.getElementById('price').value.trim();
        const description = document.getElementById('description').value.trim();
        const motivation = document.getElementById('motivation').value.trim();
        const hashtags = document.getElementById('hashtags').value.trim();
        const category = document.getElementById('category').value.trim();

        // Validate BEFORE showing confirmation
        if (!name || !place || !price || !description || !motivation || !hashtags || !category) {
            showErrorPopup("One or more fields are empty. Please fill out all fields.");
            return;
        }

        if (!/^\$\d+(\.\d{2})?$/.test(price)) {
            showErrorPopup("Price format is invalid. Use format like $3.99.");
            return;
        }

        // Show confirmation popup
        const popup = createConfirmationPopup(
            "Are you sure you want to save these changes?",
            "All previous unsaved changes will be applied.",
            () => {
                const success = savePhoto(index);
                popup.remove();
                if (success) {
                    const successPopup = createPopup("Photo updated successfully.", true);
                    document.body.appendChild(successPopup);
                    setTimeout(() => {
                        successPopup.remove();
                        window.location.href = `viewPhoto.html?index=${index}`;
                    }, 1800);
                }
            }
        );
        document.body.appendChild(popup);
    });

    // Handle Cancel
    document.getElementById('cancel-edit').addEventListener('click', () => {
        const popup = createConfirmationPopup(
            "Are you sure you want to cancel?",
            "All changes will be lost.",
            () => {
                popup.remove();
                window.location.href = "index.html";
            }
        );
        document.body.appendChild(popup);
    });
});

// ✅ Save logic with full validation and category update
function savePhoto(index) {
    const name = document.getElementById('name').value.trim();
    const place = document.getElementById('place').value.trim();
    const price = document.getElementById('price').value.trim();
    const description = document.getElementById('description').value.trim();
    const motivation = document.getElementById('motivation').value.trim();
    const hashtags = document.getElementById('hashtags').value.trim();
    const category = document.getElementById('category').value.trim();

    // Final safety validation (in case someone skips via JS)
    if (!name || !place || !price || !description || !motivation || !hashtags || !category) {
        showErrorPopup("One or more fields are empty. Please fill out all fields.");
        return false;
    }

    if (!/^\$\d+(\.\d{2})?$/.test(price)) {
        showErrorPopup("Price format is invalid. Use format like $3.99.");
        return false;
    }

    let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    const oldCategory = photos[index].category;

    // Update main photo list
    const updatedPhoto = {
        name, place, price, description, motivation, hashtags, category, src: photos[index].src
    };
    photos[index] = updatedPhoto;
    localStorage.setItem('photoLibrary', JSON.stringify(photos));

    // Handle category change
    if (oldCategory !== category) {
        let oldImages = JSON.parse(localStorage.getItem(`categoryImages_${oldCategory}`)) || [];
        oldImages = oldImages.filter(p => p.src !== updatedPhoto.src);
        localStorage.setItem(`categoryImages_${oldCategory}`, JSON.stringify(oldImages));

        let newImages = JSON.parse(localStorage.getItem(`categoryImages_${category}`)) || [];
        newImages.push(updatedPhoto);
        localStorage.setItem(`categoryImages_${category}`, JSON.stringify(newImages));
    }

    return true;
}

// ✅ Error popup (centered, styled)
function showErrorPopup(message) {
    const existing = document.querySelector('.popup-container');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.classList.add('popup-container');
    popup.innerHTML = `<h2>${message}</h2>`;
    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 2200);
}

// ✅ Generic popup (can be used for success)
function createPopup(message, isSuccess = false) {
    const popup = document.createElement('div');
    popup.className = `popup-container ${isSuccess ? 'success' : ''}`;
    popup.innerHTML = `<h2>${message}</h2>`;
    return popup;
}

// ✅ Confirmation popup with Yes/No actions
function createConfirmationPopup(title, subtitle, onConfirm) {
    const popup = document.createElement('div');
    popup.className = 'popup-container';
    popup.innerHTML = `
        <h2>${title}</h2>
        <p>${subtitle}</p>
        <div class="popup-buttons">
            <button id="confirm">Yes</button>
            <button id="cancel">No</button>
        </div>
    `;

    popup.querySelector('#confirm').addEventListener('click', () => onConfirm());
    popup.querySelector('#cancel').addEventListener('click', () => popup.remove());

    return popup;
}
