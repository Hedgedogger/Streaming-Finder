const streamingApiHost = 'streaming-availability.p.rapidapi.com';

async function fetchStreamingAvailability(imdbId, button) {
    button.disabled = true;
    button.textContent = 'Loading...';
    const apiUrl = `https://${streamingApiHost}/shows/${imdbId}?series_granularity=episode&output_language=en`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': streamingApiHost
            }
        });
        if (!response.ok) {
            throw new Error(`Streaming API response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        displayStreamingInfo(data, button);
    } catch (error) {
        button.nextElementSibling.innerHTML = `<p>No streaming information available</p>`;
        console.error(error);
    } finally {
        button.disabled = false;
        button.textContent = 'Check Streaming Availability';
    }
}

function displayStreamingInfo(data, button) {
    let streamingDetails = 'No streaming information available';
    if (data && data.streamingInfo) {
        streamingDetails = Object.entries(data.streamingInfo)
            .map(([platform, countries]) => `${platform}: ${Object.keys(countries).join(', ')}`)
            .join('<br>');
    }
    button.nextElementSibling.innerHTML = `<p>${streamingDetails}</p>`;
}
