import React, { useRef } from 'react';
import { CopyIcon, SaveIcon, CopyIconFilled, SaveIconFilled } from '../utils/icons';
import Toast from './common/Toasts';
import { useEffect, useState } from 'react';
import KeywordsBox from './common/KeywordsBox';
import { toast } from 'react-toastify';
import TextArea from './common/TextArea';
import Button from './common/UIComponents/Button';
import TypeWriterAnimation from './TypeWriterAnimation';
import copy from 'copy-to-clipboard';
import LongDescription from './LongDescription';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { webSocketURL } from '../App';

function ShortDescription({
  title,
  responseMessage,
  loading,
  setLoading,
  longDesc,
  defaultValueAdded,
  typeRef,
  isLatest,
  setMessage,
  index,
  sendMessage,
  readyStateString,
  lastMessage,
  current,
}) {
  const [isCopy, setIsCopy] = useState(false);
  const [isCopyKeywords, setIsCopyKeywords] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isRegenerate, setIsRegenerate] = useState(false);
  const [showKeywordBox, setShowKeywordBox] = useState(false);
  const [showLongDescBox, setShowLongDescBox] = useState(false);
  // const [longDescLoading, setLongDescLoading] = useState(false);
  const typeWriterRef = useRef(null);
  const longDefaultValueAdded = useRef(null);
  const token = localStorage.getItem('AccessToken');
  const [messageId, setMessageId] = useState('');

  const [tagResponseData, setTagResponseData] = useState('');

  const [longDescResponseMessage, setLongDescResponseMessage] = useState('');

  // const { sendMessage, lastMessage, readyState } = useWebSocket(webSocketURL, {
  //   retryOnError: true,
  //   shouldReconnect: () => true,
  //   queryParams: {
  //     Authorization: `Bearer ${localStorage.getItem('AccessToken')}`,
  //   },
  // });

  const setEditedDesc = (string, index) => {
    setIsRegenerate(false);
    setMessage(string, index);
  };
  // const readyStateString = {
  //   0: 'CONNECTING',
  //   1: 'OPEN',
  //   2: 'CLOSING',
  //   3: 'CLOSED',
  // }[readyState];

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage?.data);
        if (data.mode === 'long' && data.contextId === `longDesc:${index}`) {
          setLongDescResponseMessage(data.response?.description);
        } else if (data.mode === 'tag' && data.contextId === `short:${index}`) {
          setTagResponseData(data.response?.tags);
        }

        setMessageId(data.message_id);
      } catch (error) {
        console.log(error);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    longDefaultValueAdded.current = false;
  }, []);

  const generateLongDescription = (e) => {
    setShowLongDescBox(true);
    setLoading(true);

    try {
      if (responseMessage === '') return;
      if (typeWriterRef.current) {
        typeWriterRef.current.deleteAll();
      }
      longDefaultValueAdded.current = true;
      e.preventDefault();
      if (readyStateString !== 'OPEN') {
        toast(<Toast text="Socket is not connected." color="red" />);
        return;
      }

      if (!isRegenerate && !loading) {
        const message = `{"title":${JSON.stringify(
          title
        )}, "action":"start", "mode":"long", "contextId":"longDesc:${index}" , "context":${JSON.stringify(
          responseMessage
        )}}`;
        sendMessage(message);
        setLoading(true);
        setIsRegenerate(true);
      }
      if (isRegenerate) {
        const message = `{"title":${JSON.stringify(
          title
        )}, "action": "regenerate", "mode":"long", "contextId":"longDesc:${index}" , "context":${JSON.stringify(
          responseMessage
        )}}`;
        sendMessage(message);
        setLoading(true);
      }
    } catch (error) {
      setLoading(false);
      toast(<Toast text={`${error}`} color="red" />);
    }
  };

  const handleCopy = () => {
    try {
      copy(responseMessage);
      toast(<Toast text="Short description copied successfully." color="success" />);
      setIsCopy(true);
      setTimeout(() => {
        setIsCopy(false);
      }, 4000);
    } catch (error) {
      toast(<Toast text="Failed to copy text to clipboard" color="red" />);
    }
  };

  const handleCopyKeywords = () => {
    try {
      copy(tagResponseData);
      toast(<Toast text="Keywords copied successfully." color="success" />);
      setIsCopyKeywords(true);
      setTimeout(() => {
        setIsCopyKeywords(false);
      }, 4000);
    } catch (error) {
      toast(<Toast text="Failed to copy keywords to clipboard" color="red" />);
    }
  };

  const handleSave = async () => {
    try {
      setSaved(true);
      const resp = await fetch(`${process.env.REACT_APP_API_KEY}description/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          short_description: responseMessage,
          long_description: longDesc,
          keywords: tagResponseData,
        }),
      });
      const respJson = await resp.json();
      const message = respJson.message;
      if (resp.status === 200 || resp.status === 201) {
        toast(<Toast text={`${message}`} color="success" />);
      } else {
        toast(<Toast text={`${message}`} color="red" />);
      }
    } catch (error) {
      console.log(error);
      toast(<Toast text={`${error}`} color="red" />);
    }
  };

  const generateKeyWords = (e) => {
    setShowKeywordBox(true);
    try {
      e.preventDefault();
      setTagResponseData('');
      const message = `{"title":${JSON.stringify(
        title
      )}, "action": "start", "mode":"tag", "contextId":"short:${index}" , "context":${JSON.stringify(
        responseMessage
      )}}`;
      sendMessage(message);
      setLoading(true);
    } catch (error) {
      toast(<Toast text={`${error}`} color="red" />);
      setLoading(false);
    }
  };
  return (
    <>
      <section className="flex flex-col gap-6 px-8">
        <section className="flex flex-col gap-6 px-1 my-3">
          <div className="flex flex-wrap justify-between">
            <div className="">
              <h1 className="text-2xl font-bold">Short description</h1>
              <span className="font-normal text-[#616161] text-base">
                {!responseMessage
                  ? 'Generated short description will be displayed here'
                  : loading
                  ? 'Generating short description...'
                  : 'Generated short description'}
                .
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                text={isRegenerate ? 'Regenerate Long Description' : 'Generate Long Description'}
                onClick={(e) => generateLongDescription(e)}
                disabled={loading}
              />
              <Button
                text={'Generate Keywords'}
                onClick={(e) => {
                  generateKeyWords(e);
                }}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            {!loading || !isLatest ? (
              <TextArea
                setMessage={setEditedDesc}
                index={index}
                text={responseMessage}
                placeholder={
                  'Enter title of the product, select short description and then click on generate to generate the descriptions.'
                }
              />
            ) : (
              <div
                className="text-base font-normal tracking-wider rounded-lg py-4 px-3 border-[1px] font-Poppins bg-white text-black"
                style={{ border: '1px solid #616161', resize: 'none' }}
              >
                {/* {responseMessage} */}
                {responseMessage.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
                {/* <TypeWriterAnimation
                  ref={typeRef}
                  // setFinalString={setFinalString}
                  responseMessage={responseMessage}
                  setLoading={setLoading}
                  defaultValueAdded={defaultValueAdded}
                /> */}
              </div>
            )}
          </div>

          <div className="flex items-center justify-start">
            <button
              onClick={() => handleSave()}
              disabled={responseMessage === '' || loading}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              <img src={saved ? SaveIconFilled : SaveIcon} alt="save-icon" className="px-1" />
            </button>
            <button
              onClick={(e) => handleCopy(e)}
              disabled={responseMessage === '' || loading}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              <img src={!isCopy ? CopyIcon : CopyIconFilled} alt="copy-icon" className="px-1" />
            </button>
          </div>
          {showKeywordBox && (
            <KeywordsBox
              tagResponseData={tagResponseData}
              isCopy={isCopyKeywords}
              onClick={() => handleCopyKeywords()}
            />
          )}
        </section>
      </section>

      {showLongDescBox && (
        <LongDescription
          title={title}
          index={index}
          sendMessage={sendMessage}
          readyStateString={readyStateString}
          lastMessage={lastMessage}
          longDescResponseMessage={longDescResponseMessage}
          loading={loading}
          setLoading={setLoading}
          shortDesc={responseMessage}
          defaultValueAdded={longDefaultValueAdded}
          setLongDescResponseMessage={setLongDescResponseMessage}
          typeRef={typeWriterRef}
        />
      )}
    </>
  );
}

export default ShortDescription;
