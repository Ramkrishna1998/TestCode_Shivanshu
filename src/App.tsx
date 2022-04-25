import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
const ariaLabel = { 'aria-label': 'description' };
function HomePage() {
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [inputBox, setInputBox] = useState("");
  const navigate = useNavigate()
  return (
    <div className="App" style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Input placeholder="Enter country" inputProps={ariaLabel} value={inputBox}
        onChange={(e) => {
          if (e.currentTarget.value.length > 0) {
            setSubmitDisabled(false)
            setInputBox(e.currentTarget.value)
          } else {
            setSubmitDisabled(true)
            setInputBox("")
          }
        }}
      />
      <Button disabled={submitDisabled} onClick={() => navigate(`/country/${inputBox}`)}>Submit</Button>
    </div>
  );
}
function FallBack() {
  return <h1>Hello World , Please go <Link to={'/'}>here</Link></h1>
}
function CountryInfo() {
  const { countryName } = useParams();
  const [data, setData] = useState({
    capital: "",
    population: "",
    latitude: "",
    longitude: "",
    flag: ""
  });
  const [weather, setWeather] = useState<{
    temperature: string,
    precip: string,
    windSpeed: string,
    icon: string
  } | null>(null);

  React.useEffect(() => {
    if (countryName) {
      handleData(countryName)
    }
  }, [])
  const handleData = (data: string) => {
    axios({
      url: `https://restcountries.com/v3.1/name/${data}`,
      method: 'GET'
    })
      .then((response) => {
        // console.log(response.data)
        console.log({
          capital: response.data[0].capital[0],
          population: response.data[0].population,
          latitude: response.data[0].latlng[0],
          longitude: response.data[0].latlng[1],
          flag: response.data[0].flags.png
        })
        setData({
          capital: response.data[0].capital[0],
          population: response.data[0].population,
          latitude: response.data[0].latlng[0],
          longitude: response.data[0].latlng[1],
          flag: response.data[0].flags.png
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const handleWeather = () => {
    axios({
      url: `http://api.weatherstack.com/current?access_key=9dc29a6e911d66ee6c9faccecdeafb42&query=${data.capital}`,
      method: 'GET'
    })
      .then((response) => {
        console.log(response.data)
        setWeather({
          temperature: response.data.current.temperature,
          precip: response.data.current.precip,
          windSpeed: response.data.current.wind_speed,
          icon: response.data.current.weather_icons[0]
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
  return <>
    <div style={{ display: "flex", justifyContent: "center", gap: "1em", width: "100%", flexDirection: "column" }}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>


          <h1>{countryName?.toUpperCase()}</h1>
          <img src={data.flag} alt={`${countryName} flag`} />
          <Typography variant="body2">
            Capital :  {data.capital}
          </Typography>

          <Typography variant="body2">
            Population :  {data.population}
          </Typography>
          <Typography variant="body2">
            LatLng :  {data.latitude} , {data.longitude}
          </Typography>

        </CardContent>
        <CardActions>
          <Button disabled = {data ? false : true} onClick={() => handleWeather()}>Capital Weather</Button>
        </CardActions>
      </Card>
      {weather && <Card sx={{ minWidth: 275 }}>
        <CardContent>


          <h1>Weather in {data.capital}</h1>
          <img src={weather.icon} alt={'weather icon'} />
          <Typography variant="body2">
            Temperature :  {weather.temperature}
          </Typography>

          <Typography variant="body2">
            WindSpeed :  {weather.windSpeed}
          </Typography>
          <Typography variant="body2">
            Precip :  {weather.precip}
          </Typography>

        </CardContent>
      </Card>}
    </div>
  </>
}
function App() {
  return <>
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/country/:countryName' element={<CountryInfo />} />
        <Route path='*' element={<FallBack />} />
      </Routes>
    </Router>
  </>
}

export default App;
