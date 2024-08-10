import { useEffect, useRef, useState } from 'react';

export default function TextArea({ text, placeholder, setMessage, onChange, index, disabled }) {
  const textareaRef = useRef(null);
  let [noOfChars, setNumberOfchars] = useState(text?.length);
  let [value, setValue] = useState(text);
  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
      return;
    }
    setNumberOfchars(e.target.value.length);

    setMessage(e.target.value, index);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight +26 }px`;
    }
  }, [textareaRef?.current?.value]);
  
  useEffect(() => {
    setValue(text || ''); 
  }, [text]);
  return (
    <div className="relative w-full h-full">
      <textarea
        ref={textareaRef}
        onChange={handleChange}
        placeholder={placeholder || ''}
        value={value}
        className="h-full w-full text-base font-normal tracking-wider rounded-lg py-4 px-3 border-[1px] font-Poppins bg-white text-black disabled:cursor-not-allowed"
        style={{ border: '1px solid #616161', resize: 'none' }}
        onInput={() => {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }}
        disabled={disabled}
      />
    </div>
  );
}
