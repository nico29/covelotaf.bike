import NavigationBar from "../components/navbar";
import * as React from "react";
import { withApollo } from "../apollo/client";
import { NextPage } from "next";
import { useFormik, Formik } from "formik";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { User, MutationLoginArgs } from "../server/types";
import Router from "next/router";
import Link from "next/link";

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

const LoginPage: NextPage = () => {
  const [login, { loading, error: mutationError }] = useMutation<
    User,
    MutationLoginArgs
  >(LOGIN_MUTATION, { refetchQueries: [{ query: CURRENT_USER_QUERY }] });
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    async onSubmit(values, { setSubmitting }) {
      await login({ variables: { ...values } });
      setSubmitting(false);
      Router.push("/");
    },
  });
  return (
    <main>
      <NavigationBar />
      <section className="container flex content-center items-center justify-center mx-auto py-20">
        <div className="w-full lg:w-5/12 p-8 rounded shadow-lg bg-white">
          <h1 className="text-xl mb-3 textgray-600">Se connecter</h1>
          <div className="divide-y divide-gray-400">
            <form onSubmit={formik.handleSubmit} className="pb-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 uppercase text-xs font-medium mb-2"
                >
                  Email
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
                  Mot de passe
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
