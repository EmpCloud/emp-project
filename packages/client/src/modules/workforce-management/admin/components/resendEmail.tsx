/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getResendMail } from "../api/post";
import toast from "./../../../../components/Toster/index";
import { emailSchema } from "@HELPER/schema";
import validate from "validate.js";
import FloatingTextfield from "../../../../formcomponent/FloatingTextfield";
import { displayErrorMessage } from "@HELPER/function";
import { CgAsterisk } from "react-icons/cg";
// import Head from "next/head";
import Image from "next/image";
import { FiMail } from "react-icons/fi";

const resendEmail = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleResendMail = () => {
    getResendMail(formState.values).then((response) => {
      if (response.data.statusCode == 200) {
        toast({
          type: "success",
          message: response
            ? response.data.body.message
            : "Something went wrong, Try again !",
        });
        router.push("/w-m/admin/sign-in");
      } else {
        toast({
          type: "error",
          message: response
            ? response.data.body.message
            : "Something went wrong, Try again !",
        });
        // setOpen(true)
      }
    });
  };
  const initialState = {
    isValid: false,
    values: {
      email: null,
    },
    touched: {},
    errors: { email: null },
  };
  const [formState, setFormState] = useState({ ...initialState });
  const schema = {
    email: emailSchema,
  };
  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState((prevFormState) => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [formState.values, formState.isValid]);

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };
  const hasError = (field) =>
    !!(formState.touched[field] && formState.errors[field]);
  return (
    // <div className="font-inter bg-slate-50 flex">
    //   <div className="xl:w-[54%] lg:w-[54%] md:w-[54%] lg:block md:block relative">
    //     <div className=" h-[124.99vh] xl:bg-gradient-to-r xl:from-[#1f3a78] xl:to-[#239ed9] lg:bg-gradient-to-r lg:from-[#1f3a78] lg:to-[#239ed9] md:bg-gradient-to-r md:from-[#1f3a78] md:to-[#239ed9] lg:block md:block hidden">
    //       {/* <img src="/imgs/login-img/login-min.jpg" alt="" /> */}
    //       {/* <div className=" w-full h-full bg-blue-500 opacity-40"></div> */}
    //       <div className=" xl:absolute lg:absolute md:absolute lg:flex xl:flex md:flex right-0 justify-content-center gap-4 bg-white text-black flex-col top-[40px] xl:py-[268px] lg:py-[238px] md:py-[180px] h-[91%] text-center w-[50vw] rounded-l-xl">
    //         <div className="flex justify-center">
    //           <img className="w-48" src="/imgs/logo.jpg" alt="EmpMonitor" />
    //         </div>
    //         <h2 className="xl:text-3xl lg:text-3xl text-[#1d9bd8] md:text-xl">
    //           Welcome to EmpMonitor
    //         </h2>
    //         <h3 className=" font-black lg:text-4xl px-4 text-[#1f3a78] md:text-2xl">
    //           Elevate Your Workflow, <br /> Master Your Projects
    //         </h3>
    //         <p className="text-[18px] text-[#4d68a8] px-20 md:px-10 lg:block xl:block sm:none">
    //           Empower your team and boost their efficiency with
    //           EmpMonitor&apos;s intuitive project management solution, designed
    //           to enhance collaboration and streamline project workflows
    //           effectively.
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="xl:w-[46%] lg:w-[48.4%] md:w-[44%] w-[100%] lg:my-auto my-5">
    //     <div className="xl:block lg:block md:block absolute top-[124px] h-[91%] -mt-[83px] bg-blue-200 xl:bg-gradient-to-r xl:from-[#1f3a78] xl:to-[#239ed9] lg:bg-gradient-to-r lg:from-[#1f3a78] lg:to-[#239ed9] md:bg-gradient-to-r md:from-[#1f3a78] md:to-[#239ed9] sm:hidden w-[50vw] hidden rounded-r-xl"></div>
    //   <section className="container mx-auto">
    //             <div className="flex place-content-center mt-44">
    //                 <img className="w-48" src="/imgs/logo.jpg" alt="EmpMonitor" />
    //             </div>
    //         </section>
    //     <section className=" mx-auto flex justify-center">
    //       {/*-- container -- */}
    //       <div className=" absolute top-[30%] m-6 mx-auto my-auto mb-5 xl:-ml-24 lg:-ml-24 md:-ml-10 xl:w-[600px] lg:w-[500px] md:w-[380px] sm:w-[80%] xl:bg-White md:bg-white lg:bg-white rounded-xl p-10 sm:bg-blue-500 bg-blue-500">
    //         <h2 className="text-center xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white font-bold text-2xl">
    //           Get Verification Mail
    //         </h2>
    //         <div className="flex flex-row mt-4">
    //           <p className="text-sm xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white">
    //             <b> Enter email here</b>
    //           </p>
    //           <CgAsterisk color="red" />
    //         </div>
    //         <FloatingTextfield
    //           type="email"
    //           error={hasError("email")}
    //           errorMsg={displayErrorMessage(formState.errors.email)}
    //           name="email"
    //           label={""}
    //           value={formState.values.email || ""}
    //           onChange={handleChange}
    //         />
    //         <h4 className="mt-4 text-center text-defaultTextColor"></h4>
    //         <div className="mt-4 justify-center">
    //           <button
    //             onClick={() => handleResendMail()}
    //             disabled={!formState.isValid}
    //             className={`mt-8 w-full mb-4 flex justify-center py-2.5 px-4 border border-transparent text-xl font-medium rounded-full text-[#1f3a78] 
    //             ${!formState.isValid ? "opacity-50" : "opacity-100"} 
    //             ${
    //               !formState.isValid
    //                 ? ""
    //                 : "hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none"
    //             } bg-white focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all  
    //               `}
    //           >
    //             Send
    //           </button>
    //           <p className="text-center xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white">
    //             Back to Sign in? {" "}
    //             <a
    //               onClick={() => router.push("/w-m/admin/sign-in")}
    //               className="font-bold text-white md:text-[#259ed9] hover:text-darkTextColor md:hover:text-[#1f3f7d] transition-all cursor-pointer"
    //             >
    //               {"  "}
    //               Login
    //             </a>
    //           </p>
    //           {open ? (
    //             <div className="text-center xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white red-link">
    //               Please contact help & support team for further help
    //             </div>
    //           ) : (
    //             <></>
    //           )}
    //         </div>
    //       </div>
    //     </section>
    //   </div>
    // </div>
    <>
    {/* <Head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    </Head> */}

    <div className="login-8">
    <div className="container">
        <div className="flex justify-center w-[100%] login-box !mt-20">
            <div className=" w-[98%] lg:w-[56%] !py-[8rem] form-info my-auto">
                <div className="form-section">
                    <div className="logo clearfix  flex justify-center">
                        <a href="login-8.html">
                            <Image height={160} width={160} src="/imgs/logo.jpg" alt="logo"/>
                        </a>
                    </div>
                    <h3>Get Verification Mail</h3>
                    <div className="login-inner-form">
                            <div className="form-group form-box">
                                <FloatingTextfield
                                  className="form-control w-full" 
                                  type="email"
                                  error={hasError("email")}
                                  errorMsg={displayErrorMessage(formState.errors.email)}
                                  name="email"
                                  placeholder={"Enter Email here*"}
                                  label={""}
                                  value={formState.values.email || ""}
                                  onChange={handleChange}
                                  />
                                <i><FiMail className="h-5 w-5 text-defaultTextColor"/></i>
                            </div>
                            <div className="form-group mb-0">
                            <button
                              onClick={() => handleResendMail()}
                              disabled={!formState.isValid}
                              className={`mt-8 w-full mb-4 flex justify-center py-2.5 px-4 border border-transparent text-base font-medium rounded text-[#1f3a78] 
                              ${!formState.isValid ? "opacity-50" : "opacity-100"} 
                              ${
                                !formState.isValid
                                  ? ""
                                  : "hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none"
                              } bg-blue-400 focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all  
                                `}>
                                Send
                                </button>
                            </div>
                            <p className="text !text-base">Back to sign-in?<span className='cursor-pointer font-semibold text-[#2b5fc0]' onClick={() => router.push('/w-m/admin/sign-in')}> SignIn here</span></p>
                    </div>
                </div>
            </div>
            <div className="w-[44%] bg-img">
                <div className="info">
                    <div className="btn-section clearfix">
                        <span onClick={() => router.push('/w-m/admin/sign-in')} className="link-btn btn-1 default-bg mr-4">Login</span>
                        <a href="register-8.html" className="link-btn btn-1">Register</a>
                    </div>
                    <div className="info-text">
                        <div className="waviy">
                            <span style={{"--i":"1"}}>W</span>
                            <span style={{"--i":"2"}}>e</span>
                            <span style={{"--i":"3"}}>l</span>
                            <span style={{"--i":"4"}}>c</span>
                            <span style={{"--i":"5"}}>o</span>
                            <span style={{"--i":"6"}}>m</span>
                            <span style={{"--i":"7"}}>e</span>
                            <span className="color-yellow ml-2" style={{"--i":"8"}}>t</span>
                            <span className="color-yellow mr-2" style={{"--i":"9"}}>o</span>
                            <span style={{"--i":"10"}}></span>
                            <span style={{"--i":"11"}}>E</span>
                            <span style={{"--i":"12"}}>M</span>
                            <span style={{"--i":"13"}}>P</span>
                        </div>
                        <h3 className=' font-black text-2xl text-white'>
                                        Elevate Your Workflow, Master Your Projects
                                    </h3>
                                    <p>Empower your team and boost their efficiency with EmpMonitor&apos;s intuitive project management solution, designed to enhance collaboration and streamline project
                                        workflows effectively.</p>
                    </div>
                    <ul className="social-list">
                                    <li>
                                        <a href="https://www.facebook.com/EmpMonitor/" className="facebook-bg">
                                            {/* <i className="fa fa-facebook"></i> */}
                                            <i className="fa-brands fa-facebook text-xl"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://twitter.com/empmonitor" className="twitter-bg">
                                            {/* <i className="fa fa-twitter"></i> */}
                                            <i className="fa-brands fa-x-twitter text-xl"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.youtube.com/channel/UCh2X5vn5KBkN-pGY5PxJzQw" className="google-bg">
                                            {/* <i className="fa fa-google"></i> */}
                                            <i className="fa-brands fa-youtube text-xl"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/company/empmonitor/" className="linkedin-bg">
                                            {/* <i className="fa fa-linkedin"></i> */}
                                            <i className="fa-brands fa-linkedin text-xl"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="skype:empmonitorsupport" className="skype-bg">
                                            {/* <i className="fa fa-pinterest"></i> */}
                                            <i className="fa-brands fa-skype text-xl"></i>
                                        </a>
                                    </li>
                                </ul>
                </div>
            </div>
        </div>
    </div>
</div>
    </>
  );
};

export default resendEmail;
