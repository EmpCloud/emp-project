// import React, { useState } from "react";
// // import "./styles.css";
// export default () => {
//   const [picture, setPicture] = useState(null);
//   const [imgData, setImgData] = useState(null);
//   const onChangePicture = e => {
//     if (e.target.files[0]) {
//
//       setPicture(e.target.files[0]);
//       const reader = new FileReader();
//       reader.addEventListener("load", () => {
//         setImgData(reader.result);
//       });
//       reader.readAsDataURL(e.target.files[0]);
//     }
//   };
//   return (
//     <div className="register_wrapper">
//       <div className="register_player_column_layout_one">
//         <div className="register_player_Twocolumn_layout_two">
//           <form className="myForm">
//             <div className="formInstructionsDiv formElement">
//               <h2 className="formTitle">Sign Up</h2>
//               <p className="instructionsText" />
//               <div className="register_profile_image">
//                 <input id="profilePic" type="file" onChange={onChangePicture} />
//               </div>
//               <div className="previewProfilePic">
//                 <img className="playerProfilePic_home_tile" src={imgData} />
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
import { useState } from 'react';
function App() {
    const [imgfile, uploadimg] = useState([]);

    const imgFilehandler = e => {
        if (e.target.files.length !== 0) {
            uploadimg(imgfile => [...imgfile, URL.createObjectURL(e.target.files[0])]);
        }
    };
    return (
        <div className='py-3 center mx-auto'>
            <div className='bg-white px-4 py-5 rounded-lg shadow-lg text-center w-full'>
                <div className='mb-3'>
                    <img className='w-auto mx-auto rounded-full object-cover object-center h-[50px]' src={imgfile.length != 0 ? imgfile : '/imgs/default.png'} alt='Avatar Upload' />
                </div>
                <label className='cursor-pointer mt-6'>
                    <span className='mt-2 text-base leading-normal px-4 py-2 bg-blue-500 text-white text-sm rounded-full'>Select Profile Image</span>
                    <span className='mt-2 text-base leading-normal px-4 py-2 bg-blue-500 text-white text-sm rounded-full pr-5 pl-5'>Remove</span>
                    <input onChange={imgFilehandler} type='file' className='hidden' multiple='multiple' accept='accept' />
                </label>
            </div>
        </div>
    );
}
export default App;
