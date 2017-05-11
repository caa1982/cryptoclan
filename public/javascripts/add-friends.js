$(document).ready(function () {
  $("#search-button-my-coins").click(function () {

    var data = {
      mycoins: 1,
      name: $("#name").val(),
      city: $("#city").val(),
    }
    ajaxSearch(data);
  });
  $('#search-button').click(function () {

    var data = {
      mycoins:0,
      name: $("#name").val(),
      city: $("#city").val(),
      coins: $("#coins").val()
    }
    ajaxSearch(data);
  });
});

function ajaxSearch(data) {
  $.ajax({
      url: "http://localhost:3000/api/user_search",
      method: "POST",
      data,
      success: listUsers,
      error: function (err) { console.log(err) }
    });
}

function listUsers(users) {
  var html = "";
  console.dir(users);
  if (users.length) {
    
    users.forEach(function (user, ind) {
      
      if (ind % 2 === 0) html += (ind === 0 ? "" : '</div>') + '<div class="row text-center">';
      html += `
      
        <div class="col connectProfile">
                  <img id="editProfilePic" class="rounded-circle" src="${user.photo}">
                  <div>
                      ${user.name}
                  </div>
                  `;                    
      if(user.job) html+= `
                  <div>
                      ${user.job}
                  </div> `;
      if(user.city) html+= `
                  <div>
                      ${user.city}
                  </div>`;
                  
      html+=`<div class="form-group">`;

      var classes = ["badge-warning", "badge-info", "badge-danger"]
      var btnInd = 0;
      user.coins.forEach(coin => {
        html += `<span class="badge ${classes[btnInd]}"><img class="connectCoins" src="https://files.coinmarketcap.com/static/img/coins/16x16/${coin}.png"> ${coin}</span>`;
        btnInd++;
        btnInd %= 3;
      });
      html += `   </div>
                  <div>`;
                  console.log('user.isFriend: ', user.isFriend);
      if(!user.isFriend) {
        html+=` <button type="button" id="connect-button-${user._id}" onclick="connectUser('${user._id}')" class="btn btn-primary">follow</button>`;
      } else {
        html+="followed";
      }
      html+= ` <a href="/user/${user._id}" type="button" class="btn btn-success">See Profile</a>
                  </div>
              </div>`;
    });
    html+="</div>";
  } else {
    html=`
    <div class="row text-center">
      Users not found
    </div>
    `;
  }
  $("#search-results").html(html);
}

function connectUser(id) {
   $.ajax({
      url: "http://localhost:3000/api/connect/"+id,
      method: "GET",
      success: function() {
        $("#connect-button-"+id).after("followed");
        $("#connect-button-"+id).hide();
      },
      error: function (err) { console.log(err) }
    });
}