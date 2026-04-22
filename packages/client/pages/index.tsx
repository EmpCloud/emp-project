import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import router from "next/router";
import { adminData } from "../src/helper/admin";
import { adminIsEmailExist } from "@WORKFORCE_MODULES/admin/api/post";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";

import glasscss from "../styles/waytoworkforce.module.css";
const index = ({ startLoading, stopLoading }) => {
  useEffect(() => {
    // document.querySelector("body").classList.add("bg-slate-50");
  },[]);
  
  return (
    <>
      <section className="h-screen  bg-[url('/imgs/login-img/login-admin-bg2.jpg')] bg-cover bg-no-repeat">
        <div className="px-6 py-12 h-full">
          <div className="flex justify-center items-center h-full g-6 text-gray-800">
            <div
              className={`flex flex-col w-[46rem] gap-8 justify-center items-center ${glasscss.glassBg}`}
            >
              <div className="flex justify-center">
                <img 
                  className="w-64"
                  src="https://empcloud.com/wp-content/uploads/2024/10/EMPCloud-New-Logo-colored-1200x280.webp" 
                  alt="EmpMonitor" />
              </div>
              <div>
                <h2
                  className=" text-center text-[#1f3a78] font-bold lg:text-4xl md:text-3xl text-xl"
                  id="shdow-text"
                >
                  Empower Your Team with Advanced Project <br />
                  Management in EmpMonitor
                </h2>
                <p className=" text-[#1f3a78] lg:text-lg  text-base font-medium text-center py-4">
                  Elevate Collaboration and Achieve Project Excellence Through
                  Our Latest Features
                </p>
              </div>
              <button
                onClick={() => {
                  router.push("/w-m/admin/sign-in");
                }}
                className=" lg:px-10 lg:py-5 px-4 py-4 bg-gradient-to-b from-[#6FCCFF] shdaow-btn to-[#1687C3] border hover:bg-gradient-to-b hover:from-[#6FFFFF] hover:to-[#06B2B2] text-white font-medium lg:text-lg hover:text-[#1F3A78] hover:border-[#6fffff] text-sm leading-snug rounded-full focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
              >
                Streamline Your Projects Now!
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default index;
