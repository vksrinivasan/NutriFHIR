// global variables

var map = null;
var autocomplete = null
var startLoc = null
var geocoder = null
//var p_marker = null
var p_infowindowContent = null
var p_infowindow = null
var infowindow = null
var service = null; 

var csMarkers = [];
var smMarkers = [];
var fmMarkers = [];
var gmarkers = [];

var storeTypeIdMap = {};
var rowContentMap = {};
var rowMarkerMap = {};

var CS_Rows = [];
var SM_Rows = [];
var FM_Rows = [];

var preferredMarkers = [];

var starIdMarkerMap = {};

var goldStar = {
          path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
          fillColor: 'yellow',
          fillOpacity: 1,
          scale: 0.08,
          strokeColor: 'black',
          strokeWeight: 0.8
        };



var CS = {};
var FM = {};
var SM = {};

// Carefully set colors



function plotMap(address, queryType) {

d3.select("#CS_label").style('color', '#ff7f7f');
d3.select("#SM_label").style('color', '#9999ff');
d3.select("#FM_label").style('color', '#99c199');

var destMarkers = [];

var noAutoComplete = true;
var noQuery = true;
var initialService = null;
geocoder = new google.maps.Geocoder();
infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(100, 30),
    maxWidth: 125
  });
startLoc = new google.maps.LatLng(40.7902778, -73.9597222); // Manhattan, NY
var circle = new google.maps.Circle({
    center: startLoc,
    radius: 5 * 1609.34, // 10 miles
    strokeWeight: 2,
    strokeColor: "black",
    strokeOpacity: 0.9,
    fillColor: "red",
    fillOpacity: 0.15,
    clickable: false,
    map: map
  });

CS = {
          path: 'M19.006,2.97c-0.191-0.219-0.466-0.345-0.756-0.345H4.431L4.236,1.461     C4.156,0.979,3.739,0.625,3.25,0.625H1c-0.553,0-1,0.447-1,1s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124     c0.016,0.053,0.029,0.103,0.054,0.151c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112     c0.058,0.054,0.125,0.092,0.193,0.13c0.038,0.021,0.071,0.049,0.112,0.065c0.116,0.047,0.238,0.075,0.367,0.075     c0.001,0,11.001,0,11.001,0c0.553,0,1-0.447,1-1s-0.447-1-1-1H6.097l-0.166-1H17.25c0.498,0,0.92-0.366,0.99-0.858l1-7     C19.281,3.479,19.195,3.188,19.006,2.97z M17.097,4.625l-0.285,2H13.25v-2H17.097z M12.25,4.625v2h-3v-2H12.25z M12.25,7.625v2     h-3v-2H12.25z M8.25,4.625v2h-3c-0.053,0-0.101,0.015-0.148,0.03l-0.338-2.03H8.25z M5.264,7.625H8.25v2H5.597L5.264,7.625z      M13.25,9.625v-2h3.418l-0.285,2H13.25z',
          fillColor: 'red',
          fillOpacity: 0.9,
          scale: 0.8,
          strokeColor: 'red',
          strokeWeight: 0.1,
          scaledSize: new google.maps.Size(13, 13)
        };

SM = {
          path: 'M19.006,2.97c-0.191-0.219-0.466-0.345-0.756-0.345H4.431L4.236,1.461     C4.156,0.979,3.739,0.625,3.25,0.625H1c-0.553,0-1,0.447-1,1s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124     c0.016,0.053,0.029,0.103,0.054,0.151c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112     c0.058,0.054,0.125,0.092,0.193,0.13c0.038,0.021,0.071,0.049,0.112,0.065c0.116,0.047,0.238,0.075,0.367,0.075     c0.001,0,11.001,0,11.001,0c0.553,0,1-0.447,1-1s-0.447-1-1-1H6.097l-0.166-1H17.25c0.498,0,0.92-0.366,0.99-0.858l1-7     C19.281,3.479,19.195,3.188,19.006,2.97z M17.097,4.625l-0.285,2H13.25v-2H17.097z M12.25,4.625v2h-3v-2H12.25z M12.25,7.625v2     h-3v-2H12.25z M8.25,4.625v2h-3c-0.053,0-0.101,0.015-0.148,0.03l-0.338-2.03H8.25z M5.264,7.625H8.25v2H5.597L5.264,7.625z      M13.25,9.625v-2h3.418l-0.285,2H13.25z',
          fillColor: 'blue',
          fillOpacity: 0.8,
          scale: 0.9,
          strokeColor: 'blue',
          strokeWeight: 0.1,
          scaledSize: new google.maps.Size(13, 13)
        };
 
FM = {
          path: 'M19.006,2.97c-0.191-0.219-0.466-0.345-0.756-0.345H4.431L4.236,1.461     C4.156,0.979,3.739,0.625,3.25,0.625H1c-0.553,0-1,0.447-1,1s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124     c0.016,0.053,0.029,0.103,0.054,0.151c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112     c0.058,0.054,0.125,0.092,0.193,0.13c0.038,0.021,0.071,0.049,0.112,0.065c0.116,0.047,0.238,0.075,0.367,0.075     c0.001,0,11.001,0,11.001,0c0.553,0,1-0.447,1-1s-0.447-1-1-1H6.097l-0.166-1H17.25c0.498,0,0.92-0.366,0.99-0.858l1-7     C19.281,3.479,19.195,3.188,19.006,2.97z M17.097,4.625l-0.285,2H13.25v-2H17.097z M12.25,4.625v2h-3v-2H12.25z M12.25,7.625v2     h-3v-2H12.25z M8.25,4.625v2h-3c-0.053,0-0.101,0.015-0.148,0.03l-0.338-2.03H8.25z M5.264,7.625H8.25v2H5.597L5.264,7.625z      M13.25,9.625v-2h3.418l-0.285,2H13.25z',
          fillColor: 'green',
          fillOpacity: 0.9,
          scale: 0.8,
          strokeColor: 'green',
          strokeWeight: 0.1,
          scaledSize: new google.maps.Size(13, 13)
        };

var queries = ['Groceries', 'Supermarkets', 'Farmers Markets'];
var query1 = queries[0];
var query2 = queries[1];
var query3 = queries[2];






  initialize();
  storeTypeIdMap["CS"] = CS_Rows;
  storeTypeIdMap["SM"] = SM_Rows;
  storeTypeIdMap["FM"] = FM_Rows;




function callbackCS(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var places = [];
      gmarkers = [];

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        places.push(place);
        createMarker(results[i], CS);
      }

      var marker = new google.maps.Marker({
          position: startLoc,
          map: map,
          
        });

      map.fitBounds(circle.getBounds());
      google.maps.event.trigger(map, 'resize');
      map.panTo(startLoc);
      map.setZoom(map.getZoom() + 1);
      // if (markers.length == 1) map.setZoom(17);
      var destArray = [];
      destMarkers = [];

      var minDist = Number.MAX_VALUE;

      var htmlString = "Nearby " + queryType + " : " + "\n" ; 

      for (var i = 0; i < gmarkers.length; i++) {

        var streetAddr = results[i].formatted_address.split(',')[0];
        var idToCheck = 'A' + streetAddr.split(' ').join('_');
        if(idToCheck in rowContentMap)
          gmarkers[i].setMap(null);
        else
        {
            var currDist = google.maps.geometry.spherical.computeDistanceBetween(startLoc, gmarkers[i].getPosition());
            if (currDist < 5 * 1609.34) { // 1609.34 meters/mile

          //htmlString = htmlString + "\n" + "\n" +results[i].name + "\n" + results[i].formatted_address +  "(" + Number(Math.round( currDist / 1609.34 +'e2')+'e-2') + " miles away)";

            createTableRows(results[i].name, results[i].formatted_address.split(',')[0], '#ff7f7f');
            CS_Rows.push(idToCheck);
            rowMarkerMap[idToCheck] = gmarkers[i]
      
            destArray.push(gmarkers[i].getPosition());
            destMarkers.push(gmarkers[i]); 
            csMarkers.push(gmarkers[i]);
           }
          else
            gmarkers[i].setMap(null);
        }
        
      }

      $("#groceryInfo").text(htmlString);

    }   
  }

  function callbackSM(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var places = [];
      gmarkers = [];

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        places.push(place);
        createMarker(results[i], SM);
      }

      var marker = new google.maps.Marker({
          position: startLoc,
          map: map,
          
        });

      map.fitBounds(circle.getBounds());
      google.maps.event.trigger(map, 'resize');
      map.panTo(startLoc);
      map.setZoom(map.getZoom() + 1);
      // if (markers.length == 1) map.setZoom(17);
      var destArray = [];
      destMarkers = [];

      var minDist = Number.MAX_VALUE;

      var htmlString = "Nearby " + queryType + " : " + "\n" ; 

      for (var i = 0; i < gmarkers.length; i++) {

        var streetAddr = results[i].formatted_address.split(',')[0];
        var idToCheck = 'A' + streetAddr.split(' ').join('_');
        if(idToCheck in rowContentMap)
          gmarkers[i].setMap(null);
        else
        {
          var currDist = google.maps.geometry.spherical.computeDistanceBetween(startLoc, gmarkers[i].getPosition());
          if (currDist < 5 * 1609.34) { // 1609.34 meters/mile

            createTableRows(results[i].name, results[i].formatted_address.split(',')[0], '#9999ff');
            SM_Rows.push(idToCheck);
            rowMarkerMap[idToCheck] = gmarkers[i]
      
            destArray.push(gmarkers[i].getPosition());
            destMarkers.push(gmarkers[i]); 
            smMarkers.push(gmarkers[i]);
          }
          else
            gmarkers[i].setMap(null); 
        }
        
      }

      $("#groceryInfo").text(htmlString);

    }   
  }

  function callbackFM(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var places = [];
      gmarkers = [];

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        places.push(place);
        createMarker(results[i], FM);
      }

      var marker = new google.maps.Marker({
          position: startLoc,
          map: map,
          
        });

      map.fitBounds(circle.getBounds());
      google.maps.event.trigger(map, 'resize');
      map.panTo(startLoc);
      map.setZoom(map.getZoom() + 1);
      // if (markers.length == 1) map.setZoom(17);
      var destArray = [];
      destMarkers = [];

      var minDist = Number.MAX_VALUE;

      var htmlString = "Nearby " + queryType + " : " + "\n" ; 

      for (var i = 0; i < gmarkers.length; i++) {

        var streetAddr = results[i].formatted_address.split(',')[0];
        var idToCheck = 'A' + streetAddr.split(' ').join('_');
        if(idToCheck in rowContentMap)
          gmarkers[i].setMap(null);
        else
        {
            var currDist = google.maps.geometry.spherical.computeDistanceBetween(startLoc, gmarkers[i].getPosition());
            if (currDist < 5 * 1609.34) { // 1609.34 meters/mile

            //htmlString = htmlString + "\n" + "\n" +results[i].name + "\n" + results[i].formatted_address +  "(" + Number(Math.round( currDist / 1609.34 +'e2')+'e-2') + " miles away)";

            createTableRows(results[i].name, results[i].formatted_address.split(',')[0], '#99c199');
            rowMarkerMap[idToCheck] = gmarkers[i]
            FM_Rows.push(idToCheck);
      
            destArray.push(gmarkers[i].getPosition());
            destMarkers.push(gmarkers[i]); 
            fmMarkers.push(gmarkers[i]);
          }
          else
            gmarkers[i].setMap(null);
        }
        
      }

      $("#groceryInfo").text(htmlString);

    }   
  }


  function initialize() {
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(40.65, -73.95), // Brooklyn, NY
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false
    }); 
    //circle.setMap(map);
    service = new google.maps.places.PlacesService(map);
    initialService = new google.maps.places.PlacesService(map);

    input = document.getElementById('searchInput');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    p_infowindow = new google.maps.InfoWindow();
    p_infowindowContent = document.getElementById('infowindow-content');
        p_infowindow.setContent(p_infowindowContent);

    var p_marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29),
          icon: goldStar
        });


    function plotCS(iQuery) {

      geocoder.geocode({
       'address': address
        }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          startLoc = results[0].geometry.location;
          circle.setCenter(startLoc);
          var request = {
            bounds: circle.getBounds(),
            query: iQuery
          };
          initialService.textSearch(request, callbackCS);
        } else {
          alert("geocode failed:" + status); 
        }
      });

    }

    function plotSM(iQuery) {

      geocoder.geocode({
       'address': address
        }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          startLoc = results[0].geometry.location;
          circle.setCenter(startLoc);
          var request = {
            bounds: circle.getBounds(),
            query: iQuery
          };
          initialService.textSearch(request, callbackSM);
        } else {
          alert("geocode failed:" + status); 
        }
      });

    }

    function plotFM(iQuery) {

      geocoder.geocode({
       'address': address
        }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          startLoc = results[0].geometry.location;
          circle.setCenter(startLoc);
          var request = {
            bounds: circle.getBounds(),
            query: iQuery
          };
          initialService.textSearch(request, callbackFM);
        } else {
          alert("geocode failed:" + status); 
        }
      });

    }

    plotCS(query1);
    plotSM(query2);
    plotFM(query3);

    //map.setZoom(map.getZoom() + 1);
    
 
    var groceryCard = document.getElementById('GroceryCardMap');
    var groceryCardDim = groceryCard.getBoundingClientRect();
    var height = groceryCardDim.height*3.0;
    var width = groceryCardDim.width*1.4;

  var svg2 = d3.select("#mapChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var svg3 = d3.select("#groceryInfo")
    .append("svg")
    .attr("width", 0.2*width)
    .attr("height", 0.7*height);



  }

  function createMarker(place, markerIcon) {
    var placeLoc = place.geometry.location;
    if (place.icon) {  
      var image = {
        url: place.icon,
        // size:new google.maps.Size(71, 71),
        // origin: new google.maps.Point(0, 0), 
        // anchor:new google.maps.Point(35, 0),
        scaledSize: new google.maps.Size(13, 13)
      };
    } else var image = null;


    var marker = new google.maps.Marker({
      map: map,
      icon: markerIcon,
      position: place.geometry.location,
      reference: place.reference
    });

    

    var request = {
      reference: place.reference
    };   

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.marker = marker;
      service.getDetails(request, function(place, status) { 
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var contentStr = '<h5>' + place.name + '</h5><p>' + place.formatted_address;
          if (!!place.formatted_phone_number) contentStr += '<br>' + place.formatted_phone_number;
          //if (!!place.website) contentStr += '<br><a target="_blank" href="' + place.website + '">' + place.website + '</a>';
          //contentStr += '<br>' + place.types + '</p>';

          contentStr = '<p style="word-wrap:nospace">' + contentStr + '</p>';
          infowindow.setContent(contentStr);
          infowindow.open(map, marker);
        } else { 
          var contentStr = "<h5>No Result, status=" + status + "</h5>";
          infowindow.setContent(contentStr);
          infowindow.open(map, marker); 
        }
      }); 
    
    });     
    
    gmarkers.push(marker);

  }       
 

google.maps.event.addListener(infowindow, "closeclick", function()
{
    map.panTo(startLoc);
});


autocomplete.addListener('place_changed', function() {
          p_infowindow.close();
          //p_marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          
          

          // If the place has a geometry, then present it on a map.
          var bName = place.name;
          var bAddress = place.formatted_address;
          var bAddressFinal = bAddress.split(",")
          var streetAddress = bAddressFinal[0]

          var idToCheck = 'A' + streetAddress.split(' ').join('_');
          if(null == rowMarkerMap[idToCheck])
          {
            goldStar.fillColor = 'black';
            var placeMarker = new google.maps.Marker({
                  map: map,
                  icon: goldStar,
                  position: place.geometry.location
             });
            rowMarkerMap[idToCheck] = placeMarker;
            createTableRows(bName, streetAddress, 'black', 2);

            d3.select('#'+ 'B' + streetAddress.split(' ').join('_')).transition().duration(10)
                 .style('fill', 'black')
                 .style('fill-opacity', 1.0);

            var firstElement = document.getElementById("groceryTableData").rows[0];
            var currRow = document.getElementById(idToCheck);

            firstElement.parentNode.insertBefore(currRow, firstElement);
          }
          else
          {

              var currMarker = rowMarkerMap[idToCheck];

              var currContent = rowContentMap[idToCheck];
              var currColorType = currContent.Color;

              goldStar.fillColor = currColorType;
              currMarker.setIcon(goldStar);
              currContent.Preferred = 1;
              rowContentMap[idToCheck] = currContent;

              var currRow = document.getElementById(idToCheck);
              if(null == currRow)
              {
                createTableRows(currContent.Name, currContent.Address, currContent.Color);
                currMarker.setVisible(true);

              }
              else 
              {

                  var firstElement = document.getElementById("groceryTableData").rows[0];
                  firstElement.parentNode.insertBefore(currRow, firstElement);

              }

              

              var currAddr = currContent.Address;
              d3.select('#'+ 'B' + currAddr.split(' ').join('_')).transition().duration(10)
                 .style('fill', currColorType)
                 .style('fill-opacity', 1.0);




          }
          
          map.panTo(place.geometry.location);

          searchBox = document.getElementById("searchInput");
          searchBox.value = "";
          //map.setZoom(2);  // Why 17? Because it looks good.
        
          //p_marker.setPosition(place.geometry.location);
          //p_marker.setVisible(true);


        });

}

function csHandler(event) {
            var csCheckbox = event.target;

            if(!csCheckbox.checked)
            {

                var csRows = storeTypeIdMap["CS"];

                for(var i = 0; i < csRows.length; i++)
                {
                    var currContent = rowContentMap[csRows[i]];
                    if(currContent.Preferred == 0)
                    {
                        var row = document.getElementById(csRows[i]);
                        row.parentNode.removeChild(row);

                        var currMarker = rowMarkerMap[csRows[i]];
                        currMarker.setVisible(false);
                    }

                    
                }
            }
            else
            {

              var csRows = storeTypeIdMap["CS"];
              for(var i = 0; i < csRows.length; i++)
              {
                  var currContent = rowContentMap[csRows[i]];
                  if(currContent.Preferred == 0 )
                  {
                      var currContent = rowContentMap[csRows[i]];
                      var row = document.getElementById(csRows[i]);
                      if(row == null)
                        createTableRows(currContent.Name, currContent.Address, currContent.Color);

                      var currMarker = rowMarkerMap[csRows[i]];
                      currMarker.setVisible(true);
                  }
                  

              }
            }

            map.panTo(startLoc);
            
        }

function smHandler(event) {
            var smCheckbox = event.target;

            if(!smCheckbox.checked)
            {
            
               var smRows = storeTypeIdMap["SM"];

                for(var i = 0; i < smRows.length; i++)
                {
                    var currContent = rowContentMap[smRows[i]];
                    if(currContent.Preferred == 0)
                    {
                        var row = document.getElementById(smRows[i]);
                        row.parentNode.removeChild(row);

                        var currMarker = rowMarkerMap[smRows[i]];
                        currMarker.setVisible(false);
                    }

                    
                }
            }
            else
            {
              var smRows = storeTypeIdMap["SM"];

              for(var i = 0; i < smRows.length; i++)
              {
                  var currContent = rowContentMap[smRows[i]];

                  if(currContent.Preferred == 0)
                  {
                      var currContent = rowContentMap[smRows[i]];
                      var row = document.getElementById(smRows[i]);
                      if(row == null)
                        createTableRows(currContent.Name, currContent.Address, currContent.Color);

                      var currMarker = rowMarkerMap[smRows[i]];
                      currMarker.setVisible(true);
                  }

              }
            }

            map.panTo(startLoc);
            
        }

function fmHandler(event) {
            var fmCheckbox = event.target;

            if(!fmCheckbox.checked)
            {
                
                var fmRows = storeTypeIdMap["FM"];

                for(var i = 0; i < fmRows.length; i++)
                {
                    var currContent = rowContentMap[fmRows[i]];
                    if(currContent.Preferred == 0)
                    {
                        var row = document.getElementById(fmRows[i]);
                        row.parentNode.removeChild(row);

                        var currMarker = rowMarkerMap[fmRows[i]];
                        currMarker.setVisible(false);
                    }
                }
            }
            else
            {
            
              var fmRows = storeTypeIdMap["FM"];

              for(var i = 0; i < fmRows.length; i++)
              {
                  var currContent = rowContentMap[fmRows[i]];
                  if(currContent.Preferred == 0)
                  {
                      var currContent = rowContentMap[fmRows[i]];
                      var row = document.getElementById(fmRows[i]);
                      if(row == null)
                        createTableRows(currContent.Name, currContent.Address, currContent.Color);

                      var currMarker = rowMarkerMap[fmRows[i]];
                      currMarker.setVisible(true);
                  }

              }
            }

            map.panTo(startLoc);
            
        }

function createTableRows(businessName, streetAddr, colorType, preferredValue = 0) {
  var tableBody = document.getElementById("groceryTableData").getElementsByTagName('tbody')[0];
  var newRow = tableBody.insertRow(tableBody.rows.length);
  newRow.className = "groceryTableRow";

  // set row id
  newString = streetAddr.replace(/[^a-zA-Z0-9]/g,'_');
  var rowId = 'A' + newString.split(' ').join('_');
  newRow.setAttribute('id', rowId);
  
  /* Create space for star */
  var starCell = newRow.insertCell(0);
  var starDiv = document.createElement('div');
  starDiv.setAttribute('style', 'height:20px;width:20px;fill:colorType');
  
  /* Create empty star */
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('style','background-color: none');

  
  starCell.appendChild(starDiv);
  starDiv.appendChild(svg);
  
  var star = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  star.setAttribute('points', '47.6190476190476,4.76190476190476 19.047619047619,94.2857142857143 90.4761904761905,37.1428571428571 4.76190476190476,37.1428571428571 76.1904761904762,94.2857142857143');
  star.setAttribute('class', 'star');
  
  
  svg.appendChild(star);
  
  /* Create space for data */
  var newCell = newRow.insertCell(1);
  var bNameSpan = document.createElement('span');
  bNameSpan.textContent = businessName;
  var color_Type = 'color:' + colorType;
  bNameSpan.setAttribute('style', color_Type);
  var nLine = document.createElement("br");
  var sAddr = document.createTextNode(streetAddr);
  newCell.appendChild(bNameSpan);
  newCell.append(nLine);
  newCell.appendChild(sAddr);

  newCell.setAttribute('class', 'rowText');

  // map update
  var content = {'Name' : businessName, 'Address' : streetAddr, 'Color' : colorType, 'Preferred' : preferredValue};
  if(rowId in rowContentMap)
    console.log(streetAddr);

  rowContentMap[rowId] = content;
  

  var starId = 'B' + newString.split(' ').join('_')
  star.setAttribute('id', starId);
  var starRef = d3.select('#'+ 'B' + newString.split(' ').join('_'));
  starRef.on("click", 
    function(){
      //console.log('hi');

      var selectedId = this.id;
      var rowId = 'A' + selectedId.slice( 1 );
      var currMarker = rowMarkerMap[rowId];
      var currContent = rowContentMap[rowId];
      var currColorType = currContent.Color;
      var firstElement = document.getElementById("groceryTableData").rows[0];
      var firstElementId = firstElement.id;

      
      if(parseFloat(d3.select(this).style('fill-opacity'))==0.3) {
        d3.select(this).transition().duration(10)
                 .style('fill', currColorType)
                 .style('fill-opacity', 1.0); 

        //remove current marker
        goldStar.fillColor = currColorType;
        currMarker.setIcon(goldStar);
        currContent.Preferred = 1;
        rowContentMap[rowId] = currContent;

        
        var currRow = document.getElementById(rowId);

        firstElement.parentNode.insertBefore(currRow, firstElement);



      } else {
        d3.select(this).transition().duration(10)
                 .style('fill', '#C8C8C8')
                 .style('fill-opacity', 0.3);


        if(currContent.Preferred != 2)
        {
          var iconToUse = CS;
          if(currColorType == '#9999ff')
            iconToUse = SM;
          else if (currColorType == '#99c199')
            iconToUse = FM;

          currMarker.setIcon(iconToUse);

          currContent.Preferred = 0;
          rowContentMap[rowId] = currContent;

          // traverse all the rows below the star row
          baseRow = document.getElementById(rowId)

          var startSwitching = false;
          var table = document.getElementById("groceryTableData");
          for (var i = 1, row; row = table.rows[i]; i++) {

              if(startSwitching)
              {
                  if(rowContentMap[row.id].Preferred == 1) 
                      baseRow.parentNode.insertBefore(row, baseRow);
              }

              if(row.id == rowId)
                startSwitching = true;
          }
  
        }
        else
        {
          var row = document.getElementById(rowId)
          var markerToRemove = rowMarkerMap[rowId]
          markerToRemove.setMap(null)
          row.parentNode.removeChild(row);
          map.panTo(startLoc);

        }

        
        
        


      }
    }
  );

function onRowClick(tableId, callback) {
    var table = document.getElementById(tableId),
        rows = table.getElementsByTagName("tr"),
        i;

    for (var i = 0, row; row = table.rows[i]; i++) {
   //iterate through rows
   //rows would be accessed using the "row" variable assigned in the for loop
      for (var j = 0, col; col = row.cells[j]; j++) {
          //iterate through columns
          //columns would be accessed using the "col" variable assigned in the for loop
          if(j == 1) {
            col.onclick  = function (row) {
                            return function () {
                            callback(row);
                           };
                        }(table.rows[i]);
            }
      }  
    }
    /*for (i = 0; i < rows.length; i++) {
        table.rows[i].onclick = function (row) {
            return function () {
                callback(row);
            };
        }(table.rows[i]);
    }*/
};
 
onRowClick("groceryTableData", function (row){
    console.log(row.id);
    markerToShow = rowMarkerMap[row.id];
    infowindow.marker = markerToShow;

    var request = {
      reference: markerToShow.reference
    };   
    service.getDetails(request, function(place, status) { 
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var contentStr = '<h5>' + place.name + '</h5><p>' + place.formatted_address;
          if (!!place.formatted_phone_number) contentStr += '<br>' + place.formatted_phone_number;
          //if (!!place.website) contentStr += '<br><a target="_blank" href="' + place.website + '">' + place.website + '</a>';
          //contentStr += '<br>' + place.types + '</p>';

          contentStr = '<p style="word-wrap:nospace">' + contentStr + '</p>';
          infowindow.setContent(contentStr);
          infowindow.open(map, markerToShow);
        } else { 
          var contentStr = "<h5>No Result, status=" + status + "</h5>";
          infowindow.setContent(contentStr);
          infowindow.open(map, markerToShow); 
        }
      }); 

    /* Info windo added */

});


}


  //google.maps.event.addDomListener(window, 'load', initialize);



/* Generic create table rows for Grocery */
