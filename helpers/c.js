const Coin = require("../models/coin");
const request = require('request');
module.exports =

    function () {
        setInterval(function () {
            request.get({
                url: "https://api.coinmarketcap.com/v1/ticker/",
                json: true,
                headers: { 'User-Agent': 'request' }
            }, (err, data) => {
                if (err) {
                    console.log('Error:', err);
                } else {
                    data.body.forEach(function (el) {

                        Coin.update(
                            { id: el.id },
                            el,
                            { upsert: true },
                            function (err) {
                                console.log(err);
                                Coin.findOneAndUpdate({ id: el.id }, { $push: { "price_history": { price_usd: el.price_usd, price_btc: el.price_btc, timestamp: Date.now() } } },
                                    function (err) {
                                        console.log(err);
                                    });
                            }
                        );
                    });
                }
            });
        }, 300000);
    }

