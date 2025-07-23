// App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const WEATHER_API_KEY = '5b0e2f4f18d5ccc6191d96e288ec0963';
  const PEXELS_API_KEY = 'GWz2e51g2kKaCA6J3QWHDfmXKAewiLo5tvpNKsmOnipNl2yaJPOfIEct';

  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WEATHER_API_KEY}&units=metric`
      );
      setWeather(weatherRes.data);
      setCity(cityName);
      fetchPexelsImage(cityName);
    } catch (error) {
      alert('City not found. Please try again.');
      setWeather(null);
      setBgImage(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPexelsImage = async (query) => {
    try {
      const response = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });

      if (response.data.photos.length > 0) {
        setBgImage(response.data.photos[0].src.landscape);
      } else {
        setBgImage(null);
      }
    } catch (err) {
      console.error('Pexels fetch failed:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity.trim() !== '') {
      fetchWeather(inputCity.trim());
      setInputCity('');
    }
  };

  const getTime = () => {
    return new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="weather-container"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(to right, #000428, #004e92)',
      }}
    >
      <div className="overlay">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search city..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading ? (
          <div className="spinner"></div>
        ) : weather ? (
          <>
            <div className="top-bar fade-in">
              <div className="menu-icon"></div>
              <div className="location-time">
                <div>{weather.name}</div>
                <div className="time">{getTime()} Local</div>
              </div>
              <div className="add-icon"></div>
            </div>

            <div className="temp-section fade-in">
              <div className="condition">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '8px' }}>{weather.weather[0].main}</span>
              </div>
              <div className="high-low">
                ↑ {Math.round(weather.main.temp_max)}° ↓ {Math.round(weather.main.temp_min)}°
              </div>
              <div className="temp">{Math.round(weather.main.temp)}°</div>
            </div>
          </>
        ) : (
          <div className="no-data">🔍 Search for a city to see weather and background.</div>
        )}
      </div>
    </div>
  );
}

export default App;
