# 🌤️ Simple Weather App — HTML • CSS • JavaScript

A minimal, fast, and accessible weather app. Search by **city** or use **your current location**.  
Powered by **Open-Meteo** (no API key needed) with an optional **OpenWeatherMap** variant (API key).

---

## ✨ Demo

- **Live Site:** _Add your link here (GitHub Pages / Vercel / Netlify)_
- **Screenshots/GIFs:**  


---

## 🚀 Features

- 🔎 City search with geocoding (name → lat/lon)  
- 📍 “Use my location” via browser geolocation  
- 🌡️ Current temperature, feels-like, wind, humidity  
- 📅 5-day forecast (max/min)  
- ♿ Accessible status updates (`aria-live`), keyboard friendly  
- 📱 Responsive layout, works offline as a static site

---

## 🧰 Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript  
- **APIs:** 
  - Default: **Open-Meteo Geocoding** + **Open-Meteo Forecast** (no key)  
  - Optional: **OpenWeatherMap** One Call 3.0 + Direct Geocoding (API key)

---

## 🗂️ Project Structure

weather-app/
├─ index.html
├─ styles.css
├─ app.js


---

## 🧠 How it works (API flow)

1. **User action:** type a city or click **Use my location**.  
2. **Geocoding:** convert city → coordinates.  
   - `GET https://geocoding-api.open-meteo.com/v1/search?name=London&count=1`
3. **Weather:** fetch current + hourly + daily data with coordinates.  
   - `GET https://api.open-meteo.com/v1/forecast?...&current_weather=true&hourly=...&daily=...`
4. **Parse JSON → Render UI** (update DOM).  
5. **Errors handled** with friendly messages (network, city not found, geolocation denied).

---

## ⚡ Quick Start

> No build tools required. It’s a static site.

```bash
# 1) Clone
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2) Run locally (choose one):
#    - Open index.html in your browser, or
#    - Serve with a tiny dev server (recommended):
# macOS/Linux
python3 -m http.server 5173
# Windows (PowerShell)
python -m http.server 5173

# Visit http://localhost:5173

API Details (Open-Meteo – default)
Geocoding (city → lat/lon)

GET https://geocoding-api.open-meteo.com/v1/search
  ?name=Seattle
  &count=1

Sample response (trimmed)
{
  "results": [
    { "name": "Seattle", "latitude": 47.6036, "longitude": -122.3294, "country_code": "US" }
  ]
}

Weather (coordinates → data)
GET https://api.open-meteo.com/v1/forecast
  ?latitude=47.6036
  &longitude=-122.3294
  &current_weather=true
  &hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m
  &daily=temperature_2m_max,temperature_2m_min
  &timezone=auto

#You’ll use:

#current_weather.temperature

#Hourly arrays aligned to current_weather.time (humidity, feels-like, wind)

#Daily arrays (temperature_2m_max/min) → show next 5 days
