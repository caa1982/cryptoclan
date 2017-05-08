/*jshint esversion: 6 */
const mongoose = require('mongoose');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User = require('../models/user');
const Coin = require('../models/coin');
const faker = require('faker');

mongoose.connect("mongodb://localhost/cryptoclan");

for(let i=0; i<3; i++) {
  let user = new User ({
    email:  faker.internet.email(),
    name:   faker.name.findName(),
    company:faker.company.companyName(),
    website:faker.internet.domainName(),
    bio:faker.lorem.paragraph(),
    address: faker.address.streetAddress(true),
    city: faker.address.city(),
    photo: faker.image.people(100, 100),
    fake: true
  });

  user.save((err)=>{
    if(err) console.log(err);
  })

}