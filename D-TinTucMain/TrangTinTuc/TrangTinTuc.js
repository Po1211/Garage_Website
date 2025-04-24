// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the article ID from the URL
const articleId = parseInt(getUrlParameter('id'));

const sheetID = '1M1vlTD4L1cTuf9U4un5lIDxogVVlXkhkHgTmvhMPH4I'; // Google Sheet ID
const apiKey = 'AIzaSyCC3ehiGhHCg0pP81LLrPCHX2vb84xUUQo'; // API Key
const newsRange = 'NewsPage!A:Z'; // Range in the Sheet
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${newsRange}?key=${apiKey}`;

// Function to parse a date in "DD/MM/YYYY" format
function parseDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Month is zero-based in JavaScript Date
}

// Fetch data from Google Sheets
fetch(url)
    .then(response => response.json())
    .then(data => {
        const rows = data.values;

        if (rows && rows.length > 1) {
            if (articleId > 0 && articleId < rows.length) {
                const headers = rows[0];
                const content = rows[articleId];

                // Inject Title and Meta Information
                document.getElementById('article-title').innerText = content[1] || 'No Title Available';
                document.getElementById('article-meta').innerText = content[24] || 'No Date Available';

                // Inject Intro Image
                const introImage = document.getElementById('intro-image');
                if (content[2]) {
                    let imageUrl = content[2];
                    if (imageUrl.includes("drive.google.com")) {
                        const fileId = imageUrl.match(/d\/(.+?)\//)[1];
                        imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1360-h1020`;
                    }
                    introImage.src = imageUrl;
                    introImage.style.width = '100%';
                    introImage.style.objectFit = 'contain';
                    introImage.style.marginBottom = '30px';
                } else {
                    introImage.style.display = 'none';
                }

                // Inject Remaining Content and Images
                const articleContent = document.getElementById('article-content');
                articleContent.innerHTML = ''; // Clear any previous content

                // Loop through all content columns and append them to the article content
                for (let i = 3; i < headers.length; i++) {
                    if (i !== 23 && content[i]) { // Skip column 23 for now
                        let element;
                        if (headers[i].includes('Image')) {
                            let imageUrl = content[i];
                            if (imageUrl.includes("drive.google.com")) {
                                const fileId = imageUrl.match(/d\/(.+?)\//)[1];
                                imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1360-h1020`;
                            }
                            element = document.createElement('img');
                            element.src = imageUrl;
                            element.style.width = '100%';
                            element.style.objectFit = 'contain';
                            element.style.marginBottom = '20px';
                            element.style.display = 'block';
                        } else if (headers[i].includes('Content')) {
                            element = document.createElement('p');
                            element.style.fontSize = '16px';
                            element.style.lineHeight = '1.8';
                            element.style.color = '#333';
                            element.innerHTML = content[i];
                        }

                        if (element) {
                            articleContent.appendChild(element);
                        }
                    }
                }

                // Display content from column 23 as the last part of the article
                if (content[23]) {
                    const additionalContent = document.createElement('p');
                    additionalContent.style.fontSize = '20px';
                    additionalContent.style.lineHeight = '1.6';
                    additionalContent.style.color = '#555';
                    additionalContent.innerText = content[23]; // Content from column 23
                    articleContent.appendChild(additionalContent);
                }

                // Inject Tags from column 25
                const tagsContainer = document.querySelector('.tags-container'); // Use existing tags-container
                tagsContainer.innerHTML = ''; // Clear previous tags

                if (content[25]) {
                    const tags = content[25].split(' ').map(tag => tag.trim()); // Split tags by spaces and trim whitespace
                    tags.forEach(tag => {
                        const tagElement = document.createElement('span');
                        tagElement.className = 'tag';
                        tagElement.style.marginRight = '10px';
                        tagElement.style.padding = '5px 10px';
                        tagElement.style.backgroundColor = '#f1f1f1';
                        tagElement.style.borderRadius = '4px';
                        tagElement.style.fontSize = '14px';
                        tagElement.innerText = tag;
                        tagsContainer.appendChild(tagElement);
                    });
                }

                // Inject Related News
                const relatedNewsContainer = document.querySelector('.related-news-grid');
                relatedNewsContainer.innerHTML = ''; // Clear previous related news

                // Collect all articles excluding the current one, and parse dates for sorting
                const articlesWithDates = rows.slice(1).map((row, index) => {
                    return {
                        id: index + 1,
                        title: row[1],
                        date: parseDate(row[24]), // Use the parseDate function
                        imageUrl: row[2]
                    };
                }).filter(article => article.id !== articleId);

                // Sort articles by date in descending order (most recent first)
                articlesWithDates.sort((a, b) => b.date - a.date);

                // Take the 3 most recent articles
                const recentArticles = articlesWithDates.slice(0, 3);

                // Create and display the 3 recent articles
                recentArticles.forEach(article => {
                    const relatedLink = document.createElement('a');
                    relatedLink.href = `TrangTinTuc.html?id=${article.id}`;
                    relatedLink.className = 'news-card-link';

                    const relatedCard = document.createElement('div');
                    relatedCard.className = 'news-card';
                    let imageUrl = article.imageUrl;

                    if (imageUrl && imageUrl.includes("drive.google.com")) {
                        const fileId = imageUrl.match(/d\/(.+?)\//)[1];
                        imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1360-h1020`;
                    }

                    relatedCard.innerHTML = `
                        <img src="${imageUrl}" alt="${article.title}">
                        <div class="news-content">
                            <h3>${article.title}</h3>
                            <p>${article.date.toLocaleDateString()}</p>
                        </div>
                    `;
                    relatedLink.appendChild(relatedCard);
                    relatedNewsContainer.appendChild(relatedLink);
                });
            } else {
                console.error('Invalid article ID.');
            }
        } else {
            console.error('No data found in the sheet.');
        }
    })
    .catch(error => console.error('Error fetching data:', error));
