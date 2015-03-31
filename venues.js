var Twitter = require('twitter');
var request = require('request');
var cheerio = require('cheerio');
var venues = require('./venues.json');

var params = {screen_name: 'allbvposts'};
var re = /http:\/\/t\.co.*/;

var client = new Twitter({
	consumer_key: 'ARCoGEMFjXRoh5NRNRRHIeLLH',
	consumer_secret: 'BhgITJzVANyZ8shgLzcUA3G2ap2ZarBmQGqsJarG6LKIarNPqO',
	access_token_key: '13916002-wgH1ZYoqThQ50rjsD6bHVHhILn34UvVxnEy2oTPmb',
	access_token_secret: 'bjHoWw5AGLCBqDgKqKl14GMp8TaI1oNO1qUMh04B3xbhT'
});

function get_data() {
	var stringReturn = '{"type": "FeatureCollection", "features": [';

	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (error) {
			console.log(error);
		}

		tweets.forEach(function (tweet) {
			//console.log(e);
			//we want link to what's going on
			if (tweet.text.indexOf('going on') > -1) {

				var m;

				//we want the url inside the tweet
				if ((m = re.exec(tweet.text)) !== null) {

					request(m[0], function (error, response, body) {
						if (!error) {
							var $ = cheerio.load(body);

							var header = $('#wrapper .header .meta').text();
							console.log(header);

							$('.body p a').each(function (index, item) {
								//console.log($(item).html());
								if ($(item).html().indexOf(' @ ') > -1) {
									var bvEvent = $(item).text().split(' @ ');


									var names = Object.keys(venues);
									for (var i = 0, length = names.length; i < length; i++) {
										if (names[i] == bvEvent[1]) {

											//stringReturn
											//console.log(names[i]);
											//console.log(venues[names[i]]);
										}
									}


								}
							});
						}
					});

				}

			}
		});
	});

	stringReturn += "}";

	return stringReturn;
}