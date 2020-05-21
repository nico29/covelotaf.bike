import * as React from "react";
import { Ride } from "../server/types";
import { toKM } from "../utils";
import Link from "next/link";

const RideListItem: React.FunctionComponent<{
  ride: Ride;
  onRideClicked?: (id: string) => void;
  focused?: boolean;
}> = ({ ride, onRideClicked, focused }) => {
  return (
    <div
      id={`ride-${ride.id}`}
      className={`w-full rounded shadow-sm p-2 mb-2 bg-white border border-solid ${
        focused ? "border-gray-600" : "border-gray-400"
      }`}
    >
      <div
        className="flex flex-row justify-between items-center cursor-pointer"
        onClick={() => onRideClicked && onRideClicked(ride.id)}
      >
        <div className="flex items-center space-x-2">
          <span
            className="rounded h-2 w-2"
            style={{ backgroundColor: ride.color }}
          />
          <p className="font-semibold text-lg text-gray-700 hover:text-gray-600">
            {ride.name}
          </p>
        </div>
        <p className="text-gray-500 text-sm">{toKM(ride.distance)}</p>
      </div>
      <div className="mt-2 mb-2">
        <div className="text-gray-700 ">
          <span className="font-semibold text-sm">Départ : </span>
          <span>{ride.start}</span>
        </div>
        <div className="text-gray-700 ">
          <span className="font-semibold text-sm">Arrivée : </span>
          <span>{ride.finish}</span>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2 text-gray-700">
        <p>De {ride.creator.username}</p>
        <div className="cursor-pointer">
          <Link href={`/ride/${ride.id}`}>
            <a>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RideListItem;
