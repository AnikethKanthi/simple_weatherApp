// --- DOM references ---
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const locBtn = document.getElementById("loc-btn");
const statusEl = document.getElementById("status");

const placeEl = document.getElementById("place");
const tempEl = document.getElementById("temp");
const sumEl = document.getElementById("summary");
const windEl = document.getElementById("wind");
const humidityEl = document.getElementById("humidity");
const feelsEl = document.getElementById("feels");
const forecastGrid = document.getElementById("forecast-grid");

// --- Helpers ---
const fmt = (n, unit = "") => (n == null ? "—" : `${Math.round(n)}${unit}`);
const toDayName = (iso) => new Date(iso).toLocaleDateString(undefined, { weekday: "short" });

function setStatus(msg, isError = false) {
  statusEl.textContent = msg || "";
  statusEl.style.color = isError ? "#fca5a5" : "";
}

function renderCurrent({ city, current, humidity, apparent }) {
  placeEl.textContent = city ?? "—";
  tempEl.textContent = current != null ? `${Math.round(current)}°` : "—";
  sumEl.textContent = "Updated just now";
  windEl.textContent = fmt(apparent.wind, " m/s");
  humidityEl.textContent = fmt(humidity, "%");
  feelsEl.textContent = apparent.value != null ? `${Math.round(apparent.value)}°` : "—";
}

function renderForecast(days) {
  forecastGrid.innerHTML = "";
  days.forEach((d) => {
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `
      <div class="name">${toDayName(d.date)}</div>
      <div class="max">${fmt(d.tmax, "°")}</div>
      <div class="min">${fmt(d.tmin, "°")}</div>
    `;
    forecastGrid.appendChild(div);
  });
}

// --- API calls ---
// 1) Geocode a city to lat/lon using Open-Meteo Geocoding
async function geocodeCity(name) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", "1");
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("City not found");
  const r = data.results[0];
  return { lat: r.latitude, lon: r.longitude, city: `${r.name}, ${r.country_code}` };
}

// 2) Fetch weather/forecast for a lat/lon using Open-Meteo Forecast API
async function fetchWeather(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("current_weather", "true");
  url.searchParams.set("hourly", "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();

  // Current
  const current = data.current_weather?.temperature ?? null;

  // Humidity at current hour (approx)
  const nowISO = data.current_weather?.time;
  let humidity = null, feelsLike = null, wind = null;
  if (nowISO && data.hourly?.time) {
    const idx = data.hourly.time.indexOf(nowISO);
    if (idx !== -1) {
      humidity = data.hourly.relative_humidity_2m?.[idx] ?? null;
      feelsLike = data.hourly.apparent_temperature?.[idx] ?? null;
      wind = data.hourly.wind_speed_10m?.[idx] ?? null;
    }
  }
  // Forecast
  const days = (data.daily?.time || []).map((date, i) => ({
    date,
    tmax: data.daily.temperature_2m_max?.[i] ?? null,
    tmin: data.daily.temperature_2m_min?.[i] ?? null,
  }));

  return {
    current,
    humidity,
    apparent: { value: feelsLike, wind },
    days: days.slice(0, 5),
  };
}

// --- Actions ---
async function loadByCity(city) {
  try {
    setStatus("Searching…");
    const { lat, lon, city: cityLabel } = await geocodeCity(city);
    setStatus("Fetching weather…");
    const wx = await fetchWeather(lat, lon);
    renderCurrent({ city: cityLabel, current: wx.current, humidity: wx.humidity, apparent: wx.apparent });
    renderForecast(wx.days);
    setStatus("");
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Something went wrong", true);
  }
}

async function loadByGeolocation() {
  setStatus("Getting your location…");
  if (!("geolocation" in navigator)) {
    setStatus("Geolocation not supported.", true);
    return;
  }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { latitude: lat, longitude: lon } = pos.coords;
      // Reverse geocode to name (optional convenience)
      const place = await reverseGeocode(lat, lon).catch(() => null);
      setStatus("Fetching weather…");
      const wx = await fetchWeather(lat, lon);
      renderCurrent({ city: place || "Your location", current: wx.current, humidity: wx.humidity, apparent: wx.apparent });
      renderForecast(wx.days);
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("Could not fetch weather for your location.", true);
    }
  }, (err) => {
    console.error(err);
    setStatus("Location permission denied.", true);
  }, { enableHighAccuracy: true, timeout: 10000 });
}

// (Optional) Reverse geocoding to show a nice name for coordinates
async function reverseGeocode(lat, lon) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("count", "1");
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const r = data?.results?.[0];
  return r ? `${r.name}, ${r.country_code}` : null;
}

// --- Wire up UI ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;
  loadByCity(city);
});

locBtn.addEventListener("click", () => {
  loadByGeolocation();
});

// Load a default city on first visit
loadByCity("San Francisco");
