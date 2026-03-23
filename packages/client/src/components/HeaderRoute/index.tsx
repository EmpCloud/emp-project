import React from "react";
import Head from "next/head";
import { displayTitle } from "../../helper/title";
const HeaderRoute = ({ path }: any) => {
  return (
    <Head>
      <title>{displayTitle(path)}</title>
      <link rel="icon" href="/imgs/icon.jpg" />
    </Head>
  );
};
HeaderRoute.defaultProps = {
  path: "EMP",
};
export default HeaderRoute;
