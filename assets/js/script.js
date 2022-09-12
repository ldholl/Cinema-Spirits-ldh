//Global variables
var keySearch = "";
var movieObj
var plot

var posterContainerEl = document.querySelector("#posters");
var modalEl = document.querySelector("#movie-modal");
var moviePlotEl = document.querySelector(".movie-plot");
var movieTitleEl = document.querySelector(".modal-card-title");

//API keys: Lacy: Lacy Alt: k_ag013nc0 Jonathan: k_hm16evk8
apiKey = "k_ag013nc0"
//cocktailDB key 9973533

//Event listener and function for button click **NOTE: might want to add alert for empty clicks
$("#searchBtn").on("click", function (event){
    event.preventDefault();    
    keySearch = $(this).siblings("input").val();
    
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
        picEl.className = "poster-img"
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
    var apiUrl = "https://imdb-api.com/en/API/Wikipedia/k_hm16evk8/" + imdbId;
   
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
        getMoviePlot(imdbId);
    }
});
//listener for close clicks
$(".modal-close").on("click", function(){
    $(".modal").removeClass("is-active");
})
//listener for submit
$(".modal-submit").on("click", function(event){
    event.preventDefault();
    $(".modal").removeClass("is-active");
    location.href = "drink-movie.html"
    checkKeywords();
})

var checkKeywords = function(){
    console.log("checking keywords")
    var mainIngr = "";
    switch (true){
        case plot.includes("japan" || "japanese" || "anime"):
            mainIngr = "sake,";
            break;
        case plot.includes ("italy" || "italian"):
            mainIngr = "amaretto,";
            break;
        case plot.includes ("russian" || "russia" || "soviet"):
            mainIngr = "vodka,"
            break;
        case plot.includes ("french" || "france"):
            mainIngr = "cognac,";
            break;
        case plot.includes("chinese,"):
            //something
            break
        case plot.includes ("german"):
            mainIngr = "schnapps,"
            break;
        case plot.includes("indian"):
            mainIngr = "gin,"
        case plot.includes ("portuguese" || "brazilian"):
            mainIngr = "rum"                
            break;
        case plot.includes ("american" || "irish"):
            mainIngr = "whiskey";
            break;
        case plot.includes ("british"):
            mainIngr = "brandy,";
            break;
        default: break;
    };

    var secondIngr = "";
    switch(true){
        case plot.includes("action"):
            secondIngr = "";
            break;
        case plot.includes("mystery"):
            //something
            break;
        case plot.includes("crime"):
            //something
            break;
        case plot.includes("fantasy"):
            //something
            break;
        case plot.includes("science fiction"):
            //something
            break;
        default: break;
    }
    getDrink();
}


///Add api fetch here
var finalposter = $("#landing-poster")
var drinkImgEl = $("#drink-img");
var drinkName = $("#drink-name");
var recipe = $("#recipe");


var getDrink = function(mainIngr, secondIngr){
console.log("fetching drinks")
var mainIngr = "vodka,"
var secondIngr = "orange_juice"
var cocktailApi = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + mainIngr + secondIngr;
console.log(cocktailApi);
fetch(cocktailApi).then(function(response){
    response.json().then(function(data){
    console.log(data);
    console.log(data.drinks.length)
    if (data.drinks.length > 1){
        var randNo = Math.floor(Math.random() * data.drinks.length + 1 )
        console.log(data.drinks[0]);
        drinkId = data.drinks[randNo].idDrink
    }
    else {
        drinkId = data.drinks.idDrink;
    }
    setPage(drinkId);
    })
})
}

var setPage = function(drinkId){
var cocktailIdUrl = "www.thecocktaildb.com/api/json/v2/9973533/lookup.php?i=" + drinkId;
    fetch(cocktailIdUrl).then(function(response){
    response.json().then(function(data){
    console.log(data);
    //finalposter.src = 
    drinkImgEl.src =  data.strDrinkThumb;
    drinkName.innerHTML = data.strDrink;
    recipe.innerHtml = strInstructions;  

        })
    })
}



