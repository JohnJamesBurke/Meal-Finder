const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');

// Event Listeners
submit.addEventListener('submit',searchMeal);
random.addEventListener('click',randomMeal);

mealsEl.addEventListener('click', (e) => {
    const mealInfo = e.path.find(item => {
        //console.log(item);
        if(item.classList){
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    //console.log(mealInfo);
    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealID');
        //console.log(mealID);

        getMealById(mealID);
    }
});

// Functions 

function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            const meal = data.meals[0];

            addMealToDOM(meal);


    });
}

// Get random meal
function randomMeal(){
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            const meal = data.meals[0];

            addMealToDOM(meal);


    });
}

function addMealToDOM(meal){
    const ingredients =[];

    for(let i = 1; i<=20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
              );
        } else {
            break;
        }
    }

    //console.log(ingredients);

    singleMealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>

            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;


}

// Search Meal
function searchMeal(e){
    e.preventDefault();

    // Clear single meal
    singleMealEl.innerHTML = '';

    // Get the search term
    const term = search.value;

    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                resultHeading.innerHTML = `<h2>Search results for '${term}'</h2.`;

                if(data.meals === null){
                    resultHeading.innerHTML = `<p>There are no search results for '${term}' </p>`;

                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `).join('');

                    // Clear search text
                    search.value = '';
                }

            });
    } else {
        alert('Please enter a search keyword');
    }

}