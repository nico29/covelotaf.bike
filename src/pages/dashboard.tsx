import { NextPage } from "next";
import { withApollo } from "../apollo/client";
import gql from "graphql-tag";
import Auth from "../components/auth";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { User } from "../server/types";
import NavigationBar from "../components/navbar";
import RideCard from "../components/RideCard";
import { useRouter } from "next/router";
import DashboardEmptyRide from "../components/DashboardEmptyRide";

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER {
    currentUser {
      id
      email
      firstname
      lastname
      username
      rides {
        id
        name
        description
        distance
        color
        start
        previewURL
        finish
        points {
          latitude
          longitude
        }
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

const DasboardPage: NextPage = () => {
  const { data, loading } = useQuery<{ currentUser: User }>(
    CURRENT_USER_QUERY,
    {
      ssr: false,
    }
  );
  const [logout, { loading: loginOut }] = useMutation(LOGOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const router = useRouter();

  if (loading)
    return (
      <Auth>
        <NavigationBar />
        <p>Chargement de votre profil</p>
      </Auth>
    );

  const { currentUser: user } = data;
  if (!user) router.replace("/login");
  return (
    <Auth>
      <main className="min-h-screen">
        <NavigationBar />
        <div className="p-4">
          <div className="ml-4">
            <h1 className="text-3xl tracking-wide text-gray-800 font-semibold mb-4">
              Mes informations
            </h1>
            <button
              className="ml-4 mb-4 flex flex-row items-center px-3 py-2 bg-indigo-500 rounded-md text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:text-white focus:bg-indigo-600"
              onClick={async () => {
                await logout();
                router.replace("/");
              }}
            >
              <svg
                className="h-4 w-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
              Déconnexion{loginOut ? "..." : ""}
            </button>
            <div className="space-y-2 ml-4">
              <div className="flex flex-row items-center">
                <p className="font-semibold text-gray-700 text-lg">
                  Email :&nbsp;
                </p>
                <p className="">{user.email}</p>
              </div>
              <div className="flex flex-row items-center">
                <p className="font-semibold text-gray-700 text-lg">
                  Nom d'utilisateur :&nbsp;
                </p>
                <p>{user.username}</p>
              </div>
              <div className="flex flex-row items-center">
                <p className="font-semibold text-gray-700 text-lg">
                  Prénom :&nbsp;
                </p>
                <p>
                  {user.firstname
                    ? user.firstname
                    : "Vous n'avez pas renseigné de prénom"}
                </p>
              </div>
              <div className="flex flex-row items-center">
                <p className="font-semibold text-gray-700 text-lg">
                  Nom de famille :&nbsp;
                </p>
                <p>
                  {user.lastname
                    ? user.lastname
                    : "Vous n'avez pas renseigné de nom de famille"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-3xl tracking-wide ml-4 text-gray-800 font-semibold mb-4">
              Mes trajets
            </h1>
            <div>
              {!user.rides || (!user?.rides.length && <DashboardEmptyRide />)}
              <div className="grid sm:md:grid-cols-1 md:grid-cols-3 gap-4 ml-4">
                {user.rides?.map((ride) => (
                  <RideCard ride={ride} key={ride.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Auth>
  );
};

export default withApollo(DasboardPage);
