import React, { useState ,useRef} from 'react';
import dynamic from 'next/dynamic';
import  ReactQuill,{ Quill } from "react-quill";
// const Quill = dynamic(() => import('react-quill'), { ssr: false });
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import the styles for the editor
import 'quill-emoji/dist/quill-emoji.css'; // Import the styles for emoji support
import quillEmoji from "quill-emoji"; // Import Quill module

// Add the emoji module to Quill
const { QuillEmoji } = require('quill-emoji');

Quill.register(
  {
      "formats/emoji": quillEmoji.EmojiBlot,
      "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
      "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
      "modules/emoji-shortname": quillEmoji.ShortNameEmoji,
  },
  true,
);

const EmojiEditor = (value) => {
 
  const quillModules = {
    toolbar:{container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        // ['link'],
        [{ 'font':  []}],
        [{ 'align': [] }],
        ['emoji'],
        ['clean']
    ]
    },
    clipboard: {
      matchVisual: false,
    },
    'emoji-toolbar': true,
    "emoji-shortname": true,
  };
  const formats = [
    'header',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'color',
    'background',
    'font',
    'align',
    'emoji',
    'clean',
  ];
  

  return (
    <div>
      <ReactQuill
        theme="snow"
        modules={quillModules}
        value={value.value}
        onChange={value.onChange}
        formats={formats}
      />
    </div>
  );
};

export default EmojiEditor;
