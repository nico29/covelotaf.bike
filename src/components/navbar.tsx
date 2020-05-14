import * as React from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { User } from "../server/types";
import { useRouter } from "next/router";

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER {
    currentUser {
      id
      username
      firstname
      email
    }
  }
`;

const AuthButton: React.FunctionComponent<{
  text: "Connexion" | "Créer un compte";
}> = ({ text }) => {
  const href = text === "Connexion" ? "/login" : "/register";
  return (
    <div className="sm:flex sm:justify-center lg:justify-start">
      <div className="rounded-md shadow">
        <Link href={href}>
          <a className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-2 md:text-sm md:px-4">
            {text}
          </a>
        </Link>
      </div>
    </div>
  );
};
const ConnectionSubmenu: React.FunctionComponent<{ user?: User }> = ({
  user,
}) => {
  const router = useRouter();
  const pathname = router.pathname.replace("/", "");

  if (user) return null;
  if (pathname === "login") {
    return <AuthButton text="Créer un compte" />;
  } else if (pathname === "register") {
    return <AuthButton text="Connexion" />;
  } else {
    return (
      <>
        <AuthButton text="Connexion" />
        <AuthButton text="Créer un compte" />
      </>
    );
  }
};

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const { data } = useQuery<{ currentUser?: User }>(CURRENT_USER_QUERY, {
    ssr: false,
  });
  const user = data?.currentUser;
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="uppercase font-bold text-white">covelotaf.bike</a>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user && (
                <div className="flex items-center text-sm rounded-full text-white  hover:text-gray-400 focus:outline-none focus:shadow-solid ">
                  <Link href="/dashboard">
                    <a className="font-semibold pl-2">
                      {user && user.username}
                    </a>
                  </Link>
                </div>
              )}
              {!user && (
                <div className="flex flex-row items-center space-x-2">
                  <ConnectionSubmenu user={user} />
                </div>
              )}
            </div>
          </div>

          {/* responsive menu toggle */}
          <div className="-mr-2 flex md:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <svg
                className="block h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* responsive menu */}
      <div className={`${!navbarOpen ? "hidden md:hidden" : "block md:block"}`}>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 "
                src="/bike_icon.png"
                alt="bicycle icon"
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium leading-none text-white">
                {user && user.username}
              </div>
              <div className="mt-1 text-sm font-medium leading-none text-gray-400">
                {user && user.email}
              </div>
            </div>
          </div>
          <div className="mt-3 px-2">
            {user && (
              <Link href="/dashboard">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">
                  Dashboard
                </a>
              </Link>
            )}
            {!user && (
              <>
                <Link href="/login">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">
                    Connexion
                  </a>
                </Link>
                <Link href="/register">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">
                    Se créer un compte
                  </a>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
