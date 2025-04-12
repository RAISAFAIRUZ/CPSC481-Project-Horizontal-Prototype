document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');

    let photo, isTemp = false;

    if (index === 'temp') {
        photo = JSON.parse(localStorage.getItem('viewPhotoTemp'));
        isTemp = true;
    } else {
        const photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
        photo = photos[index];
    }

    if (!photo) return;

    // Populate page
    document.getElementById('photo').src = photo.src;
    document.getElementById('name').textContent = photo.name;
    document.getElementById('place').textContent = photo.place;
    document.getElementById('price').textContent = photo.price;
    document.getElementById('description').textContent = photo.description;
    document.getElementById('motivation').textContent = photo.motivation;
    document.getElementById('hashtags').textContent = photo.hashtags;

    // Show both Edit and Remove
    const editBtn = document.getElementById('edit');
    const removeBtn = document.getElementById('remove');

    editBtn.addEventListener('click', () => {
        if (isTemp) {
            // Save this photo temporarily under a fake index
            const tempPhotos = JSON.parse(localStorage.getItem('tempLibrary')) || [];
            tempPhotos.push(photo);
            const newIndex = tempPhotos.length - 1;
            localStorage.setItem('tempLibrary', JSON.stringify(tempPhotos));
            window.location.href = `edit.html?tempIndex=${newIndex}`;
        } else {
            window.location.href = `edit.html?index=${index}`;
        }
    });

    removeBtn.addEventListener('click', () => {
        const popup = document.createElement('div');
        popup.classList.add('popup-container');
        popup.innerHTML = `
            <h2>Are you sure you want to delete this photo?</h2>
            <p>This action cannot be undone.</p>
            <div class="popup-buttons">
                <button id="confirm-delete">Yes, delete</button>
                <button id="cancel-delete">Cancel</button>
            </div>`;
        document.body.appendChild(popup);

        document.getElementById('confirm-delete').addEventListener('click', () => {
            if (isTemp) {
                localStorage.removeItem('viewPhotoTemp');
            } else {
                removePhoto(index);
            }
            popup.remove();
            window.location.href = 'index.html';
        });

        document.getElementById('cancel-delete').addEventListener('click', () => {
            popup.remove();
        });
    });
});

function removePhoto(index) {
    let photos = JSON.parse(localStorage.getItem('photoLibrary')) || [];
    photos.splice(index, 1);
    localStorage.setItem('photoLibrary', JSON.stringify(photos));
}
