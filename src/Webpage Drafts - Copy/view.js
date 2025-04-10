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


    // Handle Edit button click
    document.getElementById('edit').addEventListener('click', () => {
        window.location.href = `edit.html?index=${index}`;
    });

    // Handle Remove button click
    document.getElementById('remove').addEventListener('click', () => {
        // Create the red popup container
        const popup = document.createElement('div');
        popup.classList.add('popup-container');
        popup.innerHTML = `
        <h2>Are you sure you want to delete this photo?</h2>
        <p>This action cannot be undone.</p>
        <div class="popup-buttons">
          <button id="confirm-delete">Yes, delete</button>
          <button id="cancel-delete">Cancel</button>
        </div>
      `;
        document.body.appendChild(popup);

        // Handle confirm delete button
        document.getElementById('confirm-delete').addEventListener('click', () => {
            removePhoto(index);
            popup.remove();
            window.location.href = 'index.html'; // Go to edit library page
        });

        // Handle cancel button
        document.getElementById('cancel-delete').addEventListener('click', () => {
            popup.remove();
        });
    });
});

// Function to remove photo from localStorage
function removePhoto(index) {
    let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    photos.splice(index, 1); // Remove the photo
    localStorage.setItem('photoLibrary', JSON.stringify(photos));
}
