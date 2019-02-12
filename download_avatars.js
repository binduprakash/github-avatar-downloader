var request = require('request');
var secret = require('./secrets');

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
getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach(function(contributor){
    console.log(contributor.avatar_url);
  });
});