/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import validate from "validate.js";
import Cookies from "js-cookie";
import toast from "../../../../components/Toster";
import { FloatingPasswordTextfield } from "../../../../formcomponent/FloatingPasswordTextfield";
import FloatingTextfield from "../../../../formcomponent/FloatingTextfield";
import { displayErrorMessage } from "../../../../helper/function";
import { loginMember } from "../api/post";
import { emailSchema, requiredSchema } from "../../../../helper/schema";
import { CgAsterisk } from "react-icons/cg";
import { jwtDecode } from 'jwt-decode';
// import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineIdentification } from "react-icons/hi";
import { FiMail } from "react-icons/fi";
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import { useSharedStateContext } from "../../../../helper/function"

export const memberLogin = ({ startLoading, stopLoading }) => {
  const { sharedState, updateSharedState ,profileData,setProfileData} = useSharedStateContext();

  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(
    Cookies.get("userRememberMe") ? Cookies.get("userRememberMe") : false
  );

  useEffect(() => {
    if (rememberMe) {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          orgId: Cookies.get("orgId") || "",
          userMail: Cookies.get("userMail") || "",
          password: Cookies.get("userPassword") || "",
        },
      }));
    }
    if (Cookies.get("isAdmin") === "true") router.push("/w-m/dashboard");
  }, []);
  const [showIcon, setShowIcon] = useState(false);
  const initialState = {
    isValid: false,
    values: { userMail: null, password: null, orgId: null },
    touched: {},
    errors: { userMail: null, password: null, orgId: null },
  };
  const schema = {
    userMail: emailSchema,
    password: requiredSchema,
    orgId: requiredSchema,
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
  }, [showIcon]);
  const handleChangeIcon = (event) => {
    event.preventDefault();
    setShowIcon(!showIcon);
  };
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

  const handleProfileData = () => {
    fetchProfile().then(response => {
      if (response && response.data?.body.status === 'success') {
        // Create a context with an initial value (undefined in this case)
        setProfileData(response.data.body.data);
        const permissionData = response.data.body.data.permissionConfig;
        Cookies.set('permission', JSON.stringify(permissionData));
      }
    });
  };
  
  const hasError = (field) =>
    !!(formState.touched[field] && formState.errors[field]);
  const handleSumbmit = (e) => {
    e.preventDefault();
    startLoading();
    loginMember(formState.values)
      .then(function (result) {
        stopLoading();
        if (result.data.statusCode == 200) {
          const exp = jwtDecode(result.data.body.data.accessToken).exp;
          const expiresAt = exp ? new Date(exp * 1000) : undefined;
          Cookies.set("verifyToken", result.data.body.data.userData.forgotPasswordToken);
          Cookies.set("token", result.data.body.data.accessToken,{ expires: expiresAt });
          Cookies.set("orgId", formState.values.orgId);
          Cookies.set("userMail", formState.values.userMail);
          Cookies.set("userPassword", formState.values.password);
          Cookies.set("userData",JSON.stringify(result.data.body.data.userData));
          Cookies.set("id", result.data.body.data.userData._id);
          Cookies.set("isAdmin", result.data.body.data.userData.isAdmin);
          Cookies.set('profilePic',result.data.body.data.userData.profilePic)
          updateSharedState(result.data.body.data.userData.profilePic);

          handleProfileData();
          router.push("/w-m/member/view");

          setTimeout(() => {
            Cookies.remove('token');
            Cookies.remove("id");
            Cookies.remove("userData");
            Cookies.remove("isAdmin");
            router.push('/w-m/member/login');
          }, 86160000); // logout after 23hrs 58min
        } else {
          toast({
            type: "error",
            message: result ? result.data.body.message : "Error",
          });
        }
      })
      .catch(function (e) {
        stopLoading();
        toast({
          type: "error",
          message: e.response
            ? e.response.data.body.message
            : "Something went wrong, Try again !",
        });
      });
    if (rememberMe) {
      Cookies.set("orgId", formState.values.orgId);
      Cookies.set("userMail", formState.values.userMail);
      Cookies.set("userPassword", formState.values.password);
      Cookies.set("userRememberMe", true);
    } else {
      Cookies.remove("userMail");
      Cookies.remove("userPassword");
      Cookies.remove("userRememberMe");
    }
  };
  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };
  return (
    // <div className="font-inter bg-slate-50 flex">
    //   <div className="xl:w-[54%] lg:w-[54%] md:w-[54%] lg:block md:block relative">
    //     <div className=" h-[124.99vh] xl:bg-gradient-to-r xl:from-[#1f3a78] xl:to-[#8eb1ff] lg:bg-gradient-to-r lg:from-[#1f3a78] lg:to-[#8eb1ff] md:bg-gradient-to-r md:from-[#1f3a78] md:to-[#8eb1ff] lg:block md:block hidden">
    //       {/* <img src="/imgs/login-img/login-min.jpg" alt="" /> */}
    //       {/* <div className=" w-full h-full bg-blue-500 opacity-40"></div> */}
    //       <div className=" xl:absolute lg:absolute md:absolute lg:flex xl:flex md:flex right-0 justify-content-center gap-4 bg-white text-black flex-col top-[40px] xl:py-[268px] lg:py-[230px] md:py-[180px] h-[91%] text-center w-[50vw] rounded-l-xl">
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
    //   <div className="xl:w-[46%] lg:w-[46%] md:w-[46%] w-[100%] lg:my-auto my-5">
    //     <div className="xl:block lg:block md:block sm:block absolute top-[124px] h-[91%] -mt-[83px] bg-blue-200 xl:bg-gradient-to-r xl:from-[#1f3a78] xl:to-[#8eb1ff] lg:bg-gradient-to-r lg:from-[#1f3a78] lg:to-[#8eb1ff] md:bg-gradient-to-r md:from-[#1f3a78] md:to-[#8eb1ff] sm:hidden w-[50vw] hidden rounded-r-xl"></div>
    //     <section className="container mx-auto">
    //       <div className="flex place-content-center mt-10">
    //         <img
    //           className="w-48"
    //           src="/imgs/logo.jpg"
    //           alt="EmpMonitor"
    //         />
    //       </div>
    //     </section>
    //     <section className=" mx-auto flex justify-center">
    //       {/*-- container -- */}
    //       <div className=" absolute top-[15%] m-6 mx-auto my-auto mb-5 xl:-ml-24 lg:-ml-[6%] md:-ml-[5%] xl:w-[600px] lg:w-[480px] md:w-[360px] sm:w-[80%] xl:bg-white md:bg-white lg:bg-white rounded-xl p-10 sm:bg-blue-500 bg-blue-500">
    //         <p className="text-center xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white xl:text-xl md:text-base pb-3">
    //           Welcome! Please login to continue.
    //         </p>
    //         <h2 className="text-center xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white font-bold xl:text-3xl lg:text-2xl md:text-xl sm:text-3xl text-3xl">
    //           Member Login
    //         </h2>
    //         <form onSubmit={handleSumbmit}>
    //           <div className="mt-4">
    //             <div className="flex flex-row">
    //               {/* <p className="text-sm text-darkTextColor text-white">
    //                 <b>Organization Id</b>
    //               </p>
    //               <CgAsterisk color="red" /> */}
    //             </div>
    //             <FloatingTextfield
    //               type="text"
    //               error={hasError("orgId")}
    //               errorMsg={displayErrorMessage(formState.errors.orgId)}
    //               name="orgId"
    //               label={""}
    //               value={formState.values.orgId || ""}
    //               onChange={handleChange}
    //               placeholder={"Organization Id *"}
    //             />
    //             <div className="flex flex-row  mt-6">
    //               {/* <p className="text-sm text-darkTextColor text-white mt-4">
    //                 <b> Your work email address</b>
    //               </p>
    //               <CgAsterisk color="red" className="mt-4" /> */}
    //             </div>
    //             <FloatingTextfield
    //               type="email"
    //               error={hasError("userMail")}
    //               errorMsg={displayErrorMessage(formState.errors.userMail)}
    //               name="userMail"
    //               label={""}
    //               value={formState.values.userMail || ""}
    //               onChange={handleChange}
    //               placeholder={"Email Address *"}
    //             />
    //             <div className="wrapper relative">
    //               <div className="flex flex-row mt-6">
    //                 {/* <p className="text-sm text-darkTextColor text-white mt-4">
    //                   <b>Password</b>
    //                 </p> */}
    //               </div>
    //               <FloatingPasswordTextfield
    //                 name="password"
    //                 state={showIcon}
    //                 label={""}
    //                 value={formState.values.password || ""}
    //                 onClick={handleChangeIcon}
    //                 onChange={handleChange}
    //                 error={hasError("password")}
    //                 errorMsg={displayErrorMessage(formState.errors.password)}
    //                 margin={"mt-7"}
    //                 topPosition={"-top-1"}
    //                 placeholder={"Password *"}
    //               />
    //             </div>
    //           </div>
    //           <div className="flex xs:block justify-between items-center mt-5">
    //             <div className="form-group form-check flex items-center text-base">
    //               <input
    //                 id="rememberMeCheck"
    //                 type="checkbox"
    //                 checked={rememberMe}
    //                 onChange={handleRememberMeChange}
    //                 className="focus:ring-brandBlue h-5 w-5 text-brandBlue border-gray-300 rounded-full cursor-pointer hover:border-brandBlue"
    //               />
    //               <label
    //                 htmlFor="rememberMeCheck"
    //                 className=" xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white xl:text-xl md:text-md transition-all ml-3 cursor-pointer"
    //               >
    //                 Remember me?
    //               </label>
    //             </div>
    //             <a
    //               onClick={() => router.push("/w-m/member/forgot-password")}
    //               className="font-bold text-white md:text-[#259ed9] hover:text-darkTextColor md:hover:text-[#1f3f7d] text-base transition-all md:text-base xs:mt-2 xs:float-right xs:mb-5 cursor-pointer"
    //             >
    //               Forgot password?
    //             </a>
    //           </div>
    //           {/* <!-- Continue Btn --> */}
    //           <button
    //             type="submit"
    //             className={` ${
    //               !formState.isValid ? "opacity-50" : "opacity-100"
    //             } mt-8 w-full flex justify-center py-2.5 px-4 border border-transparent text-xl font-medium rounded-full text-[#a2bfff] 
    //             bg-white focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all
    //               ${
    //                 !formState.isValid
    //                   ? ""
    //                   : "hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#a2bfff] hover:drop-shadow-none"
    //               } `}
    //             disabled={!formState.isValid}
    //           >
    //             Login
    //           </button>
    //         </form>
    //         <p className="text-center text-defaultTextColor mt-8">
    //           <a
    //             onClick={() => router.push("/w-m/admin/sign-in")}
    //             className=" font-bold text-white md:text-[#259ed9] hover:text-darkTextColor md:hover:text-[#1f3f7d] transition-all cursor-pointer"
    //           >
    //             {" "}
    //             Admin Login?
    //           </a>
    //         </p>
    //       </div>
    //     </section>
    //   </div>
    // </div>
    <>
{/* 
    <Head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    </Head> */}

    <div className="login-8">
                <div className="container">
                    <div className="flex justify-center login-box !mt-20">
                        <div className=" w-[98%] lg:w-[56%] !py-[5rem] form-info flex">
                            <div className="form-section">
                                <div className="logo clearfix flex justify-center">
                                    <Link href="/">
                                        <Image height={180} width={180} src="https://empcloud.com/wp-content/uploads/2024/10/EMPCloud-New-Logo-colored-1200x280.webp" alt="logo" />
                                    </Link>
                                </div>
                                <h3>Login Into Your Member Account</h3>
                                <div className="login-inner-form mb-0">
                                    <form onSubmit={handleSumbmit}>
                                        <div className="form-group form-box">
                                            <FloatingTextfield 
                                                className="form-control w-full" 
                                                type="text"
                                                error={hasError("orgId")}
                                                errorMsg={displayErrorMessage(formState.errors.orgId)}
                                                name="orgId"
                                                label={""}
                                                value={formState.values.orgId || ""}
                                                onChange={handleChange}
                                                placeholder={"Organization Id *"}
                                            />
                                            <i>
                                            <HiOutlineIdentification className="h-5 w-5 text-defaultTextColor"/>
                                            </i>
                                        </div>
                                        <div className="form-group form-box">
                                            <FloatingTextfield 
                                                className="form-control w-full" 
                                                type="email"
                                                error={hasError("userMail")}
                                                errorMsg={displayErrorMessage(formState.errors.userMail)}
                                                name="userMail"
                                                label={""}
                                                value={formState.values.userMail || ""}
                                                onChange={handleChange}
                                                placeholder={"Email Address *"}
                                            />
                                            <i>
                                              <FiMail className="h-5 w-5 text-defaultTextColor"/>
                                            </i>
                                        </div>
                                        <div className="form-group form-box">
                                            <FloatingPasswordTextfield 
                                                type="password" 
                                                className="form-control w-full" 
                                                name="password"
                                                state={showIcon}
                                                label={""}
                                                value={formState.values.password || ""}
                                                onClick={handleChangeIcon}
                                                onChange={handleChange}
                                                error={hasError("password")}
                                                errorMsg={displayErrorMessage(formState.errors.password)}
                                                margin={"mt-7"}
                                                topPosition={"-top-1"}
                                                placeholder={"Password *"}
                                            />
                                            {/* <i className="flaticon-password"></i> */}
                                            {/* <i className="fa-solid fa-lock text-2xl"></i> */}
                                        </div>
                                        <div className="checkbox form-group form-box">
                                            <div className="form-check checkbox-theme">
                                                <input className="form-check-input" value=""
                                                    id='rememberMeCheck'
                                                    type='checkbox'
                                                    checked={rememberMe}
                                                    onChange={handleRememberMeChange}
                                                     />
                                                <label className="form-check-label cursor-pointer" htmlFor="rememberMeCheck" >Remember me</label>
                                            </div>
                                            <span className='text-base cursor-pointer font-semibold text-[#2b5fc0] float-right' onClick={() => router.push('/w-m/member/forgot-password')}>Forgot Password</span>
                                        </div>
                                        <div className="form-group mb-0">
                                            <button
                                                type='submit'
                                                className={`text-base mt-8 w-full flex justify-center py-2.5 px-4 border border-transparent font-medium rounded text-[#1f3a78] 
                                        ${!formState.isValid ? 'opacity-50' : 'opacity-100'} 
                                        ${!formState.isValid ? '' : 'hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none'
                                                    } bg-blue-400 focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all  
                                          `}
                                                disabled={!formState.isValid}
                                            >Login</button>
                                        </div>
                                        <p className="text">
                                          <span onClick={() => router.push("/w-m/admin/sign-in")}
                                            className="text-md cursor-pointer font-semibold text-[#2b5fc0]"
                                            >
                                                {" "}
                                                Admin Login?
                                              </span>
                                            </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* <div className='bg-img'> */}
                        <div className=" w-[44%] bg-img">
                            <div className="info">
                                <div className="btn-section clearfix">
                                    <span className=" text-2xl font-semibold mr-2 text-white">Member</span>
                                    <span className="link-btn active btn-1 default-bg mr-2 cursor-pointer" onClick={() => router.push('/w-m/member/login')}>Login</span>
                                    <span className="link-btn btn-1 cursor-pointer" onClick={() => router.push('/w-m/admin/sign-up')}>Register</span>
                                </div>
                                <div className="info-text">
                                    <div className="waviy">
                                        <span style={{ "--i": "1" }}>W</span>
                                        <span style={{ "--i": "2" }}>e</span>
                                        <span style={{ "--i": "3" }}>l</span>
                                        <span style={{ "--i": "4" }}>c</span>
                                        <span style={{ "--i": "5" }}>o</span>
                                        <span style={{ "--i": "6" }}>m</span>
                                        <span style={{ "--i": "7" }}>e</span>
                                        <span className="color-yellow ml-2" style={{ "--i": "8" }}>t</span>
                                        <span className="color-yellow mr-2" style={{ "--i": "9" }}>o</span>
                                        <span style={{ "--i": "10" }}></span>
                                        <span style={{ "--i": "11" }}>E</span>
                                        <span style={{ "--i": "12" }}>M</span>
                                        <span style={{ "--i": "13" }}>P</span>
                                    </div>
                                    <h3 className=' font-black text-2xl px-4 text-white'>
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
                        {/* </div> */}
                    </div>
                </div>
            </div>
    </>
  );
};
export default memberLogin;
