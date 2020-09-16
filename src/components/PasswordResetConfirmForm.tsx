import * as React from "react";
import { useFormik } from "formik";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { MutationRequestPasswordResetArgs } from "../server/types";

import { ApolloError } from "apollo-client";

const PASSWORD_RESET_MUTATION = gql`
  mutation PASSWORD_RESET($input: ResetPasswordInput!) {
    resetPassword(email: $email) {
      user {
        id
        username
        firstname
        lastname
      }
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
  const message =
    err.message === "INVALID_CREDENTIALS"
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

const PasswordResetConfirmForm: React.FunctionComponent<{
  resetToken: string;
}> = ({ resetToken }) => {
  const [requestReset, { error, loading }] = useMutation<
    { requestPasswordReset: boolean },
    MutationRequestPasswordResetArgs
  >(PASSWORD_RESET_MUTATION);
  const formik = useFormik({
    initialValues: { email: "" },
    validateOnChange: false,
    validate(values) {
      if (!values.email) return { email: "L'email est obligatoire" };
    },
    onSubmit(values, { setSubmitting }) {
      requestReset({ variables: { ...values } }).then(() => {
        setSubmitting(false);
      });
    },
  });

  return (
    <section className="container flex content-center items-center justify-center mx-auto py-20">
      <div className="w-full lg:w-5/12 p-8 rounded shadow-lg bg-white">
        <h1 className="text-xl mb-4 textgray-600">
          Réinitialiser le mot de passe
        </h1>
        <ErrorMessage error={error} />
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center mt-4 mb-4 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-2 md:text-sm md:px-4"
            >
              {!loading && <span>Réinitialiser le mot de passe</span>}
              {loading && <span>Réinitialisation...</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PasswordResetConfirmForm;
