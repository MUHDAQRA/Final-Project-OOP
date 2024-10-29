const fs = require('fs');
const path = require('path');

var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnUpdate = document.getElementById('btnUpdate');
var btnDelete = document.getElementById('btnDelete');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');
var mealsList = document.getElementById('mealsList');

let pathName = path.join(__dirname, 'Files');

// Ensure the "Files" directory exists
if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName);
}

// Function to load and display all saved meals
function loadAllMeals() {
    mealsList.innerHTML = ''; // Clear the current list

    fs.readdir(pathName, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory:', err);
        }

        files.forEach((file) => {
            let filePath = path.join(pathName, file);
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    return console.log('Error reading file:', err);
                }

                // Create a meal box for each file
                let mealContainer = document.createElement('div');
                mealContainer.classList.add('meal-container');

                let title = document.createElement('div');
                title.classList.add('meal-title');
                title.textContent = file.replace('.txt', '');

                let ingredients = document.createElement('p');
                ingredients.classList.add('meal-ingredients');
                ingredients.textContent = data;

                // Toggle visibility of ingredients on click
                mealContainer.addEventListener('click', () => {
                    ingredients.style.display = ingredients.style.display === 'none' ? 'block' : 'none';
                });

                mealContainer.appendChild(title);
                mealContainer.appendChild(ingredients);

                // Add meal container to meals list
                mealsList.appendChild(mealContainer);
            });
        });
    });
}

// Event listener to create a new meal file
btnCreate.addEventListener('click', function() {
    let file = path.join(pathName, `${fileName.value}.txt`);
    let contents = fileContents.value;

    fs.writeFile(file, contents, function(err) {
        if (err) {
            return console.log(err);
        }
        alert(`${fileName.value} was created`);
        fileName.value = '';
        fileContents.value = '';

        // Reload the list of meals after creation
        loadAllMeals();
    });
});

// Event listener to read a specific meal file
btnRead.addEventListener('click', function() {
    let file = path.join(pathName, `${fileName.value}.txt`);

    fs.readFile(file, function(err, data) {
        if (err) {
            return console.log(err);
        }
        fileContents.value = data;
        console.log('The file was read!');
    });
});

// Event listener to delete a specific meal file
btnDelete.addEventListener('click', function() {
    let file = path.join(pathName, `${fileName.value}.txt`);

    fs.unlink(file, function(err) {
        if (err) {
            return console.log(err);
        }
        fileName.value = '';
        fileContents.value = '';
        console.log('The file was deleted!');

        // Reload the list of meals after deletion
        loadAllMeals();
    });
});

// Event listener to update a specific meal file
btnUpdate.addEventListener('click', function() {
    let file = path.join(pathName, `${fileName.value}.txt`);
    let contents = fileContents.value;

    fs.writeFile(file, contents, function(err) {
        if (err) {
            return console.log(err);
        }
        alert(`${fileName.value} was updated`);
        fileName.value = '';
        fileContents.value = '';

        // Reload the list of meals after updating
        loadAllMeals();
    });
});

// Load all meals on startup
loadAllMeals();
