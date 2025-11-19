const apiKey = '0e15c7a21921b0991f32ddcfb0ad91ce';
const backendCity = 'Fortaleza,CE,BR';
const displayCity = 'Asheville';
const units = 'imperial';

async function fetchWeather() {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${backendCity}&units=${units}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${backendCity}&units=${units}&appid=${apiKey}`;
        const currentRes = await fetch(weatherUrl);
        const currentData = await currentRes.json();
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();
        document.getElementById('current-temp').textContent = `${Math.round(currentData.main.temp)}°`;
        document.getElementById('current-desc').textContent = currentData.weather[0].description + ' (Asheville)';
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
            li.textContent = `${day}: ${temp}° (Asheville)`;
            forecastList.appendChild(li);
        });
    } catch (err) {
        document.getElementById('current-temp').textContent = '--';
        document.getElementById('current-desc').textContent = 'Unable to load weather (Asheville)';
        document.getElementById('forecast-list').innerHTML = '';
    }
}

// Responsive navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

// Helper: Get random subset of array
function getRandomSubset(arr, min=1, max=3) {
  const count = Math.min(max, Math.max(min, arr.length));
  const shuffled = arr.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Fetch and filter members
async function fetchSpotlightMembers() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const members = await response.json();
    // Membership: 3=Gold, 2=Silver, 1=Bronze
    const eligible = members.filter(m => m.membership === 3 || m.membership === 2);
    return getRandomSubset(eligible);
  } catch (err) {
    return null;
  }
}

// Build DOM for each spotlight
function buildSpotlightCard(member) {
  const card = document.createElement('article');
  card.className = 'spotlight-card';
  card.innerHTML = `
    <img src="images/images/chamber/${member.image}" alt="${member.name}" />
    <div>
      <h3>${member.name}</h3>
      <span class="membership">${member.membership === 3 ? 'Gold' : 'Silver'}</span>
    </div>
  `;
  return card;
}

// Render spotlights
async function renderSpotlights() {
  const container = document.querySelector('.spotlights-container');
  container.innerHTML = '';
  const spotlights = await fetchSpotlightMembers();
  if (!spotlights || spotlights.length === 0) {
    container.innerHTML = '<p style="color:#b00;text-align:center;">Unable to load member spotlights.</p>';
    return;
  }
  spotlights.forEach(member => {
    container.appendChild(buildSpotlightCard(member));
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Weather and spotlights test logic
fetchWeather();
renderSpotlights();
