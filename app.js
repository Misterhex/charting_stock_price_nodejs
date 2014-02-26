
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var url = require('url')
var request = require('request');
var util = require('util');
var moment = require('moment');
var csv = require('csv');
var _ = require('underscore');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post("/pricechart", function(request, response) {
    function getJsonHistoricalData(ticker, callback) {
		function getQueryString(ticker, from, to) {
			var requestFormat = util.format('http://ichart.finance.yahoo.com/table.csv?s=%s&d=%s&e=%s&f=%s&g=d&a=%s&b=%s&c=%s&ignore=.csv',
			ticker,
			pad(2,from.month(),'0'),
			pad(2,from.date(),'0'),
			from.year(),
			pad(2,to.month(),'0'),
			pad(2,to.date(),'0'),
			to.year());
			
			return requestFormat;
		};

		function pad(width, string, padding) { 
			return (width <= string.length) ? string : pad(width, padding + string, padding)
		};

		request(getQueryString(ticker, moment(), moment().subtract('years', 1)), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				csv().from.string(body)
				.to
				.array(function (data) {
					var mapped = _.map(data, function(row) { 
						var day = 
						{ 
							date: row[0], 
							open: row[1], 
							high: row[2], 
							low: row[3], 
							close: row[4],
							volume: row[5],
							adjClose: row[6],
						};
						return day;
					});
					mapped = mapped.splice(1,mapped.length-1).reverse();
					callback(mapped);
				});
			}
		});
	};

	console.log(request.body);
	// var requestTicker = url.parse(req.url,true).query.ticker;
	// getJsonHistoricalData(requestTicker, function(data) {
 //  		response.json(data, 200);
	// });
  });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


