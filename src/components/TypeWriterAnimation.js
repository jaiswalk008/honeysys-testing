import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Typewriter from 'typewriter-effect';
const TypeWriterAnimation = forwardRef(
  ({ responseMessage, setLoading, defaultValueAdded }, ref) => {
    const [animatedText, setAnimatedText] = useState('');
    const [animatingText, setAnimatingText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [writer, setWriter] = useState();
    const [writerState, setWriterState] = useState();
    const timerRef = useRef(null);
    useEffect(() => {
      // Clearing the interval when the component unmounts
      return () => clearTimeout(timerRef.current);
    }, []);

    useEffect(() => {
      if (responseMessage) {
        const replaceText = responseMessage.replace(animatedText, '');
        // console.log(replaceText, defaultValueAdded.current, animatedText);
        if (replaceText === '' && defaultValueAdded.current) {
          return;
        }
        if (animatingText === '') {
          setAnimatingText(responseMessage);
          defaultValueAdded.current = true;
        } else if (!isAnimating) {
          setAnimatingText(replaceText);
        }
        setIsAnimating(true);
      }
    }, [responseMessage, isAnimating]);

    useEffect(() => {
      if (animatingText) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        setLoading(true);
      }
      writer
        ?.typeString(animatingText)
        .callFunction((state) => {
          timerRef.current = setTimeout(() => {
            // setFinalString(animatedText);
            setWriterState(state);
            setLoading(false);
            state.elements.cursor.style.display = 'none';
          }, 5000);

          setIsAnimating(false);
          setAnimatedText(animatedText + animatingText);
        })
        .start();
    }, [animatingText]);

    const deleteAll = () => {
      if (writerState?.elements && writerState?.elements?.wrapper.innerText !== '') {
        defaultValueAdded.current = false;
        setAnimatedText('');
        setIsAnimating(false);
        writerState.elements.wrapper.innerText = '';
        writerState.elements.cursor.style.display = 'inline';
      }
    };

    useImperativeHandle(ref, () => ({
      deleteAll,
    }));
    return (
      <div>
        <Typewriter
          options={{
            delay: 30,
          }}
          onInit={(typewriter) => {
            setWriter(typewriter);
          }}
        />
      </div>
    );
  }
);

export default TypeWriterAnimation;
