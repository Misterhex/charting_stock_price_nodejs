var url = require('url')
var request = require('request');
var util = require('util');
var moment = require('moment');
var csv = require('csv');
var _ = require('underscore');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.pricechart = function(req, res){
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

	var requestTicker = url.parse(req.url,true).query.ticker;
	getJsonHistoricalData(requestTicker, function(data) {
  		res.render('pricechart', { priceData: data });
	});
};