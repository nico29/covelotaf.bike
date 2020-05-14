import React, { FunctionComponent } from "react";
import gql from "graphql-tag";
import { withApollo } from "../apollo/client";
import { useQuery } from "@apollo/react-hooks";

import { User } from "../server/types";
import Router from "next/router";

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER {
    currentUser {
      id
    }
  }
`;

const Auth: FunctionComponent<{}> = (props) => {
  const { data, loading } = useQuery<{ currentUser?: User }>(
    CURRENT_USER_QUERY,
    { ssr: false }
  );

  if (loading) return <p>Chargement...</p>;
  console.log(data);
  if (!data?.currentUser) Router.replace("/login");

  return <>{props.children}</>;
};

export default Auth;
