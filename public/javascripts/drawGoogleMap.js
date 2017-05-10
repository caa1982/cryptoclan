$( document ).ready(function() {
    googleMap();
});

function googleMap() {
    var latlng = new google.maps.LatLng(41.3851, 2.1734);
    var myOptions = {
        zoom: 8, /* zoom level of the map */
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        zoomControl: false,

        scaleControl: true,
        scaleControlOptions: {

            position: google.maps.ControlPosition.BOTTOM_LEFT
        }
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions); 
}