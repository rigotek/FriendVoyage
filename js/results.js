    //initializes the datepicker
    $('#fromdatepicker').datepicker();
    $('#todatepicker').datepicker();

    //initializes share
    $(document).ready(function () {
        $('#socialnetworks').share({
            networks: ['facebook','twitter','googleplus','linkedin','pinterest','tumblr','stumbleupon','email'],
            theme: 'square'
        });
        
            if($.cookie('markers')){
			document.getElementById('notify').style.visibility = 'visible';
		}
    });

    //initializes picture opacity
    //selects the image icon to be placed on the map
    var imageicon;
    //image selector, which changes the CSS from semi transparent to completely selected
    var selectimage = function(obj){
      if(document.getElementById(obj).style.opacity < "1"){
        document.getElementById(obj).style.opacity = "1";
    }
    else{
        document.getElementById(obj).style.opacity = ".25";
    }
    imageicon = 'img/'+obj+'.png';
}

    //initializes map
    function initMap(){
    //initializing the map
    var map;
    var myOptions = {
        zoom: 2,
        center: latlng = new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var marker = new google.maps.Marker({});

    //initialize auto complete
    var input = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(input);
    //autocomplete.bindTo('bounds', map);
    var infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        infowindow.close();
        marker.setVisible(true);
        input.className = '';
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // Inform the user that the place was not found and return.
            input.className = 'notfound';
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        }
        else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        console.log(place)
        var e = {
            latLng: {
                lat: function () {
                    return place.geometry.location.jb;
                },
                lng: function () {
                    return place.geometry.location.kb;
                }
            }
        }
        addMarkerHandler(e);
        addtolist(place.formatted_address);
    });

google.maps.event.addDomListener(window, 'load', initMap);

//instance of the map
map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
//array to hold all the markers
var markers = {};
//create id for marker
var markeridcreator=function(lat, lng){
    return lat + '_' + lng;
}
//create a lat lng getter
var getlatlng = function(lat, lng){
    return new google.maps.LatLng(lat, lng);
};
//add marker
//var addmarker = google.maps.event.addListener(map, 'click', addMarkerHandler);
// TODO change back to local
addMarkerHandler = function(e){
    console.log(e);
    var lat = e.latLng.lat();
    var lng = e.latLng.lng();
    var markerid = markeridcreator(lat, lng);
    var marker = new google.maps.Marker({
        position: getlatlng(lat, lng),
        map: map,
        id: 'marker_' + markerid,
//icon: 'img/marker.png'
});
    markers[markerid] = marker;
    markerevent(marker);

//reverse lookup
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();
var latlng = getlatlng(lat, lng);

geocoder.geocode({'latLng': latlng}, function(results) {
    infowindow.setContent(results[1].formatted_address);
    //infowindow.open(map, marker);
});

google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
});
}
//marker event binder
var markerevent = function(marker){
    google.maps.event.addListener(marker, "rightclick", function(e){
        var markerid = markeridcreator(e.latLng.lat(), e.latLng.lng());
        var marker = markers[markerid];
        deletemarker(marker, markerid);
    });
};
 // READ MARKERS FROM COOKIES
      if($.cookie('markers')){

          var savedMarkers = $.cookie('markers').split("~~||~~");
          for (var i = 0; i < savedMarkers.length; i++) {
              var latandleg = savedMarkers[i].split("_");

              // GET LAT AND LNG
              var lat = latandleg[0];
              var lng = latandleg[1];

              var markerid = markeridcreator(lat, lng);

              var marker = new google.maps.Marker({
                position: getlatlng(lat, lng), //gets lat and long
                map: map, //puts the map with the variable
                id: 'marker_' + markerid,
                 icon: 'img/plantrip.png'
              });

              //adds marker to the array
              markers[markerid] = marker;

              //adds marker to event trigger
              markerevent(marker);

              //allows for the info window to pop up
              var geocoder = new google.maps.Geocoder();
              var infowindow = new google.maps.InfoWindow();
              var latlng = getlatlng(lat, lng);
              geocoder.geocode({'latLng': latlng}, function(results) {
               infowindow.setContent(results[1].formatted_address);
             });
              //API which allows for the clicking to bind to the infowindow action
              // google.maps.event.addListener(marker, 'click', function(){
              //   infowindow.open(map,marker);
              // });
          }
      }
//marker delete
var deletemarker = function(marker, markerid){
    // marker.setMap(null);
    // delete markers[markerid];
};
}

    //add the inputted item in the list
    var addtolist = function(val){
        $("#addingcities ul").append('<li><a href="#">'+val+'</a></li>');
        $("#valuesubmit").val("");
    }
    $('.accordion section').hover(function(event) {
        var e = {
            latLng: {
                lat: function () {
                    return 48.856614;
                    // return $(this).attr('data-lat');
                },
                lng: function () {
                    return 2.3522219000000177;
                }
            }
        }
        //addMarkerHandler(e);
    });
        //must add in order for foundation to work
        document.write('<script src=' +
            ('__proto__' in {} ? 'js/vendor/zepto' : 'js/vendor/jquery') +
            '.js><\/script>')

