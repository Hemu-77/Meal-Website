const mealList = document.getElementById('lists');
const favouriteList = document.getElementById('favouriteList');
let favMeals = [];

// Function to load favorites from localStorage
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favMeals');
    if (storedFavorites) {
        favMeals = JSON.parse(storedFavorites);
        renderFavorites();
    }
}

// Function to save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('favMeals', JSON.stringify(favMeals));
}

// Function to render favorites in the favoriteList
function renderFavorites() {
    favouriteList.innerHTML = ''; // Clear the list before adding new items
    if (favMeals.length === 0) {
        favouriteList.style.display = 'none';
    } else {
        favMeals.forEach(mel => {
            const listItem = document.createElement('div');
            listItem.className = 'fav-item';

            const mealName = document.createElement('button');
            mealName.textContent = mel;
            mealName.style.display = 'inline';
            mealName.style.fontSize = '20px';
            mealName.style.width = '300px';
            mealName.style.marginTop = '30px';
            mealName.style.backgroundColor = 'greenyellow';
            mealName.style.color = 'brown';
            listItem.appendChild(mealName);

            const delIcon = document.createElement('span');
            delIcon.className = 'delete-icon';
            delIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
            delIcon.style.display = 'inline';
            delIcon.style.marginLeft = '-20px';
           delIcon.style.color = 'black';
            delIcon.addEventListener('click', () => {
                removeFromFavorites(mel); // Remove the meal from favorites
            });


            listItem.appendChild(delIcon);
            favouriteList.style.display = 'block';
            favouriteList.style.color = 'green';
            favouriteList.appendChild(listItem);
        });
    }
}

// Function to remove from favorites
function removeFromFavorites(mealName) {
    favMeals = favMeals.filter(mel => mel !== mealName);
    saveFavorites(); // Save updated favorites to localStorage
    renderFavorites(); // Update UI with new list of favorites
}

async function getItems() {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=a`);
        if (!response.ok) {
            throw new Error('No Data found');
        }

        const allMeals = await response.json();
        const mealsData = allMeals.meals;

        mealsData.forEach(meal => {
            const entireMeal = document.createElement('div');
            const dropDown = document.createElement('button');
            dropDown.textContent = meal.strMeal;
            dropDown.style.width = '250px';
            dropDown.style.height = '40px';
            dropDown.style.display = 'inline';

            const favIcon = document.createElement('span');
            favIcon.className = 'sourceText';
            favIcon.innerHTML = '<i class="fa-regular fa-heart"></i>';
            favIcon.style.display = 'inline';
            favIcon.style.marginLeft = '-20px';

            favIcon.addEventListener('click', () => {
                const favMeal = meal.strMeal;
                if (!favMeals.includes(favMeal)) {
                    favMeals.push(favMeal);
                    saveFavorites(); // Save favorites to localStorage
                    renderFavorites(); // Update UI with new favorite
                }
            });

            dropDown.addEventListener('click', () => {
                const newWindow = window.open('', '_blank');
                newWindow.document.write(`
                    <html>
                    <head>
                        <title>${meal.strMeal}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            img { width: 30vw; display: block; margin-bottom: 20px; }
                            p { font-size: 25px; }
                            .title { font-size: 50px; color: blue; background-image: linear-gradient(red, yellow); }
                        </style>
                    </head>
                    <body>
                        <p class="title">${meal.strMeal}</p>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <p>${meal.strInstructions}</p>
                        <a href="${meal.strYoutube}" target="_blank">Click on this for further information regarding ${meal.strMeal}</a>
                    </body>
                    </html>
                `);
                newWindow.document.close();
            });

            entireMeal.appendChild(dropDown);
            entireMeal.appendChild(favIcon);
            mealList.appendChild(entireMeal);
        });

        // Load favorites from localStorage when page loads
        loadFavorites();
    } catch (err) {
        console.log(err);
    }
}

getItems();
