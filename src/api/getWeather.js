const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export async function getWeather(city){
  const URL = API_URL + `?q=${city}&appid=${API_KEY}&units=metric`;
  let result = {};
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.cod === "200"){
      result = {
        weatherDetails: data.list.map((el) => ({
          temperature: el.main.temp,
          description: el.weather[0].main,
          date: new Date(el.dt * 1000)
        })),
        loading: false
      };
    }
  }catch(err) {
    result.error = true;
  }
  return result;

};
