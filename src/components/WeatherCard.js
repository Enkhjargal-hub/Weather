// WeatherCard.js
const WeatherCard = ({ title, photo, date, maxTemp, minTemp, condition }) => {
  return (
    <div className="weather-card">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <img src={photo} alt={title} className="w-full w-80 object-cover rounded-t-lg" />
      <p>{date}</p>
      <p>{maxTemp}°C / {minTemp}°C</p>
      <p>{condition}</p>
    </div>
  );
};

export default WeatherCard;

