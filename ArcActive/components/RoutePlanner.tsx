import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';

const RoutePlanner = () => {
  const [elevation, setElevation] = useState('');
  const [distance, setDistance] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
        <title>ArcGIS Maps SDK for JavaScript Tutorials: Find a route and directions</title>
        <style>
          html, body, #viewDiv {
            padding: 0;
            margin: 0;
            height: 100%;
            width: 100%;
          }
        </style>
        <link rel="stylesheet" href="https://js.arcgis.com/4.30/esri/themes/light/main.css">
        <script src="https://js.arcgis.com/4.30/"></script>
        <script>
          let startPoint = null;
          const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

          function getRoute(elevation, distance) {
            if (!startPoint) {
              alert("Please set a start point on the map.");
              return;
            }

            // Generate an end point based on the specified distance
            const endPoint = generateEndPoint(startPoint, distance);

            require([
              "esri/rest/route",
              "esri/rest/support/RouteParameters",
              "esri/rest/support/FeatureSet",
              "esri/Graphic",
              "esri/geometry/Point"
            ], function(route, RouteParameters, FeatureSet, Graphic, Point) {
              const startGraphic = new Graphic({
                geometry: new Point(startPoint),
                symbol: {
                  type: "simple-marker",
                  color: "blue",
                  size: "8px"
                }
              });

              const endGraphic = new Graphic({
                geometry: new Point(endPoint),
                symbol: {
                  type: "simple-marker",
                  color: "red",
                  size: "8px"
                }
              });

              const routeParams = new RouteParameters({
                stops: new FeatureSet({
                  features: [startGraphic, endGraphic]
                }),
                returnDirections: true,
                outSpatialReference: { wkid: 3857 } // Ensure the spatial reference is set
              });

              route.solve(routeUrl, routeParams)
                .then(function(data) {
                  console.log("Route data:", data);
                  const filteredRoutes = filterRoutes(data.routeResults, elevation, distance);
                  if (filteredRoutes.length > 0) {
                    filteredRoutes.forEach(function(result) {
                      result.route.symbol = {
                        type: "simple-line",
                        color: [5, 150, 255],
                        width: 3
                      };
                      view.graphics.add(result.route);
                    });

                    // Display directions
                    const directions = document.createElement("ol");
                    directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                    directions.style.marginTop = "0";
                    directions.style.padding = "15px 15px 15px 30px";
                    const features = filteredRoutes[0].directions.features;

                    // Show each direction
                    features.forEach(function(result, i) {
                      const direction = document.createElement("li");
                      direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                      directions.appendChild(direction);
                    });

                    view.ui.empty("top-right");
                    view.ui.add(directions, "top-right");
                  } else {
                    console.log("No routes found matching the criteria.");
                  }
                })
                .catch(function(error) {
                  console.error("Error solving route:", error);
                  alert("Unable to complete operation: " + error.message);
                });
            });
          }

          function generateEndPoint(startPoint, distance) {
            const earthRadius = 6371; // Radius of the Earth in kilometers
            const distanceInKm = parseFloat(distance);
            const bearing = 45; // Bearing in degrees (45 degrees for northeast direction)

            const lat1 = startPoint.latitude * (Math.PI / 180); // Convert latitude to radians
            const lon1 = startPoint.longitude * (Math.PI / 180); // Convert longitude to radians

            const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceInKm / earthRadius) +
              Math.cos(lat1) * Math.sin(distanceInKm / earthRadius) * Math.cos(bearing * (Math.PI / 180)));

            const lon2 = lon1 + Math.atan2(Math.sin(bearing * (Math.PI / 180)) * Math.sin(distanceInKm / earthRadius) * Math.cos(lat1),
              Math.cos(distanceInKm / earthRadius) - Math.sin(lat1) * Math.sin(lat2));

            return {
              latitude: lat2 * (180 / Math.PI), // Convert latitude back to degrees
              longitude: lon2 * (180 / Math.PI) // Convert longitude back to degrees
            };
          }

          function filterRoutes(routeResults, elevation, distance) {
            const elevationTolerance = 150; // Adjust as needed
            const distanceTolerance = 2; // Adjust as needed

            return routeResults.filter(result => {
              const totalDistance = result.route.attributes.Total_Kilometers;
              const totalElevation = result.route.attributes.Total_ElevationGain;

              const distanceMatch = Math.abs(totalDistance - parseFloat(distance)) <= distanceTolerance;
              const elevationMatch = Math.abs(totalElevation - parseFloat(elevation)) <= elevationTolerance;

              return distanceMatch && elevationMatch;
            });
          }

          window.addEventListener('message', function(event) {
            console.log('Message received in iframe:', event.data);
            if (event.data && event.data.type === 'GET_ROUTE') {
              getRoute(event.data.elevation, event.data.distance);
            }
          });

          require([
            "esri/config",
            "esri/Map",
            "esri/views/MapView",
            "esri/Graphic",
            "esri/geometry/Point"
          ], function(esriConfig, Map, MapView, Graphic, Point) {
            esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurJcLXYZuG6gISdSjmr4A9lFnIxQvjf1bPw-RmJe6CfAfDspajmIkh0hd5Oq1NjUP9AfdQbFsS9M47E3BK_0bpw80Fh6HSeV7x6cU1LcnShO-z_P4fQNlnKheT8TIX_90bSieJEQabmjoG0-QJOOw58PbJPWn1xCsTK78qdnWrpa1jYrgs-KZuni1UxGO-FV-aDOawuI51ih4aHzlNpPbhVsRY7Qx985-Y0hNPwwd8TEaAT1_C6DNZpzx";

            const map = new Map({
              basemap: "arcgis/navigation" // basemap styles service
            });

            const view = new MapView({
              container: "viewDiv",
              map: map,
              center: [-118.24532, 34.05398], // Longitude, latitude
              zoom: 12
            });

            view.on("click", function(event) {
              if (!startPoint) {
                addGraphic("start", event.mapPoint);
                startPoint = { latitude: event.mapPoint.latitude, longitude: event.mapPoint.longitude };
              } else {
                view.graphics.removeAll();
                addGraphic("start", event.mapPoint);
                startPoint = { latitude: event.mapPoint.latitude, longitude: event.mapPoint.longitude };
              }
            });

            function addGraphic(type, point) {
              const graphic = new Graphic({
                geometry: new Point(point),
                symbol: {
                  type: "simple-marker",
                  color: (type === "start") ? "blue" : "red",
                  size: "8px"
                }
              });
              view.graphics.add(graphic);
            }
          });
        </script>
      </head>
      <body>
        <div id="viewDiv"></div>
      </body>
      </html>`;
  };

  const sendMessageToIframe = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      console.log('Sending message to iframe:', { elevation, distance });
      iframe.contentWindow.postMessage({
        type: 'GET_ROUTE',
        elevation: elevation,
        distance: distance
      }, '*');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
         
          style={styles.input}
          placeholder="Elevation"
          value={elevation}
          onChangeText={setElevation}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Distance"
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
        />
        <Button
          title="Set Parameters and Find Route"
          onPress={sendMessageToIframe}
        />
      </View>
      <iframe
        ref={iframeRef}
        srcDoc={getHTML()}
        style={styles.map}
        frameBorder="0"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '80%', // Adjust the height to make the map taller
  },
});

export default RoutePlanner;