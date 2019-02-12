var request = require('request');
var secret = require('./secrets');
var fs = require('fs');

var input = process.argv.slice(2);


console.log('Welcome to the GitHub Avatar Downloader!');

/*
  Function to get all contributor details for the given repo owner and name.
*/
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent':'request',
      'Authorization':'token '+ secret.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

/*
  Function to download image for the given url and local file path
*/
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log('Response Status Message: ', response.statusMessage);
      console.log('Downloading image...');
    })
    .on('end', function(){
      console.log('Download complete.');
    })
    .pipe(fs.createWriteStream(filePath));
}

// command line argument validation
if(input.length === 2){
  getRepoContributors(input[0], input[1], function(err, result) {
    console.log("Errors:", err);
    result.forEach(function(contributor){
      downloadImageByURL(contributor.avatar_url, 'avatars/' + contributor.login + '.jpg')
    });
  });
} else {
  console.log('Error : Two inputs are required');
  console.log('eg. node download_avatars.js jquery jquery');
}
