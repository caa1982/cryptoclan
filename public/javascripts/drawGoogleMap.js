$(document).ready(function () {
    googleMap();

    $("#dropDownMyCoin").on("input", function () {
        coin = $(this).val();
        if ($("#dropDown option").filter(function () {
            return this.value === coin;
        }).length) {
            var data = { coin: coin };
            users(data);
        }
    });

    $("#dropDownMyFollower").on("input", function () {
        var follower = $(this).val();
        if ($("#dropDownUsers option").filter(function () {
            return this.value === follower;
        }).length) {
            var data = { follower: follower };
            person(data);
        }
    });

});

var coin;

function person(data) {
    $.ajax({
        url: "http://localhost:3000/api/send_MyPersonMap",
        method: "POST",
        data,
        success: function (users) { googleUserMap(users) },
        error: function (err) { console.log(err) }
    });
}

function users(data) {
    $.ajax({
        url: "http://localhost:3000/api/send_MyCoinMap",
        method: "POST",
        data,
        success: function (users) { googleMap(users) },
        error: function (err) { console.log(err) }
    });
}

function googleUserMap(users){
    console.log(users)
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

            if (users.location.coordinates[0] && users.location.coordinates[1] !== 0) {

                var contentString = `<h5>${users.name}<h5>`
                + `<h5>${users.address}<h5>` + `<h5>${users.job}<h5>` +
                `<a href="/user/${users._id}">Profile</a>` 
                ;
                
                var img = `https://files.coinmarketcap.com/static/img/coins/16x16/bitcoin.png`;

                var pin = new google.maps.LatLng(users.location.coordinates[1], users.location.coordinates[0]);

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                var marker = new google.maps.Marker({
                    position: pin,
                    map: map,
                    title: users.name,
                    icon: img,
                });

                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });

            }
    }
}

function googleMap(users) {
    console.log(users)
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
            console.log(user.following)
            if (user.location.coordinates[0] && user.location.coordinates[1] !== 0) {

                var contentString = `<h5>${user.name}<h5>`
                + `<h5>${user.address}<h5>` + `<h5>${user.job}<h5>` +
                `<a href="/user/${user._id}">Profile</a>` 
                ;
                
                var img = `https://files.coinmarketcap.com/static/img/coins/16x16/${coin}.png`;

                var pin = new google.maps.LatLng(user.location.coordinates[1], user.location.coordinates[0]);

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                var marker = new google.maps.Marker({
                    position: pin,
                    map: map,
                    title: user.name,
                    icon: img,
                });

                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });

            }
        });
    }
}