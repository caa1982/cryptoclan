const request = require('request');
const bittrex = require('../node_modules/node.bittrex.api');
const Poloniex = require('../node_modules/poloniex-api-node');
let coinmarketcapResult;




let poloniex = new Poloniex("69RTRRYT-LUIC44G1-8BAYWV7P-Z10UMW2I", 
	"70d19b9dfb32d17fedac0caa866e7a769cdcdff77e07e240e97ea92ca9a738daf171f6cdd93daf8caf6ba072343de4968fec2a117fb1ac3ce2bd23182221093d"
	);

bittrex.options({
	'apikey' : "4ffab744ddd546b2ba85330b11b55657",
	'apisecret' : "1e59b627a4a440549ede2a38e498c583", 
});

/*bittrex.getmarketsummaries( function( data ) {
    console.log( data );
});

/*bittrex.getbalances( function( data ) {
	for( var i in data.result ) {
		if(data.result[i].Balance > 0){console.log( data.result[i] );}
    };
});

poloniex.returnTicker(function(err, ticker) {
	
});

*/

setInterval(function(){
	request.get({
	url: "https://api.coinmarketcap.com/v1/ticker/",
	json: true,
	headers: {'User-Agent': 'request'}
}, (err, data) => {
	if (err) {
		console.log('Error:', err);
	} else {
		coinmarketcapResult = data.body;

	}
});
},30000)





