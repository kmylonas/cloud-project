import Navbar from "../Navbar";
import BackgroundWave from "../../common/BackgroundWave";
import React from "react";

function Layout({ children, user }) {
  return (
    <React.Fragment>
      <Navbar user={user} />
      <div>{children}</div>
      <BackgroundWave />
    </React.Fragment>
  );
}

export default Layout;
