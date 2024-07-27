import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const RoutePlanner = () => {
  const getHTML = () => {
    return `

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

        require([
            "esri/config",
            "esri/Map",
            "esri/views/MapView",

            "esri/Graphic",
            "esri/rest/route",
            "esri/rest/support/RouteParameters",
            "esri/rest/support/FeatureSet"

        ], function(esriConfig, Map, MapView, Graphic, route, RouteParameters, FeatureSet) {

            esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurJcLXYZuG6gISdSjmr4A9lFnIxQvjf1bPw-RmJe6CfAfDspajmIkh0hd5Oq1NjUP9AfdQbFsS9M47E3BK_0bpw80Fh6HSeV7x6cU1LcnShO-z_P4fQNlnKheT8TIX_90bSieJEQabmjoG0-QJOOw58PbJPWn1xCsTK78qdnWrpa1jYrgs-KZuni1UxGO-FV-aDOawuI51ih4aHzlNpPbhVsRY7Qx985-Y0hNPwwd8TEaAT1_C6DNZpzx";

            const map = new Map({
                basemap: "arcgis/navigation" // basemap styles service
            });

            const view = new MapView({
                container: "viewDiv",
                map: map,
                center: [-118.24532,34.05398], //Longitude, latitude
                zoom: 12
            });

            const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

            view.on("click", function(event){

                if (view.graphics.length === 0) {
                    addGraphic("origin", event.mapPoint);
                } else if (view.graphics.length === 1) {
                    addGraphic("destination", event.mapPoint);

                    getRoute(); // Call the route service

                } else {
                    view.graphics.removeAll();
                    addGraphic("origin",event.mapPoint);
                }

            });

            function addGraphic(type, point) {
                const graphic = new Graphic({
                    symbol: {
                        type: "simple-marker",
                        color: (type === "origin") ? "white" : "black",
                        size: "8px"
                    },
                    geometry: point
                });
                view.graphics.add(graphic);
            }

            function getRoute() {
                const routeParams = new RouteParameters({
                    stops: new FeatureSet({
                        features: view.graphics.toArray()
                    }),

                    returnDirections: true

                });

                route.solve(routeUrl, routeParams)
                    .then(function(data) {
                        data.routeResults.forEach(function(result) {
                            result.route.symbol = {
                                type: "simple-line",
                                color: [5, 150, 255],
                                width: 3
                            };
                            view.graphics.add(result.route);
                        });

                        // Display directions
                        if (data.routeResults.length > 0) {
                            const directions = document.createElement("ol");
                            directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                            directions.style.marginTop = "0";
                            directions.style.padding = "15px 15px 15px 30px";
                            const features = data.routeResults[0].directions.features;

                            // Show each direction
                            features.forEach(function(result,i){
                                const direction = document.createElement("li");
                                direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                                directions.appendChild(direction);
                            });

                            view.ui.empty("top-right");
                            view.ui.add(directions, "top-right");

                        }

                    })

                    .catch(function(error){
                        console.log(error);
                    })

            }

        });
    </script>

</head>
<body>
<div id="viewDiv"></div>
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

export default RoutePlanner;
