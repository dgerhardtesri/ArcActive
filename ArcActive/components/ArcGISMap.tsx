import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { fetchHazardsData } from '@/views/apis/GetHazards';
import { loadModules } from 'esri-loader';

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<__esri.MapView | undefined>(undefined);
  const [routeLayer, setRouteLayer] = useState<__esri.GraphicsLayer | undefined>(undefined);
  const [hazardsLayer, setHazardsLayer] = useState<__esri.GraphicsLayer | undefined>(undefined);

  useEffect(() => {
    let mapView: __esri.MapView | undefined;
    let map: __esri.Map | undefined;
    let routeLayerInstance: __esri.GraphicsLayer | undefined;
    let hazardsLayerInstance: __esri.GraphicsLayer | undefined;

    const initializeMap = async () => {
      try {
        const [
          Map,
          MapView,
          Graphic,
          GraphicsLayer,
          route,
          RouteParameters,
          FeatureSet,
          Color,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          Polyline,
          Point,
          Collection,
          Polygon,
          PointBarrier,
          PolygonBarrier,
          PolylineBarrier,
        ] = await loadModules([
          'esri/Map',
          'esri/views/MapView',
          'esri/Graphic',
          'esri/layers/GraphicsLayer',
          'esri/rest/route',
          'esri/rest/support/RouteParameters',
          'esri/rest/support/FeatureSet',
          'esri/Color',
          'esri/symbols/SimpleMarkerSymbol',
          'esri/symbols/SimpleLineSymbol',
          'esri/geometry/Polyline',
          'esri/geometry/Point',
          'esri/core/Collection',
          'esri/geometry/Polygon',
          "esri/rest/support/PointBarrier",
          "esri/rest/support/PolygonBarrier",
          "esri/rest/support/PolylineBarrier"
        ]);

        const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

        map = new Map({
          basemap: "topo-vector",
          layers: []
        });

        mapView = new MapView({
          container: mapRef.current as HTMLDivElement,
          map: map,
          center: [7.9878, 46.3159],
          zoom: 16
        });

        routeLayerInstance = new GraphicsLayer();
        hazardsLayerInstance = new GraphicsLayer();
        map?.add(routeLayerInstance);
        map?.add(hazardsLayerInstance);

        setView(mapView);
        setRouteLayer(routeLayerInstance);
        setHazardsLayer(hazardsLayerInstance);

        const outlineSymbol = new SimpleLineSymbol({
          color: new Color([255, 255, 255, 1]),
          width: 1,
          cap: "round",
          join: "round",
          miterLimit: 2,
          style: "solid"
        });

        const markerSymbol = new SimpleMarkerSymbol({
          style: "circle",
          color: new Color([255, 0, 0, 1]),
          size: 12,
          outline: outlineSymbol
        });

        const pathSymbol = new SimpleLineSymbol({
          color: new Color([255, 128, 0, 1]),
          width: 4
        });

        const routeParams = new RouteParameters({
          apiKey: "AAPTxy8BH1VEsoebNVZXo8HurJcLXYZuG6gISdSjmr4A9lFnIxQvjf1bPw-RmJe6CfAfDspajmIkh0hd5Oq1NjUP9AfdQbFsS9M47E3BK_0bpw80Fh6HSeV7x6cU1LcnShO-z_P4fQNlnKheT8TIX_90bSieJEQabmjoG0-QJOOw58PbJPWn1xCsTK78qdnWrpa1jYrgs-KZuni1UxGO-FV-aDOawuI51ih4aHzlNpPbhVsRY7Qx985-Y0hNPwwd8TEaAT1_C6DNZpzx",
          stops: new FeatureSet({
            features: []
          }),
          outSpatialReference: {
            wkid: 3857
          }
        });

        mapView?.on("click", addStop);

        function addStop(event: __esri.ViewClickEvent) {
          if (!event.mapPoint) return;

          const stop = new Graphic({
            geometry: event.mapPoint,
            symbol: markerSymbol
          });
          routeLayerInstance?.add(stop);

          routeParams.stops.features.push(stop);
          if (routeParams.stops.features.length >= 2) {
            const stops = routeParams.stops.features.map(f => f.geometry as __esri.Point);
            const minLat = Math.min(...stops.map(p => p.latitude));
            const maxLat = Math.max(...stops.map(p => p.latitude));
            const minLon = Math.min(...stops.map(p => p.longitude));
            const maxLon = Math.max(...stops.map(p => p.longitude));

            let polylineBarriers = new Collection();
            let pointBarriers = new Collection();
            let polygonBarriers = new Collection();

            fetchHazardsData(minLon, minLat, maxLon, maxLat)
              .then((hazardsData) => {
                if (hazardsData) {
                  hazardsLayerInstance?.removeAll(); // Clear previous hazards
                  const hazards = hazardsData.map((hazard: any) => {
                    const coordinates = hazard.geometry.coordinates;

                    if (Array.isArray(coordinates[0])) {
                      const minX = Math.min(...coordinates.map((c: number[]) => c[0]));
                      const minY = Math.min(...coordinates.map((c: number[]) => c[1]));
                      const maxX = Math.max(...coordinates.map((c: number[]) => c[0]));
                      const maxY = Math.max(...coordinates.map((c: number[]) => c[1]));

                      const polygonBarrier = new PolygonBarrier({
                        geometry: { 
                          rings: [[
                          [minX, minY],
                          [maxX, minY],
                          [maxX, maxY],
                          [minX, maxY],
                          [minX, minY]]]
                        }
                      });
                      polygonBarriers.add(polygonBarrier);
                    } else {
                      const pointBarrier = new PointBarrier({
                        longitude: coordinates[0],
                        latitude: coordinates[1]
                      });
                      pointBarriers.add(pointBarrier);
                    }

                    if (Array.isArray(coordinates[0])) {
                      const polyline = new Polyline({
                        paths: [coordinates]
                      });
                      return new Graphic({
                        geometry: polyline,
                        symbol: new SimpleLineSymbol({
                          style: "solid",
                          color: new Color([0, 0, 255, 1]),
                          width: 2
                        })
                      });
                    } else {
                      const point = new Point({
                        longitude: coordinates[0],
                        latitude: coordinates[1]
                      });
                      return new Graphic({
                        geometry: point,
                        symbol: new SimpleMarkerSymbol({
                          style: "circle",
                          color: new Color([255, 0, 0, 1]),
                          size: 8
                        })
                      });
                    }
                  });

                  hazardsLayerInstance?.addMany(hazards);

                  if (window.confirm("Hazards are detected on your route. Would you like to reroute considering these hazards as barriers?")) {
                    routeParams.polylineBarriers = polylineBarriers;
                    routeParams.pointBarriers = pointBarriers;
                    routeParams.polygonBarriers = polygonBarriers;
                    solveRoute(routeParams);
                  } else {
                    solveRoute(routeParams);
                  }
                    
                }
              })
              .catch((error) => {
                console.error('Error fetching hazards data:', error);
              });
          }
        }

        function solveRoute(params: __esri.RouteParameters) {
          route.solve(routeUrl, params)
            .then(onRouteUpdated)
            .catch((error) => {
              console.error('Error solving route:', error);
            });
        }

        function onRouteUpdated(data: any) {
          const routeResult = data.routeResults[0].route;
          if (routeResult) {
            const geometry = routeResult.geometry;
            mapView!.when(() => {
              mapView!.goTo(geometry.extent.expand(1.5));
            });

            routeLayerInstance?.removeAll(); // Remove previous route
            routeLayerInstance?.add(
              new Graphic({
                geometry: geometry,
                symbol: pathSymbol
              })
            );

            // Query and display elevation data if needed
            mapView!.ground.queryElevation(geometry).then(
              (result: any) => {
                let ascent = 0;
                let descent = 0;
                result.geometry.paths.forEach((path: any) => {
                  for (let i = 0; i < path.length - 1; i++) {
                    const d = path[i + 1][2] - path[i][2];
                    if (d > 0) {
                      ascent += d;
                    } else {
                      descent -= d;
                    }
                  }
                });

                document.getElementById("distanceDiv")!.innerHTML =
                  "<p>total distance: " +
                  Math.round(routeResult.attributes.Total_Kilometers * 1000) / 1000 +
                  " km</p>";
                document.getElementById("ascDiv")!.innerHTML =
                  "<p>total ascent: " + Math.round(ascent * 100) / 100 + " m</p>";
                document.getElementById("descDiv")!.innerHTML =
                  "<p>total descent: " + Math.round(descent * 100) / 100 + " m</p>";
              },
              (error: any) => {
                console.error('Error querying elevation:', error);
              }
            );
          }
        }
      } catch (error) {
        console.error('Error loading ArcGIS modules:', error);
      }
    };

    initializeMap();

    return () => {
      // Cleanup mapView and map instances when component unmounts
      if (mapView) {
        mapView.destroy();
      }
      if (map) {
        map.destroy();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <div ref={mapRef} style={styles.map} />
      {/*<div id="paneDiv" className="esri-widget">*/}
      {/*  <p>*/}
      {/*    Click on the map to add stops. The route along the stops is calculated and elevation values are queried to*/}
      {/*    update the following route statistics:*/}
      {/*  </p>*/}
      {/*  <div id="distanceDiv"><p>total distance: 0 km</p></div>*/}
      {/*  <div id="ascDiv"><p>total ascent: 0 m</p></div>*/}
      {/*  <div id="descDiv"><p>total descent: 0 m</p></div>*/}
      {/*</div>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: 600,
  },
});

export default ArcGISMap;