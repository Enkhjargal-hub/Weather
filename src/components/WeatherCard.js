import React from "react";
import "./WeatherCard.css"; // Цаг агаарын мэдээллийн стилийн файл

function WeatherCard({ title, date, maxTemp, minTemp, condition }) {
  return (
    <div className="weather-card">
      <h3>{title}</h3>
      {/* <img src={photo} alt={title} className="weather-image" /> */}
      <p><strong>Date: </strong>{date}</p>
      <p><strong>Temperature: </strong>{maxTemp}°C</p>
      <p><strong></strong>{condition}</p>
    </div>
  );
}

export default WeatherCard;

