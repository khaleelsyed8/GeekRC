document.addEventListener('DOMContentLoaded', () => {
    const blogList = document.getElementById('blog-list');
    const blogPost = document.getElementById('blog-post');
    const relatedArticlesList = document.getElementById('related-articles-list');

    async function fetchBlogPosts() {
        try {
            const response = await fetch('blogs.json'); // Path to your JSON file
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blogPosts = await response.json();
            displayBlogList(blogPosts);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            blogList.innerHTML = `<p>Error loading blog posts. Please try again later.</p>`;
        }
    }

    function displayBlogList(blogPosts) {
        blogList.innerHTML = '';
        blogPosts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.date} | ${post.category}</p>
                <p>${post.summary}</p>
                <button onclick="viewPost(${post.id})">Read More</button>
            `;
            blogList.appendChild(postElement);
        });
        blogList.style.display = 'block';
        blogPost.style.display = 'none';
    }
    fetch('blogs.json')
        .then(response => response.json())
        .then(data => {
            displayBlogPost(data);
            fetchRelatedArticles(data.category);
        })
        .catch(error => console.error('Error fetching blog post:', error));

        function displayBlogPost(postId) {
            fetch('blogs.json')
                .then(response => response.json())
                .then(blogPosts => {
                    const post = blogPosts.find(p => p.id === postId);
                    if (post) {
                        blogPost.innerHTML = `
                            <h2>${post.title}</h2>
                            <p>${post.date} | ${post.category}</p>
                            <div class="blog-content">${post.content}</div>
                            <button onclick="backToList()">Back to List</button>
                        `;
                        blogList.style.display = 'none';
                        blogPost.style.display = 'block';
                    }
                })
                .catch(error => console.error('Error fetching blog post:', error));
        }

    window.viewPost = (postId) => {
        displayBlogPost(postId);
    };
    window.backToList = () => {
        fetchBlogPosts();
    };

    fetchBlogPosts();
    function fetchRelatedArticles(category) {
        // Fetch related articles based on the category (or other criteria)
        fetch(`blogs.json?category=${category}`)
            .then(response => response.json())
            .then(data => {
                displayRelatedArticles(data);
            })
            .catch(error => console.error('Error fetching related articles:', error));
    }

    function displayRelatedArticles(articles) {
        let htmlContent = '';

        articles.forEach(article => {
            htmlContent += `
                    <a onclick="viewPost(${article.id})">
                        <h4>${article.title}</h4>
                    </a>
            `;
        });

        relatedArticlesList.innerHTML = htmlContent;
    }

});
