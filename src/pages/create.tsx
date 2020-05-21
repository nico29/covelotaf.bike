import NavigationBar from "../components/navbar";
import * as React from "react";
import { NextPage } from "next";
import { withApollo } from "../apollo/client";
import dynamic from "next/dynamic";
import Auth from "../components/auth";
import Head from "next/head";
import { useFormik } from "formik";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { MutationCreateRideArgs, Ride } from "../server/types";
import * as MapboxDirections from "@nico29/mapbox-gl-directions";
import { ApolloError } from "apollo-client";

const DirectionsInput = dynamic(() => import("../components/directions"), {
  ssr: false,
});

const CREATE_RIDE_MUTATION = gql`
  mutation CREATE_RIDE($input: CreateRideInput!) {
    createRide(input: $input) {
      id
    }
  }
`;
const CURRENT_USER_RIDES = gql`
  query CURRENT_USER_RIDES {
    currentUser {
      id
      rides {
        id
      }
    }
  }
`;

const ErrorMessage: React.FunctionComponent<{ error?: ApolloError }> = ({
  error,
}) => {
  if (!error) return null;
  const {
    graphQLErrors: [err],
  } = error;
  const message =
    err.message === "RIDE_TOO_SHORT"
      ? "Le trajet ne comporte pas assez de points"
      : err.message === "RIDE_NAME_REQUIRED"
      ? "Le trajet n'a pas de nom"
      : "Une erreur est survenue";

  return (
    <div className="mb-3 flex justify-center">
      <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        className="h-6 w-6 text-red-500"
      >
        <path
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
          fillRule="evenodd"
        ></path>
      </svg>
      <p className="text-sm text-red-500 italic">{message}</p>
    </div>
  );
};

const RideCreatedSuccessMessage: React.FunctionComponent = () => {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  }, []);
  return visible ? (
    <div
      className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold">🙌 🚴‍♀️</strong>
      <span className="block sm:inline">
        Votre trajet a bien été enregistré !
      </span>
    </div>
  ) : null;
};

const RideCreationPage: NextPage = () => {
  const [createRide, { loading, error: createRideError, data }] = useMutation<
    { createRide: Ride },
    MutationCreateRideArgs
  >(CREATE_RIDE_MUTATION, { refetchQueries: [{ query: CURRENT_USER_RIDES }] });
  const [directionPlugin, setDirectionPlugin] = React.useState<
    MapboxDirections
  >(null);
  const initialValues = {
    ridename: "",
    ridedescription: "",
    ridepoints: [],
    ridedistance: 0,
  };
  const formik = useFormik({
    initialValues,
    validate(values) {
      if (!values.ridename) {
        return { ridename: "Le nom du trajet est obligatoire" };
      }
    },
    validateOnChange: false,
    onSubmit(values, { setSubmitting, resetForm }) {
      createRide({
        variables: {
          input: {
            distance: values.ridedistance,
            name: values.ridename,
            points: values.ridepoints,
            description: values.ridedescription,
          },
        },
      }).then(() => {
        setSubmitting(false);
        resetForm();
        (document.querySelector(
          "#mapbox-directions-origin-input input"
        ) as HTMLInputElement).value = "";
        (document.querySelector(
          "#mapbox-directions-destination-input input"
        ) as HTMLInputElement).value = "";
        directionPlugin?.removeRoutes();
      });
    },
  });
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
          <h1 className="text-3xl tracking-wide ml-4 text-gray-800 font-semibold">
            Créer un trajet
          </h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col md:flex-row">
              <div className="p-4 md:w-3/12">
                <div>
                  <label
                    htmlFor="ridename"
                    className="block text-gray-700 uppercase text-xs font-medium mb-2"
                  >
                    Nom du trajet *
                  </label>
                  <input
                    type="text"
                    name="ridename"
                    id="ridename"
                    onChange={formik.handleChange}
                    placeholder="Kessel run"
                    className={`w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline ${
                      formik.errors.ridename ? "border-red-500" : ""
                    }`}
                    style={{ transition: "all .15s ease" }}
                  />
                  {formik.errors.ridename && (
                    <p className="text-red-500 text-xs italic mb-2">
                      {formik.errors.ridename}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="ridedescription"
                    className="block text-gray-700 uppercase text-xs font-medium mb-2"
                  >
                    Description du trajet
                  </label>
                  <textarea
                    name="ridedescription"
                    id="ridedescription"
                    onChange={formik.handleChange}
                    placeholder="Less than 12 parsecs"
                    className={`w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline`}
                    style={{ transition: "all .15s ease" }}
                  />
                </div>

                <ErrorMessage error={createRideError} />

                {data && <RideCreatedSuccessMessage />}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center mt-4 mb-4 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-2 md:text-sm md:px-4"
                >
                  Enregistrer
                  {loading && <span>...</span>}
                </button>
              </div>
              <div className="bg-gray-400 md:w-9/12 rounded overflow-hidden">
                <DirectionsInput
                  mapContainerID="direction-map"
                  style={{ minHeight: "80vh", position: "relative" }}
                  onMapLoad={(_, plugin) => {
                    setDirectionPlugin(plugin);
                  }}
                  onReceiveDirections={(points, distance) => {
                    formik.setFieldValue("ridepoints", points);
                    formik.setFieldValue("ridedistance", distance);
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </Auth>
  );
};
export default withApollo(RideCreationPage);
