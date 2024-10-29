// Fetch and display meals based on user input
async function buttonClicked() {
    const category = document.getElementById("category_input").value;
    const ingredient = document.getElementById("ingredient_input").value;

    const mealsDisplay = document.getElementById("mealsDisplay");
    mealsDisplay.innerHTML = ''; // Clear previous results

    let apiUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?';

    if (category) {
        apiUrl += `c=${category}`;
    } else if (ingredient) {
        apiUrl += `i=${ingredient}`;
    } else {
        alert("Please enter a category or ingredient!");
        return;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.meals) {
            mealsDisplay.innerHTML = '<p>No meals found. Try a different category or ingredient.</p>';
            return;
        }

        for (let meal of data.meals) {
            const mealContainer = document.createElement('div');
            mealContainer.className = 'meal-container';
            mealContainer.innerHTML = `
                <img class="meal-image" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p class="meal-title">${meal.strMeal}</p>
                <button onclick="addFavorite('${meal.idMeal}')">Add to Favorites</button>
            `;

            mealContainer.addEventListener('click', () => displayMealDetails(meal.idMeal));
            mealsDisplay.appendChild(mealContainer);
        }
    } catch (error) {
        console.error("Error fetching meals:", error);
        mealsDisplay.innerHTML = '<p>Failed to fetch meals. Please try again later.</p>';
    }
}

// Add meal to favorites in localStorage
function addFavorite(mealId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(mealId)) {
        favorites.push(mealId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert("Meal added to favorites!");
    } else {
        alert("Meal already in favorites!");
    }
}

// Fetch and display meal details
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

// Get ingredients list
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
