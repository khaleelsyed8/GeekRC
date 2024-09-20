document.addEventListener('DOMContentLoaded', () => {
    const fetchDetailsButton = document.getElementById('fetch-details');
    const generateJsonButton = document.getElementById('generate-json');
    const copyJsonButton = document.getElementById('copy-json');
  
    fetchDetailsButton.addEventListener('click', () => {
      const videoUrl = document.getElementById('video-url').value;
      const videoId = extractVideoID(videoUrl);
      
      if (videoId) {
        fetchVideoDetails(videoId);
      } else {
        alert('Invalid YouTube URL');
      }
    });
  
    generateJsonButton.addEventListener('click', () => {
      const videoId = document.getElementById('video-id').value;
      const title = document.getElementById('video-title').value;
      const description = document.getElementById('video-description').value;
      const tags = document.getElementById('video-tags').value.split(',').map(tag => tag.trim());
  
      const jsonData = {
        id: videoId,
        title: title,
        description: description,
        categories: tags
      };
  
      const jsonCode = JSON.stringify(jsonData, null, 2);
      document.getElementById('json-code').value = jsonCode;
      document.getElementById('json-output').style.display = 'block';
    });
  
    copyJsonButton.addEventListener('click', () => {
      const jsonCode = document.getElementById('json-code');
      jsonCode.select();
      document.execCommand('copy');
      alert('JSON copied to clipboard');
    });
  
    function extractVideoID(url) {
      const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|watch\?.+&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }
  
    function fetchVideoDetails(videoId) {
      const apiKey = 'Replace with your actual API key'; // 
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data.items && data.items.length > 0) {
            const video = data.items[0].snippet;
            document.getElementById('video-id').value = videoId;
            document.getElementById('video-title').value = video.title;
            document.getElementById('video-description').value = video.description;
            document.getElementById('video-details').style.display = 'block';
          } else {
            console.error('This Functionality has been disabled for Security reasons, We are finding an alternative.');
            alert('This Functionality has been disabled for Security reasons');
          }
        })
        .catch(error => {
          console.error('Error fetching video details:', error);
          alert('Error fetching video details');
        });
    }
  });
  
