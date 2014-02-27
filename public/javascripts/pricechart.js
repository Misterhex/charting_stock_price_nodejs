$(function() {

"use strict"

	$("#ticker").keyup(function( evt ) {
	  var ticker = $(this).val();
	  console.log(ticker);
	  var regexp = new RegExp("^[a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z]");
	  if (ticker.length == 4 && ticker.match(regexp)) 
	  {
	  	console.log(ticker);
		$.post( "/pricechart", { ticker: ticker } )
		.done(function( data ) {
			var dataSource = JSON.parse(data);
			console.log(dataSource)
			
			$("#chartContainer").dxChart({
		        dataSource: dataSource,
		        commonSeriesSettings: {
		            argumentField: 'date'
		        },
		        series: [
		            { valueField: 'open', name: 'open' },
		            // { valueField: 'high', name: 'high' },
		            // { valueField: 'low', name: 'low' },
		            // { valueField: 'close', name: 'close' },
		            // { valueField: 'volume', name: 'volume' },
		            // { valueField: 'adjClose', name: 'adjClose' },
		        ],
		        tooltip: {
		            enabled: true
		        },
		        title: {
		            text: ticker.toUpperCase() +' Historical Price From Yahoo Finance' 
		        },
		        legend: {
		            verticalAlignment: 'bottom',
		            horizontalAlignment: 'center'
		        }
		    });

	  	});
	  }

	});

});