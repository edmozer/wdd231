// chamberHome.js
// JS for Chamber Home Page: weather, spotlights, footer year/last modified


// --- Weather Section ---
const apiKey = '0e15c7a21921b0991f32ddcfb0ad91ce'; // OpenWeatherMap API key
const city = 'Asheville'; // Change to your city
const units = 'imperial'; // or 'metric'

async function fetchWeather() {
    try {
        // Current weather
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`);
        const currentData = await currentRes.json();
        // 3-day forecast
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`);
        const forecastData = await forecastRes.json();
        // Update DOM
        document.getElementById('current-temp').textContent = `${Math.round(currentData.main.temp)}°`;
        document.getElementById('current-desc').textContent = currentData.weather[0].description;
        // Get next 3 days at noon
        const days = {};
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            if (date.getHours() === 12 && Object.keys(days).length < 3 && !days[day]) {
                days[day] = Math.round(item.main.temp);
            }
        });
        const forecastList = document.getElementById('forecast-list');
        forecastList.innerHTML = '';
        Object.entries(days).forEach(([day, temp]) => {
            const li = document.createElement('li');
            li.textContent = `${day}: ${temp}°`;
            forecastList.appendChild(li);
        });
    } catch (err) {
        document.getElementById('current-temp').textContent = '--';
        document.getElementById('current-desc').textContent = 'Unable to load weather';
        document.getElementById('forecast-list').innerHTML = '';
    }
}
fetchWeather();

// --- Spotlights Section ---
async function fetchSpotlights() {
    try {
        const res = await fetch('data/members.json');
        const data = await res.json();
        // Filter gold/silver
        const eligible = data.members.filter(m => ['Gold','Silver'].includes(m.membership));
        // Shuffle and pick 2-3
        const shuffled = eligible.sort(() => 0.5 - Math.random());
        const spotlights = shuffled.slice(0, Math.floor(Math.random()*2)+2); // 2 or 3
        const container = document.getElementById('spotlights-container');
        container.innerHTML = '';
        spotlights.forEach(m => {
            const card = document.createElement('article');
            card.innerHTML = `
                <img src="${m.logo}" alt="${m.name} logo">
                <div>
                  <h3>${m.name}</h3>
                  <p><strong>Phone:</strong> ${m.phone}</p>
                  <p><strong>Address:</strong> ${m.address}</p>
                  <p><a href="${m.website}" target="_blank">Visit Website</a></p>
                  <span class="membership">${m.membership} Member</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        document.getElementById('spotlights-container').innerHTML = '<p>Unable to load member spotlights.</p>';
    }
}
fetchSpotlights();

// --- Footer Year & Last Modified ---
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;
