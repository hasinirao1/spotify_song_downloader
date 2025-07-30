document.getElementById('downloadBtn').addEventListener('click', downloadSong);

function getTrackID(url) {
  const match = url.match(/track\/([a-zA-Z0-9]+)(\?|$)/);
  return match ? match[1] : null;
}

async function downloadSong() {
  const url = document.getElementById('spotifyUrl').value.trim();
  const infoDiv = document.getElementById('songInfo');
  infoDiv.innerHTML = '🔍 Searching...';

  const trackID = getTrackID(url);
  if (!trackID) {
    infoDiv.innerHTML = '❌ Invalid Spotify URL. Please paste a correct track link.';
    return;
  }

  const apiUrl = 'https://spotify-music-mp3-downloader-api.p.rapidapi.com/download';
  const apiKey = '0402d6d1e4msh9d5f50ba9ebb292p1a37b5jsn21ab7abc8fb4'; // Replace with your own

  try {
    const response = await fetch(`${apiUrl}?songId=${trackID}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'spotify-music-mp3-downloader-api.p.rapidapi.com'
      }
    });

    console.log("API status:", response.status);
    if (!response.ok) throw new Error(`Status: ${response.status}`);

    const data = await response.json();
    console.log("Data:", data);

    if (data && data.title && data.medias && data.medias.length) {
      const { title, author, thumbnail, duration, medias } = data;
      infoDiv.innerHTML = `
        <img src="${thumbnail}" alt="Cover" style="width:100%;border-radius:10px;" /><br/><br/>
        <strong>🎵 Title:</strong> ${title}<br/>
        <strong>👤 Artist:</strong> ${author}<br/>
        <strong>⏱ Duration:</strong> ${duration} seconds<br/><br/>
        <a href="${medias[0].url}" download target="_blank">
          <button>⬇️ Download MP3</button>
        </a>
      `;
    } else {
      infoDiv.innerHTML = '⚠️ Song data not available. Try a different Spotify track.';
    }
  } catch (err) {
    console.error('Error:', err);
    infoDiv.innerHTML = '❌ Error downloading. Please try again later or check your API key.';
  }
}
