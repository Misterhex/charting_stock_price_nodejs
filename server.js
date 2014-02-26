"use strict"

var request = require('request');
var util = require('util');
var moment = require('moment');
var csv = require('csv');
var http = require('http');
var express = require('express');
var app = express();


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

	request(getQueryString(ticker, moment(), moment().subtract('years', 5)), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			csv().from.string(body)
			.to
			.array(function (data) {
				callback(JSON.stringify(data));
			});
		}
	});
};


app.get('/', function(req, res){
	res.send('Hello World');
});

app.listen(3000);
console.log('Listening on port 3000');


