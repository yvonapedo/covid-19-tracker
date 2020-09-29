import React, {useState, useEffect} from 'react';
import {FormControl, MenuItem, Select} from "@material-ui/core";
import InfoBox from  "./InfoBox";
import Map from "./Map";
import './App.css';
import { Card, CardContent } from "@material-ui/core";
import Table from './Table'
import {
  sortData,
  prettyPrintStat,
  
} from "./util";
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css";



function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry]=useState('worldwide');
  const [countryInfo, setCountryInfo ] =useState({});
  const [tableData, setTableData] =useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom , setMapZoom]=useState(3)
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] =useState("cases");


  useEffect(() => {
   fetch(
     "https://cors-anywhere.herokuapp.com/https://disease.sh/v3/covid-19/all"
   )
     .then((response) => response.json())
     .then((data) => {
       setCountryInfo(data);
     });
  }, [])


  useEffect(() => {
    
   const getCountriesData = async() =>{
     await fetch(
       "https://cors-anywhere.herokuapp.com/https://disease.sh/v3/covid-19/countries"
     )
       .then((response) => response.json())
       .then((data) => {
         const countries = data.map((country) => ({
           name: country.country,
           value: country.countryInfo.iso2,
         }));

         const sortedData =sortData(data);
         setTableData(sortedData);
         setMapCountries(data);
         setCountries(countries);
       });
   }
   getCountriesData();
  }, [])
  
  const onCountryChange =async (event) =>{
    const countryCode = event.target.value;

    //setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://cors-anywhere.herokuapp.com/http://disease.sh/v3/covid-19/all"
        : `https://cors-anywhere.herokuapp.com/http://disease.sh/v3/covid-19/countries/${countryCode}`;
    ////https://disease.sh/v3/covid-19/countries/

    await fetch(url 
      //,{mode: 'no-cors'}
      )
    .then((response) => response.json())
    .then((data) =>{
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }
  
  console.log('COUNRTY INFO', countryInfo)
  
  return (
    <div>
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>
            COVID-19 TRACKER 
          </h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
          isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />

          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          />

          <InfoBox
          isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>

        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* table */}
          <Table countries={tableData} />
          <br />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          
          {/* Graph */}
          
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
      
    </div>
    <div align="center">
      <footer>
        <div>
            <hr class="socket"></hr>
            &copy; yvon-september-2020-clprog.
          </div>
        </footer>
    </div>
    </div>
  );
}

export default App;
