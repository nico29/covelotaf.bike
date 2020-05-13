import { NextPage } from "next";
import { withApollo } from "../apollo/client";
import gql from "graphql-tag";
import Auth from "../components/auth";
import { useQuery } from "@apollo/react-hooks";
import { User } from "../server/types";
import NavigationBar from "../components/navbar";
import RideCard from "../components/RideCard";
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

const DasboardPage: NextPage = () => {
  const { data, loading } = useQuery<{ currentUser: User }>(
    CURRENT_USER_QUERY,
    {
      ssr: false,
    }
  );
  if (loading)
    return (
      <Auth>
        <NavigationBar />
        <p>Chargement de votre profil</p>
      </Auth>
    );

  const { currentUser: user } = data;

  return (
    <Auth>
      <main className="min-h-screen">
        <NavigationBar />
        <div className="p-4">
          <div className="ml-4">
            <h1 className="text-3xl tracking-wide text-gray-800 font-semibold mb-4">
              Mes informations
            </h1>
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
              <div className="grid grid-cols-3 gap-4 ml-4">
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
