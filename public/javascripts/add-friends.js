$(document).ready(function () {
  $('#search-button').click(function () {
    console.log("here")
    var data = {
      name: $("#name").val(),
      city: $("#city").val(),
      coins: $("#coins").val()
    }
    $.ajax({
      url: "http://localhost:3000/api/user_search",
      method: "POST",
      data,
      success: listUsers,
      error: function (err) { console.log(err) }
    });
  });
});

function listUsers(users) {
  var html = "";
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


      html += `       
                  </div>
                  <div>
                      <button type="button" onclick="connectUser('${user.id}')" class="btn btn-primary"> Connect</button>
                      <a href="/user/${user.id} type="button" class="btn btn-success">See Profile</a>
                  </div>
              </div>
              
        `;
    });
    html+="</div>";
  } else {
    html=`
    <div class="row text-center">
      Users not found
    </div>
    `
  }
  $("#search-results").html(html);
}