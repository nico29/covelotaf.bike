import Mapbox, { GeoJSONSource } from "mapbox-gl";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Ride, Maybe } from "../server/types";
import RideMapRideDetailCard from "./RideMapRideDetailCard";

interface RideMapProps {
  mapContainerID: string;
  onLoad?: (...args: any[]) => void;
  focusedRide?: string;
  rides?: Ride[];
  style?: React.CSSProperties;
}

class RidesMap extends React.Component<
  RideMapProps,
  { showingTooltip: boolean }
> {
  private map: Mapbox.Map;
  private zoomControl: Mapbox.NavigationControl;
  private geoControl: Mapbox.GeolocateControl;
  private tooltipContainer: HTMLDivElement;

  constructor(props: RideMapProps) {
    super(props);
    this.state = {
      showingTooltip: false,
    };
  }

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

  private toggleRideTooltip(ride?: Ride) {
    if (ride) {
      ReactDOM.render(
        React.createElement(RideMapRideDetailCard, {
          ride,
        }),
        this.tooltipContainer
      );
      this.setState({ showingTooltip: true });
    } else {
      this.hideRideTooltip();
    }
  }

  private hideRideTooltip() {
    ReactDOM.unmountComponentAtNode(this.tooltipContainer);
    this.setState({ showingTooltip: false });
  }

  componentDidMount() {
    Mapbox.accessToken = process.env.MAPBOX_TOKEN as string;

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
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        maxZoom: 11,
      },
      trackUserLocation: true,
    });
    this.map.addControl(this.geoControl, "top-right");

    this.map.on("load", () => {
      // Container to put React generated content in.
      this.tooltipContainer = document.createElement("div");

      const tooltip = new Mapbox.Marker(this.tooltipContainer, {
        offset: [-120, 0],
      })
        .setLngLat([0, 0])
        .addTo(this.map);

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
          "line-width": ["match", ["get", "focused"], "true", 6, 4],
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
        tooltip.setLngLat(event.lngLat);
        this.map.getCanvas().style.cursor = features.length ? "pointer" : "";
        const rideLayer = features.find((f) => f.layer.id === "rides");
        const ride = rideLayer?.properties as Maybe<Ride>;
        try {
          ride.creator = JSON.parse((ride.creator as unknown) as string);
          this.toggleRideTooltip(ride);
        } catch {
          this.toggleRideTooltip(null);
        }
      });

      this.map.on("click", (event) => {
        const features = this.map.queryRenderedFeatures(event.point);
        // check if the click was made outside the "rides" layer
        const topFeature = features[0];
        if (
          !topFeature ||
          (topFeature &&
            topFeature.layer.id !== "rides" &&
            this.state.showingTooltip)
        ) {
          event.preventDefault();
          this.hideRideTooltip();
        }
      });
    });
  }

  shouldComponentUpdate(nextProps: RideMapProps) {
    const source = this.map.getSource("rides-source") as GeoJSONSource;

    source.setData(this.computeMapData(nextProps) as any);

    if (nextProps.focusedRide) {
      // this.map.flyTo({ center: [this.getXStart(nextProps), this.getYStart(nextProps)] });
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
