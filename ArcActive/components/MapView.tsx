import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const ArcGISMap = () => {
    const getHTML = () => {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ArcGIS Map</title>
        <style>
          html, body, #viewDiv {
            padding: 0;
            margin: 0;
            height: 100%;
            width: 100%;
          }
        </style>
        <link rel="stylesheet" href="https://js.arcgis.com/4.20/esri/themes/light/main.css">
        <script src="https://js.arcgis.com/4.20/"></script>
      </head>
      <body>
        <div id="viewDiv"></div>
        <script>
          require([
            "esri/Map",
            "esri/views/MapView"
          ], function(Map, MapView) {
            var map = new Map({
              basemap: "streets-navigation-vector"
            });

            var view = new MapView({
              container: "viewDiv",
              map: map,
              center: [-118.80500,34.02700], // longitude, latitude
              zoom: 13
            });
          });
        </script>
      </body>
      </html>
    `;
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
