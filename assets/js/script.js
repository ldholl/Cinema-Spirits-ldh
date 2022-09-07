var keySearch = "";
var movieObj

var posterContainerEl = document.querySelector("#posters");

//After a user searches for the movie they want, the API returns a list of movies that match (the correct movie is usually the first in the index). The Returned object also includes a link to a movie poster, which will probably be useful to us. We also get the imdb ID # from this, which will help us get the movie plot in the next function.

$("#searchBtn").on("click", function (event){
    event.preventDefault();    
    keySearch = $(this).siblings("input").val();
    console.log(keySearch);
    getMovieId(keySearch);  
});

var getMovieId = function(){
    var searchUrl = "https://imdb-api.com/en/API/SearchMovie/k_766k6kjr/" + keySearch;

    console.log(searchUrl);
//make a get request to url

    fetch(searchUrl).then(function(response){
        console.log("response")
        response.json().then(function(data){
            console.log(data.results)
            movieObj = data.results
            showMovies();
        })
    })
};

//important values from the 'results' array: id and image

var showMovies = function(){
    //clear old content
    var posterContainerEl = document.getElementById("posters");
    
    for (i = 0; i < movieObj.length; i ++){
        var posterName = movieObj[i].title;
        var imgLink = movieObj[i].image;

        //container for poster
        var posterEl = document.createElement("div");
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



