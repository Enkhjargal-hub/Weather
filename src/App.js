import "./App.css";
import { useState, useEffect, useCallback } from "react";
import WeatherCard from "./components/WeatherCard";

const WeatherApiKey = "5c16f05f953742f5b6b22254251501";  // Таны API түлхүүр

function App() {
  const [countriesSearch, setCountriesSearch] = useState("Ulaanbaatar");
  const [suggestedCountries, setSuggestedCountries] = useState([]); // Харьцах улс
  const [suggestedCities, setSuggestedCities] = useState([]); // Хотын жагсаалтыг хадгалах
  const [weatherData, setWeatherData] = useState({ day: null, night: null });
  const [loading, setLoading] = useState(false);
  const [isDayTime, setIsDayTime] = useState(true); // Өдөр эсвэл шөнийн өгөгдлийг хянах
  const [selectedLocation, setSelectedLocation] = useState({ city: "", country: "" });

  // Fetch weather data
  const fetchWeatherData = useCallback(async (city, timeOfDay = 'day') => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WeatherApiKey}&q=${city}&days=2`,
        { method: "get", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.status}`);
      }
      const data = await response.json();

      const dayData = data.forecast.forecastday[0].hour.find((item) => {
        const hour = new Date(item.time).getHours();
        return hour === 12; // Өдрийн 12 цагийн мэдээлэл
      });

      const nightData = data.forecast.forecastday[0].hour.find((item) => {
        const hour = new Date(item.time).getHours();
        return hour === 0; // Шөнийн 12 цагийн мэдээлэл
      });

      setWeatherData({
        day: {
          date: dayData?.time.split(" ")[0],
          maxTemp: dayData?.temp_c,
          minTemp: dayData?.temp_c, // you can modify to actual minTemp if needed
          condition: dayData?.condition.text,
        },
        night: {
          date: nightData?.time.split(" ")[0],
          maxTemp: nightData?.temp_c,
          minTemp: nightData?.temp_c,
          condition: nightData?.condition.text,
        },
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData({ day: null, night: null });
    } finally {
      setLoading(false);
    }
  }, []);

  // Улсын жагсаалтыг татаж авах
  const fetchCountries = async (query) => {
    try {
      const response = await fetch(`https://countriesnow.space/api/v0.1/countries`);
      const data = await response.json();
      const filteredCountries = data.data.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestedCountries(filteredCountries);
    } catch (error) {
      console.error("Error fetching country list:", error);
      setSuggestedCountries([]);
    }
  };

  // Хотын жагсаалт татах
  const fetchCities = async (country) => {
    try {
      const response = await fetch(`https://countriesnow.space/api/v0.1/countries/cities?q=${country}`);
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

  // Search handler
  const handleSearch = () => {
    if (countriesSearch.trim() !== "") {
      fetchWeatherData(countriesSearch);
    }
  };

  // Country selection handler
  const handleCountrySelect = (country) => {
    setCountriesSearch(country.name);
    fetchCities(country.name);  // Хотын жагсаалтыг татах
    setSuggestedCountries([]);
  };

  // City selection handler
  const handleCitySelect = (city) => {
    const cityAndCountry = `${city}, ${countriesSearch.split(',')[1] || ""}`; // Combine city and country
    setCountriesSearch(cityAndCountry);
    setSelectedLocation({ city, country: countriesSearch.split(',')[1] || "" }); // Store selected city and country
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
            fetchCountries(e.target.value);  // Улсаар хайлт хийх
          }}
          placeholder="Search for a city"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {suggestedCountries.length > 0 && (
        <ul className="suggested-countries-list">
          {suggestedCountries.map((country, index) => (
            <li key={index} onClick={() => handleCountrySelect(country)}>
              {country.name}
            </li>
          ))}
        </ul>
      )}

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
        <button onClick={() => { setIsDayTime(true); fetchWeatherData(countriesSearch, 'day'); }} className="day-button">
          Өдөр
        </button>
        <button onClick={() => { setIsDayTime(false); fetchWeatherData(countriesSearch, 'night'); }} className="night-button">
          Шөнө
        </button>
      </div>

      {loading && <p className="loading">Loading</p>}

      {/* Display selected city and country */}
      {selectedLocation.city && selectedLocation.country && (
        <div>
          <h2>{selectedLocation.city}, {selectedLocation.country}</h2>
        </div>
      )}

      {/* Weather container */}
      <div className="weather-container">
        {isDayTime && weatherData.day && (
          <div className="day-weather">
            <WeatherCard
              title="Өдөр"
              date={weatherData.day.date}
              maxTemp={weatherData.day.maxTemp}
              minTemp={weatherData.day.minTemp}
              condition={weatherData.day.condition}
            />
          </div>
        )}
        {!isDayTime && weatherData.night && (
          <div className="night-weather">
            <WeatherCard
              title="Шөнө"
              date={weatherData.night.date}
              maxTemp={weatherData.night.maxTemp}
              minTemp={weatherData.night.minTemp}
              condition={weatherData.night.condition}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
