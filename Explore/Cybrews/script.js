const apiKey = 'pub_480530d78d65ad7d75b9505e2fd29043d22b6';
const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cybersecurity&category=technology`;
let nextPage = null;

async function fetchNews() {
    const url = nextPage ? `${apiUrl}&page=${nextPage}` : apiUrl;
    try {
        const response = await fetch(url);
        const data = await response.json();
        nextPage = data.nextPage;
        return data.results;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

function createArticleElement(article) {
    const articleElement = document.createElement('div');
    articleElement.className = 'article';

    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = article.link;
    titleLink.textContent = article.title;
    titleLink.target = '_blank';
    title.appendChild(titleLink);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `
        <span><strong>Source:</strong> ${article.source_id}</span>
        <span><strong>Published:</strong> ${new Date(article.pubDate).toLocaleString()}</span>
        <span><strong>Creator:</strong> ${article.creator || 'Unknown'}</span>
    `;

    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = article.description;

    const keywords = document.createElement('div');
    keywords.className = 'keywords';
    keywords.innerHTML = `<strong>Keywords:</strong> ${article.keywords ? article.keywords.join(', ') : 'None'}`;

    const country = document.createElement('div');
    country.className = 'country';
    country.innerHTML = `<strong>Country:</strong> ${article.country || 'Not specified'}`;

    const language = document.createElement('div');
    language.className = 'language';
    language.innerHTML = `<strong>Language:</strong> ${article.language || 'Not specified'}`;

    articleElement.appendChild(title);
    articleElement.appendChild(meta);

    if (article.image_url) {
        const image = document.createElement('img');
        image.src = article.image_url;
        image.alt = article.title;
        articleElement.appendChild(image);
    }

    articleElement.appendChild(description);
    
    const infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';
    infoContainer.appendChild(keywords);
    infoContainer.appendChild(country);
    infoContainer.appendChild(language);
    articleElement.appendChild(infoContainer);

    return articleElement;
}

async function loadNews() {
    const newsContainer = document.getElementById('news-container');
    const articles = await fetchNews();

    articles.forEach(article => {
        const articleElement = createArticleElement(article);
        newsContainer.appendChild(articleElement);
    });

    if (!nextPage) {
        document.getElementById('load-more').style.display = 'none';
    }
}

document.getElementById('load-more').addEventListener('click', loadNews);

// Initial load
loadNews();