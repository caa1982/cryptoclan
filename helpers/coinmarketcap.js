const Coin = require("../models/coin");
const CoinHistory = require("../models/coin_history");
const request = require('request');
const config = require("../configuration");

module.exports =
    function () {
        setInterval( ()=>{
            request.get({
                url: "https://api.coinmarketcap.com/v1/ticker/",
                json: true,
                headers: { 'User-Agent': 'request' }
            }, (err, data) => {
                if (err) {
                    console.log('Error:', err);
                } else {
                    var time = Date.now();
                    data.body.forEach( el =>{

                        Coin.update(
                            { id: el.id },
                            el,
                            { upsert: true },
                            err=> {
                                 if(err)  console.log(err);
                                 let coinHistory = new CoinHistory({
                                    id: el.id,
                                    symbol: el.symbol,
                                    price_usd: el.price_usd,
                                    price_btc: el.price_btc,
                                    time
                                 });
                                coinHistory.save( err=> {
                                        if(err)  console.log(err);
                                });
                            }
                        );
                    });
                }
            });

        }, config.coinmarketcapInterval);

    }

