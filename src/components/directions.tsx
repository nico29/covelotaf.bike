import * as React from "react";
import Mapbox from "mapbox-gl";
import * as MapboxDirections from "@nico29/mapbox-gl-directions";
import polyline from "@mapbox/polyline";
import { Point } from "../server/types";

export interface DirectionInputProps {
  onMapLoad?: (map: Mapbox.Map, plugin: MapboxDirections) => void;
  onReceiveDirections?: (points: Point[], distance: number) => void;
  mapContainerID: string;
  style?: React.CSSProperties;
}
class DirectionsManager extends React.PureComponent<DirectionInputProps> {
  private map: Mapbox.Map;
  private directions: MapboxDirections;
  private zoomControl: Mapbox.NavigationControl;

  componentDidMount() {
    const { mapContainerID, onMapLoad, onReceiveDirections } = this.props;
    // 0. set access token to use API
    Mapbox.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
    // 1. create the map entity
    this.map = new Mapbox.Map({
      container: mapContainerID,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [2.3488, 48.8534],
      zoom: 11,
    });

    // 2. bind controls
    this.zoomControl = new Mapbox.NavigationControl({ showCompass: false });
    this.map.addControl(this.zoomControl, "top-right");

    // 3. init the direction plugin
    this.directions = new MapboxDirections({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string,
      unit: "metric",
      profile: "mapbox/cycling",
      steps: false,
      geometries: "polyline",
      placeholderOrigin: "Choisissez un point de départ",
      placeholderDestination: "Choisissez un point d'arrivée",
      controls: { inputs: true, instructions: false, profileSwitcher: false },
    });
    // 4. register the plugin to the mao instance
    this.map.addControl(this.directions, "top-left");

    onMapLoad && onMapLoad(this.map, this.directions);

    onReceiveDirections &&
      this.directions.on(
        "route",
        (event: {
          route: { distance: number; geometry: string; [key: string]: any }[];
        }) => {
          const points = polyline.decode(event.route[0].geometry);
          // shape points
          const formattedPoints: Point[] = points.map(
            (tupple: [number, number]) => ({
              latitude: tupple[0],
              longitude: tupple[1],
            })
          );
          onReceiveDirections &&
            onReceiveDirections(formattedPoints, event.route[0].distance);
        }
      );
  }

  render() {
    return (
      <div
        id={this.props.mapContainerID}
        className="relative"
        style={this.props.style}
      />
    );
  }
}

export default DirectionsManager;
