// WeatherCard.js
const WeatherCard = ({ title, photo, date, maxTemp, minTemp, condition }) => {
  return (
    <div className="weather-card">
      <h3>{title}</h3>
      <img src={photo} alt={title} className="weather-image" />
      <p>{date}</p>
      <p>{maxTemp}°C / {minTemp}°C</p>
      <p>{condition}</p>
    </div>
  );
};

export default WeatherCard;

