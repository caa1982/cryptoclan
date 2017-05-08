const User = require("../models/user");
const Bittrex = require('../node_modules/node.bittrex.api');
const Poloniex = require('../node_modules/poloniex-api-node');

let poloniex = new Poloniex("69RTRRYT-LUIC44G1-8BAYWV7P-Z10UMW2I", 
	"70d19b9dfb32d17fedac0caa866e7a769cdcdff77e07e240e97ea92ca9a738daf171f6cdd93daf8caf6ba072343de4968fec2a117fb1ac3ce2bd23182221093d"
	);

Bittrex.options({
    'apikey': "4ffab744ddd546b2ba85330b11b55657",
    'apisecret': "1e59b627a4a440549ede2a38e498c583",
});

module.exports =
    function () {
        setInterval(function () {
            Bittrex.getbalances(function (data) {
                var time = Date.now();
                for (var i in data.result) {
                    if (data.result[i].Balance > 0) {
                        User.update(
                            {_id: "59100fce6bc88411088920bb" },
                            {$push:{portfolio:{ coins:data.result[i] } }},
                            { upsert: true },
                            function (err) {
                                
                                console.log(err);
                            }
                            );
                        }
                }
            });
            poloniex.returnBalances(function(err, data){
                for (var i in data){
                    if(data[i] > 0){
                        console.log(i);
                    }
                }
            });
        }, 10000);
    }
