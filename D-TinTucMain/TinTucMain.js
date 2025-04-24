const sheetID = '1M1vlTD4L1cTuf9U4un5lIDxogVVlXkhkHgTmvhMPH4I'; // Your Google Sheet ID
const apiKey = 'AIzaSyCC3ehiGhHCg0pP81LLrPCHX2vb84xUUQo'; // Your API Key
const newsRange = 'NewsPage!A:Y'; // Range for the sheet data
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${newsRange}?key=${apiKey}`;

const articlesPerPage = 5; // Number of articles per page
let currentPage = 1; // Default starting page

// Function to fetch news articles from Google Sheets
function fetchNewsArticles() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            if (rows && rows.length > 1) {
                // Remove any existing articles
                const newsContainer = document.querySelector('.news-grid');
                newsContainer.innerHTML = '';

                // Get articles for the current page
                const start = (currentPage - 1) * articlesPerPage + 1;
                const end = start + articlesPerPage;
                const articlesToShow = rows.slice(start, end);

                // Handle the first article separately to apply the 'large' class
                if (articlesToShow.length > 0) {
                    const firstArticleNID = articlesToShow[0][0]; // Use NID from the first column
                    const firstArticle = document.createElement('a');
                    firstArticle.href = `TrangTinTuc/TrangTinTuc.html?id=${firstArticleNID}`;
                    firstArticle.className = 'news-card large';
                    firstArticle.innerHTML = `
                        <img src="${getGoogleDriveThumbnail(articlesToShow[0][2])}" alt="News Image">
                        <div class="news-overlay">
                            <div class="news-content">
                                <h2>${articlesToShow[0][1]}</h2>
                                <p>${articlesToShow[0][24]}</p> <!-- Updated to use column 25 for the date -->
                            </div>
                        </div>
                    `;
                    newsContainer.appendChild(firstArticle);
                }

                // Append the remaining articles with the regular 'news-card' class
                articlesToShow.slice(1).forEach(row => {
                    const articleNID = row[0]; // Use NID from the first column
                    const newsCard = document.createElement('a');
                    newsCard.href = `TrangTinTuc/TrangTinTuc.html?id=${articleNID}`;
                    newsCard.className = 'news-card';
                    newsCard.innerHTML = `
                        <img src="${getGoogleDriveThumbnail(row[2])}" alt="News Image">
                        <div class="news-content">
                            <h2>${row[1]}</h2>
                            <p>${row[24]}</p> <!-- Updated to use column 25 for the date -->
                        </div>
                    `;
                    newsContainer.appendChild(newsCard);
                });

                updatePagination(rows.length - 1); // Update pagination links
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Helper function to get Google Drive thumbnail with custom size
function getGoogleDriveThumbnail(url) {
    if (url.includes("drive.google.com")) {
        const fileId = url.match(/d\/(.+?)\//)[1];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1360-h1020`;
    }
    return url;
}

// Function to update pagination links based on the total number of articles
function updatePagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; // Clear existing pagination links

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.className = 'page-number';
        pageLink.innerText = i;
        if (i === currentPage) pageLink.classList.add('active');

        // Add event listener to change pages
        pageLink.addEventListener('click', (event) => {
            event.preventDefault();
            currentPage = i;
            fetchNewsArticles();
        });

        paginationContainer.appendChild(pageLink);
    }
}

// Initial fetch on page load
fetchNewsArticles();
