import React from "react";
const index = () => {
  return (
    <div id="loader" className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden  flex flex-col items-center justify-center">
    <div className="loader-spin ease-linear rounded-full border-4 border-t-4 border-[#fff] h-12 w-12 mb-4"></div>
    <h2 className="text-center text-[#f8a937] text-xl font-semibold">Loading...</h2>
</div>
  );
};
export default index;
