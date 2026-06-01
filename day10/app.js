const API_KEY = '14561fa881dd61c6fd1c19e6796f7fc6';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM refs
const cityInput  = document.getElementById('city-input');
const searchBtn  = document.getElementById('search-btn');
const errorMsg   = document.getElementById('error-msg');
const datetimeEl = document.getElementById('datetime');

// Header date — matches design: "Sunday, June 1, 2026"
function updateClock() {
  const now = new Date();
  datetimeEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}
updateClock();
setInterval(updateClock, 60000);

// Unix timestamp → "HH:MM" (local time via timezone offset)
function unixToTime(unix, timezoneOffsetSec) {
  const date = new Date((unix + timezoneOffsetSec) * 1000);
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// Dewpoint approximation (Magnus formula)
function dewpoint(tempC, humidity) {
  const a = 17.27, b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(humidity / 100);
  return ((b * alpha) / (a - alpha)).toFixed(1);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}

function hideError() {
  errorMsg.classList.add('hidden');
}

function set(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

async function fetchWeather(city) {
  hideError();
  try {
    const res = await fetch(
      `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=kr`
    );
    if (res.status === 404) { showError('도시를 찾을 수 없습니다.'); return; }
    if (!res.ok) throw new Error('network');

    const d = await res.json();
    renderWeather(d);
  } catch {
    showError('데이터를 불러오지 못했습니다.');
  }
}

function renderWeather(d) {
  const windKmh = Math.round(d.wind.speed * 3.6);
  const visKm   = (d.visibility / 1000).toFixed(0);
  const feels   = Math.round(d.main.feels_like);
  const tz      = d.timezone;

  // Left weather block
  set('city-name',    `${d.name}, ${d.sys.country}`);
  set('temp-main',    `${Math.round(d.main.temp)}°C`);
  set('weather-desc', d.weather[0].description);
  set('temp-high',    `H: ${Math.round(d.main.temp_max)}°C`);
  set('temp-low',     `L: ${Math.round(d.main.temp_min)}°C`);

  // Right stat rows
  set('r-feels',      `${feels}°C`);
  set('r-humidity',   `${d.main.humidity}%`);
  set('r-wind',       `${windKmh} km/h`);
  set('r-visibility', `${visKm} km`);

  // Location row
  set('loc-coords',   `${d.coord.lat.toFixed(2)}° N, ${d.coord.lon.toFixed(2)}° E`);
  set('loc-sunrise',  `Sunrise ${unixToTime(d.sys.sunrise, tz)}`);
  set('loc-sunset',   `Sunset ${unixToTime(d.sys.sunset, tz)}`);
  set('loc-updated',  `Updated ${unixToTime(d.dt, tz)}`);

  // Detail Grid (bento)
  set('d-humidity',   `${d.main.humidity}%`);
  set('d-wind',       `${windKmh} km/h`);
  set('d-pressure',   `${d.main.pressure} hPa`);
  set('d-visibility', `${visKm} km`);
  set('d-feels',      `${feels}°C`);
  set('d-uv',         '—');   // Current Weather API에 UV 없음
  set('d-clouds',     `${d.clouds.all}%`);
  set('d-dew',        `${Math.round(dewpoint(d.main.temp, d.main.humidity))}°C`);
}

// Events
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
  }
});

// Render lucide icons
if (window.lucide) lucide.createIcons();

// Initial load
fetchWeather('Seoul');
