// Load and display favorite meals
async function loadFavorites() {
    const favoritesDisplay = document.getElementById("favoritesDisplay");
    favoritesDisplay.innerHTML = ''; // Clear previous favorites

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        favoritesDisplay.innerHTML = '<p>No favorite meals added yet!</p>';
        return;
    }

    for (let mealId of favorites) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
            const data = await response.json();
            const meal = data.meals[0];

            const mealContainer = document.createElement('div');
            mealContainer.className = 'meal-container';
            mealContainer.innerHTML = `
                <img class="meal-image" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p class="meal-title">${meal.strMeal}</p>
                <button onclick="removeFavorite('${mealId}')">Remove from Favorites</button>
            `;

            mealContainer.addEventListener('click', () => displayMealDetails(mealId));
            favoritesDisplay.appendChild(mealContainer);
        } catch (error) {
            console.error("Error fetching favorite meal:", error);
        }
    }
}

// Remove a meal from favorites
function removeFavorite(mealId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== mealId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites(); // Refresh the list
}

// Fetch and display meal details in modal
async function displayMealDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        const meal = data.meals[0];

        document.getElementById("mealImage").src = meal.strMealThumb;
        document.getElementById("mealName").innerText = meal.strMeal;
        document.getElementById("mealCategory").innerText = meal.strCategory;
        document.getElementById("mealArea").innerText = meal.strArea;
        document.getElementById("mealInstructions").innerText = meal.strInstructions;

        const ingredientsList = document.getElementById("mealIngredients");
        ingredientsList.innerHTML = getIngredients(meal);

        const mealYoutube = document.getElementById("mealYoutube");
        mealYoutube.innerHTML = meal.strYoutube ? 
            `<h4>Watch on YouTube:</h4><a href="${meal.strYoutube}" target="_blank">${meal.strYoutube}</a>` : '';

        openModal();
    } catch (error) {
        console.error("Error fetching meal details:", error);
    }
}

function getIngredients(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        }
    }
    return ingredientsList;
}

// Modal handling
function openModal() {
    document.getElementById("mealModal").style.display = "block";
}

function closeModal() {
    document.getElementById("mealModal").style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById("mealModal");
    if (event.target == modal) {
        closeModal();
    }
}

// Load favorites on page load
document.addEventListener("DOMContentLoaded", loadFavorites);
