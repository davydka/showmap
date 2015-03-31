var express = require('express');
var http = require('http');
var io = require('socket.io')(http);
var app = express();
var server = http.createServer(app);

var Twitter = require('twitter');
var request = require('request');
var cheerio = require('cheerio');
var venues = require('./venues.json');

var params = {screen_name: 'allbvposts', count:'200'};
var re = /http:\/\/t\.co.*/;

var client = new Twitter({
	consumer_key: 'ARCoGEMFjXRoh5NRNRRHIeLLH',
	consumer_secret: 'BhgITJzVANyZ8shgLzcUA3G2ap2ZarBmQGqsJarG6LKIarNPqO',
	access_token_key: '13916002-wgH1ZYoqThQ50rjsD6bHVHhILn34UvVxnEy2oTPmb',
	access_token_secret: 'bjHoWw5AGLCBqDgKqKl14GMp8TaI1oNO1qUMh04B3xbhT'
});

























app.get('/', function(req, res) {

	// Toggle between serving public/index.html
	// and sending a text 'Ola Mundo!' to see
	// nodemon restarting the server upon edit

	if(process.env.NODE_ENV != 'production'){
		res.sendFile(__dirname + '/app/index.html');
	} else {
		res.sendFile(__dirname + '/index.html');
	}

});

if(process.env.NODE_ENV != 'production'){
	app.use('/styles/main.css', express.static(__dirname + '/.tmp/styles/main.css'));
	app.use(express.static('app'));
	app.use('/bower_components',  express.static(__dirname + '/bower_components'));
} else {
	app.use(express.static(__dirname));
}


server.listen(process.env.PORT || 3000);
io = io.listen(server);

server.on('listening', function() {
	console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});


io.on('connection', function (socket) {
	console.log('user connected');
});




app.get('/bvenues.json', function(request, response) {

	get_data(client, io);
	response.json(get_data(client, io));
});






















function get_data(client, io) {

	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (error) {
			console.log(error);
		}

		//console.log(tweets.length);
		//console.log(tweets);

		var counter = 0;
		tweets.forEach(function (tweet) {
			//console.log(tweet);
			//we want link to what's going on
			if (tweet.text.indexOf('going on') > -1) {
				console.log(tweet.text);
				var m;

				//we want the url inside the tweet
				if ((m = re.exec(tweet.text)) !== null) {

					request(m[0], function (error, response, body) {
						if (!error) {
							//console.log(response);
							var $ = cheerio.load(body);

							var header = $('#wrapper .header .meta').text();
							//console.log(header);

							var entryDate = $('.type-post .entry-date').text();
							entryDate = entryDate.replace(' on ', '');
							//console.log(entryDate);

							var links = $('.body p a');
							var linksItems = Object.keys(links);


							$('.body p a').each(function (index, item) {
								//console.log(index);
								//console.log($(item).html());
								if ($(item).html().indexOf(' @ ') > -1) {
									var bvEvent = $(item).text().split(' @ ');

									var names = Object.keys(venues);
									for (var i = 0, length = names.length; i < length; i++) {
										if (names[i] == bvEvent[1]) {
											//console.log('found');
											var latLong = venues[names[i]].latLong;
											var venue = names[i];

											var day = 'monday';
											if(tweet.text.toLowerCase().indexOf('sunday') > -1){
												day = 'sunday';
											}
											if(tweet.text.toLowerCase().indexOf('monday') > -1){
												day = 'monday';
											}
											if(tweet.text.toLowerCase().indexOf('tuesday') > -1){
												day = 'tuesday';
											}
											if(tweet.text.toLowerCase().indexOf('wednesday') > -1){
												day = 'wednesday';
											}
											if(tweet.text.toLowerCase().indexOf('thursday') > -1){
												day = 'thursday';
											}
											if(tweet.text.toLowerCase().indexOf('friday') > -1){
												day = 'friday';
											}
											if(tweet.text.toLowerCase().indexOf('saturday') > -1){
												day = 'saturday';
											}

											io.emit('map', {day:day, venue:venue, latLong:latLong, text:tweet.text, event:bvEvent[0], entryDate:entryDate});
										}
									}
								}

								if(index == linksItems.length-5 && counter == tweets.length) {

								}
							});
						}
					});

				}

			}

			counter++;
		});
	});


}
