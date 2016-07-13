//server related dependencies 
var express = require('express');  
var app = express();  
var port = process.env.port || 8300;



//twitter dependencies
var twitter = require('twitter');  
var twit = new twitter({  
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

//twitter data
var latestMentions = [];  
var idStrings = {};


app.get('/*', function(req, res){  
  res.send('Hello World');
});

var server = app.listen(port, function(){  
  console.log('Basic server is listening on port ' + port);
});



var getMentions = function(){
  twit.get('statuses/mentions_timeline.json', function(data,response){
    if(response.length){
      for(var i = 0; i < response.length; i++){
        var currentTweet = response[i];
        if(!idStrings[currentTweet.id_str]){
         idStrings[currentTweet.id_str] = true;
          var tweetObj = {};
          tweetObj.user = currentTweet.user.screen_name;
          tweetObj.text = currentTweet.text;
          latestMentions.push(tweetObj);
        }
      }
      //response to new mentions
      replyToMentions();
    } 
    else{
      console.log(response);
    }
  });
};

//This function takes all of the mentions stored in our latestMentions array and responds to them
//with a simple message. We want to invoke it at the end of our getMentions function, so it is called
//when we have all our new mentions. 
var replyToMentions = function(){  
  for(var i = 0; i < latestMentions.length; i++){
    var currentMention = latestMentions[i];
    //responseTweet is the string we will send to twitter to tweet for us
    var responseTweet = '@';
    responseTweet += currentMention.user;
    responseTweet += '\n F O D A S \n';
	console.log(currentMention.user);
    //twit will now post this responseTweet to twitter. This function takes a string and a callback
	twit.post('statuses/update', {status: responseTweet},  function(error, tweet, response){
		console.log(tweet);  // Tweet body. 
    });
  }
};

// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(getMentions, 1000 * 60);