const User = require("../models/user");
const Coin = require("../models/coin");
const Bittrex = require('../node_modules/node.bittrex.api');
const Poloniex = require('../node_modules/poloniex-api-node');
const async = require("async");

let poloniex = {};
// poloniex = new Poloniex("69RTRRYT-LUIC44G1-8BAYWV7P-Z10UMW2I", 
//                     "70d19b9dfb32d17fedac0caa866e7a769cdcdff77e07e240e97ea92ca9a738daf171f6cdd93daf8caf6ba072343de4968fec2a117fb1ac3ce2bd23182221093d"
//                     );
// Bittrex.options({
//     'apikey': "4ffab744ddd546b2ba85330b11b55657",
//     'apisecret': "1e59b627a4a440549ede2a38e498c583",
// });

module.exports =
    function () {
       // setInterval(function () {

        User.find({$and:[
                         {"poloniex.apikey":{$exists:true}}, 
                         {"poloniex.apikey":{$ne:""}},
                         {"bittrex.apikey":{$exists:true}}, 
                         {"bittrex.apikey":{$ne:""}}
                         ]}, (err, users)=>{
            let poloniexCoins = [];
            let bittrexCoins = [];
            let totalValue=0;
            users.forEach(user=>{
              
              poloniex = new Poloniex(user.poloniex.apikey, user.poloniex.apisecret);

              poloniex.returnBalances(function(err, poloniexData){
                  for(let symbol in poloniexData) {
                      if(poloniexData[symbol]>0) {
                          poloniexCoins.push({symbol:symbol, balance:poloniexData[symbol], exchange:"poloniex"})
                      }
                  }

                async.each(poloniexCoins, function(coin, callback) {
                   Coin.findOne({"symbol":coin.symbol}, (err,coinData)=>{
                     totalValue += coinData ? coinData.price_usd * coin.balance : 0;
                     callback();
                   })
                }, function(err) {
                   Bittrex.options({ 'apikey': user.bittrex.apikey,'apisecret': user.bittrex.apisecret });
                   Bittrex.getbalances(function (bittrexData) {

                     bittrexData = bittrexData.result;
                     bittrexData.forEach(coin=>{
                       if(coin.Balance>0)
                         bittrexCoins.push({symbol:coin.Currency, balance:coin.Balance, exchange:"bittrex"})
                     })
                     async.each(bittrexCoins, function(coin, callback) {
                         Coin.findOne({"symbol":coin.symbol}, (err,coinData)=>{
                            totalValue += coinData ? coinData.price_usd * coin.balance : 0;
                            callback();
                         })
                     }, function(err) {
                        
                        const allCoins = poloniexCoins.concat(bittrexCoins);
                        User.findOneAndUpdate({"_id":user.id}, {portfolio:{coins:allCoins, total:totalValue, time:Date.now()}}, (err,user)=>{
                            if(err) console.log(err);
                        })
                        console.log();
                     });
                   });
                });
              });
            });
        });

        



    };
