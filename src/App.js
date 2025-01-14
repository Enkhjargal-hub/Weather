
import './App.css';
import { useEffect, useState, useCallback } from "react";
import { citiesFilter } from "./utils/CitiesFilter";

function App() {
  const [countriesSearch, setCountriesSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries");
      const result = await response.json();
      const countriesAndCity = citiesFilter(result.data);
      setCities(countriesAndCity);
      setFilteredData(countriesAndCity);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = useCallback(() => {
    if (countriesSearch === "") {
      setFilteredData(cities);
    } else {
      setFilteredData(
        cities
          .filter((city) =>
            city.toLowerCase().startsWith(countriesSearch.toLowerCase())
          )
          .slice(0, 5)
      );
    }
  }, [countriesSearch, cities]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    setCountriesSearch(event.target.value);
  };

  return (
    <div className="App">
      {loading && <p>Loading...</p>}
      <div>
        <input
          onChange={handleChange}
          value={countriesSearch}
          placeholder="Search country"
        />
      </div>
      <div>
        {filteredData.map((country, index) => (
          <div key={index}>{country}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
