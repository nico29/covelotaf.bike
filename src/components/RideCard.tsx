import { Ride, MutationDeleteRideArgs } from "../server/types";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

export const DELETE_RIDE_MUTATION = gql`
  mutation DELETE_RIDE($id: ID!) {
    deleteRide(id: $id) {
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

const RideCard: React.FunctionComponent<{ ride: Ride }> = ({ ride }) => {
  const [deleteRide, { loading: deleteLoading }] = useMutation<
    { ride: Ride },
    MutationDeleteRideArgs
  >(DELETE_RIDE_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_RIDES }],
  });
  return (
    <div className="max-w-md bg-white shadow-lg border border-solid border-gray-400 rounded overflow-hidden">
      <img
        src={ride.previewURL}
        alt="preview d'un itinéraire"
        className="w-full"
      />
      <div className="px-6 py-4">
        <p className="font-bold text-xl mb-2">{ride.name}</p>
        <p className="text-gray-600 h-6">
          {ride.description
            ? ride.description
            : "Pas de description pour ce trajet"}
        </p>
        <div className="mt-3 flex">
          <button
            disabled={deleteLoading}
            className="flex flex-row items-center px-3 py-2 bg-red-500 rounded-md text-base font-medium text-white hover:bg-red-400 focus:outline-none focus:text-white focus:bg-red-600"
            onClick={async () => {
              await deleteRide({ variables: { id: ride.id } });
            }}
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
            {deleteLoading ? "Supression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideCard;
