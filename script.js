const API_URL = "https://restcountries.com/v3.1/all?fields=name,flags,currencies,borders";

const countriesDiv = document.getElementById("countries");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageNumber = document.getElementById("page-number");

let countries = 0;
let currentPage = 1;
const itemsPerPage = 16;

fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        countries = data;
        displayCountries();
    })
    .catch(err => console.error(err));

function displayCountries() {
    countriesDiv.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = countries.slice(start, end);

    pageItems.forEach(country => {
        const div = document.createElement("div");
        div.className = "country";

        div.innerHTML = `
            <img src="${country.flags.png}" alt="flag">
            <p>${country.name.common}</p>
            <p>Currency: ${country.currencies ? Object.values(country.currencies).map(cur => cur.symbol).join(", ") : "N/A"}</p>
            <p>Borders: ${country.borders ?.length >= 2 ? country.borders.slice(-2).join(", ") : "N/A"}</p>
        `;

        countriesDiv.appendChild(div);
    });

    pageNumber.innerText = `Page ${currentPage}`;
}

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayCountries();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(countries.length / itemsPerPage)) {
        currentPage++;
        displayCountries();
    }
});