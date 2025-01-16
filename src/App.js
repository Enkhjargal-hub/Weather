import "./App.css";
import { useState, useEffect, useCallback } from "react";
import WeatherCard from "./components/WeatherCard";

const WeatherApiKey = "5c16f05f953742f5b6b22254251501"; 

function App() {
  const [countriesSearch, setCountriesSearch] = useState("Ulaanbaatar");
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [weatherData, setWeatherData] = useState({ day: null, night: null });
  const [loading, setLoading] = useState(false);
  const [isDayTime, setIsDayTime] = useState(true);

  const fetchWeatherData = useCallback(async (city) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WeatherApiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.status}`);
      }
      const data = await response.json();

      const dayData = data.list.find((item) => {
        const hour = new Date(item.dt_txt).getHours();
        return hour === 12; // Өдрийн 12 цагийн мэдээлэл
      });

      const nightData = data.list.find((item) => {
        const hour = new Date(item.dt_txt).getHours();
        return hour === 0; // Шөнийн 12 цагийн мэдээлэл
      });

      setWeatherData({
        day: {
          date: dayData?.dt_txt.split(" ")[0],
          maxTemp: dayData?.main.temp_max,
          minTemp: dayData?.main.temp_min,
          condition: dayData?.weather[0].description,
        },
        night: {
          date: nightData?.dt_txt.split(" ")[0],
          maxTemp: nightData?.main.temp_max,
          minTemp: nightData?.main.temp_min,
          condition: nightData?.weather[0].description,
        },
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData({ day: null, night: null });
    } finally {
      setLoading(false);
    }
  }, []);

  // Хотын жагсаалт татах
  const fetchCities = async (country) => {
    try {
      const response = await fetch(`https://countriesnow.space/api/v0.1/countries=${country}`);
      const data = await response.json();
      setSuggestedCities(data.data || []);
    } catch (error) {
      console.error("Error fetching city list:", error);
      setSuggestedCities([]);
    }
  };

  useEffect(() => {
    fetchWeatherData(countriesSearch);
  }, [countriesSearch, fetchWeatherData]);

  const handleSearch = () => {
    if (countriesSearch.trim() !== "") {
      fetchWeatherData(countriesSearch);
    }
  };

  const handleCitySelect = (city) => {
    setCountriesSearch(city);
    fetchWeatherData(city);
    setSuggestedCities([]);
  };

  return (
    <div className={`app-container ${isDayTime ? "day" : "night"}`}>
      <div className="search-container">
        <input
          type="text"
          value={countriesSearch}
          onChange={(e) => {
            setCountriesSearch(e.target.value);
            fetchCities(e.target.value);  // Хотоор хайлт хийх
          }}
          placeholder="Search for a city"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {suggestedCities.length > 0 && (
        <ul className="suggested-cities-list">
          {suggestedCities.map((city, index) => (
            <li key={index} onClick={() => handleCitySelect(city)}>
              {city}
            </li>
          ))}
        </ul>
      )}

      <div className="button-container">
        <button onClick={() => setIsDayTime(true)} className="day-button">
          Өдөр
        </button>
        <button onClick={() => setIsDayTime(false)} className="night-button">
          Шөнө
        </button>
      </div>

      {loading && <p className="loading">Loading</p>}

      {weatherData.day && weatherData.night && (
        <div className="weather-container">
          <div className="day-weather">
            <WeatherCard
              title="Өдрийн цаг агаар"
              date={weatherData.day.date}
              maxTemp={weatherData.day.maxTemp}
              minTemp={weatherData.day.minTemp}
              condition={weatherData.day.condition}
            />
          </div>
          <div className="night-weather">
            <WeatherCard
              title="Шөнийн цаг агаар"
              date={weatherData.night.date}
              maxTemp={weatherData.night.maxTemp}
              minTemp={weatherData.night.minTemp}
              condition={weatherData.night.condition}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
