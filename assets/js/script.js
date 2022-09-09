//Global variables
var keySearch = "";
var movieObj

var posterContainerEl = document.querySelector("#posters");
var modalEl = document.querySelector("#movie-modal");
var moviePlotEl = document.querySelector(".movie-plot");

//API keys: Lacy: Lacy Alt: k_ag013nc0 Jonathan: k_hm16evk8
apiKey = "k_ag013nc0"

//Event listener and function for button click **NOTE: might want to add alert for empty clicks
$("#searchBtn").on("click", function (event){
    event.preventDefault();    
    keySearch = $(this).siblings("input").val();
    console.log(keySearch);
    getMovieId(keySearch);  
});

//Event listener for displaying modal when user clicks on a movie poster
posterContainerEl.addEventListener("click", function(event) {
    if (event.target.matches(".img-fluid")) {
        imdbId = event.target.parentElement.id;
        getMoviePlot(imdbId);
        plotDrinkModal();
    }
});

var getMovieId = function(){
    var searchUrl = "https://imdb-api.com/en/API/SearchMovie/" + apiKey + "/" + keySearch;

    console.log(searchUrl);

    //Fetch request
    fetch(searchUrl).then(function(response){
        console.log("response")
        response.json().then(function(data){
            console.log(data.results)
           movieObj = data.results
            console.log(movieObj)
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
        picEl.className = "img-fluid"
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
    console.log(apiUrl)
    //make request to url
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            console.log(data);
            // Sets movie's short plot as modal's text
            moviePlotEl.innerHTML = data.plotShort.plainText;
        });
    });
    
};

var plotDrinkModal = function() {
    console.log("poster clicked");
    modalEl.style.display = "block";
};

// When the user clicks anywhere outside of the modal, the modal closes
window.onclick = function(event) {
    if (event.target == modalEl) {
      modalEl.style.display = "none";
    }
};