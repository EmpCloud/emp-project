import React, { useRef, useEffect } from 'react';
import { GrClose } from 'react-icons/gr';
import toast from '../../../src/components/Toster';
import clipboardCopy from 'clipboard-copy'; // Import a clipboard library

const ShareModal = ({ isOpen, onClose, positionShare, Title, marginT, CloseBtn, CloseIcon, ShareLink, setCopyLink, shareLinks }) => {
  if (!isOpen) {
    return null;
  }

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);


  const copyLinkToClipboard = async () => {
    try {
      await clipboardCopy(ShareLink);
      toast({
        type: 'success',
        message: 'Link Copied Successfully!',
    });
    } catch (error) {
      toast({
        type: 'error',
        message: error?error:'Something went wrong, Try again !',
    }); 
    }
  };

  
  return (
    <div className={`${positionShare}`}>
      <div className='modal-content p-5 flex flex-col bg-slate-100 dark:bg-gray-900 dark:shadow dark:shadow-gray-950 relative'>
        <h1 className='text-center font-bold'>{Title}</h1>
        <button className=' absolute right-4 top-3 hover:bg-slate-200 p-2 rounded-full cursor-pointer' onClick={onClose}><GrClose/></button>
        <div className={`flex flex-col gap-3 ${marginT} relative`}>
          {/* <div
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <span className=' absolute -top-3 -right-2 ms-4' onClick={copyLinkToClipboard}>
              {CloseIcon}
            </span>
          </div> */}
          <label htmlFor='shareLink' className='font-bold '>
            Link to this card
          </label>
          <input
            ref={inputRef}
            value={ShareLink}
            className='text-sm font-medium text-gray-900 dark:text-white border py-1 px-2 outline-none '
            id='shareLink'
            type='text'
          />
        </div>

        <div className='flex justify-center' onClick={copyLinkToClipboard}>
          {CloseBtn}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
