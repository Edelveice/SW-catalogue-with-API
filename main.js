const SWAPI = "https://swapi.dev/api";

let currentCategory = null;

const startURLs = {
    people: `${SWAPI}/people/`,
    planets: `${SWAPI}/planets/`,
    vehicles: `${SWAPI}/vehicles/`
};

const output = document.querySelector(".catalogue-container");
const buttons = document.querySelectorAll(".main-buttons");
const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".close");
const message = document.getElementById("message");

buttons.forEach(button => {
    button.addEventListener("click", function() {
        const category = button.getAttribute("data-category");

        message.style.display = "block";

        if (category !== currentCategory) {
            currentCategory = category;
            output.innerHTML = '';
        }

        const url = startURLs[category];

        axios.get(url).then((res) => {
            console.log(res.data);

            startURLs[category] = res.data.next;

            displayData(res.data);
        });
    });
});

output.addEventListener("click", function (event) {
    if (event.target.classList.contains("details")) {
        const entityData = event.target.parentElement.dataset;
        const entityUrl = entityData.url;

        axios.get(entityUrl).then((res) => {
            const entityDetails = res.data;

            const detailsHTML = generateDetailsHTML(entityDetails);
            document.querySelector(".modal-body").innerHTML = detailsHTML;

            modal.style.display = "block";
        });
    }
});

closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

function displayData(data) {
    const items = data.results;

    items.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");

        const nameElement = document.createElement("div");
        nameElement.classList.add("name");
        nameElement.textContent = item.name;
        itemElement.appendChild(nameElement);

        itemElement.dataset.url = item.url;

        const detailsButton = document.createElement("button");
        detailsButton.textContent = "Details";
        detailsButton.classList.add("details");
        itemElement.appendChild(detailsButton);

        output.appendChild(itemElement);
    });
}

function generateDetailsHTML(entityDetails) {
    let detailsHTML = '';

    if (currentCategory === 'people') {
        detailsHTML = `
            <p>Name: ${entityDetails.name}</p>
            <p>Birth Year: ${entityDetails.birth_year}</p>
            <p>Gender: ${entityDetails.gender}</p>
            <p>Mass: ${entityDetails.mass}</p>
            <p>Height: ${entityDetails.height}</p>
            <p>Skin Color: ${entityDetails.skin_color}</p>
        `;
    } else if (currentCategory === 'planets') {
        detailsHTML = `
            <p>Name: ${entityDetails.name}</p>
            <p>Climate: ${entityDetails.climate}</p>
            <p>Diameter: ${entityDetails.diameter}</p>
            <p>Population: ${entityDetails.population}</p>
            <p>Gravity: ${entityDetails.gravity}</p>
            <p>Orbital Period: ${entityDetails.orbital_period}</p>
        `;
    } else if (currentCategory === 'vehicles') {
        detailsHTML = `
            <p>Name: ${entityDetails.name}</p>
            <p>Model: ${entityDetails.model}</p>
            <p>Length: ${entityDetails.length}</p>
            <p>Crew: ${entityDetails.crew}</p>
            <p>Cargo Capacity: ${entityDetails.cargo_capacity}</p>
            <p>Cost in Credits: ${entityDetails.cost_in_credits}</p>
        `;
    }

    return detailsHTML;
}