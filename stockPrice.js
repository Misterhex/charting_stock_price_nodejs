var request = require('request');
var util = require('util');
var moment = require('moment');
var program = require('commander');
var csv = require('csv');

program
  .version('1.0.0')
  .option('-t, --ticker [type]', 'stock ticker', 'aapl')
  .option('-y, --yearsAgo [type]', 'n years ago data to get','5')
  .parse(process.argv);
  
console.log(program.ticker);
console.log(program.yearsAgo);

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
}

request(getQueryString(program.ticker, moment(), moment().subtract('years', program.yearsAgo)), function (error, response, body) {
	if (!error && response.statusCode == 200) {
	csv().from.string(body)
	.to
	.array(function (data) {
	console.log(JSON.stringify(data));
	})}});
