const API_URL = "https://restcountries.com/v3.1/all?fields=name,flags,currencies,borders,capital";

const countriesDiv = document.getElementById("countries");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("search-input");

let countries = [];
let filteredCountries = [];
let currentPage = 1;
const itemsPerPage = 16;

fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        countries = data;
        filteredCountries = data;
        displayCountries();
    })
    .catch(err => console.error(err));

function displayCountries() {
    countriesDiv.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredCountries.slice(start, end);

    pageItems.forEach(country => {
        const div = document.createElement("div");
        div.className = "country";

        div.innerHTML = `
            <img src="${country.flags.png}" alt="flag">
            <p>${country.name.common}</p>   
             `;

        div.addEventListener("click", () => openModal(country));

        countriesDiv.appendChild(div);
    });

    renderPagination();
}

function renderPagination() {
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

    if (totalPages <= 1) return;
    const prevBtn = document.createElement("button");
    prevBtn.innerText = "«";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayCountries();
        }
    });
    paginationDiv.appendChild(prevBtn);

    const maxVisiblePages = 7;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
        if (currentPage <= 4) {
            endPage = maxVisiblePages - 1;
        } else if (currentPage >= totalPages - 3) {
            startPage = totalPages - (maxVisiblePages - 2);
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    if (startPage > 1) {
        createPageButton(1);
        if (startPage > 2) {
            const ellipsis = document.createElement("span");
            ellipsis.innerText = "...";
            ellipsis.style.padding = "8px";
            paginationDiv.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        createPageButton(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement("span");
            ellipsis.innerText = "...";
            ellipsis.style.padding = "8px";
            paginationDiv.appendChild(ellipsis);
        }
        createPageButton(totalPages);
    }

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "»";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayCountries();
        }
    });
    paginationDiv.appendChild(nextBtn);
}

function createPageButton(pageNum) {
    const btn = document.createElement("button");
    btn.innerText = pageNum;
    if (pageNum === currentPage) {
        btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
        currentPage = pageNum;
        displayCountries();
    });
    paginationDiv.appendChild(btn);
}

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    displayCountries();
});

const modal = document.getElementById("modal");
const modalFlag = document.getElementById("modal-flag");
const modalName = document.getElementById("modal-name");
const modalCurrency = document.getElementById("modal-currency");
const modalBorders = document.getElementById("modal-borders");
const closeBtn = document.querySelector(".close");
const closeButton = document.querySelector(".close-button");
const modalWeather = document.getElementById("modal-weather");

function openModal(country) {

    modalFlag.src = country.flags.png;
    modalName.innerText = country.name.common;

    if (country.currencies) {
        const currencyList = Object.values(country.currencies)
            .map(cur => `${cur.name} (${cur.symbol || ""})`)
            .join(", ");
        modalCurrency.innerText = "Currency: " + currencyList;
    } else {
        modalCurrency.innerText = "Currency: N/A";
    }

    if ((country.borders && country.borders.length > 0) && country.borders.length <= 2) {
        modalBorders.innerText = "Borders: " + country.borders.join(", ");
    } else if (country.borders && country.borders.length > 2) {
        const lastTwoBorders = country.borders.slice(-2).join(", ");
        modalBorders.innerText = "Borders: " + lastTwoBorders;
    } else {
        modalBorders.innerText = "Borders: None";
    }

    modal.style.display = "flex";
}

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});
const ACCU_API_KEY = "YOUR_API_KEY_HERE";

async function showWeather(cityName) {
    const weatherContainer = document.getElementById('weather-info');

    try {
        const locRes = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${ACCU_API_KEY}&q=${cityName}`);
        const locData = await locRes.json();

        if (locData && locData.length > 0) {
            const locationKey = locData[0].Key;

            const weatherRes = await fetch(`https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCU_API_KEY}`);
            const weatherData = await weatherRes.json();

            const temp = weatherData[0].Temperature.Metric.Value;
            const text = weatherData[0].WeatherText;
            const iconCode = weatherData[0].WeatherIcon;

            weatherContainer.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                        <img src="https://developer.accuweather.com/sites/default/files/${iconCode < 10 ? '0' + iconCode : iconCode}-s.png" alt="weather-icon">
                        <span><strong>${cityName} Weather:</strong> ${temp}°C, ${text}</span>
                    </div>
                `;
        } else {
            weatherContainer.innerHTML = "<p>Weather data unavailable.</p>";
        }
    } catch (error) {
        weatherContainer.innerHTML = "<p>Could not load weather.</p>";
    }
}

async function openModal(country) {
    modalFlag.src = country.flags.png;
    modalName.innerText = country.name.common;

    // Handle Currency
    if (country.currencies) {
        const currencyList = Object.values(country.currencies)
            .map(cur => `${cur.name} (${cur.symbol || ""})`)
            .join(", ");
        modalCurrency.innerText = "Currency: " + currencyList;
    } else {
        modalCurrency.innerText = "Currency: N/A";
    }

    // Handle Borders
    if (country.borders && country.borders.length > 0) {
        const borderDisplay = country.borders.length > 2
            ? country.borders.slice(-2).join(", ")
            : country.borders.join(", ");
        modalBorders.innerText = "Borders: " + borderDisplay;
    } else {
        modalBorders.innerText = "Borders: None";
    }

    // Handle Weather
    if (country.capital && country.capital.length > 0) {
        modalWeather.innerHTML = "Loading weather..."; // Placeholder
        showWeather(country.capital[0]);
    } else {
        modalWeather.innerText = "Weather: Capital not found";
    }

    modal.style.display = "flex";
}

async function showWeather(cityName) {
    try {
        const locRes = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${ACCU_API_KEY}&q=${cityName}`);
        const locData = await locRes.json();

        if (locData && locData.length > 0) {
            const locationKey = locData[0].Key;

            const weatherRes = await fetch(`https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCU_API_KEY}`);
            const weatherData = await weatherRes.json();

            const temp = weatherData[0].Temperature.Metric.Value;
            const text = weatherData[0].WeatherText;
            const iconCode = weatherData[0].WeatherIcon;

            // Updated to use modalWeather instead of weather-info
            modalWeather.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                    <span> Weather: ${cityName}, ${temp}°C, ${text}</span>
                </div>
            `;
        } else {
            modalWeather.innerHTML = "Weather data unavailable.";
        }
    } catch (error) {
        console.error("AccuWeather Error:", error);
        modalWeather.innerHTML = "Could not load weather.";
    }
}