$(document).ready(function () {

  $(".coin-chart").each(function (idx, item) {
    let coinId = $(item).attr('id');
    $.ajax({
      url: "http://localhost:3000/api/coin24/" + coinId,
      method: 'GET',
      success: function (data) {
        plotCoinChart(data, coinId);
      },
      error: function (error) {
        console.log('error');
      }
    });

  })

  $.ajax({
    url: "http://localhost:3000/api/portfolio24/",
    method: 'GET',
    success: plotValueChart,
    error: function (error) {
      console.log('error');
    }
  });

  if($("#button-toggle-share")) {
    $("#button-toggle-share").click(function(){
        $.ajax({
        url: "http://localhost:3000/api/toggle_public",
        method: 'GET',
        success: function(data) {
          $("#button-toggle-share").toggleClass("btn-success");
          $("#button-toggle-share").toggleClass("btn-primary");

          if(data.public) {
            $("#button-toggle-share").html("Make portfolio private");
          } else { 
            $("#button-toggle-share").html("Make portfolio public");
          }
        },
        error: function (error) {
          console.log('error');
        }
  });
    })
  }


})

function plotValueChart(data) {
  let labels = [];
  data.forEach((d, ind) => {
    labels.push(ind);
  });
  let ctx = document.getElementById("valueChart");
  var dataChart = {
    labels: labels, //["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Portfolio Value",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(175,192,92,0.4)",
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
          display: false
        }],
        yAxes: [{
          display: true
        }]
      }
    }
  });
}

function plotCoinChart(data, coinId) {
  var labels = data.map((el, ind) => ind);
  var ctx = document.getElementsByClassName("chart-" + coinId);
  [].forEach.call(ctx, el => {
    var dataChart = {
      labels: labels, //["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: coinId,
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(175,192,92,0.4)",
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
    var myLineChart = new Chart(el, {
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
            display: false
          }],
          yAxes: [{
            display: false
          }]
        }
      }
    });
  })



}

function clickEditCoin(id, balance) {
  $("#edit-coin-container-" + id).append(`
  <div id="edit-coin-div-${id}" >
  <form id="edit-coin-form-${id}" method="POST" action="/user/portfolio/${id}">
  <input type=text name="balance" id="edit-coin-amount-${id}" value="${balance}">
  <button type="submit" class="btn btn-default" id="edit-coin-save-${id}">Save</button>
  <button id="edit-coin-cancel-${id}" class="btn btn-default">Cancel</button>
  </form>
  </div>
  `)
  $(`#edit-coin-cancel-${id}`).click(() => {
    $("#edit-coin-div-"+id).remove();
  })

}