$(document).ready(function () {
    googleMap();

    $("#dropDownMyCoin").on("input", function () {
        var coin = $(this).val();
        if ($("#dropDown option").filter(function () {
            return this.value === coin;
        }).length) {
            var data = { coin: coin };
            ajax(data);
        }
    });

});

function ajax(data) {
    $.ajax({
        url: "http://localhost:3000/api/send_MyCoinMap",
        method: "POST",
        data,
        success: function (users) { googleMap(users) },
        error: function (err) { console.log(err) }
    });
}



function googleMap(users) {  
    var latlng = new google.maps.LatLng(0, 0);
    var myOptions = {
        zoom: 2,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        zoomControl: false,

        scaleControl: false,
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
    
      if (users) {
        
        users.forEach(user => {
            var pin = new google.maps.LatLng(user.location.coordinates[1], user.location.coordinates[0]);

            var marker = new google.maps.Marker({
                position: pin,
                map: map,
                title: user.name
            });

        });
       
    }

}