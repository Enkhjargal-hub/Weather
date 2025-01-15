import "./App.css";
import { useState, useEffect, useCallback } from "react";
import WeatherCard from "./components/weatherCard";

function App() {
  const [countriesSearch, setCountriesSearch] = useState("Ulaanbaatar"); // Эхний хот оруулалт
  const [weatherData, setWeatherData] = useState(null); // Цаг агаарын мэдээлэл хадгалахад
  const [loading, setLoading] = useState(false); // Ачаалж байгаа эсэхийг илэрхийлнэ
  const [isDayTime, setIsDayTime] = useState(true); // Өдөр эсвэл шөнө байна уу?

  const fetchWeatherData = useCallback(async (city) => {
    setLoading(true); // Ачаалах үедээ ачааллыг эхлүүлнэ
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric` // Үндсэн API хүсэлт
      );
      if (!response.ok) {
        throw new Error(`Цаг агаарын мэдээлэл авахад алдаа гарлаа: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData({
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
      });
      const currentHour = new Date().getHours(); // Одоо цагийг шалгана
      setIsDayTime(currentHour >= 6 && currentHour < 18); // Өдөр үү, шөнө үү гэдгийг шалгах
    } catch (error) {
      console.error("Цаг агаарын мэдээлэл авахад алдаа гарлаа:", error);
      setWeatherData(null); // Алдаа гарах үед мэдээллийг цэвэрлэнэ
    } finally {
      setLoading(false); // Ачаалал дуусах үедээ
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(countriesSearch); // Эхний хот дээр хүсэлт хийж байна
  }, [countriesSearch, fetchWeatherData]);

  const handleSearch = () => {
    if (countriesSearch.trim() !== "") { // Хоосон утга оруулсан эсэхийг шалгана
      fetchWeatherData(countriesSearch);
    }
  };

  return (
    <div className={`app-container ${isDayTime ? "day" : "night"}`}>
      <div className="search-container">
        <input
          type="text"
          value={countriesSearch}
          onChange={(e) => setCountriesSearch(e.target.value)} // Хайлт хийхээр текстийг өөрчлөнө
          placeholder="Хот оруулна уу"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Хайх
        </button>
      </div>
      {loading && <p className="loading">Ачааллаж байна...</p>}
      {weatherData && (
        <WeatherCard
          city={weatherData.city}
          temperature={weatherData.temperature}
          condition={weatherData.condition}
          icon={weatherData.icon}
          isDayTime={isDayTime}
        />
      )}
    </div>
  );
}

export default App;
