# 🌤️ Simple Weather App — HTML • CSS • JavaScript

A minimal, fast, and accessible weather app. Search by **city** or use **your current location**.  
Powered by **Open-Meteo** (no API key needed) with an optional **OpenWeatherMap** variant (API key).

---

## ✨ Demo

- **Live Site:** _Add your link here (GitHub Pages / Vercel / Netlify)_
- **Screenshots/GIFs:**  
  ![App Screenshot](./assets/screenshot.png) <!-- replace with your image path -->

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
