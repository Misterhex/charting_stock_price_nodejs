var request = require('request');
var util = require('util');
var moment = require('moment');

function getRequestFormat(ticker, from, to) {
	var requestFormat = util.format('http://ichart.finance.yahoo.com/table.csv?s=%s&d=%s&e=%s&f=%s&g=d&a=%s&b=%s&c=%s&ignore=.csv',
	ticker,
	pad(2,from.getMonth(),'0'),
	pad(2,from.getDate(),'0'),
	from.getFullYear(),
	pad(2,to.getMonth(),'0'),
	pad(2,to.getDate(),'0'),
	to.getFullYear());
	
	return requestFormat;
};

function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, padding + string, padding)
}

var s = getRequestFormat('MSFT', moment(), moment().add('years',-5));
console.log(s);

// var now = new Date();

// request(getRequestFormat('MSFT'), function (error, response, body) {
  // if (!error && response.statusCode == 200) {
    // console.log(body);
  // }
// })