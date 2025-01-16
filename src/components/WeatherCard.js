import React from "react";
import "./WeatherCard.css"; // Цаг агаарын мэдээллийн стилийн файл

function WeatherCard({ title, date, maxTemp, minTemp, condition }) {
  return (
    <div className="weather-card">
      <h3>{title}</h3>
      <p><strong>Огноо: </strong>{date}</p>
      <p><strong>Дээд Температур: </strong>{maxTemp}°C</p>
      <p><strong>Доод Температур: </strong>{minTemp}°C</p>
      <p><strong>Нөхцөл: </strong>{condition}</p>
    </div>
  );
}

export default WeatherCard;

