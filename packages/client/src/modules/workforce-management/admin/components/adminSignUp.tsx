/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import validate from 'validate.js';
import { useRouter } from 'next/router';
import toast from '@COMPONENTS/Toster/index';
import { registerAdmin } from '../api/post';
import _ from 'lodash';
import { OrgIdSchema } from '@HELPER/schema';
import { adminAddData } from '@HELPER/admin';
import { Country, State, City } from 'country-state-city';
import { FloatingPasswordTextfield } from '../../../../formcomponent/FloatingPasswordTextfield';
import FloatingTextfield from '../../../../formcomponent/FloatingTextfield';
import { isRequiredErrorMessage } from '@HELPER/exportData';
import { displayErrorMessage } from '@HELPER/function';
import { FloatingSelectfield } from '../../../../formcomponent/FloatingSelectfield';
import codes from 'country-calling-code';
// import Head from 'next/head';
import { FiMail } from 'react-icons/fi';
import { CiUser } from "react-icons/ci";
import { generateDicebearUrl } from '@HELPER/avtar';

const companyInitialState = {
  isValid: false,
  values: {
    // countryCode: adminAddData['countryCode'],
    // phoneNumber: adminAddData['phoneNumber'],
    // email: adminAddData['email'],
    // orgId: adminAddData['orgId'],
    // orgName: adminAddData['orgName'],
    // address: adminAddData['address'],
    // city: adminAddData['city'],
    // state: adminAddData['state'],
    // country: adminAddData['country'],
    // zipCode: adminAddData['zipCode'],
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
const basicInitialState = {
  isValid: false,
  values: {
    // firstName: adminAddData['firstName'],
    // lastName: adminAddData['lastName'],
    // userName: adminAddData['userName'],
    // profilePic: adminAddData['profilePic'],
    // password :adminAddData["password"],
    // confirmPassword :adminAddData["password"],
    // email: adminAddData['email'],
    firstName: null,
    lastName: null,
    userName: null,
    // profilePic: 'https://avatars.dicebear.com/api/bottts/' + 'dfsd' + '.svg',
    profilePic: 'https://api.dicebear.com/7.x/initials/svg?seed'+ 'dfsd' + '.svg',
    password: null,
    confirmPassword: null,
    email: null,
  },
  touched: {},
  errors: {
    firstName: null,
    lastName: null,
    userName: null,
    profilePic: null,
    password: null,
    confirmPassword: null,
    email: null,
  },
};

export const index = ({ startLoading, stopLoading }) => {
  const router = useRouter();
  const [showMoreDetails, setshowMoreDetails] = useState(false);
  const [signupDetails, setSignupDetails] = useState({
    userRegisterFor: null,
    termsAndCondition: true,
    basic: {
      index: 1,
      text: 'Basic Details',
      visibility: true,
      isCompleted: false,
      select: true,
    },
    company: {
      index: 2,
      text: 'Company Details',
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
    email: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
      email: { message: "Doesn't look like email." },
      format: {
        pattern: '^(?!.*(gmail|yahoo|orkut|inbox|outlook|mail)).*$',
        message: 'must be professional email.',
      },
    },
    firstName: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
      format: {
        pattern: '[a-zA-Z][a-zA-Z ]*',
        message: 'can only contain alphabets.',
      },
    },
    lastName: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
      format: {
        pattern: '[a-zA-Z][a-zA-Z ]*',
        message: 'can only contain alphabets.',
      },
    },
    confirmPassword: {
      equality: 'password',
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
    },
    password: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
      format: {
        pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,20}$',
        message: ' needs at least one numeric digit, uppercase , lowercase letter and special character .',
      },
      length: {
        maximum: 30,
        minimum: 8,
        message: 'must be at least 8 characters .',
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
        pattern: '^[0-9]*$',
        message: 'can only contain digits.',
      },
      length: {
        maximum: 10,
        minimum: 10,
        message: 'must be 10 digit .',
      },
      numericality: { onlyFloat: true },
    },
    country: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
    },
    // zipCode: {
    //   // presence: { allowEmpty: false, message: isRequiredErrorMessage },
    // 
    //   length: {
    //     maximum: 6,
    //     minimum: 6,
    //     message: 'must be 6 digt.',
    //   },
      
   
    // },
    zipCode: {
   // presence: { allowEmpty: false, message: isRequiredErrorMessage },
        format: {
          pattern: '^([0-9]{6})? *$',
          message: 'Must be empty or 6 digits.',
      },
    },
    address: {
      presence: { allowEmpty: false, message: isRequiredErrorMessage },
    },
  };

  useEffect(() => {
    const errors = validate(basicState.values, basicSchema);
    setBasicState(preBasic => ({
      ...preBasic,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [basicState.values, basicState.isValid]);

  useEffect(() => {
    const errors = validate(companyState.values, companySchema);
    setCompanyState(preCompany => ({
      ...preCompany,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [companyState.values, companyState.isValid]);

  useEffect(() => {
    // document.querySelector('body').classList.add('bg-slate-50');
  }, [signupDetails]);

  const handleShowNextField = e => {
    e.preventDefault();
    setSignupDetails(details => ({
      ...details,
      basic: {
        ...signupDetails.basic,
        isCompleted: true,
        visibility: false,
        select: !signupDetails.basic.select,
      },
      company: {
        ...signupDetails.company,
        select: !signupDetails.company.select,
      },
    }));
    setshowMoreDetails(!showMoreDetails);
  };

  const handleBasicChange = event => {
    event.preventDefault();
    setBasicState(basicState => ({
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

  const handleBackPage = event => {
    event.preventDefault();
    setSignupDetails(details => ({
      ...details,
      basic: {
        ...signupDetails.basic,
        select: !signupDetails.basic.select,
      },
      company: {
        ...signupDetails.company,
        select: !signupDetails.company.select,
      },
    }));
    setshowMoreDetails(!showMoreDetails);
  };

  const handleCompanyChange = event => {
    if (event.target.name === 'orgName') {
      setCompanyState(companyState => ({
        ...companyState,
        values: {
          ...companyState.values,
          orgId: event.target.value.toUpperCase().substring(0, 3) + '-' + Math.random().toString(16).slice(10),
        },
      }));
    }
    if (event.target.name === 'orgId') {
      setCompanyState(companyState => ({
        ...companyState,
        values: {
          ...companyState.values,
          orgId: event.target.value.toUpperCase(),
        },
      }));
    }
    event.preventDefault();
    setCompanyState(companyState => ({
      ...companyState,
      values: {
        ...companyState.values,
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      },
      touched: {
        ...companyState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleSumbmit = e => {
    e.preventDefault();
    if (!signupDetails.termsAndCondition) {
      toast({
        type: 'error',
        message: 'Please indicate that you have read and agree to the Terms and Conditions and Privacy Policy',
      });
      return false;
    }
    startLoading();
    const profilePic = generateDicebearUrl(basicState?.values?.firstName, basicState?.values?.lastName);
    registerAdmin({
      ..._.omit({ ...basicState.values, ...companyState.values ,profilePic}, ['confirmPassword']),
    })
      .then(response => {
        if (response.data.statusCode == 200) {
          stopLoading();
          setTimeout(() => {
          toast({
            type: 'success',
            message: response ? response.data.body.message : '',
          });
          router.push('/w-m/admin/sign-in');
          }, 500); 
        } else {
          toast({
            type: 'error',
            message: response ? response.data.body.error : 'Something went wrong, Try again !',
          });
          stopLoading();
        }
      })
      .catch(function ({ response }) {
        stopLoading();

        toast({
          type: 'error',
          message: response ? response.data.error : 'Something went wrong, Try again !',
        });
      });
  };

  const handlePaste = e => {
    e.preventDefault();
  };

  const hasErrorInBasic = field => !!(basicState.touched[field] && basicState.errors[field]);
  const hasErrorInCompany = field => !!(companyState.touched[field] && companyState.errors[field]);

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
    let phoneData = codes.filter(item => item.country === selectedCountry);

    if (!phoneData[0]) {
      setCompanyState(companyState => ({
        ...companyState,
        values: {
          ...companyState.values,
          countryCode: null,
        },
      }));
      return false;
    }

    let phoneCode = '+' + phoneData[0].countryCodes[0];
    setCompanyState(companyState => ({
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
    let countryList = Country.getAllCountries().map(item => {
      return {
        text: item.name,
        value: item.name,
        isoCode: item.isoCode,
      };
    });
    setCountryList(countryList);
    getState(countryList);
  };

  const getState = countryList => {
    if (!selectedCountry) return false;
    let selectedItem = countryList?.filter(country => country.value == (selectedCountry ? selectedCountry : ''));
    let stateList = State?.getStatesOfCountry(selectedItem ? selectedItem[0].isoCode : '').map(item => {
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

  const getCity = stateList => {
    if (!selectedState) return false;
    let selectedItem = stateList?.filter(state => state.value === (selectedState ? selectedState : ''));
    let cityList = City?.getCitiesOfState(selectedItem ? selectedItem[0]?.countryCode : '', selectedItem ? selectedItem[0]?.isoCode : '').map(item => {
      return {
        text: item.name,
        value: item.name,
      };
    });
    setCityList(cityList);
  };
  const handleClearCity = () => {
    setCompanyState(companyState => ({
      ...companyState,
      values: {
        ...companyState.values,
        state: null,
        city: null,
      },
    }));
  };
  return (
    // <div className='font-inter flex'>
    //   <div className='xl:w-[54%] lg:w-[54%] md:w-[54%] lg:block md:block relative'>
    //     <div className=' h-[124.99vh] xl:bg-gradient-to-r xl:from-[#1f3a78] xl:to-[#239ed9] lg:bg-gradient-to-r lg:from-[#1f3a78] lg:to-[#239ed9] md:bg-gradient-to-r md:from-[#1f3a78] md:to-[#239ed9] lg:block md:block hidden'>
    //       {/* <img src="/imgs/login-img/login-min.jpg" alt="" /> */}
    //       {/* <div className=" w-full h-full bg-blue-500 opacity-40"></div> */}
    //       <div className=' xl:absolute lg:absolute md:absolute lg:flex xl:flex md:flex right-0 justify-content-center gap-4 bg-white text-black flex-col top-[40px] xl:py-[268px] lg:py-[238px] md:py-[180px] h-[91%] text-center w-[50vw] rounded-l-xl'>
    //         <div className='flex justify-center'>
    //           <img className='w-48' src='/imgs/logo.jpg' alt='EmpMonitor' />
    //         </div>
    //         <h2 className='xl:text-3xl lg:text-3xl text-[#1d9bd8] md:text-xl'>Welcome to EmpMonitor</h2>
    //         <h3 className=' font-black lg:text-4xl px-4 text-[#1f3a78] md:text-2xl'>
    //           Elevate Your Workflow, <br /> Master Your Projects
    //         </h3>
    //         <p className='text-[18px] text-[#4d68a8] px-20 md:px-10 lg:block xl:block sm:none'>
    //           Empower your team and boost their efficiency with EmpMonitor&apos;s intuitive project management solution, designed to enhance collaboration and streamline project
    //           workflows effectively.
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    //   <div className='xl:w-[46%] lg:w-[46%] md:w-[46%] w-[100%] lg:my-auto my-5'>
    //     <div className='xl:block lg:block md:block sm:block absolute top-[124px] h-[91%] -mt-[83px] bg-blue-200 xl:bg-gradient-to-r xl:from-[#1f3a78] xl:to-[#239ed9] lg:bg-gradient-to-r lg:from-[#1f3a78] lg:to-[#239ed9] md:bg-gradient-to-r md:from-[#1f3a78] md:to-[#239ed9] sm:hidden w-[50vw] hidden rounded-r-xl'></div>
    //     <section className="container mx-auto">
    //       <div className="flex place-content-center mt-8">
    //         <img className="w-48" src="/imgs/logo.jpg" alt="EmpMonitor" />
    //       </div>
    //     </section>
    //     {/* Progress steps */}
    //     <section className='max-w-sm mx-auto lg:mt-10 mt-4'>
    //       <div className=' xl:absolute lg:absolute md:absolute sm:relative block xl:top-[5%] lg:top-[5%] md:top-[5%] top-0 m-6 mx-auto my-auto mb-5 xl:-ml-[8%] lg:-ml-[7%] md:-ml-[2%] xl:w-[600px] lg:w-[500px] md:w-[380px] w-[80%] xl:bg-transparent md:bg-transparent lg:bg-transparent rounded-xl p-10 sm:bg-blue-500 bg-blue-500'>
    //         <div className='flex pb-1'>
    //           <div className='flex-1'></div>
    //           <div className='flex-1'>
    //             {signupDetails.basic.isCompleted ? (
    //               <div className='flex-1'>
    //                 <div className='w-7 h-7 bg-white mx-auto rounded-full text-sm text-white flex items-center border border-brandBlue'>
    //                   <span className='text-brandBlue text-center w-full'>
    //                     <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mx-auto' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
    //                       <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
    //                     </svg>
    //                   </span>
    //                 </div>
    //               </div>
    //             ) : (
    //               <div
    //                 className={
    //                   signupDetails.basic.select
    //                     ? 'w-7 h-7 bg-[#64bbe4] mx-auto rounded-full text-sm text-black font-bold flex items-center border'
    //                     : 'w-7 h-7 bg-brandBlue  bg-white  mx-auto rounded-full text-sm text-white flex items-center'
    //                 }>
    //                 <span className='text-white text-center w-full'>{signupDetails.basic.index}</span>
    //               </div>
    //             )}
    //           </div>
    //           <div className='w-1/3 align-center items-center align-middle content-center flex'>
    //             <div className='w-full h-0.5 bg-lightGrey opacity-50 rounded items-center align-middle align-center flex-1 overflow-hidden'>
    //               {/* Add w-full to show completed */}
    //               <div className='bg-brandBlue text-base leading-none py-1 text-center text-grey-darkest rounded w-0'></div>
    //             </div>
    //           </div>
    //           <div className='flex-1'>
    //             <div
    //               className={
    //                 !signupDetails.basic.select
    //                   ? 'w-7 h-7 bg-[#64bbe4] mx-auto rounded-full opacity-[1] text-sm text-white flex items-center border'
    //                   : 'w-7 h-7 bg-brandBlue opacity-[0.7] bg-white mx-auto rounded-full text-sm text-white flex items-center'
    //               }>
    //               <span className={!signupDetails.basic.select ? 'text-white font-bold text-center w-full' : 'text-black text-center w-full'}>{signupDetails.company.index}</span>
    //             </div>
    //           </div>
    //           <div className='flex-1'></div>
    //         </div>
    //         <div className='flex text-sm content-center text-center text-white'>
    //           <div className={signupDetails.basic.select ? 'w-2/4 font-bold text-[#64bbe4]' : 'w-2/4'}>{signupDetails.basic.text}</div>
    //           <div className={signupDetails.company.select ? 'w-2/4 font-bold text-[#64bbe4] opacity-[1]' : 'w-2/4 opacity-[0.7]'}>{signupDetails.company.text}</div>
    //         </div>
    //       </div>
    //     </section>
    //     <section className=' mx-auto flex justify-center'>
    //       {/*-- container -- */}
    //       <div className=' absolute top-[15.8%] m-6 mx-auto my-auto mb-5 xl:-ml-24 lg:-ml-[6%] md:-ml-[5%] xl:w-[600px] lg:w-[480px] md:w-[340px] sm:w-[80%] xl:bg-white md:bg-white lg:bg-white rounded-xl p-10 sm:bg-blue-500 bg-blue-500 mt-4'>
    //         <div className='flex justify-between'>
    //           <h2 className='text-center xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white font-bold xl:text-3xl lg:text-2xl md:text-xl sm:text-2xl'>
    //             {signupDetails.basic.select ? signupDetails.basic.text : signupDetails.company.select ? signupDetails.company.text : ''}
    //           </h2>
    //           {signupDetails.company.select && (
    //             <a onClick={handleBackPage} className='flex items-center text-black hover:text-[#a6e2ff] transition-all cursor-pointer'>
    //               <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
    //                 <path strokeLinecap='round' strokeLinejoin='round' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
    //               </svg>
    //             </a>
    //           )}
    //         </div>
    //         {showMoreDetails ? (
    //           <form onSubmit={handleSumbmit} className=' h-[70vh] pb-8 overflow-y-auto px-10 lg:w-[30rem] w-[20rem] hide-scroll lg:-ml-10'>
    //             <div className='mt-8'>
    //               <FloatingTextfield
    //                 type='text'
    //                 error={hasErrorInCompany('orgName')}
    //                 errorMsg={displayErrorMessage(companyState.errors.orgName)}
    //                 name='orgName'
    //                 // label={'Company Name*'}
    //                 placeholder={'Company Name*'}
    //                 value={companyState.values.orgName || ''}
    //                 onChange={handleCompanyChange}
    //               />
    //             </div>
    //             <div className='mt-9 pb-1'>
    //               <FloatingTextfield
    //                 type='text'
    //                 error={hasErrorInCompany('orgId')}
    //                 errorMsg={displayErrorMessage(companyState.errors.orgId)}
    //                 name='orgId'
    //                 // label={'Company Id*'}
    //                 placeholder={'Company Id*'}
    //                 value={companyState.values.orgId || ''}
    //                 onChange={handleCompanyChange}
    //               />
    //             </div>

    //             <div className='mt-5'>
    //               <div className='company-location text-left mb-5'>
    //                 <h5 className='xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white text-base lineAfter font-bold'>Company location</h5>
    //               </div>
    //               <div className='mt-4'>
    //               <h5 className="ml-2 lg:text-defaultTextColor md:text-defaultTextColor text-white text-base  font-bold">
    //               Country
    //                 </h5>
    //                 <FloatingSelectfield
    //                   // label={'Country*'}
    //                   // placeholder={'Country*'}
    //                   optionsGroup={countryList}
    //                   name={'country'}
    //                   value={companyState.values.country || ''}
    //                   onChange={e => {
    //                     setSelectedCountry(e.target.value);
    //                     handleClearCity();
    //                     handleCompanyChange(e);
    //                   }}
    //                   error={hasErrorInCompany('country')}
    //                   errorMsg={displayErrorMessage(companyState.errors.country)}
    //                 />
    //               </div>
    //               <div className='mt-4'>
    //               <h5 className="ml-2 lg:text-defaultTextColor md:text-defaultTextColor text-white text-base  font-bold">
    //               State
    //                 </h5>
    //                 <FloatingSelectfield
    //                   // label={'State*'}
    //                   // placeholder={'State*'}
    //                   optionsGroup={stateList}
    //                   name={'state'}
    //                   value={companyState.values.state || ''}
    //                   onChange={e => {
    //                     handleClearCity();
    //                     setSelectedState(e.target.value);
    //                     handleCompanyChange(e);
    //                   }}
    //                   error={hasErrorInCompany('state')}
    //                   errorMsg={displayErrorMessage(companyState.errors.state)}
    //                 />
    //               </div>
    //               <div className='mt-4'>
    //                 <h5 className="ml-2 lg:text-defaultTextColor md:text-defaultTextColor text-white text-base  font-bold">
    //                 City
    //                 </h5>
    //                 <FloatingSelectfield
    //                   // label={'City*'}
    //                   // placeholder={'City*'}
    //                   optionsGroup={cityList}
    //                   name={'city'}
    //                   value={companyState.values.city || ''}
    //                   onChange={e => {
    //                     handleCompanyChange(e);
    //                   }}
    //                   error={hasErrorInCompany('city')}
    //                   errorMsg={displayErrorMessage(companyState.errors.city)}
    //                 />
    //               </div>
    //               <div className='flex'>
    //                 <div className='w-20'>
    //                   <FloatingTextfield
    //                     name='phoneNumber'
    //                     // placeholder={"+"}
    //                     type='text'
    //                     value={companyState.values.countryCode || ''}
    //                     error={hasErrorInCompany('countryCode')}
    //                     errorMsg={displayErrorMessage(companyState.errors.countryCode)}
    //                   />
    //                 </div>
    //                 <div className='w-80 mx-1'>
    //                   <FloatingTextfield
    //                     name='phoneNumber'
    //                     // type="number"
    //                     // label={'Work / Mobile No*'}
    //                     placeholder={'Work / Mobile No*'}
    //                     value={companyState.values.phoneNumber || ''}
    //                     onChange={handleCompanyChange}
    //                     error={hasErrorInCompany('phoneNumber')}
    //                     errorMsg={displayErrorMessage(companyState.errors.phoneNumber)}
    //                   />
    //                 </div>
    //               </div>
    //               <div className='company-location text-left  mt-5'>
    //                 {/* <h5 className="xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white text-base lineAfter font-bold">
    //                   Zip Code
    //                 </h5> */}
    //               </div>
    //               <FloatingTextfield
    //                 // label={'ZipCode*'}
    //                 placeholder={'ZipCode*'}
    //                 name='zipCode'
    //                 // optionsGroup={country_data}
    //                 value={companyState.values.zipCode || ''}
    //                 onChange={handleCompanyChange}
    //                 error={hasErrorInCompany('zipCode')}
    //                 errorMsg={displayErrorMessage(companyState.errors.zipCode)}
    //               />

    //               <div className='company-location text-left mt-8'>
    //                 {/* <h5 className="lg:text-defaultTextColor md:text-defaultTextColor text-white text-base lineAfter font-bold">
    //                   Address
    //                 </h5> */}

    //                 <FloatingTextfield
    //                   // label={'Address*'}
    //                   placeholder={'Address*'}
    //                   name='address'
    //                   // optionsGroup={country_data}
    //                   value={companyState.values.address || ''}
    //                   onChange={handleCompanyChange}
    //                   error={hasErrorInCompany('address')}
    //                   errorMsg={displayErrorMessage(companyState.errors.address)}
    //                 />
    //               </div>
    //               {/* <!-- Terms & Conditions --> */}
    //               <div className='mt-5 flex items-start'>
    //                 <div className='flex items-center h-5'>
    //                   <input
    //                     name='termsAndCondition'
    //                     type='checkbox'
    //                     onClick={handleTermsAndCondition}
    //                     checked={signupDetails.termsAndCondition}
    //                     className='focus:ring-brandBlue text-brandBlue hover:border-brandBlue h-5 w-5  border-gray-300 rounded-full cursor-pointer '
    //                   />
    //                 </div>
    //                 <div className='ml-3 text-sm'>
    //                   <p className='text-black'>
    //                     I agree to the{' '}
    //                     <a
    //                       href='https://empmonitor.com/terms-and-conditions/'
    //                       target='_blank'
    //                       className='text-blue font-bold hover:text-[#a6e2ff] transition-all cursor-pointer'>
    //                       Terms & Conditions
    //                     </a>{' '}
    //                     and
    //                     <a href='https://empmonitor.com/refund-policy/' target='_blank' className='text-blue font-bold hover:text-[#a6e2ff] transition-all cursor-pointer'>
    //                       {' '}
    //                       Refund
    //                     </a>{' '}
    //                     &{' '}
    //                     <a href='https://empmonitor.com/privacy-policy/' target='_blank' className='text-blue font-bold hover:text-[#a6e2ff] transition-all cursor-pointer'>
    //                       {' '}
    //                       Privacy Policy
    //                     </a>{' '}
    //                   </p>
    //                 </div>
    //               </div>
    //               {/* <!-- Create account Btn --> */}
    //               <button
    //                 disabled={!signupDetails.termsAndCondition || !companyState.isValid}
    //                 type='submit'
    //                 className={`${!signupDetails.termsAndCondition || !companyState.isValid ? 'opacity-50' : 'opacity-100'
    //                   } mt-5 w-full flex justify-center py-2.5 px-4 border border-transparent text-xl font-medium rounded-full text-[#1f3a78]
    //                 bg-white focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all
    //                   ${!signupDetails.termsAndCondition || !companyState.isValid ? '' : 'hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none'} `}>
    //                 Create account
    //               </button>
    //               {/* //code */}
    //             </div>
    //           </form>
    //         ) : (
    //           <form onSubmit={handleShowNextField} className=' h-[70vh] pb-8 overflow-y-auto px-10 xl:w-[38rem] lg:w-[30rem] w-[20rem] hide-scroll lg:-ml-10 md:-ml-10'>
    //             <div className='mt-4'>
    //               <FloatingTextfield
    //                 type='email'
    //                 error={hasErrorInBasic('email')}
    //                 errorMsg={displayErrorMessage(basicState.errors.email)}
    //                 name='email'
    //                 // label={'Your Work Email Address*'}
    //                 placeholder={'Your Work Email Address*'}
    //                 value={basicState.values.email || ''}
    //                 onChange={handleBasicChange}
    //               />
    //               <div className='mt-6'>
    //                 <FloatingTextfield
    //                   type='text'
    //                   error={hasErrorInBasic('userName')}
    //                   errorMsg={displayErrorMessage(basicState.errors.userName)}
    //                   name='userName'
    //                   // label={'User Name*'}
    //                   placeholder={'User Name*'}
    //                   value={basicState.values.userName || ''}
    //                   onChange={handleBasicChange}
    //                 />
    //               </div>
    //               <div className='mt-6'>
    //                 <FloatingTextfield
    //                   type='text'
    //                   error={hasErrorInBasic('firstName')}
    //                   errorMsg={displayErrorMessage(basicState.errors.firstName)}
    //                   name='firstName'
    //                   // label={'First Name*'}
    //                   placeholder={'First Name*'}
    //                   value={basicState.values.firstName || ''}
    //                   onChange={handleBasicChange}
    //                 />
    //               </div>
    //               <div className='mt-6'>
    //                 <FloatingTextfield
    //                   type='text'
    //                   error={hasErrorInBasic('lastName')}
    //                   errorMsg={displayErrorMessage(basicState.errors.lastName)}
    //                   name='lastName'
    //                   // label={'Last Name*'}
    //                   placeholder={'Last Name*'}
    //                   value={basicState.values.lastName || ''}
    //                   onChange={handleBasicChange}
    //                 />
    //               </div>
    //               <div className='wrapper relative mt-6'>
    //                 <FloatingPasswordTextfield
    //                   name='password'
    //                   state={visibility.password}
    //                   // label={'Your Password'}
    //                   placeholder={'Your Password'}
    //                   value={basicState.values.password || ''}
    //                   onClick={handleClickShowPassword}
    //                   onChange={handleBasicChange}
    //                   error={hasErrorInBasic('password')}
    //                   topPosition={'top-4'}
    //                   errorMsg={displayErrorMessage(basicState.errors.password)}
    //                 />
    //               </div>
    //               <div className='wrapper relative mt-6'>
    //                 <FloatingPasswordTextfield
    //                   name='confirmPassword'
    //                   state={visibility.confirmPassword}
    //                   // label={'Confirm Password'}
    //                   placeholder={'Confirm Password'}
    //                   value={basicState.values.confirmPassword || ''}
    //                   onClick={handleClickShowConfirmPassword}
    //                   onChange={handleBasicChange}
    //                   error={hasErrorInBasic('confirmPassword')}
    //                   topPosition={'top-4'}
    //                   errorMsg={displayErrorMessage(basicState.errors.confirmPassword)}
    //                   onPaste={e => handlePaste(e)}
    //                 />
    //               </div>
    //             </div>
    //             {/* <!-- Continue Btn --> */}
    //             <button
    //               type='submit'
    //               className={` ${!basicState.isValid ? 'opacity-50' : 'opacity-100'
    //                 } mt-6 items-center w-full flex justify-center py-2.5 px-4 border border-transparent text-xl font-medium rounded-full text-[#1f3a78]
    //               bg-white focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all
    //                 ${!basicState.isValid ? '' : 'hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none'} `}
    //               disabled={!basicState.isValid}
    //               >
    //               Continue
    //             </button>
    //           </form>
    //         )}
    //         <div className='text-center mt-4'>
    //           <p className='xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white text-sm'>
    //             Already have an account?
    //             <a
    //               onClick={() => router.push('/w-m/admin/sign-in')}
    //               className='font-bold text-white md:text-[#259ed9] hover:text-darkTextColor md:hover:text-[#1f3f7d] transition-all cursor-pointer'>
    //               {' '}
    //               Sign in
    //             </a>
    //           </p>
    //         </div>
    //       </div>
    //     </section>
    //   </div>
    // </div>
    <>
    {/* <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    </Head> */}
    <div className="login-8 font-inter">
    <div className="w-[90%] md:w-[80%]">
        <div className="flex justify-center login-box">
        <div className="w-[100%] lg:w-[60%] form-info">
                <div className="form-section">
                    {/* <div className="logo clearfix flex justify-center">
                        <a href="login-20.html">
                            <img src="/imgs/logo.jpg" alt="logo"/>
                        </a>
                    </div> */}
                    <h3>Create An Account</h3>
                    {/* Progress steps */}
         <section className=''>
           <div className=''>
             <div className='flex pb-1'>
               <div className='flex-1'></div>
              <div className='flex-1'>
                 {signupDetails.basic.isCompleted ? (
                  <div className='flex-1'>
                    <div className='w-5 h-5 bg-green-300 mx-auto rounded-full text-sm text-white flex items-center border '>
                      <span className='text-brandBlue text-center w-full'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mx-auto' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                          <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                        </svg>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      signupDetails.basic.select
                        ? 'w-5 h-5 bg-[#64bbe4] mx-auto rounded-full text-sm text-black font-bold flex items-center border'
                        : 'w-5 h-5 bg-brandBlue  bg-white  mx-auto rounded-full text-sm text-white flex items-center'
                    }>
                    <span className='text-white text-center w-full'>{signupDetails.basic.index}</span>
                  </div>
                )}
              </div>
              <div className='w-1/3 align-center items-center align-middle content-center flex'>
                <div className='w-full h-0.5 bg-lightGrey opacity-50 rounded items-center align-middle align-center flex-1 overflow-hidden'>
                  {/* Add w-full to show completed */}
                  <div className='bg-brandBlue text-base leading-none py-1 text-center text-grey-darkest rounded w-0'></div>
                </div>
              </div>
              <div className='flex-1'>
                <div
                  className={
                    !signupDetails.basic.select
                      ? 'w-5 h-5 bg-[#64bbe4] mx-auto rounded-full opacity-[1] text-sm text-white flex items-center border'
                      : 'w-5 h-5 bg-brandBlue opacity-[0.7] bg-gray-400 mx-auto rounded-full text-sm text-white flex items-center'
                  }>
                  <span className={!signupDetails.basic.select ? 'text-white font-bold text-center w-full' : 'text-black text-center w-full'}>{signupDetails.company.index}</span>
                </div>
              </div>
              <div className='flex-1'></div>
            </div>
            <div className='flex text-sm content-center text-center text-white'>
              <div className={signupDetails.basic.select ? 'w-2/4 font-bold text-[#64bbe4]' : 'w-2/4 text-green-400'}>{signupDetails.basic.text}</div>
              <div className={signupDetails.company.select ? 'w-2/4 font-bold text-[#64bbe4] opacity-[1]' : 'w-2/4 opacity-[0.7] text-darkTextColor'}>{signupDetails.company.text}</div>
            </div>
          </div>
        </section>
        <section className=' mx-auto flex justify-center'>
          {/*-- container -- */}
          <div className=' '>
            <div className=''>
              <h2 className=' text-xl text-defaultTextColor'>
                {signupDetails.basic.select ? signupDetails.basic.text : signupDetails.company.select ? signupDetails.company.text : ''}
              </h2>
              {signupDetails.company.select && (
                <a onClick={handleBackPage} className='flex items-center text-black hover:text-[#a6e2ff] transition-all cursor-pointer'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                  </svg>
                </a>
              )}
            </div>
                    <div className="login-inner-form">
                    {showMoreDetails ? (
              <form onSubmit={handleSumbmit} className=''>
                <div className='flex items-center justify-between gap-2 form-group form-box !mb-1'>          
                <div className='w-2/4'>
                  <FloatingTextfield
                    type='text'
                    error={hasErrorInCompany('orgName')}
                    errorMsg={displayErrorMessage(companyState.errors.orgName)}
                    name='orgName'
                    // label={'Company Name*'}
                    placeholder={'Company Name*'}
                    value={companyState.values.orgName || ''}
                    onChange={handleCompanyChange}
                  />
                </div>
                <div className='w-2/4'>
                  <FloatingTextfield
                    type='text'
                    error={hasErrorInCompany('orgId')}
                    errorMsg={displayErrorMessage(companyState.errors.orgId)}
                    name='orgId'
                    // label={'Company Id*'}
                    placeholder={'Company Id*'}
                    value={companyState.values.orgId || ''}
                    onChange={handleCompanyChange}
                  />
                </div>
                </div>

                
                <div className=''>
                
                  {/* <div className='company-location text-left !mb-1'>
                    <h5 className='xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white text-base lineAfter font-bold'>Company location</h5>
                  </div> */}
                  <div className=' flex gap-2 justify-between items-center form-group form-box !mb-1'>

                  
                  <div className='mt-2 w-[33.3%]'>
                  {/* <h5 className="ml-2 lg:text-defaultTextColor md:text-defaultTextColor text-white text-base  font-bold">
                  Country
                    </h5> */}
                    <FloatingSelectfield
                      label={'Country*'}
                      placeholder={'Select Country*'}
                      optionsGroup={countryList}
                      name={'country'}
                      value={companyState.values.country || ''}
                      onChange={e => {
                        setSelectedCountry(e.target.value);
                        handleClearCity();
                        handleCompanyChange(e);
                      }}
                      error={hasErrorInCompany('country')}
                      errorMsg={displayErrorMessage(companyState.errors.country)}
                    />
                  </div>
                  <div className='mt-2 w-[33.3%]'>
                  {/* <h5 className="ml-2 lg:text-defaultTextColor md:text-defaultTextColor text-white text-base  font-bold">
                  State
                    </h5> */}
                    <FloatingSelectfield
                      label={'State*'}
                      placeholder={'Select State*'}
                      optionsGroup={stateList}
                      name={'state'}
                      value={companyState.values.state || ''}
                      onChange={e => {
                        handleClearCity();
                        setSelectedState(e.target.value);
                        handleCompanyChange(e);
                      }}
                      error={hasErrorInCompany('state')}
                      errorMsg={displayErrorMessage(companyState.errors.state)}
                    />
                  </div>
                  <div className='mt-2 w-[33.3%]'>
                    {/* <h5 className="ml-2 lg:text-defaultTextColor md:text-defaultTextColor text-white text-base  font-bold">
                    City
                    </h5> */}
                    <FloatingSelectfield
                      label={'City*'}
                      placeholder={'Select City*'}
                      optionsGroup={cityList}
                      name={'city'}
                      value={companyState.values.city || ''}
                      onChange={e => {
                        handleCompanyChange(e);
                      }}
                      error={hasErrorInCompany('city')}
                      errorMsg={displayErrorMessage(companyState.errors.city)}
                    />
                  </div>
                  </div>
                  <div className='flex justify-between items-center gap-2 form-group form-box !mb-1'>
                    <div className='w-[20%]'>
                      <FloatingTextfield
                        name='phoneNumber'
                        // placeholder={"+"}
                        type='text'
                        value={companyState.values.countryCode || ''}
                        error={hasErrorInCompany('countryCode')}
                        errorMsg={displayErrorMessage(companyState.errors.countryCode)}
                      />
                    </div>
                    <div className='w-[80%]'>
                      <FloatingTextfield
                        name='phoneNumber'
                        // type="number"
                        // label={'Work / Mobile No*'}
                        placeholder={'Work / Mobile No*'}
                        value={companyState.values.phoneNumber || ''}
                        onChange={handleCompanyChange}
                        error={hasErrorInCompany('phoneNumber')}
                        errorMsg={displayErrorMessage(companyState.errors.phoneNumber)}
                      />
                    </div>
                  </div>
                    <div className=' flex items-center justify-between gap-2 form-group form-box !mb-1'>
                  <div className='company-location text-left w-[20%]'>
                    {/* <h5 className="xl:text-defaultTextColor lg:text-defaultTextColor md:text-defaultTextColor text-white text-base lineAfter font-bold">
                      Zip Code
                    </h5> */}
                  
                  <FloatingTextfield
                    // label={'ZipCode*'}
                    placeholder={'ZipCode'}
                    name='zipCode'
                    // optionsGroup={country_data}
                    value={companyState.values.zipCode || ''}
                    onChange={handleCompanyChange}
                    error={hasErrorInCompany('zipCode')}
                    errorMsg={displayErrorMessage(companyState.errors.zipCode)}
                  />
                  </div>
                  <div className='company-location text-left w-[80%]'>
                    {/* <h5 className="lg:text-defaultTextColor md:text-defaultTextColor text-white text-base lineAfter font-bold">
                      Address
                    </h5> */}

                    <FloatingTextfield
                      // label={'Address*'}
                      placeholder={'Address*'}
                      name='address'
                      // optionsGroup={country_data}
                      value={companyState.values.address || ''}
                      onChange={handleCompanyChange}
                      error={hasErrorInCompany('address')}
                      errorMsg={displayErrorMessage(companyState.errors.address)}
                    />
                  </div>
                  </div>
                  {/* <!-- Terms & Conditions --> */}
                  <div className=' flex items-start form-group form-box'>
                    <div className='flex items-center h-5'>
                      <input
                        name='termsAndCondition'
                        type='checkbox'
                        onClick={handleTermsAndCondition}
                        checked={signupDetails.termsAndCondition}
                        className='focus:ring-brandBlue text-brandBlue hover:border-brandBlue h-5 w-5  border-gray-300 rounded-full cursor-pointer '
                      />
                    </div>
                    <div className='ml-3 text-sm'>
                      <p className='text-black'>
                        I agree to the{' '}
                        <a
                          href='https://empmonitor.com/terms-and-conditions/'
                          target='_blank'
                          className='text-blue font-bold hover:text-[#a6e2ff] transition-all cursor-pointer'>
                          Terms & Conditions
                        </a>{' '}
                        and
                        <a href='https://empmonitor.com/refund-policy/' target='_blank' className='text-blue font-bold hover:text-[#a6e2ff] transition-all cursor-pointer'>
                          {' '}
                          Refund
                        </a>{' '}
                        &{' '}
                        <a href='https://empmonitor.com/privacy-policy/' target='_blank' className='text-blue font-bold hover:text-[#a6e2ff] transition-all cursor-pointer'>
                          {' '}
                          Privacy Policy
                        </a>{' '}
                      </p>
                    </div>
                  </div>
                  {/* <!-- Create account Btn --> */}
                  <button
                    disabled={!signupDetails.termsAndCondition || !companyState.isValid}
                    type='submit'
                    className={`${!signupDetails.termsAndCondition || !companyState.isValid ? 'opacity-50' : 'opacity-100'
                      } mt-5 w-full flex justify-center py-2.5 px-4 border border-transparent text-base font-medium rounded text-[#1f3a78]
                    bg-blue-400 focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all
                      ${!signupDetails.termsAndCondition || !companyState.isValid ? '' : 'hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none'} `}>
                    Create account
                  </button>
                  {/* //code */}
                </div>
              </form>
            ) : (
              <form onSubmit={handleShowNextField} className=''>
                {/* <div className='flex'> */}
                <div className='form-group form-box !mb-1'>
                  <FloatingTextfield
                    type='email'
                    error={hasErrorInBasic('email')}
                    errorMsg={displayErrorMessage(basicState.errors.email)}
                    name='email'
                    // label={'Your Work Email Address*'}
                    placeholder={'Your Work Email Address*'}
                    value={basicState.values.email || ''}
                    onChange={handleBasicChange}
                  />
                  <i><FiMail className="h-5 w-5 text-defaultTextColor"/></i>
                  </div>
                  <div className='form-group form-box !mb-1'>
                    <FloatingTextfield
                      type='text'
                      error={hasErrorInBasic('userName')}
                      errorMsg={displayErrorMessage(basicState.errors.userName)}
                      name='userName'
                      // label={'User Name*'}
                      placeholder={'User Name*'}
                      value={basicState.values.userName || ''}
                      onChange={handleBasicChange}
                    />
                  </div>
                  {/* </div> */}
                  <div className=' flex items-center justify-between gap-2 form-group form-box !mb-1'> 

                  
                  <div className='w-2/4'>
                    <FloatingTextfield
                      type='text'
                      error={hasErrorInBasic('firstName')}
                      errorMsg={displayErrorMessage(basicState.errors.firstName)}
                      name='firstName'
                      // label={'First Name*'}
                      placeholder={'First Name*'}
                      value={basicState.values.firstName || ''}
                      onChange={handleBasicChange}
                    />
                  </div>
                  <div className='w-2/4'>
                    <FloatingTextfield
                      type='text'
                      error={hasErrorInBasic('lastName')}
                      errorMsg={displayErrorMessage(basicState.errors.lastName)}
                      name='lastName'
                      // label={'Last Name*'}
                      placeholder={'Last Name*'}
                      value={basicState.values.lastName || ''}
                      onChange={handleBasicChange}
                    />
                  </div>
                  </div>
                  <div className=' flex  flex-col md:flex-row items-center gap-2 form-group form-box'>

                  
                  <div className='wrapper relative w-full md:w-2/4'>
                    <FloatingPasswordTextfield
                      name='password'
                      state={visibility.password}
                      // label={'Your Password'}
                      placeholder={'Your Password'}
                      value={basicState.values.password || ''}
                      onClick={handleClickShowPassword}
                      onChange={handleBasicChange}
                      error={hasErrorInBasic('password')}
                      topPosition={'top-6'}
                      errorMsg={displayErrorMessage(basicState.errors.password)}
                    />
                  </div>
                  <div className='wrapper relative w-full md:w-2/4'>
                    <FloatingPasswordTextfield
                      name='confirmPassword'
                      state={visibility.confirmPassword}
                      // label={'Confirm Password'}
                      placeholder={'Confirm Password'}
                      value={basicState.values.confirmPassword || ''}
                      onClick={handleClickShowConfirmPassword}
                      onChange={handleBasicChange}
                      error={hasErrorInBasic('confirmPassword')}
                      topPosition={'top-6'}
                      errorMsg={displayErrorMessage(basicState.errors.confirmPassword)}
                      onPaste={e => handlePaste(e)}
                    />
                  </div>
                  </div>
                {/* <!-- Continue Btn --> */}
                <button
                  type='submit'
                  className={`mt-8 w-full flex justify-center py-2.5 px-4 border border-transparent text-base font-medium rounded text-[#1f3a78] 
                  ${!basicState.isValid ? 'opacity-50' : 'opacity-100'} 
                  ${!basicState.isValid ? '' : 'hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none'
                              } bg-blue-400 focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all `}
                  disabled={!basicState.isValid}
                  >
                  Continue
                </button>
              </form>
            )}
            </div>
            </div>
            </section>
            <p className="text !text-base">Already a member?<span className=' cursor-pointer font-semibold text-[#2b5fc0]' onClick={() => router.push('/w-m/admin/sign-in')}> Login here</span></p>
                        {/* <form action="#" method="GET">
                            <div className="form-group form-box">
                                <input type="text" name="name" className="form-control" placeholder="Full Name" aria-label="Full Name"/>
                                <i className="flaticon-user"></i>
                            </div>
                            <div className="form-group form-box">
                                <input type="email" name="email" className="form-control" placeholder="Email Address" aria-label="Email Address"/>
                                <i className="flaticon-mail-2"></i>
                            </div>
                            <div className="form-group form-box">
                                <input type="password" name="password" className="form-control" autoComplete="off" placeholder="Password" aria-label="Password"/>
                                <i className="flaticon-password"></i>
                            </div>
                            <div className="checkbox form-group form-box">
                                <div className="form-check checkbox-theme">
                                    <input className="form-check-input" type="checkbox" value="" id="rememberMe"/>
                                    <label className="form-check-label" htmlFor="rememberMe">
                                        I agree to the <a href="#">terms of service</a>
                                    </label>
                                </div>
                            </div>
                            <div className="form-group mb-0">
                                <button type="submit" className="btn-md btn-theme w-100">Register</button>
                            </div>
                            <p className="text">Already a member?<a href="login-8.html"> Login here</a></p>
                        </form> */}
                    </div>
        </div>
        <div className="w-[40%] bg-img">
                <div className="info">
                    <div className="btn-section clearfix">
                    <div className=" text-2xl font-semibold mr-2 text-white">Admin</div>
                        <div className="link-btn btn-1 active default-bg mr-2 cursor-pointer" onClick={() => router.push('/w-m/admin/sign-up')}>Register</div>
                        <div className="link-btn btn-1 cursor-pointer" onClick={() => router.push('/w-m/admin/sign-in')}>Login</div>
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
export default index;
