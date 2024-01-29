// Create variables
let breakfasts;
let errorMsg;
let message;
let checkImgLoads = 0;
// Get container for recipes.
let container = document.getElementById("recipes");
// Set display none first, after fully loaded will set block.
container.style.display = "none";

// main container with id messageHandler will keep our loading and error message in itself.
let messageHandler = document.getElementById("messageHandler");
messageHandler.style.position = "relative";

// Create message for info on loading or error.
function createMessage() {
    message = document.createElement("span");
    message.classList.add("fs-1", "text-dark", "d-flex", "align-items-center", "justify-content-center");
    message.style.position = "absolute";
    message.style.left = "0";
    message.style.width = "100%";
    message.style.height = "300px";
    message.style.zIndex = "2";
    message.innerText = "Listing breakfasts for you...";

    // Append it to main container
    messageHandler.prepend(message);
}

// Fetch api function
async function fetchBreakfast() {
    const response = await fetch('https://api.edamam.com/api/recipes/v2?' + new URLSearchParams({
        app_id: '32b84d13',
        app_key: 'e636d4ec3f1bb6076faa93cb61e9eacf',
        type: 'public',
        mealType: 'Breakfast',
        imageSize: 'LARGE',
        random: 'true',
    }).toString())
        .then(response => response.json())
        .then(response => {
            // If there are recipes
            if (response.hits.length > 0)
                return JSON.stringify(response.hits);
            // or not send null to array
            else
                return null;
        });
    return response;
}

// Create recipe card
function createCard() {
    let card = document.createElement("div");
    card.classList.add("card", "p-3", "col-xxl-3", "col-lg-5", "col-md-12", "mb-2", "d-flex", "align-items-center", "justify-content-between", "gap-5");
    cardTitle = document.createElement("h2");
    cardTitle.classList.add("fs-4", "text-center");
    card.appendChild(cardTitle);
    cardImg = document.createElement("img");
    cardImg.setAttribute("width", "150");
    cardImg.setAttribute("height", "150");
    cardImg.classList.add("rounded-5");
    card.appendChild(cardImg);
    let div = document.createElement("div");
    div.classList.add("col", "d-flex", "justify-content-between", "align-items-end", "w-100");
    let span1 = document.createElement("span");
    let span2 = document.createElement("span");
    div.appendChild(span1);
    div.appendChild(span2);
    card.appendChild(div);

    return card;
}

createMessage();

// Start fetching
fetchBreakfast().then(data => {
    // Parse json data to array
    breakfasts = JSON.parse(data);
    // Check if array is null, we use return null if fetch fails.
    if (breakfasts != null) {
        // Get module for array length. We use 3 cards in every row.
        let module = breakfasts.length % 3;
        // Get row count after module reduced from array
        let rowCount = (breakfasts.length - module) / 3;
        // Create rows
        for (let i = 1; i <= rowCount; i++) {
            let row = document.createElement("div");
            row.classList.add("row", "d-flex", "justify-content-between", "gap-4", "my-4");
            // Give an id for append cards later according to ids.
            row.setAttribute("id", "row-" + i);
            container.appendChild(row);
        }
        // Set first id for row to append cards.
        let appendCard = 1;
        // Create 3 cards from array for every row.
        for (let i = 0; i < breakfasts.length - module; i += 3) {

            // Get Row
            let row = document.getElementById("row-" + appendCard);

            // First Card
            let card = createCard();
            card.getElementsByTagName("h2")[0].innerText = breakfasts[i].recipe.label;

            card.getElementsByTagName("img")[0].setAttribute("src", breakfasts[i].recipe.image);
            card.getElementsByTagName("img")[0].setAttribute("width", "150");
            card.getElementsByTagName("img")[0].setAttribute("height", "150");
            card.getElementsByTagName("img")[0].classList.add("rounded-5");

            card.getElementsByTagName("span")[0].innerText = "Calories: " + Math.floor(breakfasts[i].recipe.totalNutrients.ENERC_KCAL.quantity) + breakfasts[i].recipe.totalNutrients.ENERC_KCAL.unit;

            card.getElementsByTagName("span")[1].innerText = "Fat: " + Math.floor(breakfasts[i].recipe.totalNutrients.FAT.quantity) + breakfasts[i].recipe.totalNutrients.FAT.unit;

            row.appendChild(card);

            // Second Card
            card = createCard();

            card.getElementsByTagName("h2")[0].innerText = breakfasts[i + 1].recipe.label;

            card.getElementsByTagName("img")[0].setAttribute("src", breakfasts[i + 1].recipe.image);
            card.getElementsByTagName("img")[0].setAttribute("width", "150");
            card.getElementsByTagName("img")[0].setAttribute("height", "150");
            card.getElementsByTagName("img")[0].classList.add("rounded-5");

            card.getElementsByTagName("span")[0].innerText = "Calories: " + Math.floor(breakfasts[i + 1].recipe.totalNutrients.ENERC_KCAL.quantity) + breakfasts[i + 1].recipe.totalNutrients.ENERC_KCAL.unit;

            card.getElementsByTagName("span")[1].innerText = "Fat: " + Math.floor(breakfasts[i + 1].recipe.totalNutrients.FAT.quantity) + breakfasts[i + 1].recipe.totalNutrients.FAT.unit;

            row.appendChild(card);

            // Third Card
            card = createCard();

            card.getElementsByTagName("h2")[0].innerText = breakfasts[i + 2].recipe.label;

            card.getElementsByTagName("img")[0].setAttribute("src", breakfasts[i + 2].recipe.image);
            card.getElementsByTagName("img")[0].setAttribute("width", "150");
            card.getElementsByTagName("img")[0].setAttribute("height", "150");
            card.getElementsByTagName("img")[0].classList.add("rounded-5");

            card.getElementsByTagName("span")[0].innerText = "Calories: " + Math.floor(breakfasts[i + 2].recipe.totalNutrients.ENERC_KCAL.quantity) + breakfasts[i + 2].recipe.totalNutrients.ENERC_KCAL.unit;

            card.getElementsByTagName("span")[1].innerText = "Fat: " + Math.floor(breakfasts[i + 2].recipe.totalNutrients.FAT.quantity) + breakfasts[i + 2].recipe.totalNutrients.FAT.unit;

            row.appendChild(card);

            // Increase row id to create 3 more cards for next row in every loop.
            appendCard += 1;
        }
        // If module is greater than zero, create new row with remain cards.
        if (module > 0) {
            let row = document.createElement("div");
            row.classList.add("row", "d-flex", "justify-content-evenly", "gap-4", "my-4");
            row.setAttribute("id", "row-" + appendCard + 1);
            container.appendChild(row);

            // Create cards according to module count. 1 or 2.
            for (let i = module; i > 0; i--) {
                let card = createCard();
                card.getElementsByTagName("h2")[0].innerText = breakfasts[breakfasts.length - module].recipe.label;

                card.getElementsByTagName("img")[0].setAttribute("src", breakfasts[breakfasts.length - module].recipe.image);
                card.getElementsByTagName("img")[0].setAttribute("width", "150");
                card.getElementsByTagName("img")[0].setAttribute("height", "150");
                card.getElementsByTagName("img")[0].classList.add("rounded-5");

                card.getElementsByTagName("span")[0].innerText = "Calories: " + Math.floor(breakfasts[breakfasts.length - module].recipe.totalNutrients.ENERC_KCAL.quantity) + breakfasts[breakfasts.length - module].recipe.totalNutrients.ENERC_KCAL.unit;

                card.getElementsByTagName("span")[1].innerText = "Fat: " + Math.floor(breakfasts[breakfasts.length - module].recipe.totalNutrients.FAT.quantity) + breakfasts[breakfasts.length - module].recipe.totalNutrients.FAT.unit;

                row.appendChild(card);

                // reduce module by 1
                module -= 1;
            }
        }

        // Get all item images except navbar img ( navar is in an anchor tag )
        const images = document.querySelectorAll("div>img");
        // Get images total count
        let imagesLeft = images.length;
        // Add load eventlistener to all images and after fully loaded, reduce the number of imageLeft by 1
        for (const image of images) {
            image.addEventListener('load', () => {
                imagesLeft--;
                // If all images are fully loaded, show container and hide loading message
                if (imagesLeft === 0) {
                    message.remove();
                    container.style.display = "block";
                };
            });
        }
    }
    else {
        // If there is no query fetched from api send error message.
        errorMsg = 'Oops. Something went wrong.';
        message.innerText = errorMsg;
    }
});