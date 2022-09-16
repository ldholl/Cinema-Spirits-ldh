//Global variables
var keySearch = "";
var movieObj
var plot
var finalPoster
var searches = [];
var imdbId;

var posterContainerEl = document.querySelector("#posters");
var modalEl = document.querySelector("#movie-modal");
var moviePlotEl = document.querySelector(".movie-plot");
var movieTitleEl = document.querySelector(".modal-card-title");
var pastSearchesEl = document.querySelector(".past-searchlist")


//API keys: Lacy: k_766k6kjr Lacy Alt: k_ag013nc0 k_g17k88h4 k_k97mdcmz Jonathan: k_hm16evk8
apiKey = "k_ag013nc0"


//cocktailDB key 9973533

//Event listener and function for button click 
$("#searchBtn").on("click", function (event){
    event.preventDefault();    
    keySearch = $(this).siblings("input").val();
    
    searches.push(keySearch)
    saveSearches();
    getMovieId(keySearch);  
});

//Random movie search
$("#randomBtn").on("click", function(event){
    event.preventDefault();
    $(".hero").remove();
    $("#posters").remove();
    randomMovie();
})

//Fetch movies from user's input
var getMovieId = function(){
    var searchUrl = "https://imdb-api.com/en/API/SearchMovie/" + apiKey + "/" + keySearch;

    //Fetch request
    fetch(searchUrl).then(function(response){
     
        response.json().then(function(data){
           
           movieObj = data.results
           console.log(movieObj)

           
            showMovies();
            
        })
    })
};


//Function to get the movie ids and posters to display
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

//Function to fetch random movie
var randomMovie = function(){
    var randomMovieUrl = "https://imdb-api.com/en/API/Top250Movies/" + apiKey
    fetch(randomMovieUrl).then(function(response){
        response.json().then(function(data){
            var randNo = Math.floor(Math.random() * data.items.length)
            
            imdbId = data.items[randNo].id;
           
            
            //Then fetch the random movie's plot
            var apiUrl = "https://imdb-api.com/en/API/Wikipedia/" + apiKey + "/" + imdbId;
            fetch(apiUrl).then(function(response){
                response.json().then(function(data){
                    plot = data.plotShort.plainText;
                    plot = plot.toLowerCase();
            //Then get the movie's poster
            var randomPosterUrl = "https://imdb-api.com/API/Posters/" + apiKey + "/" + imdbId;
            fetch(randomPosterUrl).then(function(response){
                response.json().then(function(data){
                    var posterObj = data.posters[0];
                    console.log(posterObj)
                    //If there is no poster returned, display 'no image available'
                    if (posterObj === undefined){
                        finalPoster = document.createElement("img");
                        finalPoster.src ="https://64.media.tumblr.com/b33e159bd01f610ec43cc9995cc188bc/a085049e26e857c4-cf/s1280x1920/73f7334595c0a072311a428a74acf9de627f013f.pnj";
                    }
                    else {finalPoster = posterObj["link"]}

                    checkKeywords();
                })
            })       
                })
            })
        })
    })
}

//Retrieves the plot of the movie in an object.

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
//removes most of the html so poster and drink can display
    $(".hero").remove();
    $("#posters").remove();

    checkKeywords();
    
})

var mainIngr
var secondIngr

//Check specified keywords against short plot
var checkKeywords = function() {
    
    plot.split(" ");
    console.log(plot)
    console.log("checking keywords")
    mainIngr = "";
    switch (true){
        case plot.includes("japan" || "japanese" || "anime" || "tokyo"):
            mainIngr = "midori_melon_liqueur"; // sake was not an ingredient listed in the API, subbed for Midori for the next closest Japan-related ingredient
            break;
        case plot.includes ("italy" || "italian" || "renaissance" || "italia" || "rome"):
            mainIngr = "amaretto";
            break;
        case plot.includes ("russian" || "russia" || "soviet" || "ussr" || "berlin"):
            mainIngr = "vodka";
            break;
        case plot.includes("mexico" || "mexican" || "western"):
            mainIngr = "tequila";
            break;
        case plot.includes ("french" || "france" || "paris" || "eiffel-tower"):
            mainIngr = "cognac";
            break;
        case plot.includes ("german"):
            mainIngr = "jagermeister"
            break;
        case plot.includes("drama"):
            mainIngr = "triple_sec";
        case plot.includes("chinese" || "china" || "cantonese" || "mandarin"):
            mainIngr = "tea";
            break
        case plot.includes("korea" || "korean" || "kdrama"):
            mainIngr = "yoghurt"; // soju was not a listed ingredient, subbed for yoghurt (closet to yakult)
            break;
        case plot.includes("indian" || "india" || "bangladesh" || "bengali"):
            mainIngr = "gin";
            break;
        case plot.includes ("portuguese" || "brazilian" || "spanish"):
            mainIngr = "rum"                
            break;
        case plot.includes ("irish"):
            mainIngr = "whisky";
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
        case plot.includes("action"):
            secondIngr = "lime_juice";
            break;
        case plot.includes("adventure"):
            secondIngr = "lemon_juice";
            break;
        case plot.includes("animation"):
            secondIngr = "orange_juice";
            break;
        case plot.includes("mystery" || "thriller" || "psychological"):
            secondIngr = "vermouth";
            break;
        case plot.includes("historical"):
            secondIngr = "cinnamon";
            break;
        case plot.includes("comedy"):
            secondIngr = "soda_water";
            break;
        case plot.includes("crime"):
            secondIngr = "bitters";
            break;
        case plot.includes("fantasy" || "fantastical"):
            secondIngr = "grenadine";
            break;
        case plot.includes("romance" || "romantic"):
            secondIngr = "sugar";
            break;
        case plot.includes("science-fiction" || "sci-fi"):
            secondIngr = "sour";
        case plot.includes("biographical"):
            secondIngr = "champagne";
            break;
        default: break;
    }

    console.log(mainIngr, secondIngr);
    getDrink(mainIngr, secondIngr);
};

//Fetches Drinks from cocktailDB
var getDrink = function() {

    console.log("fetching drinks")

    var cocktailApi = "";

if (secondIngr === ""){
    cocktailApi = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + mainIngr
}

else if(mainIngr === ""){
    cocktailApi = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + secondIngr
}
//if there were no matches, get random cocktail
else if (mainIngr === "" && secondIngr === ""){
    cocktailApi = "https://www.thecocktaildb.com/api/json/v2/9973533/random.php"
    console.log("no keyword matches")
}
else {cocktailApi = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + mainIngr + "," + secondIngr}

console.log(cocktailApi);

    fetch(cocktailApi).then(function(response){
        
        response.json().then(function(data){
        //add in if statement for empty returns ****
        console.log(data);
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
        //If there were matching keywords but no cocktails with that combination, randomly get a vodka drink
        if (drinkId === undefined){
            console.log("no drink matches");
            mainIngr = "vodka";
            secondIngr = "";
            getDrink(); 
        }
        setPage(drinkId);
        
        })
    })
}

//Sets the html to display poster and drink info
var setPage = function(drinkId){
    console.log("setting page")
   
   
    var cocktailIdUrl = "https://www.thecocktaildb.com/api/json/v2/9973533/lookup.php?i=" + drinkId;
  
    fetch(cocktailIdUrl).then(function(response){
        response.json().then(function(data){
        
        var drinkInfo = data.drinks;

        var containerEl = document.getElementById("holder");
        document.body.style.backgroundImage = "url('https://images.pexels.com/photos/3391752/pexels-photo-3391752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
        containerEl.className = "columns final-holder is-centered is-vcentered";

    var imageCard = document.createElement("div");
    imageCard.className = "column is-4 poster-card";
    containerEl.appendChild(imageCard);

    var finalImage = document.createElement("img");
    finalImage.src = finalPoster;
    finalImage.className = "final-poster";
    
    imageCard.appendChild(finalImage);

    var cardEl = document.createElement("div");
    cardEl.className = "card-el column is-4";
    containerEl.appendChild(cardEl)
    
    var drinkCardEl = document.createElement("div");
    drinkCardEl.className= "drink-card";

    cardEl.appendChild(drinkCardEl);

    
    var finalTitle = document.createElement("h2");
    console.log(drinkInfo[0].strDrink)
    finalTitle.innerText = drinkInfo[0].strDrink;
    finalTitle.id = "final-name"

    drinkCardEl.appendChild(finalTitle)

    var cardImgEl = document.createElement("div");
    cardImgEl.id = "image-div"

    drinkCardEl.appendChild(cardImgEl);

    var drinkEl = document.createElement("img");
    console.log(drinkInfo[0].strDrinkThumb)
    drinkEl.src = drinkInfo[0].strDrinkThumb;
    drinkEl.id = "drink-image";

    cardImgEl.appendChild(drinkEl);

    var ingredientsEl = document.createElement("ul");
    ingredientsEl.innerText = "Ingredients:   ";
    ingredientsEl.className = "Ingredients"
    drinkCardEl.appendChild(ingredientsEl);

    if (drinkInfo[0].strIngredient1 !== null){
        var ingredient1 = document.createElement("li");
        ingredient1.innerText = drinkInfo[0].strIngredient1;
        ingredient1.className = "ingredient-item"
        ingredientsEl.appendChild(ingredient1);
    }
    if (drinkInfo[0].strIngredient2 !== null){
        var ingredient2 = document.createElement("li");
        ingredient2.innerText = ", " + drinkInfo[0].strIngredient2;
        ingredient2.className = "ingredient-item"
        ingredientsEl.appendChild(ingredient2);
    }
    if (drinkInfo[0].strIngredient3 !== null){
        var ingredient3 = document.createElement("li");
        ingredient3.innerText = ", " + drinkInfo[0].strIngredient3;
        ingredient3.className = "ingredient-item"
        ingredientsEl.appendChild(ingredient3);
    }
    if (drinkInfo[0].strIngredient4 !== null){
        var ingredient4 = document.createElement("li");
        ingredient4.innerText = ", " + drinkInfo[0].strIngredient4;
        ingredient4.className = "ingredient-item"
        ingredientsEl.appendChild(ingredient4)
        
    }
    if (drinkInfo[0].strIngredient5 !== null){
    var ingredient5 = document.createElement("li");
    ingredient5.innerText = ", " + drinkInfo[0].strIngredient5;
    ingredient5.className = "ingredient-item"
    ingredientsEl.appendChild(ingredient5)
   }

   var recipeEl = document.createElement("p");
   recipeEl.innerText = drinkInfo[0].strInstructions;
   recipeEl.id = "recipe"

   drinkCardEl.appendChild(recipeEl);

   var reloader = document.createElement("button");
   reloader.type = "submit"
   reloader.innerText = "Refresh";
   reloader.id = "reloadBtn";
   
   var fullDoc =document.querySelector("body");
    fullDoc.prepend(reloader);
        })
    })
}

//Reload button listener
$("body").on("click", "#reloadBtn",function(){
    console.log("click")
    document.location.reload()
})

//Function to display saved searches
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

//Function to save searches
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
