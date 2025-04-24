const sheetID = '1M1vlTD4L1cTuf9U4un5lIDxogVVlXkhkHgTmvhMPH4I'; // Google Sheet ID
const apiKey = 'AIzaSyCC3ehiGhHCg0pP81LLrPCHX2vb84xUUQo'; // API Key
const newsRange = 'NewsPage!A:Y'; // Range in the Sheet
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${newsRange}?key=${apiKey}`;

// Function to parse date in "DD/MM/YYYY" or other common formats
function parseDate(dateString) {
    if (!dateString) return new Date(0); // Return earliest date if date string is invalid
    const parts = dateString.split(/[-/]/).map(Number); // Split by either '-' or '/'
    return new Date(parts[2], parts[1] - 1, parts[0]); // Construct date (Month is zero-based)
}

// Helper function to get Google Drive thumbnail with custom size
function getGoogleDriveThumbnail(url) {
    if (url && url.includes("drive.google.com")) {
        const fileId = url.match(/d\/(.+?)\//);
        if (fileId && fileId[1]) {
            return `https://drive.google.com/thumbnail?id=${fileId[1]}&sz=w1360-h1020`;
        }
    }
    return url; // Return the original URL if not a Google Drive link
}

// Function to fetch and display 3 recent news items
function fetchRecentNews() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            if (rows && rows.length > 1) {
                const articles = rows.slice(1).map(row => ({
                    title: row[1] || 'No Title', // Default title if missing
                    date: row[24] || '01/01/1970', // Default date if missing
                    imageUrl: getGoogleDriveThumbnail(row[2] || ''), // Default image URL if missing
                    link: `/D-TinTucMain/TrangTinTuc/TrangTinTuc.html?id=${row[0]}` // Construct link using ID
                }));

                // Sort articles by date in descending order
                articles.sort((a, b) => parseDate(b.date) - parseDate(a.date));

                // Take the 3 most recent articles
                const recentArticles = articles.slice(0, 3);

                // Update the news section
                const newsContainer = document.querySelector('.news-container');
                newsContainer.innerHTML = ''; // Clear existing news items

                recentArticles.forEach(article => {
                    const newsItem = document.createElement('a');
                    newsItem.href = article.link;
                    newsItem.className = 'news-item';

                    newsItem.innerHTML = `
                        <div class="image-wrapper">
                            <img src="${article.imageUrl}" alt="${article.title}">
                        </div>
                        <h3>${article.title}</h3>
                        <p>${article.date}</p>
                    `;

                    newsContainer.appendChild(newsItem);
                });
            }
        })
        .catch(error => console.error('Error fetching news data:', error));
}

// Call the function to fetch and display recent news on page load
fetchRecentNews();
