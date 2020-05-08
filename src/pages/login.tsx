import NavigationBar from "../components/navbar";
import * as React from "react";
import { withApollo } from "../apollo/client";
import { NextPage } from "next";
import { useFormik } from "formik";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { User, MutationLoginArgs } from "../server/types";
import Router from "next/router";
import Link from "next/link";
import { PASSWORD_REGEX } from "../config";
import { isNonNullType } from "graphql";

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

const ErrorMessage: React.FunctionComponent<{ error?: Error }> = ({
  error,
}) => {
  if (!error) return null;
  const message =
    error.message === "INVALID_CREDENTIALS"
      ? "Les identifiants sont incorrects"
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

const LoginPage: NextPage = () => {
  const [login, { loading, error: loginError }] = useMutation<
    User,
    MutationLoginArgs
  >(LOGIN_MUTATION, { refetchQueries: [{ query: CURRENT_USER_QUERY }] });
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate(values) {
      const errors: { email?: string; password?: string } = {};

      if (!values.password) {
        errors.password = "Votre mot de passe est requis";
      }

      if (!values.email) {
        errors.email = "Votre email est requis";
      }
      return errors;
    },
    onSubmit(values, { setSubmitting }) {
      try {
        login({ variables: { ...values } }).then(() => {
          setSubmitting(false);
          Router.push("/");
        });
      } catch {
        alert("fail");
      }
    },
  });
  return (
    <main>
      <NavigationBar />
      <section className="container flex content-center items-center justify-center mx-auto py-20">
        <div className="w-full lg:w-5/12 p-8 rounded shadow-lg bg-white">
          <h1 className="text-xl mb-4 textgray-600">Se connecter</h1>
          <ErrorMessage error={loginError} />
          <div className="divide-y divide-gray-400">
            <form onSubmit={formik.handleSubmit} className="pb-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 uppercase text-xs font-medium mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  name="email"
                  id="email"
                  placeholder="tim.cook@apple.com"
                  className={`w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline ${
                    formik.errors.email ? "border-red-500" : ""
                  }`}
                  style={{ transition: "all .15s ease" }}
                />
                {formik.errors.email && (
                  <p className="text-red-500 text-xs italic mb-2">
                    {formik.errors.email}
                  </p>
                )}
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
                  className={`w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline ${
                    formik.errors.password ? "border-red-500" : ""
                  }`}
                  style={{ transition: "all .15s ease" }}
                />

                {formik.errors.password && (
                  <p className="text-red-500 text-xs italic mb-2">
                    {formik.errors.password}
                  </p>
                )}
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
            <Link href="/reset">
              <a className="block pt-4 text-center text-sm text-gray-600 w-full hover:text-gray-500">
                Mot de passe oublié
              </a>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
export default withApollo(LoginPage);
