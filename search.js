const rapidApiKey = 'cef1f28104msh73c944b20f697efp17df2ajsn1c104209af02';
const movieApiHost = 'moviesminidatabase.p.rapidapi.com';

document.getElementById('movieSearchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('movieTitle').value;
    document.getElementById('message').textContent = 'Searching for movies...';
    searchMovies(title);
});

document.getElementById('tvShowSearchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('tvShowTitle').value;
    document.getElementById('message').textContent = 'Searching for TV shows...';
    searchTVShows(title);
});

async function searchMovies(title) {
    const apiUrl = `https://${movieApiHost}/movie/imdb_id/byTitle/${encodeURIComponent(title)}/`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': movieApiHost
            }
        });
        if (!response.ok) {
            throw new Error(`Movie API response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        displayResults(data.results, 'movie');
    } catch (error) {
        document.getElementById('message').textContent = `An error occurred: ${error.message}. Please try again later.`;
        document.getElementById('results').innerHTML = '';
    }
}

async function searchTVShows(title) {
    const apiUrl = `https://${movieApiHost}/series/idbyTitle/${encodeURIComponent(title)}/`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': movieApiHost
            }
        });
        if (!response.ok) {
            throw new Error(`TV Show API response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        displayResults(data.results, 'tvShow');
    } catch (error) {
        document.getElementById('message').textContent = `An error occurred: ${error.message}. Please try again later.`;
        document.getElementById('results').innerHTML = '';
    }
}

function displayResults(results, type) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    for (const result of results) {
        const title = result.title || 'N/A';
        const imdbId = result.imdb_id || 'N/A';
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <h2>${title} (${type === 'movie' ? 'Movie' : 'TV Show'})</h2>
            <p>IMDB ID: ${imdbId}</p>
            <button onclick="loadStreamingScript('${imdbId}', this)">Check Streaming Availability</button>
            <div class="streaming-info"></div>
        `;
        resultsDiv.appendChild(resultItem);
    }
    document.getElementById('message').textContent = `${type === 'movie' ? 'Movies' : 'TV Shows'} found successfully.`;
}

function loadStreamingScript(imdbId, button) {
    if (!document.getElementById('streamingScript')) {
        const script = document.createElement('script');
        script.id = 'streamingScript';
        script.src = 'https://raw.githubusercontent.com/Hedgedogger/Streaming-Finder/main/streaming.js';
        document.body.appendChild(script);
        script.onload = () => fetchStreamingAvailability(imdbId, button);
    } else {
        fetchStreamingAvailability(imdbId, button);
    }
}
