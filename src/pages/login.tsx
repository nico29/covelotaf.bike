import NavigationBar from "../components/navbar";
import * as React from "react";
import { withApollo } from "../apollo/client";
export default withApollo(() => (
  <main>
    <NavigationBar />
    <div className="hero">
      <h1 className="title">login Page</h1>
    </div>
  </main>
));
