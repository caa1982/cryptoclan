require("dotenv").config();

module.exports = {
  baseUrl: process.env.BASE_URI,
  
  verificationEmail: {
    tempUserCollection: 'tempusers',
    user:'cryptoclannow@gmail.com',
    pass: 'cryptoclan123'
  },
  coinmarketcapInterval: 5*60*1000,
  portfolioInterval: 30*1000
}

  // "start": "nodemon --ignore 'public/javascripts/*.js' ./bin/www"
