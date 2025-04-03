document.addEventListener('DOMContentLoaded', () => {
    const photoId = new URLSearchParams(window.location.search).get('id');
    if (photoId !== null) loadPhoto(photoId);

    document.getElementById('edit-form').addEventListener('submit', saveChanges);
    document.getElementById('edit-photo').addEventListener('change', handlePhotoChange);
});

function loadPhoto(id) {
    let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    const photo = photos[id];

    if (!photo) {
        alert('Photo not found.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('edit-preview').src = photo.src;
    document.getElementById('edit-name').value = photo.name;
    document.getElementById('edit-place').value = photo.place;
    document.getElementById('edit-price').value = photo.price;
    document.getElementById('edit-description').value = photo.description;
    document.getElementById('edit-motivation').value = photo.motivation;
    document.getElementById('edit-hashtags').value = photo.hashtags;
    document.getElementById('edit-category').value = photo.category;
}

function handlePhotoChange(e) {
    const preview = document.getElementById('edit-preview');
    const file = e.target.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
    }
}

function previewEditPhoto() {
    const preview = document.getElementById('edit-preview').src;
    if (!preview) {
        showPopup('No picture uploaded.', true);
        return;
    }

    const container = document.createElement('div');
    container.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    container.innerHTML = `<img src="${preview}" class="max-w-2xl rounded shadow">`;
    container.addEventListener('click', () => container.remove());
    document.body.appendChild(container);
}

function saveChanges(e) {
    e.preventDefault();
    const id = new URLSearchParams(window.location.search).get('id');
    let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    const photo = photos[id];

    const name = document.getElementById('edit-name').value.trim();
    const place = document.getElementById('edit-place').value.trim();
    const price = document.getElementById('edit-price').value.trim();
    const description = document.getElementById('edit-description').value.trim();
    const motivation = document.getElementById('edit-motivation').value.trim();
    const hashtags = document.getElementById('edit-hashtags').value.trim();
    const category = document.getElementById('edit-category').value.trim();
    const newPhoto = document.getElementById('edit-photo').files[0];

    if (!name || !place || !price || !description || !motivation || !hashtags || !category) {
        showPopup('One or more fields are empty.', true);
        return;
    }

    if (!/^\$\d+(\.\d{2})?$/.test(price)) {
        showPopup('Price format is invalid. Example: $3.99', true);
        return;
    }

    const update = () => {
        photo.name = name;
        photo.place = place;
        photo.price = price;
        photo.description = description;
        photo.motivation = motivation;
        photo.hashtags = hashtags;
        photo.category = category;
        localStorage.setItem('photoLibrary', JSON.stringify(photos));
        showPopup('Changes saved successfully.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    };

    if (newPhoto) {
        const reader = new FileReader();
        reader.onload = function () {
            photo.src = reader.result;
            update();
        };
        reader.readAsDataURL(newPhoto);
    } else {
        update();
    }
}

function confirmDelete() {
    if (confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
        const id = new URLSearchParams(window.location.search).get('id');
        let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
        photos.splice(id, 1);
        localStorage.setItem('photoLibrary', JSON.stringify(photos));
        showPopup('Photo has been deleted.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

function showPopup(message, isError = false) {
    const container = document.createElement('div');
    container.className = `fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-md shadow-lg text-center max-w-xl z-50 border ${isError
        ? 'bg-red-100 text-red-700 border-red-300'
        : 'bg-green-100 text-green-700 border-green-300'
        }`;
    container.innerHTML = `<p class="font-semibold italic">${message}</p>`;
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 2500);
}