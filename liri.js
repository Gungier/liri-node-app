require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api'); 
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

 

var command = process.argv[2];
var userInputText = process.argv.slice(3).join(" ");

function toText(data) {
    fs.appendFile("random.txt", '\r\n\r\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    fs.appendFile("random.txt", (data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(space + "random.txt was updated!");
    });
}

switch (command) {
    case "concertThis":
        concerts();
        break;

    case "spotifyThis":
        spotifySong();
        break;

    case "movieThis":
        movie();
        break;

    case "heyLiri":
        doIt();
        break;

    default:
        console.log("Need to know how Liri.js works? Type in the command line 'node liri.js' and one of the following commands and the input text:");
        console.log("\r 'concertThis' and the name of a band");
        console.log("\r 'spotifyThis' and the name of a song");
        console.log("\r 'movieThis' and the name of a movie");
        console.log("\r That's it! Enjoy!");
};


function concerts() {
    var queryUrl = "https://rest.bandsintown.com/artists/" + userInputText + "/events?app_id=codingbootcamp";
    if (userInputText === "") {
        console.log("You must enter a band/artist");
    } else {
        axios.get(queryUrl).then(
            function (response) {
                for (i = 0; i < response.data.length; i++) {
                    console.log("\r\n------YOUR CONCERT SEARCH for " + userInputText + "---------");
                    console.log("Venue: " + response.data[i].venue.name);
                    var location = response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country
                    console.log("Location: " + location);
                    var eventDate = moment(response.data[i].venue.datetime).format("MM-DD-YYYY");
                    console.log("Date: " + eventDate);

                    toText(response);
                }
            }
        );
    };
};


// spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
//     if ( err ) {
//         console.log('Error occurred: ' + err);
//         return;
//     }
 
//     // Do something with 'data'
// });
function spotifySong() {
    if (userInputText === "") {
        userInputText = "The Sign by Ace of Base";
    }
    spotify
        .search({
            type: "track",
            query: userInputText
        })
        .then(function (response) {
            for (i = 0; i <= 7; i++) {
                console.log("\r\n------YOUR SONG SEARCH for '" + userInputText + "'---------");
                console.log("Artist: " + response.tracks.items[i].album.artists[0].name);
                console.log("Album: " + response.tracks.items[i].album.name);
                console.log("Song: " + response.tracks.items[i].name);
                console.log("Preview Song: " + response.tracks.items[i].external_urls.spotify);
            }
            toText(response);
        })
        .catch(function (err) {
            console.log(err);
        });
};



var movie = function() {

    if (!movie) {
        movie = "Mr Nobody";
    }
    //Get your OMDb API key creds here http://www.omdbapi.com/apikey.aspx
    // t = movietitle, y = year, plot is short, then the API key
    var urlHit = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=33981212";

    request(urlHit, function(err, res, body) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            var jsonData = JSON.parse(body);
            output = space + header +
                space + 'Title: ' + jsonData.Title +
                space + 'Year: ' + jsonData.Year +
                space + 'Rated: ' + jsonData.Rated +
                space + 'IMDB Rating: ' + jsonData.imdbRating +
                space + 'Country: ' + jsonData.Country +
                space + 'Language: ' + jsonData.Language +
                space + 'Plot: ' + jsonData.Plot +
                space + 'Actors: ' + jsonData.Actors +
                space + 'Tomato Rating: ' + jsonData.Ratings[1].Value +
                space + 'IMDb Rating: ' + jsonData.imdbRating + "\n";

            console.log(movie);
            console.log(res);
            console.log(output);
            console.log(request);
            writeToLog(output);
        }
    });
};
// ***********************************************************************************

// DO WHAT IT SAYS
// if request is do-what-it-says get artist from bands in town - fs
// `node liri.js do-what-it-says`
//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
//      * Edit the text in random.txt to test out the feature for movie-this and concert-this.
// ***********************************************************************************

function doIt() {
    // We will read the existing  file
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        userInputText = data;
        spotifySong ();
    });
}