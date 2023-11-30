document.getElementById('randomImage').addEventListener('click', function() {
    fetch('https://api.unsplash.com/photos/random?client_id=YOUR_UNSPLASH_ACCESS_KEY')
        .then(response => response.json())
        .then(data => {
            // Handle the response data (set the image URL in a form field or display it)
            const imageUrl = data.urls.regular; // Adjust according to Unsplash API response
            document.getElementById('coverPhotoPreview').src = imageUrl;
            document.getElementById('coverPhotoPreview').style.display = 'block';
            document.getElementById('unsplashImageUrl').value = imageUrl;
        })
        .catch(error => console.error('Error:', error));
});
