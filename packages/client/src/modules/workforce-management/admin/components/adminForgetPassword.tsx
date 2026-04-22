import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import validate from "validate.js";
import { forgotPasswordAdmin } from "../api/post";
import FloatingTextfield from "../../../../formcomponent/FloatingTextfield";
import { emailSchema } from "@HELPER/schema";
import { displayErrorMessage } from "@HELPER/function";
import toast from "@COMPONENTS/Toster/index";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
// import Head from "next/head";
export const Index = ({ startLoading, stopLoading }) => {
  const router = useRouter();
  const initialState = {
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  };
  const schema = {
    email: emailSchema,
  };
  const [formState, setFormState] = useState({ ...initialState });
  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState((prevFormState) => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [formState.values, formState.isValid]);
  useEffect(() => {
    // document.querySelector("body").classList.add("bg-slate-50");
  }, []);
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
  const handleSumbmit = (e) => {
    e.preventDefault();
    startLoading();
    forgotPasswordAdmin(formState.values.email).then((response) => {
      if (response.data.statusCode == 200) {
        toast({
          type: "success",
          message: response
            ? response.data.body.message
            : "Something went wrong, Try again !",
        });
      } else {
        toast({
          type: "error",
          message: response
            ? response.data.body.message
            : "Something went wrong, Try again !",
        });
        stopLoading();
      }
      setTimeout(() => {
        router.push("/w-m/admin/sign-in");
      }, 2000);
    });
    stopLoading();
  };
  return (<>
    <div className="login-8">
    <div className="container">
        <div className="flex justify-center login-box !mt-5">
            <div className="w-[98%] lg:w-[56%] !py-[10rem] form-info my-auto">
                <div className="form-section">
                    <div className="logo clearfix  flex justify-center">
                        <a href="login-8.html">
                            <Image height={180} width={180} src="https://empcloud.com/wp-content/uploads/2024/10/EMPCloud-New-Logo-colored-1200x280.webp" alt="logo"/>
                        </a>
                    </div>
                    <h3>Recover Your Password</h3>
                    <div className="login-inner-form">
                        <form onSubmit={handleSumbmit}>
                            <div className="form-group form-box">
                                <FloatingTextfield type="email"
                                  error={hasError("email")}
                                  errorMsg={displayErrorMessage(formState.errors.email)}
                                  name="email"
                                  // label={"Your work email address*"}
                                  value={formState.values.email || ""}
                                  onChange={handleChange}
                                  autoComplete={"autocomplete"}
                                  className="form-control w-full" 
                                  placeholder="Email Address" 
                                  aria-label="Email Address"/>
                                <i><FiMail className="h-5 w-5 text-defaultTextColor"/></i>
                            </div>
                            <div className="form-group mb-0">
                                <button type="submit" className={`text-base w-full flex justify-center py-2.5 px-4 border border-transparent font-medium rounded text-[#1f3a78] 
                                        ${!formState.isValid ? 'opacity-50' : 'opacity-100'} 
                                        ${!formState.isValid ? '' : 'hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none'
                                                    } bg-blue-400 focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all  
                                          `}
                                                disabled={!formState.isValid}>Send Me Email</button>
                            </div>
                            <p className="text !text-md">Already a member?<span className=' cursor-pointer font-semibold text-[#2b5fc0]' onClick={() => router.push('/w-m/admin/sign-in')}> Login here</span></p>
                        </form>
                    </div>
                </div>
            </div>
            <div className="w-[44%] bg-img">
                <div className="info">
                    <div className="btn-section clearfix">
                    <span className=" text-2xl font-semibold mr-2 text-white">Admin</span>
                        <span onClick={() => router.push('/w-m/admin/forgot-password')} className="link-btn btn-1 active default-bg mr-2 cursor-pointer">forgot</span>
                        <span onClick={() => router.push('/w-m/admin/sign-up')} className="link-btn btn-1 cursor-pointer">Register</span>
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
export default Index;
