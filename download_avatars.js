var request = require('request');
var secret = require('./secrets');
var fs = require('fs');

var input = process.argv.slice(2);


console.log('Welcome to the GitHub Avatar Downloader!');

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

function downloadImageByURL(url, filePath) {
  request.get(url)     // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       .on('response', function (response) {                           // Note 3
         console.log('Response Status Message: ', response.statusMessage);
         console.log('Downloading image...');
       })
       .on('end', function(){
          console.log('Download complete.');
       })
       .pipe(fs.createWriteStream(filePath));
}
if(input.length === 2){
getRepoContributors(input[0], input[1], function(err, result) {
  console.log("Errors:", err);
  result.forEach(function(contributor){
    // console.log(contributor.avatar_url);
    // console.log(contributor.login);
    downloadImageByURL(contributor.avatar_url, 'avatars/' + contributor.login + '.jpg')
  });
});
}
else {
  console.log('error : 2 inputs are required');
}
