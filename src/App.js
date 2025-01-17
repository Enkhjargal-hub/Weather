import './tailwind.css';
import { useState, useEffect, useCallback } from "react";
import WeatherCard from "./components/WeatherCard";
import Day from './img/Day.png';  
import Night from './img/Night.png'; 
import Zurag from './img/Zurag.png';



const WeatherApiKey = "5c16f05f953742f5b6b22254251501";

function App() {
  const [countriesSearch, setCountriesSearch] = useState("Ulaanbaatar");
  const [weatherData, setWeatherData] = useState({ day: null, night: null });
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = useCallback(async (city) => {
    setLoading(true); //API ogogdol duudna
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WeatherApiKey}&q=${city}&days=2`,
        { method: "get", headers: { "Content-Type": "application/json" } }
      );
      const data = await response.json();

      const dayData = data.forecast.forecastday[0].hour.find((item) => {
        const hour = new Date(item.time).getHours();
        return hour === 12;
      });

      const nightData = data.forecast.forecastday[0].hour.find((item) => {
        const hour = new Date(item.time).getHours();
        return hour === 0;
      });

      setWeatherData({
        day: {
          date: dayData?.time.split(" ")[0],
          maxTemp: dayData?.temp_c,
          minTemp: dayData?.temp_c,
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

  useEffect(() => {
    fetchWeatherData(countriesSearch);
  }, [countriesSearch, fetchWeatherData]); //Ulsiin ner data oorchlogdoh burt medeelel tatagdana

  const handleSearch = () => {
    if (countriesSearch.trim() !== "") {
      fetchWeatherData(countriesSearch);
    }
  };  //Hooson text bish hotiin nereer ogogdol avna

  return (
    <div className="app-container">
  <img src={Zurag} alt="Background" className="background-image" />
  <div className="search-container">
    <input
      type="text"
      value={countriesSearch}
      onChange={(e) => setCountriesSearch(e.target.value)}
      placeholder="Search for a city"
      className="search-input"
    />
    <button onClick={handleSearch} className="search-button">
      Search
    </button>
  </div>

  {loading && <p className="loading">Loading</p>}


  <img src={Zurag} alt="Day" />
  <img src={Night} alt="Night" />

  <div className="weather-container">  
    {/* Day Weather Section */}
    <div className="weather-side left">
      {weatherData.day && (
        <WeatherCard
          title="Өдөр"
          photo={Day}  
          date={weatherData.day.date}
          maxTemp={weatherData.day.maxTemp}
          minTemp={weatherData.day.minTemp}
          condition={weatherData.day.condition}
        />
      )}
    </div>

    {/* Night Weather Section */}
    <div className="weather-side right">
      {weatherData.night && (
        <WeatherCard
          title="Шөнө"
          photo={Night} 
          date={weatherData.night.date}
          maxTemp={weatherData.night.maxTemp}
          minTemp={weatherData.night.minTemp}
          condition={weatherData.night.condition}
        />
      )}
    </div>
  </div>
</div>

  );
}

export default App;


