const sheetID = '1M1vlTD4L1cTuf9U4un5lIDxogVVlXkhkHgTmvhMPH4I'; // Your Google Sheet ID
const apiKey = 'AIzaSyCC3ehiGhHCg0pP81LLrPCHX2vb84xUUQo'; // Your API Key
const newsRange = 'NewsPage!A:Y'; // Range in the Sheet
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${newsRange}?key=${apiKey}`;

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const resultsContainer = document.querySelector('.results');
const resultCountElement = document.createElement('p');
resultsContainer.appendChild(resultCountElement); // Add the element to display the result count

const paginationContainer = document.createElement('div'); // Create a container for pagination
paginationContainer.className = 'pagination';
resultsContainer.insertAdjacentElement('afterend', paginationContainer); // Add pagination below results

const articlesPerPage = 5; // Number of articles per page
let currentPage = 1; // Starting page

// Function to fetch and filter articles
function fetchAndDisplayArticles() {
    const query = searchInput.value.trim().toLowerCase();

    // If the search query is empty, display a message and return early
    if (!query) {
        resultsContainer.innerHTML = '<p>Vui lòng nhập từ khóa tìm kiếm.</p>';
        paginationContainer.innerHTML = ''; // Clear pagination
        return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            if (rows && rows.length > 1) {
                const headers = rows[0];
                const articles = rows.slice(1); // Exclude header row

                // Filter articles by matching the search query in the title (index 1)
                const filteredArticles = articles.filter(article => {
                    return article[1] && article[1].toLowerCase().includes(query);
                });

                // Display the result count
                const resultCount = filteredArticles.length;
                resultCountElement.textContent = `Có ${resultCount} kết quả được tìm thấy`;

                // Set up pagination
                const totalPages = Math.ceil(resultCount / articlesPerPage);

                // Function to display articles for the current page
                function displayArticlesForPage(page) {
                    resultsContainer.innerHTML = '';
                    resultsContainer.appendChild(resultCountElement);

                    const start = (page - 1) * articlesPerPage;
                    const end = start + articlesPerPage;
                    const articlesToDisplay = filteredArticles.slice(start, end);

                    articlesToDisplay.forEach(article => {
                        const articleNID = article[0];
                        const articleLink = document.createElement('a');
                        articleLink.href = `TrangTinTuc/TrangTinTuc.html?id=${articleNID}`; // Redirect to the corresponding news page
                        articleLink.className = 'news-card-link';

                        const articleElement = document.createElement('div');
                        articleElement.className = 'news-card';
                        articleElement.innerHTML = `
                            <div class="news-image">
                                <img src="${getGoogleDriveThumbnail(article[2])}" alt="${article[1]}">
                            </div>
                            <div class="news-details">
                                <h2 class="news-title">${article[1]}</h2>
                                <p class="news-date">${article[24]}</p>
                            </div>
                        `;

                        articleLink.appendChild(articleElement);
                        resultsContainer.appendChild(articleLink);
                    });

                    // Update pagination
                    paginationContainer.innerHTML = '';
                    for (let i = 1; i <= totalPages; i++) {
                        const pageLink = document.createElement('button');
                        pageLink.className = 'page-link';
                        pageLink.innerText = i;
                        if (i === page) pageLink.classList.add('active');
                        pageLink.addEventListener('click', () => {
                            currentPage = i;
                            displayArticlesForPage(i);
                        });
                        paginationContainer.appendChild(pageLink);
                    }
                }

                // Display the first page of articles
                displayArticlesForPage(currentPage);
            } else {
                resultsContainer.innerHTML = '<p>Không có kết quả được tìm thấy</p>';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Helper function to get Google Drive thumbnail
function getGoogleDriveThumbnail(url) {
    if (url && url.includes("drive.google.com")) {
        const fileId = url.match(/d\/(.+?)\//)[1];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600-h400`;
    }
    return url || '/path/to/default-image.jpg'; // Default image
}

// Event listeners for search
searchButton.addEventListener('click', fetchAndDisplayArticles);
searchInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        fetchAndDisplayArticles();
    }
});
