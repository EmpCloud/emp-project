"use client"
import { url } from 'inspector';
import React, { useEffect } from 'react';
import Head from "next/head"
import { useRouter } from 'next/router';
import error from "../styles/404error.module.css"
import Parallax from 'parallax-js'; // Import the Parallax library
const NotFound = () => {
  const router = useRouter()
  useEffect(() => {
    // Wrap your code in a DOMContentLoaded event listener
    // document.addEventListener('DOMContentLoaded', () => {
    //   const scene = document.getElementById('scene');
    //   const parallax = new Parallax(scene);
      var scene = document.getElementById('scene');
      var parallax = new Parallax(scene);

      // Cleanup code when the component unmounts
      // return () => {
      //   parallax.destroy();
      // };
    // });
  }, []); // The empty dependency array ensures this runs only once after mount
  return (
    <>
    <Head>
      <script defer src="https://cdnjs.cloudflare.com/ajax/libs/parallax/3.1.0/parallax.min.js"></script>
      <script defer src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
      
    </Head>
      {/* <div className="relative overflow-none bg-cover" style={{ width: "100%" }}> */}
        {/*     <img src="https://external-preview.redd.it/4MddL-315mp40uH18BgGL2-5b6NIPHcDMBSWuN11ynM.jpg?width=960&crop=smart&auto=webp&s=b98d54a43b3dac555df398588a2c791e0f3076d9" className="absolute h-full w-full object-cover"/> */}
        {/* <div className="container mx-auto px-6 md:px-12 relative z-10 flex items-center py-32 xl:py-40">
          <div className="w-full font-mono flex flex-col gap-10 py-8 items-center bg-gradient-to-r from-indigo-500 to-blue-500 shadow shadow-darkBlue rounded-xl relative z-10">
            <h1 className="font-extrabold text-5xl text-center py-8 text-slate-100 leading-tight">
              Page Not Found
            </h1>
            <p className=' text-8xl text-slate-100 font-black'>404 ERROR</p>
            <button className=" text-5xl text-black shadow bg-indigo-200 px-10 py-4 mt-8 rounded-full" onClick={() => router.back()}>
              Go back
            </button>
          </div>
        </div>
      </div> */}
  {/* about */}
  
  {/* end about */}
  <section className={`${error.wrapper} error-body`}>
    <div className={error.container}>
      <div id="scene" className={error.scene} data-hover-only="false">
        <div className={error.circle} data-depth="1.2" />
        <div className={error.one} data-depth="0.9">
          <div className={error.content}>
            <span className={error.piece} />
            <span className={error.piece} />
            <span className={error.piece} />
          </div>
        </div>
        <div className={error.two} data-depth="0.60">
          <div className={error.content}>
            <span className={error.piece} />
            <span className={error.piece} />
            <span className={error.piece} />
          </div>
        </div>
        <div className={error.three} data-depth="0.40">
          <div className={error.content}>
            <span className={error.piece} />
            <span className={error.piece} />
            <span className={error.piece} />
          </div>
        </div>
        <p className={error.p404} data-depth="0.50">
          404
        </p>
        <p className={error.p404} data-depth="0.10">
          404
        </p>
      </div>
      <div className={error.text}>
        <article>
          <p>
            Uh oh! Looks like you got lost. <br />
            Go back to the homepage!
          </p>
          <button name='go back' onClick={() => router.back()}>Go Back!</button>
        </article>
      </div>
    </div>
  </section>

    </>
  )
}
export default NotFound