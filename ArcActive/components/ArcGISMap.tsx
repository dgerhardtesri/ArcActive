import React, {useEffect, useRef, useState} from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { fetchHazardsData } from '@/views/apis/GetHazards';
import { loadModules } from 'esri-loader';
import {isGoodToStart} from "@/utils/tools";

const ArcGISMap: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const mapRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkIsGoodToStart = async () => {
      const isGood = await isGoodToStart();
      console.log('isGood', isGood);
      if (!isGood) {
        window.alert("Running condition changed, please go home!")
      }
    }
    const intervalId = setInterval(checkIsGoodToStart, 10000);

    let view: __esri.SceneView;

    loadModules([
      'esri/Map',
      'esri/views/SceneView',
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
      'esri/rest/route',
      'esri/rest/support/RouteParameters',
      'esri/rest/support/FeatureSet'
    ]).then(([Map, SceneView, Graphic, GraphicsLayer, route, RouteParameters, FeatureSet]) => {
      const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

      const routeLayer = new GraphicsLayer();

      const map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation",
        layers: [routeLayer]
      });

      view = new SceneView({
        container: mapRef.current as HTMLDivElement,
        map: map,
        center: [7.9878, 46.3159],
        zoom: 16
      });

      const routeParams = new RouteParameters({
        apiKey: "AAPTxy8BH1VEsoebNVZXo8HurJcLXYZuG6gISdSjmr4A9lFnIxQvjf1bPw-RmJe6CfAfDspajmIkh0hd5Oq1NjUP9AfdQbFsS9M47E3BK_0bpw80Fh6HSeV7x6cU1LcnShO-z_P4fQNlnKheT8TIX_90bSieJEQabmjoG0-QJOOw58PbJPWn1xCsTK78qdnWrpa1jYrgs-KZuni1UxGO-FV-aDOawuI51ih4aHzlNpPbhVsRY7Qx985-Y0hNPwwd8TEaAT1_C6DNZpzx",
        stops: new FeatureSet(),
        outSpatialReference: {
          wkid: 3857
        }
      });

      const markerSymbol = {
        type: "point-3d",
        symbolLayers: [
          {
            type: "object",
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

      const pathSymbol = {
        type: "line-3d",
        symbolLayers: [
          {
            type: "path",
            width: 17,
            material: {
              color: [255, 128, 0]
            }
          }
        ]
      };

      view.on("click", addStop);

      function addStop(event: __esri.ViewClickEvent) {
        if (!event.mapPoint) {
          return;
        }

        const stop = new Graphic({
          geometry: event.mapPoint,
          symbol: markerSymbol
        });
        routeLayer.add(stop);

        routeParams.stops.features.push(stop);
        if (routeParams.stops.features.length >= 2) {
          let minLat = routeParams.stops.features[0].geometry.latitude;
          let minLon = routeParams.stops.features[0].geometry.longitude;
          let maxLat = minLat;
          let maxLon = minLon;

          for (let i = 1; i < routeParams.stops.features.length; i++) {
            const lat = routeParams.stops.features[i].geometry.latitude;
            const lon = routeParams.stops.features[i].geometry.longitude;
            if (lat < minLat) {
              minLat = lat;
            }
            if (lat > maxLat) {
              maxLat = lat;
            }
            if (lon < minLon) {
              minLon = lon;
            }
            if (lon > maxLon) {
              maxLon = lon;
            }
          }

          fetchHazardsData(minLon, minLat, maxLon, maxLat)
            .then((hazardsData) => {
              if (hazardsData) {
                console.log(hazardsData);
              }
            })
            .catch((error) => {
              console.error('Error fetching hazards data:', error);
            });

          route
            .solve(routeUrl, routeParams)
            .then(onRouteUpdated)
        }
      }

      function onRouteUpdated(data: any) {
        const route = data.routeResults[0].route;
        const geometry = route.geometry;

        const elevationPromise = map.ground.queryElevation(geometry);

        elevationPromise.then(
          (result: any) => {
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

            document.getElementById("distanceDiv")!.innerHTML =
              "<p>total distance: " +
              Math.round(route.attributes.Total_Kilometers * 1000) / 1000 +
              " km</p>";
            document.getElementById("ascDiv")!.innerHTML =
              "<p>total ascent: " + Math.round(ascent * 100) / 100 + " m</p>";
            document.getElementById("descDiv")!.innerHTML =
              "<p>total descent: " + Math.round(descent * 100) / 100 + " m</p>";

            routeLayer.add(
              new Graphic({
                geometry: result.geometry,
                symbol: pathSymbol
              })
            );
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });

    return () => {
      clearInterval(intervalId);
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <div ref={mapRef} style={styles.map} />
      <div id="paneDiv" className="esri-widget">
        <p>
          Click on the map to add stops. The route along the stops is calculated and elevation values are queried to
          update the following route statistics:
        </p>
        <div id="distanceDiv"><p>total distance: 0 km</p></div>
        <div id="ascDiv"><p>total ascent: 0 m</p></div>
        <div id="descDiv"><p>total descent: 0 m</p></div>
      </div>
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
