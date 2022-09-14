//Global variables
var keySearch = "";
var movieObj
var plot
var finalPoster
var searches = [];

var posterContainerEl = document.querySelector("#posters");
var modalEl = document.querySelector("#movie-modal");
var moviePlotEl = document.querySelector(".movie-plot");
var movieTitleEl = document.querySelector(".modal-card-title");
var pastSearchesEl = document.querySelector(".past-searchlist")

//API keys: k_g17k88h4 Lacy: k_766k6kjr Lacy Alt: k_ag013nc0 Jonathan: k_hm16evk8
apiKey = "k_ag013nc0"
//cocktailDB key 9973533

//Event listener and function for button click **NOTE: might want to add alert for empty clicks
$("#searchBtn").on("click", function (event){
    event.preventDefault();    
    keySearch = $(this).siblings("input").val();
    
    searches.push(keySearch)
    saveSearches();
    getMovieId(keySearch);  
});


var getMovieId = function(){
    var searchUrl = "https://imdb-api.com/en/API/SearchMovie/" + apiKey + "/" + keySearch;

    //Fetch request
    fetch(searchUrl).then(function(response){
     
        response.json().then(function(data){
           
           movieObj = data.results
           
            showMovies();
            
        })
    })
};


//Function to get the movie ids and posters
var showMovies = function(){

    var posterContainerEl = document.getElementById("posters");
    
    // Empties the inner HTML content of the poster container so the new search can populate its corresponding posters
    posterContainerEl.innerHTML = "";

    for (i = 0; i < movieObj.length; i ++){
        
        //container for poster
        var posterEl = document.createElement("div");
        //id of poster is the id we need to pull the plot in getMoviePlot
        posterEl.id = movieObj[i].id;
        posterEl.className = "column is-half-mobile is-one-third-tablet is-one-quarter-desktop"

        var imgLink = movieObj[i].image;
        var picEl = document.createElement("img");
        picEl.src = imgLink;
        picEl.className = "poster-img image is 2by3"
        posterEl.appendChild(picEl);

        var posterName = movieObj[i].title;
        var titleEl = document.createElement("span");
        titleEl.innerText = posterName;
        posterEl.appendChild(titleEl);

        posterContainerEl.appendChild(posterEl);
    }
}


//Retrieves the plot of the movie in an object. We can later edit this function to only return the "short" or "long" plot, depending on what we need. *Note to self: add a call to the function

var getMoviePlot = function(imdbId){
    //format api url
    var apiUrl = "https://imdb-api.com/en/API/Wikipedia/" + apiKey + "/" + imdbId;
   
    //make request to url
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            // Sets movie's short plot as modal's text
            moviePlotEl.innerHTML = data.plotShort.plainText;
            movieTitleEl.innerHTML = data.fullTitle;
            plot = data.plotShort.plainText;
            plot = plot.toLowerCase();
            $(".modal").addClass("is-active");
        });
    }
    
    );
    
};

//MODAL FUNCTIONS
//listener for poster clicks
posterContainerEl.addEventListener("click", function(event) {
    if (event.target.matches(".poster-img")) {
        imdbId = event.target.parentElement.id;
        finalPoster = event.target.src;
        getMoviePlot(imdbId);
    }
});
//listener for close clicks
$(".modal-close").on("click", function(){
    $(".modal").removeClass("is-active");
})
//listener for clicking off of modal
$(document).on("click" , function() {
    $(".modal").removeClass("is-active");
})
//listener for submit
$(".modal-submit").on("click", function(){
    $(".modal").removeClass("is-active");
     
    
    console.log("click");
    //location.href = "drink-movie.html";
    $(".hero").remove();
    $("#posters").remove();
   
    //checkKeywords();
    checkKeywords();
    
})

var mainIngr
var secondIngr

var checkKeywords = function() {
    
    plot.split(" ");
    console.log(plot)
    console.log("checking keywords")
    mainIngr = "";
    switch (true){
        case plot.includes("japan" || "japanese" || "anime" || "tokyo"):
            mainIngr = "Midori melon liqueur"; // sake was not an ingredient listed in the API, subbed for Midori for the next closest Japan-related ingredient
            break;
        case plot.includes ("italy" || "italian" || "renaissance" || "italia" || "rome"):
            mainIngr = "amaretto";
            break;
        case plot.includes ("russian" || "russia" || "soviet" || "USSR" || "berlin"):
            mainIngr = "vodka";
            break;
        case plot.includes ("french" || "france" || "paris" || "eiffel tower"):
            mainIngr = "cognac";
            break;
        case plot.includes("chinese" || "china" || "cantonese" || "mandarin"):
            mainIngr = "tea";
            break
        case plot.includes("korea" || "korean" || "kdrama"):
            mainIngr = "Yoghurt"; // soju was not a listed ingredient, subbed for yoghurt (closet to yakult)
            break;
        case plot.includes ("german" || "deutsche" || "germany"):
            mainIngr = "strawberry schnapps"; // schnapps was not a listed ingredient, subbed for strawberry schnapps
            break;
        case plot.includes("indian" || "india" || "bangladesh" || "bengali"):
            mainIngr = "gin";
            break;
        case plot.includes ("portuguese" || "brazilian" || "spanish"):
            mainIngr = "rum"                
            break;
        case plot.includes ("american" || "irish" || "ireland"):
            mainIngr = "whiskey";
            break;
        case plot.includes("southern"):
            mainIngr = "bourbon";
            break;
        case plot.includes ("british" || "britain" || "wales" || "welsh"):
            mainIngr = "brandy";
            break;
        default: break;
    };

    secondIngr = "";
    switch(true){
        case plot.includes("action" || "adventure"):
            secondIngr = "";
            break;
        case plot.includes("mystery" || "thriller" || "psychological"):
            secondIngr = "vermouth";
            break;
        case plot.includes("crime"):
            secondIngr = "bitters";
            break;
        case plot.includes("fantasy" || "fantastical"):
            secondIngr = "champagne";
            break;
        case plot.includes("romance" || "romantic comedy" || "rom-com"):
            secondIngr = "sugar";
            break;
        case plot.includes("science fiction"):
            secondIngr = "carbonated water"
            break;
        default: break;
    }

    console.log(mainIngr, secondIngr);
    getDrink(mainIngr, secondIngr);
};


var getDrink = function() {

    console.log("fetching drinks")

    var cocktailApi = "";

    if (secondIngr === ""){
        cocktailApi = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + mainIngr
    }

    else if(mainIngr === ""){
        cocktailApi = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + secondIngr
    }

    else {cocktailApi = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + mainIngr + "," + secondIngr}

    console.log(cocktailApi);


    fetch(cocktailApi).then(function(response){
        
        response.json().then(function(data){
        //add in if statement for empty returns ****
        console.log(data);
        console.log(data.drinks.length)
        var drinkId 
    //if multiple matches, display random drink from returned list
        if (data.drinks.length > 1){
            var randNo = Math.floor(Math.random() * data.drinks.length + 1 )
            console.log(data.drinks[0]);
            drinkId = data.drinks[randNo].idDrink;
        }
        else {
            drinkId = data.drinks[0].idDrink;
        }
        console.log(drinkId)
        setPage(drinkId);
        
        })
    })
}


var setPage = function(drinkId){
    console.log("setting page")
   
   
    var cocktailIdUrl = "https://www.thecocktaildb.com/api/json/v2/9973533/lookup.php?i=" + drinkId;
  
    fetch(cocktailIdUrl).then(function(response){
        response.json().then(function(data){
        
        var drinkInfo = data.drinks;

        var containerEl = document.getElementById("holder");
        containerEl.className = "holder";

    var imageCard = document.createElement("div");
    imageCard.className = "poster-card";
    containerEl.appendChild(imageCard);

    var finalImage = document.createElement("img");
    finalImage.src = finalPoster;
    finalImage.className = "final-poster";
    
    imageCard.appendChild(finalImage);

    var cardEl = document.createElement("div");
    cardEl.className = "card-el";
    containerEl.appendChild(cardEl)
    
    var drinkCardEl = document.createElement("div");
    drinkCardEl.className= "tile drink-card is-vertical";

    cardEl.appendChild(drinkCardEl);

    
    var finalTitle = document.createElement("h2");
    console.log(drinkInfo[0].strDrink)
    finalTitle.innerText = drinkInfo[0].strDrink;
    finalTitle.className = "tile";
    finalTitle.id = "final-drink"

    drinkCardEl.appendChild(finalTitle)

    var cardImgEl = document.createElement("div");
    cardImgEl.className = "tile is-parent";
    cardImgEl.id = "image-div"

    drinkCardEl.appendChild(cardImgEl);

    var drinkEl = document.createElement("img");
    console.log(drinkInfo[0].strDrinkThumb)
    drinkEl.src = drinkInfo[0].strDrinkThumb;
    drinkEl.className = "tile is-child";
    drinkEl.id = "drink-image";

    cardImgEl.appendChild(drinkEl);

    var recipeEl = document.createElement("p");
    recipeEl.innerText = drinkInfo[0].strInstructions;
    recipeEl.className = "tile";
    recipeEl.id = "recipe"

    drinkCardEl.appendChild(recipeEl);

    ///add in ingredients




        })
    })
}

var listPastSearch = function(keySearch) {
    // Does not list searched movie if already previously searched
    if (searches.includes(keySearch)) {
        return false;
    }
    
    searches.push(keySearch);
    searchedMovieEl = document.createElement("option");
    searchedMovieEl.value = keySearch;
    pastSearchesEl.appendChild(searchedMovieEl);
};

var saveSearches = function () {
    localStorage.setItem("searched-movies", JSON.stringify(searches));
};

var loadSearches = function() {
    savedSearches = localStorage.getItem("searched-movies");

    if (!savedSearches) {
        return false;
    }

    savedSearches = JSON.parse(savedSearches);

    for (var i = 0; i <savedSearches.length; i++) {
        listPastSearch(savedSearches[i]);
    }
};

loadSearches();