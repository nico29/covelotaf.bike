import NavigationBar from "../components/navbar";
import Link from "next/link";
import { withApollo } from "../apollo/client";

const HomePage = () => (
  <main className="min-h-screen">
    <NavigationBar />
    <section className="lg:flex xs:flex-col h-screen items-center">
      <div className="bg-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-700 sm:text-5xl sm:leading-none md:text-6xl">
                Roulez à plusieurs
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Le trajet sera beaucoup plus sympa
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/map">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                      Explorer les trajets
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img className="lg:w-1/2 sm:mt-4" src="/home_hero_picture.svg" alt="" />
    </section>
  </main>
);

export default withApollo(HomePage);
