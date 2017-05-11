$(document).ready(function () {

$("#asideCoins").on("click", "img", function(){
  var data = { coin: $(this).attr("id") };
  ajax(data);
});

});

function ajax(data) {
  $.ajax({
      url: "/api/console_coin",
      method: "POST",
      data,
      success: consoleCoin,
      error: function (err) { console.log(err) }
    });
}

function consoleCoin(coin){
    var html="";
    $("#console").html("");
    html = `
        <span class="col">Name: ${coin.name} (${coin.symbol})</span>
        <span class="col">USD: ${coin.price_usd}</span>
        <span class="col">BTC: ${coin.price_btc}</span>
        <span class="col">Market Cap: ${coin.market_cap_usd}</span>
        <span class="col">1H: ${coin.percent_change_1h}%</span>
        <span class="col">24H: ${coin.percent_change_24h}%</span>
         `
    $("#console").html(html);
}