$(document).ready(function () {

  $(".coin-chart").each(function (idx, item) {
    let coinId = $(item).attr('id');
    $.ajax({
      url: "http://localhost:3000/api/coin24/"+coinId,
      method: 'GET',
      success: function(data) {
        plotChart(data, coinId);
      },
      error: function (error) {
        console.log('error');
      }
    });

  })

})

function plotChart(data, coinId) {
  var labels = data.map((el, ind)=>ind);
  var ctx = document.getElementById(coinId);
  var dataChart = {
    labels: labels, //["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: coinId,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: data,// [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        }
    ]
};
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: dataChart,
    options: 
    {
      legend: {
    	  display: false
      },
      scales:
        {
            xAxes: [{
                display: true
            }],
             yAxes: [{
                display: false
            }]
        }
    }
 });

  //{labels, datasets:[ data ]}

 
  console.log('coinId: ', coinId);
  console.log('data: ', data);
}