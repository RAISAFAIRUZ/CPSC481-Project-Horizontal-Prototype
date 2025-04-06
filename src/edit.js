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

    document.getElementById('save').addEventListener('click', () => savePhoto(index));
});

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

    alert("Photo updated successfully.");
    window.location.href = 'index.html'; // Redirect back to the main page
}

function cancelEdit() {
    window.location.href = '/src/index.html';
}



