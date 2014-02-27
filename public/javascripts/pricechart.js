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
			console.log(dataSource[0]);

			$("#chartContainer").dxChart({
		        dataSource: dataSource,
		        series: { type: 'stock' },
		        title: {
		            text: 'Stock Price'
		        },
		        tooltip: {
		            enabled: true
		        },
		        argumentAxis: {
		            label: {
		                format: 'dd/MM'
		            }
		        },commonAxisSettings: {
		            label: { rotationAngle: 45 }
		        }
		    });

	  	});
	  }

	});

});