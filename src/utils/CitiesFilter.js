export const citiesFilter = (countries) => {
    const citiesAndCountry = countries.flatMap((country) =>
      country.cities.map((city) => `${city}, ${country.country}`)
    );
    console.log(citiesAndCountry);
    return citiesAndCountry;
  };
  