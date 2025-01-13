
import './App.css';
import {useEffect, useState} from "react";
import {citiesFilter} from "./utils/CitiesFilter";

function App () {
  const [countriesSearch, setCountriesSearch] = useState("");
  const [filteredData, setFilteredData] = useState ([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    await fetch ("https://countriesnow.space/api/v0.1/countries")
    .then((response) => response.json())
    .then((result) => {
      const countriesAndCity = citiesFilter(result.data);
      setCities (countriesAndCity);
      setFilteredData(countriesAndCity);
    })
    .catch((error) => {
      console.log("Error", error);
    })
    .finally(() => {
      setLoading(false);
    });
  };
  const filterData =() => {
    
  }
}