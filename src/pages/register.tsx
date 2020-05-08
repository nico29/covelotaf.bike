import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import gql from "graphql-tag";
import { NextPage } from "next";
import Router from "next/router";
import * as React from "react";
import { withApollo } from "../apollo/client";
import NavigationBar from "../components/navbar";
import {
  RegisterUserInput,
  User,
  MutationRegisterUserArgs,
} from "../server/types";

const REGISTER_MUTATION = gql`
  mutation REGISTER_USER($input: RegisterUserInput!) {
    registerUser(input: $input) {
      id
    }
  }
`;

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

const RegisterPage: NextPage = () => {
  const [register, { loading }] = useMutation<User, MutationRegisterUserArgs>(
    REGISTER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      username: "",
    },
    async onSubmit(values, { setSubmitting }) {
      await register({ variables: { input: { ...values } } });
      setSubmitting(false);
      Router.push("/");
    },
  });
  return (
    <main>
      <NavigationBar />
      <section className="container flex content-center items-center justify-center mx-auto py-20">
        <div className="w-full lg:w-5/12 p-8 rounded shadow-lg bg-white">
          <h1 className="text-xl mb-3 textgray-600">Créer un compte</h1>
          <div>
            <form onSubmit={formik.handleSubmit} className="pb-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 uppercase text-xs font-medium mb-2"
                >
                  Email *
                </label>
                <input
                  type="text"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  name="email"
                  id="email"
                  placeholder="tim.cook@apple.com"
                  className="w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline"
                  style={{ transition: "all .15s ease" }}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 uppercase text-xs font-medium mb-2"
                >
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  name="password"
                  id="password"
                  placeholder="*********"
                  className="w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline"
                  style={{ transition: "all .15s ease" }}
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-700 uppercase text-xs font-medium mb-2"
                >
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  name="username"
                  id="username"
                  placeholder="tim.cook"
                  className="w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline"
                  style={{ transition: "all .15s ease" }}
                />
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    htmlFor="firstname"
                    className="block text-gray-700 uppercase text-xs font-medium mb-2"
                  >
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    name="firstname"
                    id="firstname"
                    placeholder="Tim"
                    className="w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline"
                    style={{ transition: "all .15s ease" }}
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label
                    htmlFor="lastname"
                    className="block text-gray-700 uppercase text-xs font-medium mb-2"
                  >
                    Nom de famille
                  </label>
                  <input
                    type="text"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    name="lastname"
                    id="lastname"
                    placeholder="Cook"
                    className="w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline"
                    style={{ transition: "all .15s ease" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center mt-4 mb-4 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-2 md:text-sm md:px-4"
              >
                Se connecter
                {loading && <span>...</span>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default withApollo(RegisterPage);
