    // Array to hold lcoations
  var recomendationsCollector  = new Array();

var categorySelected = "";
var ratingSelected = "";
var markerSelected = "";

//initializes sharing on facebook
    $(document).ready(function(){
      $('#socialnetworks').share({
        networks: ['facebook','twitter','googleplus','linkedin','pinterest','tumblr','stumbleupon','email'],
        theme: 'square'
      });
    });

    //closes and opens the modal by the button
    function closeModal(id){
      $(id).foundation('reveal', 'close');
    }
    function openModal(id){
      $(id).foundation('reveal', 'open');
    }

    //initializes map
    function initMap(){
      //options to set the primary view for the map
      var myOptions = {
        zoom: 2, //how zoomed to start off
        center: latlng = new google.maps.LatLng(0, 0), //starts in the middle of the map
        mapTypeId: google.maps.MapTypeId.ROADMAP //starts in roadmap view
      };
      //pins to be dropped
      var marker = new google.maps.Marker({});

      //initialize auto complete for the address bar
      var input = document.getElementById('address');
      var autocomplete = new google.maps.places.Autocomplete(input);
      var infowindow = new google.maps.InfoWindow({}); //ADD HERE THE COMMENTS PEOPLE WILL MAKE ABOUT THE PLACE, AS WELL AS YELP'S API?

      //event listener that attemps to see whether someone is typing on the input field
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        infowindow.close();
        //marker.setVisible(true);
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
        else{
          map.setCenter(place.geometry.location);
          map.setZoom(12);  //Once place selected, it zooms to that location
        }
        //drops the pin at the location inputted
        //marker.setPosition(place.geometry.location);
        //marker.setVisible(true);

        //part of google places api
        var address = '';
        if (place.address_components) {
          address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }
        //console.log(place) //good tool used to verify the location of a place inputted on the console

        //this finds the latitude and longitude of the place inputted and adds a marker
        var e = {
          latLng: {
            lat: function (){
              return place.geometry.location.jb;
            },//latLng
            lng: function () {
              return place.geometry.location.kb;
            }//lng
          }//latLng
        }//e

        //function used to add the marker onto the map
        addMarkerHandler(e);
        addtolist(place.formatted_address);
      });//google maps auto complete

      //this is an icon selector for the drop pins
      $("div.pictureselect").click(function(){
        var checked=$(this).find('input:radio').attr('checked', true);
        //alert(checked.val());
        imageicon='img/'+checked.val()+'.png';
        $(this).parent('div.pictures').find('label').css('opacity', '.25');
        $(this).find('label').css('opacity', '1');

        categorySelected = checked.val();
      });

      //this is an icon selector for the drop pins
      $("div.gradeselect").click(function(){
        //console.log($(this));
        var checked=$(this).find('input:radio').attr('checked', true);
        $(this).parent('div#givegrade').find('label').css('opacity', '.25');
        $(this).find('label').css('opacity', '1');

        ratingSelected = checked.val();
      });

      //this loads the map onto the screen
      google.maps.event.addDomListener(window, 'load', initMap);

      //instance of the map
      var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

      //array to hold all the markers
      var markers = {};

      //create id for marker
      var markeridcreator=function(lat, lng){return lat + '_' + lng;};

      //create a lat lng getter
      var getlatlng = function(lat, lng){return new google.maps.LatLng(lat, lng);};

      //function that is called on google maps auto complete to add the address onto the screen
      var addMarkerHandler = function(e){
        console.log(e);
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        var markerid = markeridcreator(lat, lng);
        var marker = new google.maps.Marker({
          position: getlatlng(lat, lng), //gets lat and long
          map: map, //puts the map with the variable
          id: 'marker_' + markerid, //helps to identify which is which
          icon: imageicon //grabs it from the checking function
        });

        markerSelected = markerid;
        //adds marker to the array
        markers[markerid] = marker;

        //adds marker to event trigger
        markerevent(marker);

        //allows for the info window to pop up
        var geocoder = new google.maps.Geocoder();
        var infowindow = new google.maps.InfoWindow();
        var latlng = getlatlng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results) {
            var str = $('#recommendationtext').val(); //adds description to popup info window
         infowindow.setContent(results[1].formatted_address + '<br>' + str);
       });
        //API which allows for the clicking to bind to the infowindow action
        google.maps.event.addListener(marker, 'click', function(){
          infowindow.open(map,marker);
        });
      }//addmarkerhandler

      //marker event binder - getting ready for removal
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
 if($.cookie('recomendations')){
        // Read Recomendations
        var savedRecommendations   = $.cookie('recomendations').split("||");
        for (var i = 0; i < savedRecommendations.length; i++) {

          recomendationsCollector.push(savedRecommendations[i]);

        }
    }

      //marker delete
      var deletemarker = function(marker, markerid){
        // marker.setMap(null);
        // delete markers[markerid];
        //removefromlist(placename);
      };

      //remove value from list
      var removefromlist = function(val){
        $("#addingcities ul").remove('<li><a href="#">'+val+'</a></li>');
          //$("#addingcities ul").update();
        }
      }

      //add the inputted item to the list
      //in this case, we will have to make sure to fill out the accordion with this
      var addtolist = function(val){
         //$("#addingcities ul").append('<li><a href="#">'+val+'</a></li>');
         $("#valuesubmit").val("");
       }

  //must add in order for foundation to work
  document.write('<script src=' +
   ('__proto__' in {} ? 'js/vendor/zepto' : 'js/vendor/jquery') +
   '.js><\/script>')


/** scripts to make the popup guide work
  $(document).foundation('joyride', 'start');
**/
  <!-- script to make the add more button work-->
  var startoveraccordion=function(){
    $('.section').removeClass('active');
    $('#step1').addClass('active');
    //$(this).addClass('showhidenew');
  }

function saveRecomendation(startOver){
  var recomendation  = new Array();
  recomendation[0] =  ratingSelected;
  recomendation[1] = categorySelected
  recomendation[2] = markerSelected
  recomendation[3] = $("#recommendationtext").val()

  recomendationsCollector.push(recomendation.join("~~~"))

$.cookie('recomendations', recomendationsCollector.join("||"));

  if (startOver){
    startoveraccordion();
  }

}
