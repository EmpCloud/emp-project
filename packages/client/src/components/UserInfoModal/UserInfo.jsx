import { FloatingSelectfield } from "@COMPONENTS/FloatingSelectfield";
import FloatingTextfield from "@COMPONENTS/FloatingTextfield";
import MultiSelectDropDown from "@COMPONENTS/MultiSelectDropDown";
import { TextArea } from "@COMPONENTS/TextArea";
import React from "react";
import { CgAsterisk } from "react-icons/cg";

import { useEffect, useState } from "react";
import validate from "validate.js";
import { useRouter } from "next/router";
import Router from "next/router";
import toast from "@COMPONENTS/Toster/index";
import { registerAdmin } from "@WORKFORCE_MODULES/admin/api/post";
import _ from "lodash";
import { OrgIdSchema } from "@HELPER/schema";
import { adminAddData } from "@HELPER/admin";
import { Country, State, City } from "country-state-city";
import { FloatingPasswordTextfield } from "@COMPONENTS/FloatingPasswordTextfield";
import { isRequiredErrorMessage } from "@HELPER/exportData";
import { displayErrorMessage } from "@HELPER/function";
import codes from "country-calling-code";
// import Head from 'next/head';
import { FiMail } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { generateDicebearUrl } from "@HELPER/avtar";
import Cookies from "js-cookie";
import { adminConfig } from "@WORKFORCE_MODULES/cofiguration/api/post";
import { jwtDecode } from 'jwt-decode';
const UserInfo = ({ data,handleCloseModel }) => {
  const basicInitialState = {
    isValid: false,
    values: {
      firstName: data?.first_name,
      lastName: data?.last_name,
      userName: data?.username,
      // profilePic: 'https://avatars.dicebear.com/api/bottts/' + 'dfsd' + '.svg',
      profilePic: generateDicebearUrl(data?.first_name, data?.last_name),
      password: null,
      confirmPassword: null,
      email: data?.email,
      empMonitorId: `${data?.user_id}`, // dought
      isEmpMonitorUser: true,
    },
    touched: {},
    errors: {
      userName: null,
      profilePic: null,
      password: null,
      confirmPassword: null,
    },
  };
  const companyInitialState = {
    isValid: false,
    values: {
      countryCode: null,
      address: null,
      phoneNumber: null,
      orgId: null,
      orgName: null,
      city: null,
      state: null,
      country: null,
      zipCode: null,
    },
    touched: {},
    errors: {
      countryCode: null,
      address: null,
      phoneNumber: null,
      orgId: null,
      orgName: null,
      city: null,
      state: null,
      country: null,
      zipCode: null,
    },
  };

  const router = useRouter();
  // const jsonString= router?.query?.data
  // const jsonObject = JSON.parse(jsonString);

  // console.log(jsonObject); // Output: { name: 'John', age: 30 }
  const [signupDetails, setSignupDetails] = useState({
    userRegisterFor: null,
    termsAndCondition: true,
    basic: {
      index: 1,
      text: "Basic Details",
      visibility: true,
      isCompleted: false,
      select: true,
    },
    company: {
      index: 2,
      text: "Company Details",
      visibility: false,
      isCompleted: false,
      select: false,
    },
  });
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [basicState, setBasicState] = useState({ ...basicInitialState });
  const [companyState, setCompanyState] = useState({ ...companyInitialState });
  const handleClickShowPassword = () => {
    setVisibility({ ...visibility, password: !visibility.password });
  };
  const handleTermsAndCondition = () => {
    setSignupDetails({
      ...signupDetails,
      termsAndCondition: !signupDetails.termsAndCondition,
    });
  };
  const handleClickShowConfirmPassword = () => {
    setVisibility({
      ...visibility,
      confirmPassword: !visibility.confirmPassword,
    });
  };
  const basicSchema = {
    confirmPassword: {
      equality: "password",
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
    },
    password: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
      format: {
        pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,20}$",
        message:
          " needs at least one numeric digit, uppercase , lowercase letter and special character .",
      },
      length: {
        maximum: 30,
        minimum: 8,
        message: "must be at least 8 characters .",
      },
    },
  };
  const companySchema = {
    orgName: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
      // format: {
      //   pattern: '[a-zA-Z][a-zA-Z ]*',
      //   message: 'can only contain alphabets.',
      // },
    },
    orgId: OrgIdSchema,
    phoneNumber: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
      format: {
        pattern: "^[0-9]*$",
        message: "can only contain digits.",
      },
      length: {
        maximum: 10,
        minimum: 10,
        message: "must be 10 digit .",
      },
      numericality: { onlyFloat: true },
    },
    country: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
    },
    zipCode: {
      // presence: { allowEmpty: false, message: isRequiredErrorMessage },
      format: {
        pattern: "^([0-9]{6})? *$",
        message: "Must be empty or 6 digits.",
      },
    },
    address: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
    },
  };

  useEffect(() => {
    const errors = validate(basicState.values, basicSchema);
    setBasicState((preBasic) => ({
      ...preBasic,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [basicState.values, basicState.isValid]);

  useEffect(() => {
    const errors = validate(companyState.values, companySchema);
    setCompanyState((preCompany) => ({
      ...preCompany,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [companyState.values, companyState.isValid]);

  useEffect(() => {
    // document.querySelector('body').classList.add('bg-slate-50');
  }, [signupDetails]);

  const handleBasicChange = (event) => {
    event.preventDefault();
    setBasicState((basicState) => ({
      ...basicState,
      values: {
        ...basicState.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...basicState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleCompanyChange = (event) => {
    if (event.target.name === "orgName") {
      setCompanyState((companyState) => ({
        ...companyState,
        values: {
          ...companyState.values,
          orgId:
            event.target.value.toUpperCase().substring(0, 3) +
            "-" +
            Math.random().toString(16).slice(10),
        },
      }));
    }
    if (event.target.name === "orgId") {
      setCompanyState((companyState) => ({
        ...companyState,
        values: {
          ...companyState.values,
          orgId: event.target.value.toUpperCase(),
        },
      }));
    }
    event.preventDefault();
    setCompanyState((companyState) => ({
      ...companyState,
      values: {
        ...companyState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...companyState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const allConfig = [
    "projectFeature",
    "taskFeature",
    "subTaskFeature",
    "invitationFeature",
  ];
  const handleConfigSet = () => {
    adminConfig(allConfig)
      .then((response) => {
        if (response.data.statusCode == 200) {
        const exp = jwtDecode(response.data.body.data.accessToken).exp;
        const expiresAt = exp ? new Date(exp * 1000) : undefined;
        Cookies.remove("token");
        Cookies.set("token", response.data.body.data.accessToken, { expires: expiresAt });
          Router.push("/w-m/dashboard");
        }
      })
      .catch(function (response) {
        toast({
          type: "error",
          message: response
            ? response.data.body.message
            : "Something went wrong, Try again !",
        });
      });
  };

  const handleSumbmit = (e) => {
    e.preventDefault();
    if (!signupDetails.termsAndCondition) {
      toast({
        type: "error",
        message:
          "Please indicate that you have read and agree to the Terms and Conditions and Privacy Policy",
      });
      return false;
    }

    // startLoading();
    // const profilePic = generateDicebearUrl(basicState?.values?.firstName, basicState?.values?.lastName);

    registerAdmin({
      // ..._.omit({ ...basicState.values, ...companyState.values, profilePic }, ['confirmPassword']),
      ..._.omit({ ...basicState.values, ...companyState.values }, [
        "confirmPassword",
      ]),
    }).then((response) => {
      if (response.data.statusCode == 200) {
        console.log(response, "registor response");
        // toast({
        //     type: 'success',
        //     message: response ? response.data.body.message : null,
        // });

        Cookies.set("token", response?.data?.body?.data?.accessToken);
        Cookies.set(
          "adminData",
          JSON.stringify(response?.data?.body?.data?.resultData)
        );
        Cookies.set("id", response?.data?.body?.data?.resultData?._id);
        Cookies.set("isAdmin", response?.data?.body?.data?.resultData?.isAdmin);
        Cookies.set(
          "isEmpAdmin",
          response?.data?.body?.data.resultData?.isEmpMonitorUser
        );
        Cookies.set(
          "planName",
          response?.data?.body.data.resultData.planData?.planName
        );
        Cookies.set(
          "profilePic",
          response.data.body.data.resultData.profilePic
        );

        if (!response.data.body.data.resultData.isConfigSet) {
          handleConfigSet();
        }
        if (response.data.body.data.resultData.isConfigSet) {
          Router.push("/w-m/dashboard");
        }

        // Router.push('/w-m/dashboard');
        setTimeout(() => {
          Cookies.remove("token");
          Cookies.remove("adminData");
          Cookies.remove("id");
          Cookies.remove("isAdmin");
          Cookies.remove("isEmpAdmin");
          Router.push("/w-m/admin/sign-in");
        }, 86160000); // logout after 23hrs 58min;
      } // stopLoading();
      //     setTimeout(() => {
      //         toast({
      //             type: 'success',
      //             message: response ? response.data.body.message : '',
      //         });
      //         router.push('/w-m/dashboard');
      //     }, 500);
      // }
      //  else {
      //     toast({
      //         type: 'error',
      //         message: response ? response.data.body.error : 'Something went wrong, Try again !',
      //     });
      //     // stopLoading();
      // }
    });
    // .catch(function ({ response }) {
    //     // stopLoading();
    //     console.log( response,'respoomse==================>')

    //     toast({
    //         type: 'error',
    //         message: response ? response.data.error : 'Something went wrong, Try again !',
    //     });
    // });
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const hasErrorInBasic = (field) =>
    !!(basicState.touched[field] && basicState.errors[field]);
  const hasErrorInCompany = (field) =>
    !!(companyState.touched[field] && companyState.errors[field]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [countryList, setCountryList] = useState(null);
  const [stateList, setStateList] = useState(null);
  const [cityList, setCityList] = useState(null);

  useEffect(() => {
    getCountry();
    getCountryCode();
  }, [selectedCountry]);

  const getCountryCode = () => {
    let phoneData = codes.filter((item) => item.country === selectedCountry);

    if (!phoneData[0]) {
      setCompanyState((companyState) => ({
        ...companyState,
        values: {
          ...companyState.values,
          countryCode: null,
        },
      }));
      return false;
    }

    let phoneCode = "+" + phoneData[0].countryCodes[0];
    setCompanyState((companyState) => ({
      ...companyState,
      values: {
        ...companyState.values,
        countryCode: phoneCode,
      },
    }));
  };
  useEffect(() => {
    getState(countryList);
    getCity(stateList);
  }, [selectedCountry, selectedState]);

  const getCountry = () => {
    let countryList = Country.getAllCountries().map((item) => {
      return {
        text: item.name,
        value: item.name,
        isoCode: item.isoCode,
      };
    });
    setCountryList(countryList);
    getState(countryList);
  };

  const getState = (countryList) => {
    if (!selectedCountry) return false;
    let selectedItem = countryList?.filter(
      (country) => country.value == (selectedCountry ? selectedCountry : "")
    );
    let stateList = State?.getStatesOfCountry(
      selectedItem ? selectedItem[0].isoCode : ""
    ).map((item) => {
      return {
        text: item.name,
        value: item.name,
        isoCode: item.isoCode,
        countryCode: item.countryCode,
      };
    });
    setStateList(stateList);
    getCity(stateList);
  };

  const getCity = (stateList) => {
    if (!selectedState) return false;
    let selectedItem = stateList?.filter(
      (state) => state.value === (selectedState ? selectedState : "")
    );
    let cityList = City?.getCitiesOfState(
      selectedItem ? selectedItem[0]?.countryCode : "",
      selectedItem ? selectedItem[0]?.isoCode : ""
    ).map((item) => {
      return {
        text: item.name,
        value: item.name,
      };
    });
    setCityList(cityList);
  };
  const handleClearCity = () => {
    setCompanyState((companyState) => ({
      ...companyState,
      values: {
        ...companyState.values,
        state: null,
        city: null,
      },
    }));
  };

  return (
    <>
      <div className="justify-center flex overflow-x-hidden overflow-y-auto mb-4 fixed inset-0 z-[999] outline-none focus:outline-none user-Emp-Info">
        <div className="relative my-2 mx-auto z-[999]">
          {/*content*/}
          <div className="border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            {/*body*/}
            <div className="relative py-5 sm:px-3 lg:w-p-3 md:px-10 flex-auto">
              <button
                className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleCloseModel}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeWidth="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {/* user details */}
              <>
                <div className="max-w-[400px] pb-4">
                  <div className="flex justify-center login-box">
                    <div className="w-full form-info">
                      <div className="form-section">
                        <h3 className="text-center font-semibold text-2xl mb-3">
                          Set Up An Account
                        </h3>
                        {/* Progress steps */}

                        <section className=" mx-auto flex justify-center">
                          {/*-- container -- */}
                          <div className=" ">
                            <div className="">
                              <h2 className=" text-xl text-defaultTextColor mb-2">
                                {signupDetails.basic.select
                                  ? signupDetails.basic.text
                                  : signupDetails.company.select
                                  ? signupDetails.company.text
                                  : ""}
                              </h2>
                            </div>
                            <div className="login-inner-form">
                              <form onSubmit={handleSumbmit} className="">
                                <div className="flex flex-col gap-2 form-group form-box !mb-1">
                                  <div className="flex items-center gap-2">
                                    <div className="form-group form-box w-full relative">
                                      <FloatingTextfield
                                        titleStyle={"rounded-sm py-[7px] px-[10px] bg-gray-200/30"}
                                        type="text"
                                        error={hasErrorInBasic("userName")}
                                        errorMsg={displayErrorMessage(
                                          basicState.errors.userName
                                        )}
                                        name="userName"
                                        placeholder={"User Name*"}
                                        value={basicState.values.userName || ""}
                                        onChange={handleBasicChange}
                                      />
                                      <i className=" absolute top-2 right-3">
                                        <FiMail className="h-4 w-4 text-gray-400/90" />
                                      </i>
                                    </div>
                                  </div>
                                  <div className="flex items-start justify-between gap-2 mt-1">
                                    <div className="wrapper relative w-full md:w-2/4">
                                      <FloatingPasswordTextfield
                                      titleStyle={"rounded-sm py-[7px] px-[10px] bg-gray-200/30"}
                                        name="password"
                                        state={visibility.password}
                                        placeholder={"Your Password"}
                                        value={basicState.values.password || ""}
                                        onClick={handleClickShowPassword}
                                        onChange={handleBasicChange}
                                        error={hasErrorInBasic("password")}
                                        topPosition={"top-6"}
                                        errorMsg={displayErrorMessage(
                                          basicState.errors.password
                                        )}
                                      />
                                    </div>
                                    <div className="wrapper relative w-full md:w-2/4">
                                      <FloatingPasswordTextfield
                                      titleStyle={"rounded-sm py-[7px] px-[10px] bg-gray-200/30"}
                                        name="confirmPassword"
                                        state={visibility.confirmPassword}
                                        placeholder={"Confirm Password"}
                                        value={
                                          basicState.values.confirmPassword ||
                                          ""
                                        }
                                        onClick={handleClickShowConfirmPassword}
                                        onChange={handleBasicChange}
                                        error={hasErrorInBasic(
                                          "confirmPassword"
                                        )}
                                        topPosition={"top-6"}
                                        errorMsg={displayErrorMessage(
                                          basicState.errors.confirmPassword
                                        )}
                                        onPaste={(e) => handlePaste(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="company-location text-left !mb-1 mt-1">
                                    <h5 className="xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white text-base lineAfter font-bold">
                                      Company Details
                                    </h5>
                                  </div>
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="w-full md:w-2/4">
                                      <FloatingTextfield
                                      errorStyles={' absolute'}
                                      titleStyle={"rounded-sm py-[7px] px-[10px] bg-gray-200/30"}
                                        type="text"
                                        error={hasErrorInCompany("orgName")}
                                        errorMsg={displayErrorMessage(
                                          companyState.errors.orgName
                                        )}
                                        name="orgName"
                                        placeholder={"Company Name*"}
                                        value={
                                          companyState.values.orgName || ""
                                        }
                                        onChange={handleCompanyChange}
                                      />
                                    </div>
                                    <div className="w-full md:w-2/4">
                                      <FloatingTextfield
                                    titleStyle={"rounded-sm py-[7px] px-[10px] bg-gray-200/30"}
                                        type="text"
                                        error={hasErrorInCompany("orgId")}
                                        errorMsg={displayErrorMessage(
                                          companyState.errors.orgId
                                        )}
                                        name="orgId"
                                        placeholder={"Company Id*"}
                                        value={companyState.values.orgId || ""}
                                        onChange={handleCompanyChange}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="">
                                  <div className="company-location text-left !mb-1 mt-3">
                                    <h5 className="xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white text-base lineAfter font-bold">
                                      Company location
                                    </h5>
                                  </div>
                                  <div className=" flex gap-2 justify-between items-center form-group form-box !mb-1 w-[400px]">
                                    <div className="mt-2 w-1/3">
                                      <h5 className="ml-2 lg:text-defaultTextColor md:text-defaultTextColor text-white text-base  font-bold">
                                        Country
                                      </h5>
                                      <FloatingSelectfield
                                        width={"rounded-sm w-full pr-7 py-[7px] px-[10px] bg-gray-200/30"}
                                        label={"Country*"}
                                        placeholder={"Select Country*"}
                                        optionsGroup={countryList}
                                        name={"country"}
                                        value={
                                          companyState.values.country || ""
                                        }
                                        onChange={(e) => {
                                          setSelectedCountry(e.target.value);
                                          handleClearCity();
                                          handleCompanyChange(e);
                                        }}
                                        error={hasErrorInCompany("country")}
                                        errorMsg={displayErrorMessage(
                                          companyState.errors.country
                                        )}
                                      />
                                    </div>
                                    <div className="mt-2 w-1/3">
                                      <h5 className="ml-2 lg:text-defaultTextColor md:text-defaultTextColor text-white text-base  font-bold">
                                        State
                                      </h5>
                                      <FloatingSelectfield
                                        width={"rounded-sm w-full pr-7 py-[7px] px-[10px] bg-gray-200/30"}
                                        label={"State*"}
                                        placeholder={"Select State*"}
                                        optionsGroup={stateList}
                                        name={"state"}
                                        value={companyState.values.state || ""}
                                        onChange={(e) => {
                                          handleClearCity();
                                          setSelectedState(e.target.value);
                                          handleCompanyChange(e);
                                        }}
                                        error={hasErrorInCompany("state")}
                                        errorMsg={displayErrorMessage(
                                          companyState.errors.state
                                        )}
                                      />
                                    </div>
                                    <div className="mt-2 w-1/3">
                                      <h5 className="ml-2 lg:text-defaultTextColor md:text-defaultTextColor text-white text-base  font-bold">
                                        City
                                      </h5>
                                      <FloatingSelectfield
                                        width={"rounded-sm w-full pr-7 py-[7px] px-[10px] bg-gray-200/30"}
                                        label={"City*"}
                                        placeholder={"Select City*"}
                                        optionsGroup={cityList}
                                        name={"city"}
                                        value={companyState.values.city || ""}
                                        onChange={(e) => {
                                          handleCompanyChange(e);
                                        }}
                                        error={hasErrorInCompany("city")}
                                        errorMsg={displayErrorMessage(
                                          companyState.errors.city
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center gap-2 form-group form-box !mb-1 mt-3">
                                    <div className="w-[20%]">
                                      <FloatingTextfield
                                      titleStyle={"rounded-sm py-[7px] px-[10px] bg-gray-200/30"}
                                        name="phoneNumber"
                                        placeholder={"+"}
                                        type="text"
                                        value={
                                          companyState.values.countryCode || ""
                                        }
                                        error={hasErrorInCompany("countryCode")}
                                        errorMsg={displayErrorMessage(
                                          companyState.errors.countryCode
                                        )}
                                      />
                                    </div>
                                    <div className="w-[80%]">
                                      <FloatingTextfield
                                      errorStyles={'absolute'}
                                      titleStyle={"rounded-sm py-[7px] px-[10px] bg-gray-200/30"}
                                        name="phoneNumber"
                                        // type="number"
                                        // label={'Work / Mobile No*'}
                                        placeholder={"Work / Mobile No*"}
                                        value={
                                          companyState.values.phoneNumber || ""
                                        }
                                        onChange={handleCompanyChange}
                                        error={hasErrorInCompany("phoneNumber")}
                                        errorMsg={displayErrorMessage(
                                          companyState.errors.phoneNumber
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className=" flex items-center justify-between gap-2 form-group form-box !mb-1 mt-3">
                                    <div className="company-location text-left w-[20%]">
                                      <h5 className="xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white text-base font-bold mb-1">
                                        Zip Code
                                      </h5>

                                      <FloatingTextfield
                                      errorStyles={'absolute'}
                                      titleStyle={"rounded-sm py-[7px] px-[10px] bg-gray-200/30"}
                                        // label={'ZipCode*'}
                                        placeholder={"ZipCode"}
                                        name="zipCode"
                                        // optionsGroup={country_data}
                                        value={
                                          companyState.values.zipCode || ""
                                        }
                                        onChange={handleCompanyChange}
                                        error={hasErrorInCompany("zipCode")}
                                        errorMsg={displayErrorMessage(
                                          companyState.errors.zipCode
                                        )}
                                      />
                                    </div>
                                    <div className="company-location text-left w-[80%]">
                                      <h5 className="lg:text-defaultTextColor md:text-defaultTextColor text-white text-base lineAfter font-bold mb-1">
                                        Address
                                      </h5>

                                      <FloatingTextfield
                                      errorStyles={'absolute'}
                                      titleStyle={"rounded-sm py-[7px] px-[10px] bg-gray-200/30"}
                                        // label={'Address*'}
                                        placeholder={"Address*"}
                                        name="address"
                                        // optionsGroup={country_data}
                                        value={
                                          companyState.values.address || ""
                                        }
                                        onChange={handleCompanyChange}
                                        error={hasErrorInCompany("address")}
                                        errorMsg={displayErrorMessage(
                                          companyState.errors.address
                                        )}
                                      />
                                    </div>
                                  </div>
                                  {/* <!-- Terms & Conditions --> */}
                                  <div className=" flex mt-3 items-center form-group form-box">
                                    <div className="flex items-center h-5">
                                      <input
                                        name="termsAndCondition"
                                        type="checkbox"
                                        onClick={handleTermsAndCondition}
                                        checked={
                                          signupDetails.termsAndCondition
                                        }
                                        className="focus:ring-brandBlue text-brandBlue hover:border-brandBlue h-5 w-5  border-gray-300 rounded-full cursor-pointer "
                                      />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <p className="text-black">
                                        I agree to the{" "}
                                        <a
                                          href="https://empmonitor.com/terms-and-conditions/"
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-blue font-bold hover:text-[#a6e2ff] transition-all cursor-pointer"
                                        >
                                          Terms & Conditions
                                        </a>{" "}
                                        and
                                        <a
                                          href="https://empmonitor.com/refund-policy/"
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-blue font-bold hover:text-[#a6e2ff] transition-all cursor-pointer"
                                        >
                                          {" "}
                                          Refund
                                        </a>{" "}
                                        &{" "}
                                        <a
                                          href="https://empmonitor.com/privacy-policy/"
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-blue font-bold hover:text-[#a6e2ff] transition-all cursor-pointer"
                                        >
                                          {" "}
                                          Privacy Policy
                                        </a>{" "}
                                      </p>
                                    </div>
                                  </div>
                                  {/* <!-- Create account Btn --> */}
                                  <button
                                    disabled={
                                      !signupDetails.termsAndCondition ||
                                      !companyState.isValid
                                    }
                                    type="submit"
                                    className={`${
                                      !signupDetails.termsAndCondition ||
                                      !companyState.isValid
                                        ? "opacity-50"
                                        : "opacity-100"
                                    } mt-5 w-full flex justify-center py-2.5 px-4 border border-transparent text-base font-medium rounded text-[#1f3a78]
                    bg-blue-400 focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all
                      ${
                        !signupDetails.termsAndCondition ||
                        !companyState.isValid
                          ? ""
                          : "hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none"
                      } `}
                                  >
                                    Proceed to Dashboard
                                  </button>
                                  {/* //code */}
                                </div>
                              </form>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </>
              {/* user details */}
            </div>
          </div>
        </div>
        <div
          className="opacity-25 fixed inset-0 z-40 bg-black"
          // onClick={handleCloseModel}
        ></div>
      </div>
    </>
  );
};

export default UserInfo;
