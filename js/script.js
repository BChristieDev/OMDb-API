// API Key required to use the OMDb API.
const API_KEY = "660774da"

// The base url that will be appended with request parameters.
const BASE_URL = "https://www.omdbapi.com/?apikey=" + API_KEY

// Width and Height for the poster image displayed in the table.
const IMAGE_WIDTH = 150
const IMAGE_HEIGHT = 220

// Maximum amount of pages the OMDb API allows to be displayed.
const LAST_PAGE = 100

// Alt text for the poster image in the event that one is not available.
const ALT_MESSAGE = "No Image Found"

// Text box used to search for a movie.
let movieTitleContains = document.getElementById("movieTitleContains")

// Displays the current page number.
let currentPageNo = document.getElementById("currentPageNo")

// Displays the last page number.
let lastPageNo = document.getElementById("lastPageNo")

// Table containing all of the movies found with the specified keyword in movieTitleContains.
let movieList = document.getElementById("movieList")

// Detailed information that will be displayed when a user selects a poster.
let detailedMovieList = document.getElementById("detailedMovieList")

// Default current page will be set to one.
let currentPage = 1

window.onload = () => {
	// When the search button is pressed, it will append the url with the base url and request parameters and uses the fetch api.
	document.getElementById("search").onclick = search

	// When the prevPage button is pressed, it will call the prevPage function which will decrement the current page and call the search function.
	document.getElementById("prevPage").onclick = prevPage

	// When the nextPage button is pressed, it will call the nextPage function which will increment the current page and call the search function.
	document.getElementById("nextPage").onclick = nextPage

	// Appends the url with the base url and request parameters and uses the fetch api.
	search()
}

// Decrements the current page and calls the search function, displaying the new page.
function prevPage() {
	if (currentPage - 1 > 0) {
		currentPage--

		search()
	}
}

// Increments the current page and calls the search function, displaying the new page.
function nextPage() {
	if (currentPage + 1 <= LAST_PAGE) {
		currentPage++

		search()
	}
}

// Appends the url with the base url and request parameter and uses the fetch api to display movie data in to a table.
function search() {
	let typeRadio = document.querySelector("input[name='typeRadio']:checked").value

	let url = BASE_URL + "&s=" + movieTitleContains.value

	if (typeRadio != "") {
		url += "&type=" + typeRadio
	}

	url += "&page=" + currentPage

	fetchResource(url)
}

// Appends the detailed url with the base url and request parameter for a more specific search which only returns one result, and uses the fetch api to display that specific
// movie's data in to a table.
function detailedSearch(movieTitle) {
	let detailedUrl = BASE_URL + "&t=" + movieTitle

	fetchDetailedResource(detailedUrl)
}

// Uses the specified url to fetch a resource. Displays the current and last page as well as calls the displayMovies function with the json data returned as a response from
// the fetch api.
function fetchResource(url) {
	fetch(url)
		.then((response) => response.json())
		.then((json) => {
			currentPageNo.innerText = "Current Page: " + currentPage
			lastPageNo.innerText = "Last Page: " + LAST_PAGE

			displayMovies(json.Search)
		})
		.catch((error) => alert(error))
}

// Uses the specified detailed url to fetch a resrouce for one specific movie, and calls the displayDetailedData function with the json data returned as a response from
// the fetch api.
function fetchDetailedResource(detailedUrl) {
	fetch(detailedUrl)
		.then((response) => response.json())
		.then((json) => displayDetailedData(json))
		.catch((error) => alert(error))
}

// displayMovies is a function that will read through each index of the JSON returned from the fetch api and append it to a table.
function displayMovies(movieJSON) {
	let keys = Object.keys(movieJSON)

	movieList.innerHTML = ""

	movieList.innerHTML +=
		"<thead>" +
		"<tr>" +
		`<th scope="col">Poster</th>` +
		`<th scope="col">Title</th>` +
		`<th scope="col">Type</th>` +
		`<th scope="col">Year</th>` +
		"</tr>" +
		"</thead>"

	keys.forEach((key) => {
		let movieData = movieJSON[key]

		movieList.innerHTML +=
			"<tr>" +
			"<td>" +
			`<img src="` +
			movieData.Poster +
			`" width="` +
			IMAGE_WIDTH +
			`" height="` +
			IMAGE_HEIGHT +
			`" alt="` +
			ALT_MESSAGE +
			`" onclick=\"detailedSearch('${movieData.Title}')\" />` +
			"</td>" +
			"<td>" +
			movieData.Title +
			"</td>" +
			"<td>" +
			movieData.Type +
			"</td>" +
			"<td>" +
			movieData.Year +
			"</td>" +
			"</tr>"
	})
}

// displayDetailedData is a function that will read through the one JSON response returned from the fetch api and append it to a table with more specific information
// about the movie.
function displayDetailedData(detailedMovieJSON) {
	detailedMovieList.innerHTML =
		"<thead>" +
		"<tr>" +
		`<th scope="col">Rated</th>` +
		`<th scope="col">Released</th>` +
		`<th scope="col">Runtime</th>` +
		`<th scope="col">Genres</th>` +
		`<th scope="col">Writers</th>` +
		`<th scope="col">Actors</th>` +
		`<th scope="col">Rating</th>` +
		`<th scope="col">Seasons</th>` +
		"</tr>" +
		"</thead>" +
		"<tr>" +
		"<td>" +
			detailedMovieJSON.Rated +
		"</td>" +
		"<td>" +
			detailedMovieJSON.Released +
		"</td>" +
		"<td>" +
			detailedMovieJSON.Runtime +
		"</td>" +
		"<td>" +
			detailedMovieJSON.Genre +
		"</td>" +
		"<td>" +
			detailedMovieJSON.Writer +
		"</td>" +
		"<td>" +
			detailedMovieJSON.Actors +
		"</td>" +
		"<td>" +
			detailedMovieJSON.imdbRating +
		"</td>" +
		"<td>" +
			detailedMovieJSON.totalSeasons +
		"</td>" +
		"</tr>"
}