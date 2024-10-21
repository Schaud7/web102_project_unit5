import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  const fetchWeatherData = async (city) => {
    if (!city) return;

    const response = await fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=8882dc59e87b4907817f9a03e754b4fc`);
    if (!response.ok) {
      setMessage('Failed to fetch weather data.');
      return;
    }

    const data = await response.json();
    const newWeather = data.data[0];

    if (newWeather) {
      setWeatherData(newWeather);
      setHistory((prevHistory) => [...prevHistory, newWeather]);
      setMessage('');
    } else {
      setMessage('No data found for this location.');
    }
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData(location);
    setLocation('');
  };

  useEffect(() => {
    // Optionally fetch weather data for a default location on load
    fetchWeatherData('New York');
  }, []);

  return (
    <div className="container">
      <div className="sideNav">
        <h2>WeatherBit!</h2>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#search">Search</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </div>
      <div className="main-content">
        <div className="top-section">
          <h1>Weather Finder!</h1>
          <form onSubmit={handleLocationSubmit}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city name"
            />
            <button type="submit">Get Weather</button>
          </form>
          {weatherData && (
            <div className="weather-info">
              <h2>Current Weather in {weatherData.city_name}</h2>
              <p>Temperature: {weatherData.temp} °C</p>
              <p>Weather: {weatherData.weather.description}</p>
              <p>Humidity: {weatherData.rh}%</p>
              <p>Wind Speed: {weatherData.wind_spd} m/s</p>
            </div>
          )}
          {message && <p>{message}</p>}
        </div>
        <div className="history-section">
          <h2>Search History</h2>
          <ul>
            {history.map((weather, index) => (
              <li key={index}>{weather.city_name}, {weather.country_code}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
