document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const movieTitle = document.getElementById('movieTitle').value;
    fetchStreamingAvailability(movieTitle);
});

async function fetchStreamingAvailability(title) {
    const url = `https://apis.justwatch.com/content/titles/en_US/popular?body={"query":"${encodeURIComponent(title)}","page_size":1,"page":1}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movieId = data.items[0].id;
        fetchDetailedAvailability(movieId);
    } catch (error) {
        console.error('Error fetching streaming availability:', error);
    }
}

async function fetchDetailedAvailability(movieId) {
    const url = `https://apis.justwatch.com/content/titles/movie/${movieId}/locale/en_US`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error fetching detailed availability:', error);
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.innerHTML = `<h2>${data.title}</h2>`;

    for (const country of Object.keys(data.offers)) {
        resultItem.innerHTML += `<h3>${country.toUpperCase()}</h3><ul>`;
        data.offers[country].forEach(offer => {
            resultItem.innerHTML += `<li>${offer.provider_id} (${offer.urls.standard_web})</li>`;
        });
        resultItem.innerHTML += `</ul>`;
    }

    resultsDiv.appendChild(resultItem);
}
