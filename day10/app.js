const API_KEY = '14561fa881dd61c6fd1c19e6796f7fc6';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM refs
const cityInput  = document.getElementById('city-input');
const searchBtn  = document.getElementById('search-btn');
const errorMsg   = document.getElementById('error-msg');
const datetimeEl = document.getElementById('datetime');

// Update header clock every second
function updateClock() {
  const now = new Date();
  datetimeEl.textContent = now.toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
}
updateClock();
setInterval(updateClock, 1000);

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
  const windKmh = (d.wind.speed * 3.6).toFixed(1);
  const visKm   = (d.visibility / 1000).toFixed(1);
  const tz      = d.timezone;

  // Hero
  set('city-name',    d.name);
  set('country-code', d.sys.country);
  set('temp-main',    `${Math.round(d.main.temp)}°C`);
  set('temp-high',    `최고 ${Math.round(d.main.temp_max)}°C`);
  set('temp-low',     `최저 ${Math.round(d.main.temp_min)}°C`);
  set('temp-feel',    `체감 ${Math.round(d.main.feels_like)}°C`);
  set('weather-desc', d.weather[0].description);
  set('stat-humidity', `${d.main.humidity}%`);
  set('stat-wind',    `${windKmh} km/h`);
  set('stat-sunrise', unixToTime(d.sys.sunrise, tz));
  set('stat-sunset',  unixToTime(d.sys.sunset, tz));

  // Detail Grid
  set('d-humidity',   d.main.humidity);
  set('d-wind',       windKmh);
  set('d-pressure',   d.main.pressure);
  set('d-visibility', visKm);
  set('d-feels',      Math.round(d.main.feels_like));
  set('d-uv',         '—');   // Current Weather API에 UV 없음
  set('d-clouds',     d.clouds.all);
  set('d-dew',        dewpoint(d.main.temp, d.main.humidity));
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

// Initial load
fetchWeather('Seoul');
