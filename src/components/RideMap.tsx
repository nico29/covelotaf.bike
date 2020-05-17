import Mapbox, { GeoJSONSource } from "mapbox-gl";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Ride, Maybe } from "../server/types";

interface RideMapProps {
  mapContainerID: string;
  onLoad?: (...args: any[]) => void;
  focusedRide?: string;
  rides?: Ride[];
  style?: React.CSSProperties;
  onRideClicked?: (id: string) => void;
}

class RidesMap extends React.Component<RideMapProps> {
  private map: Mapbox.Map;
  private zoomControl: Mapbox.NavigationControl;
  private geoControl: Mapbox.GeolocateControl;

  private computeMapData(props: RideMapProps) {
    return {
      type: "FeatureCollection",
      features: props.rides
        .map((ride) => {
          const coordinates = ride.points.map(({ latitude, longitude }) => [
            longitude,
            latitude,
          ]);
          return {
            type: "Feature",
            properties: {
              focused: `${props.focusedRide === ride.id}`,
              color: ride.color,
              name: ride.name,
              description: ride.description,
              id: ride.id,
              creator: ride.creator,
              distance: ride.distance,
            },
            geometry: {
              type: "LineString",
              coordinates,
            },
          };
        })
        .sort((f1, f2) =>
          // NOTE: features are rendered in the order they appear in the array
          f1.properties.focused > f2.properties.focused ? 1 : -1
        ),
    };
  }

  private getYStart(props: RideMapProps) {
    if (props.focusedRide) {
      let getFocused = props.rides.find(
        (ride) => ride.id === props.focusedRide
      );
      return getFocused.points[0].latitude;
    }
  }

  private getXStart(props: RideMapProps) {
    if (props.focusedRide) {
      let getFocused = props.rides.find(
        (ride) => ride.id === props.focusedRide
      );

      return getFocused.points[0].longitude;
    }
  }

  private getYEnd(props: RideMapProps) {
    if (props.focusedRide) {
      let getFocused = props.rides.find(
        (ride) => ride.id === props.focusedRide
      );

      return getFocused.points[getFocused.points.length - 1].latitude;
    }
  }

  private getXEnd(props: RideMapProps) {
    if (props.focusedRide) {
      let getFocused = props.rides.find(
        (ride) => ride.id === props.focusedRide
      );

      return getFocused.points[getFocused.points.length - 1].longitude;
    }
  }

  componentDidMount() {
    Mapbox.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

    this.map = new Mapbox.Map({
      container: this.props.mapContainerID,
      style: "mapbox://styles/mapbox/streets-v11",
      // TODO: center on user location
      center: [2.3488, 48.8534],
      zoom: 10,
    });

    // Add zoom control to the map.
    this.zoomControl = new Mapbox.NavigationControl({ showCompass: false });
    this.map.addControl(this.zoomControl, "top-right");

    // Add geolocate control to the map
    this.geoControl = new Mapbox.GeolocateControl({
      fitBoundsOptions: {
        maxZoom: 11,
      },
      showAccuracyCircle: false,
    });
    this.map.addControl(this.geoControl, "top-right");

    this.map.on("load", () => {
      this.map.addSource("rides-source", {
        type: "geojson",
        data: this.computeMapData(this.props) as any,
      });

      this.map.addLayer({
        id: "rides",
        type: "line",
        source: "rides-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-width": ["match", ["get", "focused"], "true", 6, 5],
          "line-color": ["get", "color"],
          "line-opacity": ["match", ["get", "focused"], "true", 1, 0.6],
        },
      });

      this.map.on("mouseenter", "rides", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });

      // Curseur normal quand on quitte un trajet
      this.map.on("mouseleave", "rides", () => {
        this.map.getCanvas().style.cursor = "";
      });

      this.map.on("click", "rides", (event) => {
        const features = this.map.queryRenderedFeatures(event.point);
        this.map.getCanvas().style.cursor = features.length ? "pointer" : "";
        const rideLayer = features.find((f) => f.layer.id === "rides");
        const ride = rideLayer?.properties as Maybe<Ride>;
        this.props.onRideClicked && this.props.onRideClicked(ride.id);
      });
    });
  }

  shouldComponentUpdate(nextProps: RideMapProps) {
    const source = this.map.getSource("rides-source") as GeoJSONSource;

    source.setData(this.computeMapData(nextProps) as any);
    if (nextProps.focusedRide) {
      this.map.fitBounds(
        [
          [this.getXStart(nextProps), this.getYStart(nextProps)],
          [this.getXEnd(nextProps), this.getYEnd(nextProps)],
        ],
        {
          padding: 40,
        }
      );
    }
    return true;
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div id={this.props.mapContainerID} style={this.props.style} />;
  }
}

export default RidesMap;
