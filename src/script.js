document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('photo-grid');
    const count = document.getElementById('photo-count');

    if (grid) loadLibrary();

    const form = document.getElementById('upload-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
        document.getElementById('photo').addEventListener('change', handlePreviewChange);
        document.querySelector('button[onclick="previewPhoto()"]').addEventListener('click', previewPhoto);
    }
});

function loadLibrary() {
    const grid = document.getElementById('photo-grid');
    const count = document.getElementById('photo-count');
    let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];

    grid.innerHTML = ''; // Clear existing content
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'bg-white rounded-lg overflow-hidden shadow cursor-pointer';

        // Redirect to the viewPhoto page when the photo is clicked
        item.addEventListener('click', () => {
            window.location.href = `viewPhoto.html?index=${index}`;
        });

        item.innerHTML = `
            <img src="${photo.src}" alt="${photo.name}" class="w-full h-40 object-cover">
            <div class="p-2">
                <strong>${photo.name}</strong>
                <p>${photo.category}</p>
                <p>${photo.price}</p>
            </div>
        `;
        grid.appendChild(item);
    });

    count.textContent = `${photos.length} photos found.`;
}

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

function handlePreviewChange(e) {
    const preview = document.getElementById('preview');
    const uploadLabel = document.querySelector('label[for="photo"]');
    const file = e.target.files[0];

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.classList.remove('hidden');

        // Remove upload text and icon
        uploadLabel.style.display = "none";

        // Make image fill the box
        preview.classList.add('w-full', 'h-full', 'object-cover', 'rounded-xl');
    }
}

function previewPhoto() {
    const file = document.getElementById('photo').files[0];
    const preview = document.getElementById('preview');

    if (!file) {
        showPopupMessage("Cannot preview. No picture uploaded yet.", true);
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
    overlay.innerHTML = `
    <div class="relative bg-white p-4 rounded-lg max-w-3xl">
        <button class="absolute top-2 right-2 text-black font-bold" onclick="this.parentElement.parentElement.remove()">X</button>
        <img src="${preview.src}" class="max-h-[80vh] rounded" />
    </div>`;
    document.body.appendChild(overlay);
}

function handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const place = document.getElementById('place').value.trim();
    const price = document.getElementById('price').value.trim();
    const description = document.getElementById('description').value.trim();
    const motivation = document.getElementById('motivation').value.trim();
    const hashtags = document.getElementById('hashtags').value.trim();
    const category = document.getElementById('category').value.trim();
    const photo = document.getElementById('photo').files[0];

    if (!photo) {
        showPopupMessage("Cannot save photo without uploading a picture.", true);
        return;
    }

    if (!name || !place || !price || !description || !motivation || !hashtags || !category) {
        showPopupMessage("One or more fields are empty. Fill all fields to add photo to the library.", true);
        return;
    }

    if (!/^\$\d+(\.\d{2})?$/.test(price)) {
        showPopupMessage("Price format is invalid. Example: $3.99", true);
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const newPhoto = {
            name, place, price, description, motivation, hashtags, category, src: reader.result
        };

        // Add to main library
        let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
        photos.push(newPhoto);
        localStorage.setItem('photoLibrary', JSON.stringify(photos));

        // Add to category-specific images
        let categoryImages = JSON.parse(localStorage.getItem(`categoryImages_${category}`)) || [];
        categoryImages.push(newPhoto);
        localStorage.setItem(`categoryImages_${category}`, JSON.stringify(categoryImages));

        showPopupMessage("Success! Photo has been added.");

        setTimeout(() => {
            window.location.href = '/src/index.html';
        }, 1500);
    };
    reader.readAsDataURL(photo);
}


function cancelUpload() {
    // Remove any existing popup
    const existing = document.querySelector('.popup-container');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.classList.add('popup-container');
    popup.innerHTML = `
        <h2>Are you sure you want to cancel?</h2>
        <p>All unsaved changes will be lost.</p>
        <div class="popup-buttons">
            <button onclick="window.location.href='index.html'">Yes, cancel</button>
            <button onclick="this.closest('.popup-container').remove()">No, stay</button>
        </div>
    `;
    document.body.appendChild(popup);
}

