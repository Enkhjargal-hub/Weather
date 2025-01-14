import "./App.css";
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
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries"
      );
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
      <div>
        {/* <img
        className="Photo"
        src="/img/Screenshot 2025-01-13 at 5.58.41 PM.png"
        alt="Screenshot"
      /> */}
      </div>
      <div>
        <div className="Sun">
          <div>
            <h4 className="Date">January 14, 2025</h4>
            <h2 className="World">Ulaanbaatar</h2>
            <div>
              <svg
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-map-pin text-gray-600"
              >
                <path
                  d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
                  stroke="#4B5563"
                  fill="none"
                  stroke-width="2px"
                ></path>
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                  stroke="#4B5563"
                  fill="none"
                  stroke-width="2px"
                ></circle>
              </svg>
            </div>
          </div>
        </div>


        <div className="Moon">
          <div>
        <h4 className="Date">January 14, 2025</h4>
        <h2 className="World">Ulaanbaatar</h2>
        <div><svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-gray-600"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" stroke="#4B5563" fill="none" stroke-width="2px"></path><circle cx="12" cy="10" r="3" stroke="#4B5563" fill="none" stroke-width="2px"></circle></svg></div>
        </div>
        <div>
        </div>
        </div>
      </div>
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
