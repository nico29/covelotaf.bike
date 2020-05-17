import * as React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useFormik } from "formik";
import { MutationContactRideCreatorArgs } from "../server/types";

const CONTACT_RIDE_CREATOR_MUTATION = gql`
  mutation CONTACT_RIDE_CREATOR($input: ContactRideCreatorInput!) {
    contactRideCreator(input: $input)
  }
`;
const RideCreatorContactForm: React.FunctionComponent<{
  rideCreatorID: string;
}> = () => {
  const [contactCreator, { error, loading }] = useMutation<
    { contactRideCreator: boolean },
    MutationContactRideCreatorArgs
  >(CONTACT_RIDE_CREATOR_MUTATION);
  const formik = useFormik({
    initialValues: {
      mailContent: "",
      mailSubject: "",
    },
    validate(values) {
      const errors: typeof values = { mailContent: "", mailSubject: "" };
      if (!values.mailContent)
        errors.mailContent = "Vous devenez définir un objet pour le mail";
      if (!values.mailSubject)
        errors.mailSubject = "Vous devenez définir un contenu pour le mail";
      return errors;
    },
    validateOnChange: false,
    onSubmit(values) {},
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label
          htmlFor="mailSubject"
          className="block text-gray-700 uppercase text-xs font-medium mb-2"
        >
          Object du mail *
        </label>
        <input
          type="text"
          name="mailSubject"
          id="mailSubject"
          onChange={formik.handleChange}
          placeholder="Kessel run"
          className={`w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline ${
            formik.errors.mailSubject ? "border-red-500" : ""
          }`}
          style={{ transition: "all .15s ease" }}
        />
        {formik.errors.mailSubject && (
          <p className="text-red-500 text-xs italic mb-2">
            {formik.errors.mailSubject}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="mailContent"
          className="block text-gray-700 uppercase text-xs font-medium mb-2"
        >
          Contenu du mail *
        </label>
        <textarea
          name="mailContent"
          id="mailContent"
          onChange={formik.handleChange}
          className={`w-full text-sm text-gray-700 border rounded border-solid border-grey-600 p-2 mb-3 focus:outline-none focus:shadow-outline ${
            formik.errors.mailContent ? "border-red-500" : ""
          }`}
          style={{ transition: "all .15s ease" }}
        />
        {formik.errors.mailContent && (
          <p className="text-red-500 text-xs italic mb-2">
            {formik.errors.mailContent}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center mt-4 mb-4 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-2 md:text-sm md:px-4"
      >
        Contacter
        {loading && <span>...</span>}
      </button>
    </form>
  );
};

export default RideCreatorContactForm;
