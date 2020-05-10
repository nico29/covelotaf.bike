import * as React from "react";
import { Ride } from "../server/types";
import { toKM } from "../utils";

const RideListItem: React.FunctionComponent<{
  ride: Ride;
  onRideClicked?: (id: string) => void;
}> = ({ ride, onRideClicked }) => {
  return (
    <div className="w-full rounded shadow-sm p-2 mb-2">
      <div
        className="flex flex-row justify-between cursor-pointer"
        onClick={() => onRideClicked && onRideClicked(ride.id)}
      >
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-lg text-gray-700 hover:text-gray-600">
            {ride.name}{" "}
          </p>
          <span
            className="rounded h-2 w-2"
            style={{ backgroundColor: ride.color }}
          />
        </div>
        <p className="text-gray-500 text-sm">{toKM(ride.distance)}</p>
      </div>
      <div className="flex items-center space-x-2 text-gray-600">
        <p>{ride.creator.username}</p>
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
        </svg>
      </div>
      <p className="text-gray-500 mt-2">{ride.description}</p>
    </div>
  );
};

export default RideListItem;
