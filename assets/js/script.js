//Global variables
var keySearch = "";
var movieObj

var posterContainerEl = document.querySelector("#posters");

//Event listener and function for button click **NOTE: might want to add alert for empty clicks
$("#searchBtn").on("click", function (event){
    event.preventDefault();    
    keySearch = $(this).siblings("input").val();
    console.log(keySearch);
    getMovieId(keySearch);  
});

var getMovieId = function(){
    var searchUrl = "https://imdb-api.com/en/API/SearchMovie/k_766k6kjr/" + keySearch;

    console.log(searchUrl);

    //Fetch request
    fetch(searchUrl).then(function(response){
        console.log("response")
        response.json().then(function(data){
            console.log(data.results)
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
        var posterName = movieObj[i].title;
        var imgLink = movieObj[i].image;

        //container for poster
        var posterEl = document.createElement("div");
        //id of poster is the id we need to pull the plot in getMoviePlot
        posterEl.id = movieObj[i].id;
        posterContainerEl.appendChild(posterEl);

        var titleEl = document.createElement("span");
        titleEl.innerText = posterName;
        posterEl.appendChild(titleEl);

        var picEl = document.createElement("img");
        picEl.src = imgLink;
        posterEl.appendChild(picEl);
    }
}


//Retrieves the plot of the movie in an object. We can later edit this function to only return the "short" or "long" plot, depending on what we need. *Note to self: add a call to the function

var getMoviePlot = function(imdbId){
    //format api url
    var apiUrl = "https://imdb-api.com/en/API/Wikipedia/k_766k6kjr/" + imdbId;
    console.log(apiUrl)
    //make request to url
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            console.log(data);
        });
    });
    
};



