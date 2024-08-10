import React from 'react';
import { CopyIcon, SaveIcon, CopyIconFilled, SaveIconFilled } from '../utils/icons';
import Toast from './common/Toasts';
import { useEffect, useState } from 'react';
import KeywordsBox from './common/KeywordsBox';
import { toast } from 'react-toastify';
import TextArea from './common/TextArea';
import Button from './common/UIComponents/Button';
import TypeWriterAnimation from './TypeWriterAnimation';
import copy from 'copy-to-clipboard';

function LongDescription({
  longDescResponseMessage,
  defaultValueAdded,
  shortDesc,
  title,
  setLongDescResponseMessage,
  typeRef,
  loading,
  setLoading,
  setIsRegenerate,
  lastMessage,
  sendMessage,
  // generalLoading,
  // generalSetLoading,
  index,
}) {
  const [isCopy, setIsCopy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKeywordBox, setShowKeywordBox] = useState(false);
  const [isCopyKeywords, setIsCopyKeywords] = useState(false);
  const [tagResponseData, setTagResponseData] = useState('');
  const token = localStorage.getItem('AccessToken');

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage?.data);
        if (data.contextId === `long:${index}`) {
          setTagResponseData(data.response?.tags);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [lastMessage]);

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
          short_description: shortDesc,
          long_description: longDescResponseMessage,
          keywords: tagResponseData,
        }),
      });
      // return await resp.json();
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

  const handleCopy = (e) => {
    try {
      copy(longDescResponseMessage);
      toast(<Toast text="Long description copied successfully." color="success" />);
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

  const setLongDesc = (e) => {
    setLongDescResponseMessage(e.target.value);
  };
  const generateKeyWords = (e) => {
    console.log(longDescResponseMessage);
    setShowKeywordBox(true);
    try {
      e.preventDefault();
      setTagResponseData('');
      const message = `{"title":${JSON.stringify(
        title
      )}, "action": "start", "mode":"tag", "contextId":"long:${index}" ,"context":${JSON.stringify(
        longDescResponseMessage
      )}}`;
      sendMessage(message);
      setLoading(true);

      //     toast(<Toast text="Keywords generated successfully..." color="success" />);
    } catch (error) {
      toast(<Toast text={`${error}`} color="red" />);
      setLoading(false);
    }
  };
  return (
    <section className="flex flex-col gap-6 px-8">
      <section className="flex flex-col gap-6 px-1 my-3">
        <div className="flex flex-wrap justify-between">
          <div className="">
            <h1 className="text-2xl font-bold">Long description</h1>
            <span className="font-normal text-[#616161] text-base">
              Generated long description will be displayed here.
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
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
          {!loading ? (
            <TextArea
              onChange={(e) => setLongDesc(e)}
              text={longDescResponseMessage}
              placeholder={
                'Enter title of the product, select short description and then click on generate to generate the descriptions.'
              }
            />
          ) : (
            <div
              className="text-base font-normal tracking-wider rounded-lg py-4 px-3 border-[1px] font-Poppins bg-white text-black"
              style={{ border: '1px solid #616161', resize: 'none' }}
            >
              {/* {longDescResponseMessage} */}
              {longDescResponseMessage.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              {/* <TypeWriterAnimation
                ref={typeRef}
                // setFinalString={setFinalString}
                responseMessage={longDescResponseMessage}
                setLoading={setLoading}
                defaultValueAdded={defaultValueAdded}
              /> */}
            </div>
          )}
        </div>

        <div className="flex items-center justify-start">
          <button
            onClick={() => handleSave()}
            disabled={longDescResponseMessage === '' || loading}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            <img src={saved ? SaveIconFilled : SaveIcon} alt="save-icon" className="px-1" />
          </button>
          <button
            onClick={(e) => handleCopy(e)}
            disabled={longDescResponseMessage === '' || loading}
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
  );
}

export default LongDescription;
