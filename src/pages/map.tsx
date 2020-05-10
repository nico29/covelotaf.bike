import NavigationBar from "../components/navbar";
import * as React from "react";
import { withApollo } from "../apollo/client";
import { NextPage } from "next";
import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Ride } from "../server/types";
import RideListItem from "../components/RideListItem";
import Head from "next/head";
import dynamic from "next/dynamic";

const RideMap = dynamic(() => import("../components/RideMap"), {
  ssr: false,
});

const ALL_RIDES_QUERY = gql`
  query ALL_RIDES {
    rides {
      id
      name
      description
      distance
      color
      creator {
        id
        username
        lastname
        firstname
      }
      points {
        latitude
        longitude
      }
    }
  }
`;

const RidesMapPage: NextPage = () => {
  const { data } = useQuery<{ rides: Ride[] }>(ALL_RIDES_QUERY);
  const [selectedRide, setSelectedRide] = React.useState<string>(null);
  return (
    <main className="min-h-screen">
      <Head>
        <link
          key="mapbox-global-css"
          href="https://api.mapbox.com/mapbox-gl-js/v1.10.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <NavigationBar />
      <div className="p-4 h-full">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:w-3/12">
            <Link href="/create">
              <a className=" flex items-center justify-center mt-4 mb-4 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-2 md:text-sm md:px-4">
                Créer un trajet
              </a>
            </Link>
            <h1 className="text-3xl tracking-wide ml-4 text-gray-800 font-semibold">
              Liste des trajets
            </h1>
            <div className="overflow-y-scroll" style={{ maxHeight: "75vh" }}>
              {data?.rides.map((r) => (
                <RideListItem
                  ride={r}
                  key={r.id}
                  onRideClicked={setSelectedRide}
                />
              ))}
            </div>
          </div>
          <div className="bg-gray-400 md:w-9/12 rounded overflow-hidden">
            <RideMap
              rides={data?.rides}
              mapContainerID="rides-map"
              style={{ minHeight: "100%", position: "relative" }}
              focusedRide={selectedRide}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default withApollo(RidesMapPage);
