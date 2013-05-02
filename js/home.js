
// Array to hold lcoations
var globalMarkersID = new Array();

var pictureselect = new Array();
  pictureselect[0] = false;
  pictureselect[1] = false;
  pictureselect[2] = false;
  pictureselect[3] = false;
  pictureselect[4] = false;
  pictureselect[5] = false;
  pictureselect[6] = false;
  pictureselect[7] = false;

document.write('<script src=' +
        ('__proto__' in {} ? 'js/vendor/zepto' : 'js/vendor/jquery') +
        '.js><\/script>')

var selectimage = function(obj){
    switch(obj)
      {
      case "arts":
        pictureselect[0] = !pictureselect[0];
        break;
      case "coffee":
        pictureselect[1] = !pictureselect[1];
        break;
      case "drinks":
        pictureselect[2] = !pictureselect[2];
        break;
      case "family":
        pictureselect[3] = !pictureselect[3];
        break;
      case "food":
        pictureselect[4] = !pictureselect[4];
        break;
      case "nightlife":
        pictureselect[5] = !pictureselect[5];
        break;
      case "shopping":
        pictureselect[6] = !pictureselect[6];
        break;
      case "sights":
        pictureselect[7] = !pictureselect[7];
        break;
      }
  if(document.getElementById(obj).style.opacity < "1"){
    document.getElementById(obj).style.opacity = "1";
  }
  else
    document.getElementById(obj).style.opacity = ".25";
}

    //initializes the datepicker
    $('#fromdatepicker').datepicker();
    $('#todatepicker').datepicker();

    //initializes share
    $(document).ready(function () {
      $('#socialnetworks').share({
        networks: ['facebook','twitter','googleplus','linkedin','pinterest','tumblr','stumbleupon','email'],
        theme: 'square'
      });
    });
  //closes the modal by the button
  function closeModal(id){
    //$('a.close-reveal-modal').trigger('click');
    $(id).foundation('reveal', 'close');

  }

  function openModal(id){
    $(id).foundation('reveal', 'open');
  }

  //initializes map
  function initMap(){
    //initializing modal the opening window
    $('#myModal').foundation('reveal', 'open');
    $('#myModal').foundation('reveal', 'close');
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
          } else {
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
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        //array to hold all the markers
        var markers = {};
        //create id for marker
        var markeridcreator=function(lat, lng){return lat + '_' + lng;};
        //create a lat lng getter
        var getlatlng = function(lat, lng){return new google.maps.LatLng(lat, lng);};
        //add marker
        var addMarker = google.maps.event.addListener(map, 'click', addMarkerHandler);
        //function that is called when addMarker is called
        var placename;

        var addMarkerHandler = function(e){
          console.log(e);
          var lat = e.latLng.lat();
          var lng = e.latLng.lng();
          var markerid = markeridcreator(lat, lng);
          var marker = new google.maps.Marker({
            position: getlatlng(lat, lng),
            map: map,
            id: 'marker_' + markerid,
            icon: 'img/plantrip.png'
          });

           if(globalMarkersID.indexOf(markerid) < 0){
                 globalMarkersID.push(markerid)
            }

          markers[markerid] = marker;
          markerevent(marker);
          //reverse lookup
          var geocoder = new google.maps.Geocoder();
          var infowindow = new google.maps.InfoWindow();
          var latlng = getlatlng(lat, lng);
          geocoder.geocode({'latLng': latlng}, function(results) {
            infowindow.setContent(results[1].formatted_address);
            //infowindow.open(map, marker);
                //placename = results[1].formatted_address;
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
        //marker delete
        var deletemarker = function(marker, markerid){
          marker.setMap(null);
          delete markers[markerid];
            //removefromlist(placename);
          };
        //remove value from list
        var removefromlist = function(val){
          $("#addingcities ul").remove('<li><a href="#">'+val+'</a></li>');
            //$("#addingcities ul").update();
          }
        }
    //add the inputted item in the list
    var addtolist = function(val){
      $("#addingcities ul").append('<li><a href="#">'+val+'</a></li>');
      $("#valuesubmit").val("");
    }



      var inputmode = function(obj){
        if(obj == 'register'){
          document.getElementById('signinview').style.visibility = 'hidden';
          document.getElementById('registerview').style.visibility = 'visible';
          document.getElementById('resetview').style.visibility = 'hidden';
          document.getElementById('resetviewinfofilled').style.visibility = 'hidden';
          document.getElementById('registerwith').style.visibility = 'visible';
          document.getElementById('signinwith').style.visibility = 'hidden';
        }
        else if(obj == 'signin'){
          document.getElementById('signinview').style.visibility = 'visible';
          document.getElementById('registerview').style.visibility = 'hidden';
          document.getElementById('resetview').style.visibility = 'hidden';
          document.getElementById('resetviewinfofilled').style.visibility = 'hidden';
          document.getElementById('registerwith').style.visibility = 'hidden';
          document.getElementById('signinwith').style.visibility = 'visible';
        }
        else if(obj == 'reset'){
          document.getElementById('signinview').style.visibility = 'hidden';
          document.getElementById('registerview').style.visibility = 'hidden';
          document.getElementById('resetview').style.visibility = 'visible';
          document.getElementById('resetviewinfofilled').style.visibility = 'hidden';
          document.getElementById('registerwith').style.visibility = 'hidden';
          document.getElementById('signinwith').style.visibility = 'hidden';
        }
        else if(obj == 'resetfilled'){
          document.getElementById('signinview').style.visibility = 'hidden';
          document.getElementById('registerview').style.visibility = 'hidden';
          document.getElementById('resetview').style.visibility = 'hidden';
          document.getElementById('resetviewinfofilled').style.visibility = 'visible';
          document.getElementById('registerwith').style.visibility = 'hidden';
          document.getElementById('signinwith').style.visibility = 'hidden';
        }
      }


/**
This function saves the data to the cookies.
**/
function saveToCookiesAndOpenModal(id){

    // Save Title
    $.cookie('trip_title', $("#tripname").val());

    // Save FromDate
    $.cookie('fromdatepicker', $("#fromdatepicker").val());

    // Save ToDate
    $.cookie('todatepicker', $("#todatepicker").val());

    // Saving Markers
    $.cookie('markers', globalMarkersID.join("~~||~~"));

    //Saving LikeToDo
    $.cookie('liketodo', pictureselect.join("~~||~~"));

    $(id).foundation('reveal', 'open');
  }

