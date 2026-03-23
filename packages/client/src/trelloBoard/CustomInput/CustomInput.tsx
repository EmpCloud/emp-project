import React, { useState ,useEffect} from 'react';
import { X } from 'react-feather';
import Cookies from 'js-cookie';
import { Tooltip } from '@material-tailwind/react';


interface CustomInputProps {
    text: string;
    onSubmit: (value: string) => void;
    displayClass?: string;
    editClass?: string;
    placeholder?: string;
    defaultValue?: string;
    buttonText?: string;
    validation?: string;
    widthForCard?:string;
    rowsHeight:number;
}

function CustomInput(props: CustomInputProps) {
    const { text, onSubmit, displayClass,rowsHeight, editClass,widthForCard, placeholder, defaultValue, buttonText, type, cardStatusCode ,validation,disable,disableCardTitle,diableDashboard} = props;
    const [isCustomInput, setIsCustomInput] = useState(false);
    const [inputText, setInputText] = useState(defaultValue || '');
    const [validationMessage, setValidationMessage] = useState('');
    const minCharCount = 4;
    const maxCharCount = 100;
    const minCharDesc = 4;
    const maxCharDesc = 20000;

    useEffect(()=>{
        if(defaultValue){
            setInputText(defaultValue);
        }
    },[defaultValue])
    
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    function makeHttpLinksClickable(description, maxURLLength = 20) {
        const urlRegex = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi;
        const convertedDescription = description?.replace(urlRegex, url => {
            let truncatedURL = url;
            if (url.length > maxURLLength) {
                truncatedURL = url.substring(0, maxURLLength) + '...';
                const nextCharIndex = maxURLLength + 3;
                if (nextCharIndex < url.length && url.charAt(nextCharIndex) !== ' ') {
                    truncatedURL += ' ';
                }
            }
            return `<a href="${url}" target="_blank" style="color: blue">${truncatedURL}</a>`;
        });

        return convertedDescription;
    }
        const convertedText = makeHttpLinksClickable(text);
    return (
        <>
        {/* <ToolTip message='Add card'> */}
            <div className={`custom-input ${widthForCard}`}>
                {isCustomInput ? (
                    <form className={`custom-input-edit ${editClass ? editClass : ''}`} onSubmit={submission}>
                        <textarea
                            type={type ? type : 'text'}
                            value={inputText}
                            placeholder={placeholder || text}
                            onChange={handleInputChange}
                            autoFocus
                            rows={rowsHeight}
                            className='p-3 outline-none border dark:bg-gray-950 rounded dark:text-gray-50 mt-0 placeholder:text-base text-base'
                        />
                        <div className=' bg-black inset-0 z-20 relative'>

                        </div>
                        {validationMessage && <p className="text-red-500 text-base">{validationMessage}</p>}
                        <div className='custom-input-edit-footer'>
                        <button
                            type='submit'
                            disabled={!!validationMessage}
                            className='text-sm bg-blue-200 font-semibold hover:bg-blue-300'
                        >
                                {buttonText || 'Save'}
                            </button>
                            <X
                                onClick={() => {
                                    setInputText(validation==="title"?'':(inputText??''));
                                    setIsCustomInput(false);
                                    setValidationMessage('');
                                }}
                                className='closeIcon'
                            />
                        </div>
                    </form>
                ) : (
                    <div className={`custom-input-display bg-slate-50 dark:bg-gray-900 dark:text-gray-50 text-base ${displayClass ? displayClass : ''}`} onClick={handleCreateCard} style={{ whiteSpace: 'pre-line' }}>
                    {convertedText?.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                        <span dangerouslySetInnerHTML={{ __html: line }} />
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                )}
            </div>
            {/* </ToolTip> */}
        </>
    );
}

export default CustomInput;
