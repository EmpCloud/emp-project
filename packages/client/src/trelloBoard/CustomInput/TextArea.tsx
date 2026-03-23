import React, { useState ,useEffect} from 'react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const MyQuillEditor = (props) => {
  const { text, onSubmit, displayClass,rowsHeight, editClass,widthForCard, placeholder, defaultValue, buttonText, type, cardStatusCode ,validation,disable,disableCardTitle,diableDashboard} = props;

  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputText, setInputText] = useState(defaultValue || '');
  const [validationMessage, setValidationMessage] = useState('');
  const minCharCount = 4;
  const maxCharCount = 100;
  const minCharDesc = 4;
  const maxCharDesc = 20000;
  const handleChange = (value) => {
    setText(value);
  };
  const handleInputChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);
    if(validation==="title"){
    if (newText.length < minCharCount) {
        setValidationMessage('Title must contain at least 4 characters.');
    } else if (newText.length > maxCharCount) {
        setValidationMessage('Title must not exceed 100 characters.');
    } else {
        setValidationMessage('');
    }}else{
      if (newText.length < minCharDesc) {
        setValidationMessage('Description must contain at least 4 characters.');
    } else if (newText.length > maxCharDesc) {
        setValidationMessage('Description must not exceed 20000 characters.');
    } else {
        setValidationMessage('');
    }
    }
};

const submission = (e: any) => {
    e.preventDefault();
    if (inputText && onSubmit && validationMessage === '') {
        onSubmit(inputText);
        setIsCustomInput(false);
        setInputText(validation==="title"?'':(inputText??''));
        setValidationMessage('');
    }
};
const handleCreateCard = () =>{
    
    if(disable===true||Cookies.get("isAdmin")==="true"){
    setIsCustomInput(true);
    }else if(disableCardTitle===true||Cookies.get("isAdmin")==="true"){
    setIsCustomInput(true);
    }else if(diableDashboard===true||Cookies.get("isAdmin")==="true"){
    setIsCustomInput(true);
    }
}
  return (
    <div>
      <ReactQuill 
      value={inputText}
      onChange={handleInputChange}
      />
    </div>
  );
};

export default MyQuillEditor;
