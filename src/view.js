document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
    const photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    const photo = photos[index];

    // Pre-fill the page with the photo details
    document.getElementById('photo').src = photo.src;
    document.getElementById('name').textContent = photo.name;
    document.getElementById('place').textContent = photo.place;
    document.getElementById('price').textContent = photo.price;
    document.getElementById('description').textContent = photo.description;
    document.getElementById('motivation').textContent = photo.motivation;
    document.getElementById('hashtags').textContent = photo.hashtags;
    document.getElementById('category').textContent = photo.category;

    // Handle Edit button click
    document.getElementById('edit').addEventListener('click', () => {
        window.location.href = `edit.html?index=${index}`;
    });

    // Handle Remove button click
    document.getElementById('remove').addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
            removePhoto(index);
        }
    });
});

function removePhoto(index) {
    let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    photos.splice(index, 1); // Remove the photo
    localStorage.setItem('photoLibrary', JSON.stringify(photos));
    alert("Photo removed successfully.");
    window.location.href = 'index.html'; // Redirect back to the main page
}
