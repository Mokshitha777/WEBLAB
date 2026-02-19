const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");
const errorDiv = document.getElementById("error");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const condition = document.getElementById("condition");

const API_KEY = "631097db45c515ea9670c2aa66f7a0d8"; // 🔑 Replace this

let cachedCity = null;
let cachedData = null;

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    // Check cache
    if (cachedCity === city.toLowerCase()) {
        displayWeather(cachedData);
        return;
    }

    fetchWeather(city);
});

function fetchWeather(city) {
    loader.classList.remove("hidden");
    errorDiv.textContent = "";
    weatherCard.classList.add("hidden");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error("City not found (404)");
            } else {
                throw new Error("Server error (500)");
            }
        })
        .then(data => {
            cachedCity = city.toLowerCase();
            cachedData = data;

            displayWeather(data);
        })
        .catch(error => {
            showError(error.message);
        })
        .finally(() => {
            loader.classList.add("hidden");
        });
}

function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `🌡 Temperature: ${data.main.temp} °C`;
    humidity.textContent = `💧 Humidity: ${data.main.humidity}%`;
    condition.textContent = `☁ Condition: ${data.weather[0].description}`;

    weatherCard.classList.remove("hidden");
}

function showError(message) {
    errorDiv.textContent = message;
}
