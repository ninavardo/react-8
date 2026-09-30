import { useEffect, useRef, useState } from "react";
import TbilisiImage from "./assets/tbilisi.jpg";
import axios from "axios";
import { Sun } from "lucide-react";

function App() {
  const [currentCity, setCurrentCity] = useState("Tbilisi");
  const [weather, setWeather] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    const fetchWeather = async () => {
      const { VITE_WEATHER_API_KEY } = import.meta.env;

      try {
        const geocodingResponse = await axios.get(
          "https://api.openweathermap.org/geo/1.0/direct",
          {
            params: {
              q: currentCity,
              appid: VITE_WEATHER_API_KEY,
            },
          },
        );

        const data = geocodingResponse.data[0];
        const { lat, lon } = data;
        console.log(lat, lon);

        const weatherResponse = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              lat: lat,
              lon: lon,
              appid: VITE_WEATHER_API_KEY,
              units: "metric",
            },
          },
        );
        console.log(weatherResponse.data);
        setWeather(weatherResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWeather();
  }, [currentCity]);

  const handleSearch = () => {
    const value = inputRef.current.value;
    setCurrentCity(value);
  };

  return (
    <section className="relative min-h-screen border flex justify-center items-center">
      <img
        src={TbilisiImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 backdrop-blur-xs bg-stone-950/20" />
      <div className="relative z-10 bg-stone-950/40 p-5 rounded-md text-white w-250">
        <div className="flex gap-x-3">
          <input
            type="text"
            placeholder="Enter city..."
            className="border rounded-md p-3 w-full"
            ref={inputRef}
          />
          <button
            onClick={handleSearch}
            className="border px-4 py-3 rounded-md cursor-pointer"
          >
            Search
          </button>
        </div>

        {weather && (
          <div>
            <div className="flex justify-between my-4">
              <div>
                <h2 className="text-5xl">{currentCity}</h2>
                <h2 className="text-7xl font-semibold">
                  {Math.round(weather.main.temp)}°
                </h2>
              </div>
              <div>
                <img
                  src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`}
                  alt=""
                  className="w-36 h-36"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="border rounded-md p-3 flex-1">
                <p>Visibility</p>
                <h3 className="text-2xl">{weather.visibility} m</h3>
              </div>
              <div className="border rounded-md p-3 flex-1">
                <p>Wind speed</p>
                <h3 className="text-2xl">{weather.wind.speed} m/s</h3>
              </div>
              <div className="border rounded-md p-3 flex-1">
                <p>Feels like</p>
                <h3 className="text-2xl">
                  {Math.round(weather.main.feels_like)}°
                </h3>
              </div>
              <div className="border rounded-md p-3 flex-1">
                <p>Humidity</p>
                <h3 className="text-2xl">{weather.main.humidity}%</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default App;
