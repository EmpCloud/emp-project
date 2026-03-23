import React, { useState, useEffect } from 'react';
import { X } from 'react-feather';
import Cookies from 'js-cookie';
import ReactQuill, { Quill } from "react-quill";
import quillEmoji from "quill-emoji";
import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";
import NoSsr from '@COMPONENTS/NoSsr';

interface CustomInputProps {
  text: string;
  onSubmit: (value: string) => void;
  displayClass?: string;
  editClass?: string;
  placeholder?: string;
  defaultValue?: string;
  buttonText?: string;
  validation?: string;
  widthForCard?: string;
  rowsHeight: number;
}

function CustomInput(props: CustomInputProps) {
  const {
    text,
    onSubmit,
    displayClass,
    rowsHeight,
    editClass,
    widthForCard,
    placeholder,
    defaultValue,
    buttonText,
    validation,
    disable,
    disableCardTitle,
    diableDashboard,
  } = props;
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputText, setInputText] = useState(defaultValue || '');
  const [validationMessage, setValidationMessage] = useState('');
  const minCharCount = 4;
  const maxCharCount = 100;
  const minCharDesc = 4;
  const maxCharDesc = 20000;

  useEffect(() => {
    if (defaultValue) {
      setInputText(defaultValue);
    }
  }, [defaultValue]);

  const handleInputChange = (value) => {
    setInputText(value);
    if (validation === 'title') {
      if (value.length < minCharCount) {
        setValidationMessage('Title must contain at least 4 characters.');
      } else if (value.length > maxCharCount) {
        setValidationMessage('Title must not exceed 100 characters.');
      } else {
        setValidationMessage('');
      }
    } else {
      if (value.length < minCharDesc) {
        setValidationMessage('Description must contain at least 4 characters.');
      } else if (value.length > maxCharDesc) {
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
      setInputText(validation === 'title' ? '' : inputText || '');
      setValidationMessage('');
    }
  };

  const handleCreateCard = () => {
    if (disable === true || Cookies.get('isAdmin') === 'true') {
      setIsCustomInput(true);
    } else if (disableCardTitle === true || Cookies.get('isAdmin') === 'true') {
      setIsCustomInput(true);
    } else if (diableDashboard === true || Cookies.get('isAdmin') === 'true') {
      setIsCustomInput(true);
    }
  };
  function makeHttpLinksClickable(description, maxURLLength = 20) {
    const urlRegex = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi;
    const convertedDescription = description?.replace(urlRegex, (url) => {
      let truncatedURL = url;
      if (url.length > maxURLLength) {
        truncatedURL = url.substring(0, maxURLLength) + '...';
        const nextCharIndex = maxURLLength + 3;
        if (nextCharIndex < url.length && url.charAt(nextCharIndex) !== ' ') {
          truncatedURL += ' ';
        }
      }
      const linkTarget = typeof window !== 'undefined' ? '_blank' : '';
      return `<a href="${url}" target="${linkTarget}" style="color: blue">${truncatedURL}</a>`;
    });
  
    return convertedDescription;
  }
  
  Quill.register(
    {
        "formats/emoji": quillEmoji.EmojiBlot,
        "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
        "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
        "modules/emoji-shortname": quillEmoji.ShortNameEmoji,
    },
    true,
);
  
  const convertedText = makeHttpLinksClickable(text);
  const modules = {
    toolbar:{container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        // ['link'],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['emoji'],
        ['clean']
    ]
    },
    clipboard: {
      matchVisual: false,
    },
    'emoji-toolbar': true,
    // "emoji-textarea": true,
    "emoji-shortname": true,
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "size",
    "font",
    "emoji"
  ];

  return (
    <>
      <div className={`custom-input ${widthForCard}`}>
        {isCustomInput ? (
          <form className={`custom-input-edit ${editClass || ''}`} onSubmit={submission}>
            <NoSsr>
            <ReactQuill
              theme="snow"
              value={inputText}
              onChange={handleInputChange}
              modules={modules}
              formats={formats}
            /></NoSsr>
            {validationMessage && <p className="text-red-500">{validationMessage}</p>}
            <div className="custom-input-edit-footer">
              <button
                type="submit"
                disabled={!!validationMessage}
                style={{
                  backgroundColor: validationMessage ? 'lightblue' : '', // Change the background color to light blue when disabled
                }}
              >
                {buttonText || 'Save'}
              </button>
              <X
                onClick={() => {
                  setInputText(validation === 'title' ? '' : inputText || '');
                  setIsCustomInput(false);
                  setValidationMessage('');
                }}
                className="closeIcon"
              />
            </div>
          </form>
        ) : (
          <div className={`custom-input-display bg-slate-50 text-base ${displayClass ? displayClass : ''}`} onClick={handleCreateCard} style={{ whiteSpace: 'pre-line', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
          {convertedText?.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              <span dangerouslySetInnerHTML={{ __html: line }} />
              <br />
            </React.Fragment>
          ))}
        </div>
        )}
      </div>
    </>
  );
}

export default CustomInput;