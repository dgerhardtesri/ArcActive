import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const ArcGISMap = () => {
    const getHTML = () => {
        return `
   
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Query Elevation (lines) | Sample | ArcGIS Maps SDK for JavaScript 4.30</title>
    <style>
      html,
      body,
      #viewDiv {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }

      #ascDiv,
      #descDiv,
      #distanceDiv {
        padding: 0;
        margin: 0;
        width: 30%;
        float: left;
        font-weight: 900;
      }

      #ascDiv p,
      #descDiv p,
      #distanceDiv p {
        padding: 0;
        margin: 0.2em;
      }

      #paneDiv {
        position: absolute;
        top: 12px;
        left: 62px;
        width: 80%;
        padding: 0 12px 0 12px;
        background-color: rgba(255, 255, 255, 0.85);
        border: 1px solid white;
        color: black;
      }
    </style>

    <link rel="stylesheet" href="https://js.arcgis.com/4.30/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.30/"></script>

    <script>
      require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/rest/route",
        "esri/rest/support/RouteParameters",
        "esri/rest/support/FeatureSet"
      ], (Map, SceneView, Graphic, GraphicsLayer, route, RouteParameters, FeatureSet) => {
        // Point the URL to a valid routing service
        const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

        // The stops and route result will be stored in this layer
        const routeLayer = new GraphicsLayer();

        const map = new Map({
          basemap: "topo-vector",
          ground: "world-elevation",
          layers: [routeLayer] // Add the route layer to the map
        });

        const view = new SceneView({
          container: "viewDiv",
          map: map,
          center: [7.9878, 46.3159],
          zoom: 16
        });

        // prepare the route parameters
        const routeParams = new RouteParameters({
          // An authorization string used to access the routing service
          apiKey: "AAPTxy8BH1VEsoebNVZXo8HurJcLXYZuG6gISdSjmr4A9lFnIxQvjf1bPw-RmJe6CfAfDspajmIkh0hd5Oq1NjUP9AfdQbFsS9M47E3BK_0bpw80Fh6HSeV7x6cU1LcnShO-z_P4fQNlnKheT8TIX_90bSieJEQabmjoG0-QJOOw58PbJPWn1xCsTK78qdnWrpa1jYrgs-KZuni1UxGO-FV-aDOawuI51ih4aHzlNpPbhVsRY7Qx985-Y0hNPwwd8TEaAT1_C6DNZpzx"
,
          stops: new FeatureSet(),
          outSpatialReference: {
            // autocasts as new SpatialReference()
            wkid: 3857
          }
        });

        // the symbol used to mark stops on the route
        const markerSymbol = {
          type: "point-3d", // autocasts as new PointSymbol3D()
          symbolLayers: [
            {
              type: "object", // autocasts as new ObjectSymbol3DLayer()
              width: 35,
              resource: {
                primitive: "sphere"
              },
              material: {
                color: [255, 0, 0]
              }
            }
          ]
        };

        // the symbol used to mark the paths between stops
        const pathSymbol = {
          type: "line-3d", // autocasts as new LineSymbol3D()
          symbolLayers: [
            {
              type: "path", // autocasts as new PathSymbol3DLayer()
              width: 17, // If only the width is given, the height is set to the same value.
              material: {
                color: [255, 128, 0]
              }
            }
          ]
        };

        // Adds a graphic when the user clicks the map. If 2 or more points exist, route is solved.
        view.on("click", addStop);

        function addStop(event) {
          if (!event.mapPoint) {
            return;
          }

          // Add a marker at the location of the map click
          const stop = new Graphic({
            geometry: event.mapPoint,
            symbol: markerSymbol
          });
          routeLayer.add(stop);

          // Update the route and execute it if 2 or more stops are input
          routeParams.stops.features.push(stop);
          if (routeParams.stops.features.length >= 2) {
            route
              .solve(routeUrl, routeParams)
              .then(onRouteUpdated)
              .catch((error) => {
                // if it fails, print the error to the console and remove the recently added point
                routeLayer.remove(stop);
                routeParams.stops.features.pop();
                console.error(error);
              });
          }
        }

        function onRouteUpdated(data) {
          const route = data.routeResults[0].route;
          const geometry = route.geometry;

          // do the actual elevation query
          const elevationPromise = map.ground.queryElevation(geometry);

          elevationPromise.then(
            (result) => {
              // compute the total ascent and descent
              let ascent = 0;
              let descent = 0;
              for (let j = 0; j < result.geometry.paths.length; j++) {
                const path = result.geometry.paths[j];
                for (let i = 0; i < path.length - 1; i++) {
                  const d = path[i + 1][2] - path[i][2];
                  if (d > 0) {
                    ascent += d;
                  } else {
                    descent -= d;
                  }
                }
              }

              // update the text fields
              document.getElementById("distanceDiv").innerHTML =
                "<p>total distance: " + Math.round(route.attributes.Total_Kilometers * 1000) / 1000 + " km</p>";
              document.getElementById("ascDiv").innerHTML =
                "<p>total ascent: " + Math.round(ascent * 100) / 100 + " m</p>";
              document.getElementById("descDiv").innerHTML =
                "<p>total descent: " + Math.round(descent * 100) / 100 + " m</p>";

              // add a path symbol following the calculated route to the scene
              routeLayer.add(
                new Graphic({
                  geometry: result.geometry,
                  symbol: pathSymbol
                })
              );
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
    </script>
  </head>
  <body>
    <div id="viewDiv"></div>
    <div id="paneDiv" class="esri-widget">
      <p>
        Click on the map to add stops. The route along the stops is calculated and elevation values are queried to
        update the following route statistics:
      </p>
      <div id="distanceDiv"><p>total distance: 0 km</p></div>
      <div id="ascDiv"><p>total ascent: 0 m</p></div>
      <div id="descDiv"><p>total descent: 0 m</p></div>
    </div>
  </body>
</html>`;
    };

    return (
        <View style={styles.container}>
            {Platform.OS === 'web' ? (
                <iframe
                    srcDoc={getHTML()}
                    style={styles.map}
                    frameBorder="0"
                />
            ) : (
                <WebView
                    originWhitelist={['*']}
                    source={{ html: getHTML() }}
                    style={styles.map}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default ArcGISMap;
