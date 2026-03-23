import { useState } from "react";
import Topbar from "../section/topbar";
import Slider from "../section/sidebar"
const Layout = ({ children}) => {
  return (
    <>
      <>
        <div className="font-inter">
          <Topbar />
          <Slider />
          <div className="main-wrapper">{children}</div>
          {/* <Footer /> */}
        </div>
      </>
    </>
  );
};
export default Layout;
