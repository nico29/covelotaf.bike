import * as React from "react";
import { NextPage } from "next";
import { withApollo } from "../../apollo/client";
import { useRouter } from "next/router";
import Auth from "../../components/auth";
import Head from "next/head";
import NavigationBar from "../../components/navbar";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { QueryRideArgs, Ride } from "../../server/types";
import dynamic from "next/dynamic";
import { toKM } from "../../utils";
import RideCreatorContactForm from "../../components/RideCreatorContactForm";
const RideMap = dynamic(() => import("../../components/RideMap"), {
  ssr: false,
});

const RIDE_BY_ID_QUERY = gql`
  query RIDE_BY_ID($id: ID!) {
    ride(id: $id) {
      id
      name
      description
      distance
      color
      start
      finish
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

const RideDetailPage: NextPage = () => {
  const router = useRouter();
  const [showContactForm, setShowContactForm] = React.useState(false);
  const { data, loading, error } = useQuery<{ ride: Ride }, QueryRideArgs>(
    RIDE_BY_ID_QUERY,
    {
      variables: { id: router.query.rideID as string },
      ssr: false,
    }
  );

  if (error) router.replace("/");
  console.log(error);
  if (loading)
    return <p className="text-center mt-4">Chargement de votre trajet...</p>;

  const { ride } = data;

  return (
    <Auth>
      <Head>
        <link
          key="mapbox-global-css"
          href="https://api.mapbox.com/mapbox-gl-js/v1.10.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <main className="min-h-screen">
        <NavigationBar />

        <div className="p-4 h-full">
          <div className="flex flex-col md:flex-row">
            <div className="p-4 md:w-3/12">
              <h1 className="text-3xl tracking-wide ml-4 mb-3 text-gray-800 font-semibold">
                Détails du trajet
              </h1>
              <div
                className="overflow-y-scroll ml-4"
                style={{ maxHeight: "75vh" }}
              >
                <div className="text-gray-700 ">
                  <div className="mt-2 mb-2">
                    <span className="font-semibold text-sm">
                      Nom du trajet :{" "}
                    </span>
                    <span className="text-lg">{ride.name}</span>
                  </div>
                  <div className="mt-2 mb-2">
                    <span className="font-semibold text-sm">Distance : </span>
                    <span className="text-sm">{toKM(ride.distance)}</span>
                  </div>
                  <div className="mt-2 mb-2">
                    <div>
                      <span className="font-semibold text-sm">Départ : </span>
                      <span>{ride.start}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-sm">Arrivée : </span>
                      <span>{ride.finish}</span>
                    </div>
                  </div>
                  <div className="mt-2 mb-2">
                    <p className="font-semibold text-sm">
                      {" "}
                      Créé par {ride.creator.username}
                    </p>
                  </div>
                  <button
                    className="w-full flex items-center justify-center mt-4 mb-4 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-2 md:text-sm md:px-4"
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    Contacter {ride.creator.username}
                  </button>
                  {showContactForm && (
                    <RideCreatorContactForm rideCreatorID={ride.creator.id} />
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-400 md:w-9/12 rounded overflow-hidden">
              <RideMap
                rides={[ride]}
                mapContainerID="rides-map"
                style={{ minHeight: "85vh", position: "relative" }}
                focusedRide={ride.id}
              />
            </div>
          </div>
        </div>
      </main>
    </Auth>
  );
};

export default withApollo(RideDetailPage);
