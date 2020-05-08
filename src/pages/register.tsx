import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import gql from "graphql-tag";
import { NextPage } from "next";
import Router from "next/router";
import * as React from "react";
import { withApollo } from "../apollo/client";
import NavigationBar from "../components/navbar";
import { User, MutationRegisterUserArgs } from "../server/types";
import { PASSWORD_REGEX } from "../config";
import { ApolloError } from "apollo-client";

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

const ErrorMessage: React.FunctionComponent<{ error?: ApolloError }> = ({
  error,
}) => {
  if (!error) return null;
  const {
    graphQLErrors: [err],
  } = error;
  let message: string;

  if (err.message === "EMAIL_TAKEN") {
    message = "Cet email n'est pas disponible";
  } else if (err.message === "USERNAME_TAKEN") {
    message = "Ce nom d'utilisateur n'est pas disponible";
  } else if (err.message === "PASSWORD_WEAK") {
    message = "Le mot de passe est trop faible";
  } else {
    message = "Une erreur est survenue";
  }

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

const RegisterPage: NextPage = () => {
  const [register, { loading, error: registerError }] = useMutation<
    User,
    MutationRegisterUserArgs
  >(REGISTER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      username: "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    validate(values) {
      const errors: {
        email?: string;
        password?: string;
        username?: string;
      } = {};

      if (!values.password.match(PASSWORD_REGEX)) {
        errors.password = "Mot de passe trop faible";
      }

      if (!values.email || !values.email.includes("@")) {
        errors.email = "L'adresse email est invalide";
      }

      if (!values.username) {
        errors.username = "Il vous faut un nom d'utilisateur !";
      }
      return errors;
    },
    onSubmit(values, { setSubmitting }) {
      register({ variables: { input: { ...values } } }).then(() => {
        setSubmitting(false);
        Router.push("/");
      });
    },
  });
  return (
    <main>
      <NavigationBar />
      <section className="container flex content-center items-center justify-center mx-auto py-20">
        <div className="w-full lg:w-5/12 p-8 rounded shadow-lg bg-white">
          <h1 className="text-xl mb-4 textgray-600">Créer un compte</h1>
          <ErrorMessage error={registerError} />
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
                  className={`w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline ${
                    formik.errors.username ? "border-red-500" : ""
                  }`}
                  style={{ transition: "all .15s ease" }}
                />

                {formik.errors.username && (
                  <p className="text-red-500 text-xs italic mb-2">
                    {formik.errors.username}
                  </p>
                )}
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
                Créer un compte
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
