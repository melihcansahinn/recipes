// Create variables
let breakfasts;
let errorMsg;
let message;
let checkImgLoads = 0;
let loadingDiv;
// Give card id to all cards.
let cardId = 0;
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
    message.style.left = "0";
    message.style.width = "100%";
    message.style.height = "300px";
    message.innerText = "Listing recipes for you...";

    loadingDiv = createLoadingDiv(messageHandler);
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

// Loading container function
function createLoadingDiv(div) {
    if (div) {
        let loadingContainer = document.createElement("div");
        loadingContainer.classList.add("loading-container");
        //Create 8 bubble containers.
        for (let i = 0; i < 8; i++) {
            let bubbleContainer = document.createElement("div");
            bubbleContainer.classList.add("bubble-container");
            let bubble = document.createElement("div");
            bubble.classList.add("bubble");
            bubbleContainer.append(bubble);
            loadingContainer.append(bubbleContainer);
        }
        div.append(loadingContainer);
        return loadingContainer;
    } else {
        console.log('test');
    }
    return null;
}

// Create details of recipe function
function cardDetails(event) {
    let card = document.getElementById(event.target.closest('.card').id);
    let cardTitle = card.querySelector("h2").innerText;

    let index = card.id.match(/(\d+)/);

    if (index)
        index = index[0];

    let fullCard = document.createElement("div");
    let height = document.getElementById("nav").offsetHeight;
    fullCard.classList.add("fullCard", "w-100", "position-absolute", "d-flex", "flex-column", "justify-content-around", "align-items-center");
    fullCard.setAttribute("id", "fullCard");
    fullCard.style.zIndex = "3";
    fullCard.style.top = `${height}px`;
    fullCard.style.minHeight = `calc(100% - ${height}px)`;
    fullCard.style.padding = "10px";
    fullCard.style.overflow = "hidden";
    container.style.display = "none";
    document.getElementById("body").prepend(fullCard);
    let fullCardTitle = document.createElement("h2");
    fullCardTitle.style.textAlign = "center";
    fullCardTitle.style.padding = "5px";
    fullCardTitle.innerHTML = `Loading recipe details of <p style='color: rgb(0, 185, 25);'>${cardTitle}.</p> Please wait...`;
    fullCard.append(fullCardTitle);
    // Create loading div into the fullCard.
    let loadingContainer = createLoadingDiv(fullCard);
    // Prepare details before show them. Will be removed fullCardTitle and loadingContainer after content is ready.
    let itemContainer = document.createElement("div");
    itemContainer.classList.add("d-flex", "position-relative", "justify-content-center", "align-items-center", "rounded-3", "border", "border-dark-subtle", "flex-column", "p-1");
    itemContainer.style.backgroundColor = "rgba(63, 123, 112, .3)";
    itemContainer.style.width = "90%";
    itemContainer.style.overflow = "hidden";
    let itemTitle = document.createElement("h2");
    itemTitle.style.textAlign = "center";
    itemTitle.style.padding = "5px";
    itemTitle.classList.add("col-9", "border-bottom", "border-light");
    itemTitle.innerText = cardTitle;
    itemTitle.style.color = "rgb(0, 185, 25)";

    itemContainer.append(itemTitle);
    let itemRow1 = document.createElement("div");
    itemRow1.classList.add("row", "w-100", "justify-content-center", "d-flex", "gap-2");
    let itemImageContainer = document.createElement("div");
    itemImageContainer.classList.add("col-sm-10", "d-flex", "align-items-center", "justify-content-center");
    let itemImage = document.createElement("img");
    itemImage.classList.add("img-thumbnail");
    itemImage.style.width = "300px";
    itemImage.setAttribute("src", breakfasts[index].recipe.images.LARGE.url);

    itemImageContainer.append(itemImage);

    itemRow1.append(itemImageContainer);

    let leftCard = document.createElement("div");
    leftCard.classList.add("col-lg-5", "col-md-10", "col-sm-10", "d-flex", "align-items-center", "flex-column", "rounded-4", "border-light", "border", "p-3", "m-1");
    let nutritionTitle = document.createElement("h2");
    nutritionTitle.classList.add("fs-5");
    nutritionTitle.innerText = "Nutritional Values";
    leftCard.append(nutritionTitle);
    let nutritionUl = document.createElement("ul");
    nutritionUl.classList.add("list-group", "col-12", "overflow-y-auto");
    nutritionUl.style.height = "300px";

    for (let i = 0; i < breakfasts[index].recipe.digest.length; i++) {
        let nutritionItem = document.createElement("li");
        nutritionItem.classList.add("border-bottom", "p-1", "d-flex", "justify-content-between", "fs-5", "bg-transparent");
        let nameOfItem = document.createElement("span");
        nameOfItem.innerText = breakfasts[index].recipe.digest[i].label;
        let totalOfItem = document.createElement("span");
        totalOfItem.innerText = Math.floor(breakfasts[index].recipe.digest[i].total) + " " + breakfasts[index].recipe.digest[i].unit;
        nutritionItem.append(nameOfItem);
        nutritionItem.append(totalOfItem);
        nutritionUl.append(nutritionItem);
    }

    leftCard.append(nutritionUl);

    itemRow1.append(leftCard);

    let rightCard = document.createElement("div");
    rightCard.classList.add("col-lg-5", "col-md-10", "col-sm-10", "d-flex", "align-items-center", "flex-column", "rounded-4", "border-light", "border", "p-3", "m-1");
    let ingredientsTitle = document.createElement("h2");
    ingredientsTitle.classList.add("fs-5");
    ingredientsTitle.innerText = "Ingredients";
    rightCard.append(ingredientsTitle);
    let ingredientsUl = document.createElement("ul");
    ingredientsUl.classList.add("list-group", "col-12", "overflow-y-auto");
    ingredientsUl.style.height = "300px";

    for (let i = 0; i < breakfasts[index].recipe.ingredients.length; i++) {
        let ingredientsItem = document.createElement("li");
        ingredientsItem.classList.add("border-bottom", "p-1", "d-flex", "justify-content-between", "fs-5", "bg-transparent");
        let nameOfItem = document.createElement("span");
        nameOfItem.innerText = breakfasts[index].recipe.ingredients[i].food;
        let totalOfItem = document.createElement("span");
        totalOfItem.innerText = parseFloat(breakfasts[index].recipe.ingredients[i].quantity.toFixed(2)) + " " + breakfasts[index].recipe.ingredients[i].measure;
        ingredientsItem.append(nameOfItem);
        ingredientsItem.append(totalOfItem);
        ingredientsUl.append(ingredientsItem);
    }

    rightCard.append(ingredientsUl);

    itemRow1.append(rightCard);

    itemContainer.append(itemRow1);

    let ingredientLines = document.createElement("div");
    ingredientLines.classList.add("col-md-10", "col-sm-11", "p-3", "m-1", "justify-content-center", "d-flex", "gap-2", "align-items-start", "rounded-4", "border", "border-light", "flex-column", "shadow");
    ingredientLines.style.backgroundColor = "rgba(248,249,250,.5)";
    for (let i = 0; i < breakfasts[index].recipe.ingredientLines.length; i++) {
        let ingredientLine = document.createElement("span");
        ingredientLine.classList.add("fs-4", "p-3", "d-flex", "w-100");
        ingredientLine.innerText = `${i + 1}: ${breakfasts[index].recipe.ingredientLines[i]}`;
        ingredientLines.append(ingredientLine);
    }

    itemContainer.append(ingredientLines);

    let closeButton = document.createElement("div");
    closeButton.style.cssText = "position: absolute; right: 10px; top: 10px; width: 30px; height: 30px; background-color: rgba(0,0,0,.5); display: flex; justify-content: center; align-items: center; over-flow: hidden; cursor: pointer; color: white; transition: all .2s ease-in-out; border-radius: 5px; border: 1px solid transparent;";
    // Hover Effects
    closeButton.addEventListener('mouseover', () => {
        closeButton.style.cssText += 'background-color: rgba(255,255,255,.5); color: #111; border-color: #111;';
    });
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.cssText += 'background-color: rgba(0,0,0,.5); color: white; border-color: transparent;';
    });
    // Closing details
    closeButton.addEventListener('click', () => {
        container.style.display = "flex";
        fullCard.remove();
    });

    let closeMark = document.createElement("i");
    closeMark.classList.add("fa-solid", "fa-x");
    closeMark.style.cssText = "font-size: 20px; font-family: 'Font Awesome 6 Free';";
    closeButton.append(closeMark);

    itemContainer.append(closeButton);

    // Get item image

    // Add load eventlistener to image and after fully loaded remove loadercontainer
    if (itemImage) {
        itemImage.addEventListener('load', () => {
            // If image are fully loaded, show fullcard after remove loading container and message
            loadingContainer.remove();
            fullCardTitle.remove();
            fullCard.append(itemContainer);
            itemImage.style.cssText += "transform: translateX(-300%); opacity: 0.2;";
            itemImage.animate({ opacity: 1 }, 500);
            itemImage.animate({ transform: 'translateX(0)' }, 250).onfinish = () => {
                itemImage.style.cssText += "transform: translateX(0%); opacity: 1;";
            };

        });
    }

    // loadingContainer.remove();
    // fullCardTitle.remove();
}

// Create recipe card
function createCard(id) {
    let card = document.createElement("div");
    card.classList.add("card", "p-3", "col-lg-5", "col-md-12", "mb-2", "d-flex", "align-items-center", "justify-content-between", "gap-5");
    card.setAttribute("id", "card-" + id);
    card.style.cursor = "pointer";
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

    card.addEventListener("click", cardDetails);

    return card;
}

createMessage();

// Start fetching
fetchBreakfast().then(data => {
    // Parse json data to array
    breakfasts = JSON.parse(data);
    // Check if array is null, we use return null if fetch fails.
    if (breakfasts != null) {
        // Get module for array length. We use 2 cards in every row.
        let module = breakfasts.length % 2;
        // Get row count after module reduced from array
        let rowCount = (breakfasts.length - module) / 2;
        // Create rows
        for (let i = 1; i <= rowCount; i++) {
            let row = document.createElement("div");
            row.classList.add("row", "d-flex", "justify-content-between", "gap-4", "my-4", "w-100");
            // Give an id for append cards later according to ids.
            row.setAttribute("id", "row-" + i);
            container.appendChild(row);
        }
        // Set first id for row to append cards.
        let appendCard = 1;
        // Create 2 cards from array for every row.
        for (let i = 0; i < breakfasts.length - module; i += 2) {

            // Get Row
            let row = document.getElementById("row-" + appendCard);

            // First Card
            let card = createCard(cardId);
            cardId += 1;
            card.getElementsByTagName("h2")[0].innerText = breakfasts[i].recipe.label;

            card.getElementsByTagName("img")[0].setAttribute("src", breakfasts[i].recipe.image);
            card.getElementsByTagName("img")[0].setAttribute("width", "150");
            card.getElementsByTagName("img")[0].setAttribute("height", "150");
            card.getElementsByTagName("img")[0].classList.add("rounded-5");

            card.getElementsByTagName("span")[0].innerText = "Calories: " + Math.floor(breakfasts[i].recipe.totalNutrients.ENERC_KCAL.quantity) + breakfasts[i].recipe.totalNutrients.ENERC_KCAL.unit;

            card.getElementsByTagName("span")[1].innerText = "Fat: " + Math.floor(breakfasts[i].recipe.totalNutrients.FAT.quantity) + breakfasts[i].recipe.totalNutrients.FAT.unit;

            row.appendChild(card);

            // Second Card
            card = createCard(cardId);
            cardId += 1;

            card.getElementsByTagName("h2")[0].innerText = breakfasts[i + 1].recipe.label;

            card.getElementsByTagName("img")[0].setAttribute("src", breakfasts[i + 1].recipe.image);
            card.getElementsByTagName("img")[0].setAttribute("width", "150");
            card.getElementsByTagName("img")[0].setAttribute("height", "150");
            card.getElementsByTagName("img")[0].classList.add("rounded-5");

            card.getElementsByTagName("span")[0].innerText = "Calories: " + Math.floor(breakfasts[i + 1].recipe.totalNutrients.ENERC_KCAL.quantity) + breakfasts[i + 1].recipe.totalNutrients.ENERC_KCAL.unit;

            card.getElementsByTagName("span")[1].innerText = "Fat: " + Math.floor(breakfasts[i + 1].recipe.totalNutrients.FAT.quantity) + breakfasts[i + 1].recipe.totalNutrients.FAT.unit;

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

            // Create card according to module count. It has to be 1 card because our rows have 2 cards only.
            // Loop will stay to prevent failures if row column counts changes manually.
            for (let i = module; i > 0; i--) {
                let card = createCard(cardId);
                cardId += 1;
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

        // Get all item images except navbar img ( navbar is in an anchor tag )
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
                    loadingDiv.remove();
                    container.style.display = "flex";
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

window.addEventListener('resize', function () {
    let fullCard = document.getElementById("fullCard");
    if (fullCard) {
        let height = document.getElementById("nav").offsetHeight;
        fullCard.style.minHeight = `calc(100% - ${height}px)`;
        fullCard.style.top = `${height}px`;
    }
}, true);