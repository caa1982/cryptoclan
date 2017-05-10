/*jshint esversion: 6 */
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const User = require('../models/user');
const Coin = require('../models/coin');
const faker = require('faker');
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI);

Coin.find({}, (err, cmcCoins) => {

  for (let i = 0; i < 100; i++) {
    let coins = [];
    let totalValue = 0;
    if (Math.floor(Math.random() * 2)) {
      let exchange = "poloniex";
      let numberOfCoins = Math.floor(Math.random() * 10);
      
      for (let i = 0; i < numberOfCoins; i++) {
        let coinInd = Math.floor(Math.random()*cmcCoins.length);
        let balance = Math.floor(Math.random()*100)
        coins.push({
              symbol: cmcCoins[coinInd].symbol, 
              balance,
              exchange});
        totalValue+= balance* cmcCoins[coinInd].price_usd;
      }
    }

     if (Math.floor(Math.random() * 2)) {
      let exchange = "bittrex";
      let numberOfCoins = Math.floor(Math.random() * 10);
      
      for (let i = 0; i < numberOfCoins; i++) {
        let coinInd = Math.floor(Math.random()*cmcCoins.length);
        let balance = Math.floor(Math.random()*100)
        coins.push({
              symbol: cmcCoins[coinInd].symbol, 
              balance,
              exchange});
        totalValue+= balance* cmcCoins[coinInd].price_usd;
      }
    }
    let coinClans = [];
    let numberOfCoinClans = Math.floor(Math.random()*10);
    for (let i = 0; i < numberOfCoinClans; i++) {
      coinClans.push(cmcCoins[Math.floor(Math.random()*cmcCoins.length)].id)
    }

    let newUser = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      company: faker.company.companyName(),
      website: faker.internet.domainName(),
      bio: faker.lorem.paragraph(),
      address: faker.address.streetAddress(true),
      city: faker.address.city(),
      job: faker.name.jobTitle(),
      photo: "https://randomuser.me/api/portraits/"+(Math.floor(Math.random()*2)?"wo":"")+"men/"+Math.floor(Math.random()*100)+".jpg",
      fake: true,
      coins: coinClans
    }
    if(coins.length)
       newUser.portfolio = { coins, total:totalValue, time:Date.now() }
    let user = new User(newUser);

    user.save((err, user) => {
      if (err) console.log(err);
    })
  }

})




