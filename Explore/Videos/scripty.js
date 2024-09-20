document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const videoList = document.getElementById('video-list');
  const categoriesSection = document.getElementById('categories');
  const videoModal = document.getElementById('video-modal');
  const modalVideoFrame = document.getElementById('modal-video-frame');
  const recommendationsList = document.getElementById('recommendations-list');
  const categories = new Set();
  let videosData = [];

  // Fetch video data from JSON file
  fetch('videos.json')
    .then(response => response.json())
    .then(data => {
      videosData = data;
      data.forEach(video => {
        video.categories.forEach(category => categories.add(category));
      });
      displayVideos(data);
      displayCategories([...categories]);

      // Add event listener for search
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredVideos = data.filter(video => video.title.toLowerCase().includes(query));
        displayVideos(filteredVideos);
      });

      // Add event listener for categories
      categoriesSection.addEventListener('click', (event) => {
        if (event.target.classList.contains('category')) {
          const selectedCategory = event.target.getAttribute('data-category');
          filterByCategory(selectedCategory);
        }
      });
    });

  function displayVideos(videos) {
    videoList.innerHTML = '';
    videos.forEach(video => {
      const videoCard = document.createElement('div');
      videoCard.classList.add('video-card');
      videoCard.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
        <div class="content">
          <h3>${video.title}</h3>
          <p>${video.description}</p>
          <div class="tags">${video.categories.map(category => `<span>${category}</span>`).join('')}</div>
        </div>
      `;
      videoCard.addEventListener('click', () => {
        openModal(video.id, video.categories);
      });
      videoList.appendChild(videoCard);
    });
  }

  function displayCategories(categories) {
    categoriesSection.innerHTML = '<button class="category active" data-category="all">All</button>';
    categories.forEach(category => {
      const categoryButton = document.createElement('button');
      categoryButton.classList.add('category');
      categoryButton.setAttribute('data-category', category);
      categoryButton.textContent = category;
      categoriesSection.appendChild(categoryButton);
    });
  }

  function filterByCategory(category) {
    const buttons = document.querySelectorAll('.category');
    buttons.forEach(button => button.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    if (category === 'all') {
      displayVideos(videosData);
    } else {
      const filteredVideos = videosData.filter(video => video.categories.includes(category));
      displayVideos(filteredVideos);
    }
  }

  function openModal(videoId, categories) {
    modalVideoFrame.src = `https://www.youtube.com/embed/${videoId}`;
    const relatedVideos = videosData.filter(video => video.categories.some(category => categories.includes(category)) && video.id !== videoId);
    displayRecommendations(relatedVideos);
    videoModal.style.display = 'flex';
  }

  function displayRecommendations(recommendations) {
    recommendationsList.innerHTML = '';
    recommendations.forEach(video => {
      const recommendationCard = document.createElement('div');
      recommendationCard.classList.add('recommendation-card');
      recommendationCard.innerHTML = `
        <img src="https://img.youtube.com/vi/${video.id}/0.jpg" alt="${video.title}">
        <div class="recommendation-content">
          <h3>${video.title}</h3>
          <p>${video.description}</p>
        </div>
      `;
      recommendationCard.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the modal from closing
        openModal(video.id, video.categories);
      });
      recommendationsList.appendChild(recommendationCard);
    });
  }

  videoModal.addEventListener('click', () => {
    videoModal.style.display = 'none';
    modalVideoFrame.src = '';
  });

  // Prevent clicks inside the modal content from closing the modal
  videoModal.querySelector('.modal-content').addEventListener('click', (event) => {
    event.stopPropagation();
  });
});
