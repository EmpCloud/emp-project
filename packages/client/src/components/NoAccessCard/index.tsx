import React from 'react'
import glasscss from "../../../styles/waytoworkforce.module.css";

const index = () => {
  return (
    <>
    <section className="h-[125vh]  card bg-cover bg-no-repeat">
        <div className="px-6 py-12 h-full">
          <div className="flex justify-center items-center h-full g-6 text-gray-800">
            
            <div
              className={`flex flex-col gap-10 justify-center items-center `}
            >
              <div className="flex justify-center w-full">
                <img
                  className="w-full"
                  src="/imgs/png/accessDenied2.png"
                  alt="EmpMonitor"
                />
              </div>
              <div>
                <h1
                  className=" text-center text-black text-2xl mr-16"
                  id="shdow-text"
                >
                </h1>
                
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
    
  )
}

export default index