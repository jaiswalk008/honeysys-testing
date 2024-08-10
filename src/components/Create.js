import Button from './common/UIComponents/Button';
import TextArea from './common/TextArea';
import ShortDescription from './ShortDescription';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { webSocketURL } from '../App';
import { useEffect, useRef, useState } from 'react';
import Toast from './common/Toasts';
import { toast } from 'react-toastify';

export default function Create() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState('');
  const [shortArray, setShortArray] = useState([]);
  const [isRegenerate, setIsRegenerate] = useState(false);
  const [counter, setCounter] = useState(0);
  const [messageId, setMessageId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName , setFileName] = useState('No file chosen')
  const [uploadingImage, setUploadingImage] = useState(false);
  const typeWriterRef = useRef(null);
  const defaultValueAdded = useRef(null);

  useEffect(() => {
    defaultValueAdded.current = false;
  }, []);

  const { sendMessage, lastMessage, readyState } = useWebSocket(webSocketURL, {
    retryOnError: true,
    shouldReconnect: () => true,
    queryParams: {
      Authorization: `Bearer ${localStorage.getItem('AccessToken')}`,
    },
  });

  const setMessage = (message, index) => {
    const _shortArray = [...shortArray];
    _shortArray[index].shortDescResponseMessage = message;
    setShortArray(_shortArray);
  };

  const readyStateString = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
  }[readyState];

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage?.data);
        if (current === 'short' && data.mode === 'short') {
          if (shortArray.length > 0) {
            const _shortArray = [...shortArray];
            _shortArray[0].shortDescResponseMessage = data.response?.description;
            setShortArray(_shortArray);
            setMessageId(data.message_id);
          }
        }
        if (data.message === 'Generation completed') {
          toast(<Toast text={data.message} color="success" />);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        toast(<Toast text="Something went wrong" color="red" />);
        setLoading(false);
      }
    }
  }, [lastMessage, current]);

  const handleChange = (e) => {
    setIsRegenerate(false);
    setLoading(false);
    setTitle(e.target.value);
  };

  const generateShortDescription = async (e) => {
    try {
      setCurrent('');
      if (typeWriterRef.current) {
        typeWriterRef.current.deleteAll();
      }
      defaultValueAdded.current = true;
      e.preventDefault();
      if (readyStateString !== 'OPEN') {
        setCurrent('');
        toast(<Toast text="Socket is not connected." color="red" />);
        return;
      }

      if (!isRegenerate && !loading) {
        const message = `{"title":${JSON.stringify(
          title
        )}, "action": "start", "mode":"short", "context":""}`;
        setCurrent('');
        setCurrent('short');
        const _shortArray = [...shortArray];
        _shortArray.unshift({ shortDescResponseMessage: '', index: counter, title });
        setShortArray(_shortArray);
        const _counter = counter + 1;
        setCounter(_counter);
        setIsRegenerate(true);
        setLoading(true);
        sendMessage(message);
      }
      if (isRegenerate) {
        const message = `{"title":${JSON.stringify(
          title
        )}, "action": "regenerate", "mode":"short", "context":""}`;
        const _shortArray = [...shortArray];
        _shortArray[0].shortDescResponseMessage = '';
        setShortArray(_shortArray);
        sendMessage(message);
        setCurrent('short');
        setLoading(true);
      }
    } catch (error) {
      setCurrent('');
      toast(<Toast text={`${error}`} color="red" />);
    }
  };
  const handleFileChange = (e) =>{
    console.log(e)
    const type = e?.target?.files[0]?.type.split('/')[0];
    if(type !== 'image') {
      toast(<Toast text={'Please upload an image file'} color="red" />);
      return;

    }
    setSelectedFile(e.target.files[0]);
    setFileName(truncateFileName(e.target.files[0].name))
  }
  const uploadImage =async (e) =>{
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await fetch(process.env.REACT_APP_UPLOAD_IMAGE_KEY, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully:', data);
        setIsRegenerate(false);
        setLoading(false);
        setTitle(data.product_title);
        
        
        toast(<Toast text={'Image uploaded successfully'} color="success" />);
      } else {
        console.error('File upload failed:', response.statusText);
        toast(<Toast text={response.statusText} color="red" />);
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast(<Toast text={error?.response?.message || 'Something went wrong'} color="red" />);
    }
    setUploadingImage(false);

  }
  
  const truncateFileName = (fileName, maxLength = 15) => {
    if (fileName.length <= maxLength) return fileName;
  
    const extension = fileName.split('.').pop();
    const baseName = fileName.slice(0, -extension.length - 1);
    const truncatedBaseName = baseName.slice(0, maxLength - 3);
    
    return `${truncatedBaseName}...${extension}`;
  };
  const handleRemoveFile= () =>{
    setSelectedFile(null);
    setFileName('No file chosen');
    document.getElementById('file-upload').value = '';
  }
  return (
    <>
      <div className="pb-28">
        <section className="flex flex-col gap-6 px-8">
          <section
            className="flex flex-col flex-wrap gap-3 px-1 pb-3"
            style={{ borderBottom: '1px solid black' }}
          >
            <div>
              <h1 className="pt-10 text-2xl font-bold">Enter Title of the product</h1>
              <span className="font-normal text-[#616161] text-base">
                According to the title the descriptions will be generated.
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-5 px-1 lg:flex-nowrap">
              <TextArea
                placeholder={'Write the title of the product to generate short description.'}
                text={title}
                onChange={(e) => handleChange(e)}
                disabled={loading}
                 
              />
              <div className="flex flex-row lg:flex-col min-w-fit">
                <Button
                  text={isRegenerate ? 'Regenerate' : 'Generate'}
                  onClick={(e) => generateShortDescription(e)}
                  disabled={title === '' || loading}
                  
                />
                <div className="flex flex-row ">
                <label htmlFor="file-upload" className="font-Poppins cursor-pointer bg-[#2C95BE] rounded-lg text-white px-2 py-3 h-fit m-1 min-w-fit flex-wrap">
                  Choose File
                </label>
                <input
                  id='file-upload'
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                  <Button
                    text={!uploadingImage ?  'Upload' : 
                      <div role="status">
                          <svg aria-hidden="true" className="w-8 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                          <span class="sr-only">Loading...</span>
                      </div>
                      }
                    onClick={(e) => uploadImage(e)}
                    disabled={!selectedFile}
                  />
                  
                </div>
                <div className="relative flex items-center border border-gray-300 rounded-lg p-1 m-1 bg-white">
  
                  <span className="font-Poppins sm:mt-4 lg:mt-0 lg:px-1 flex-1">
                    {fileName}
                  </span>
                  {!!selectedFile && <button 
                    className="absolute top-1 right-1 text-gray-500 hover:text-red-500 focus:outline-none" 
                    onClick={handleRemoveFile}
                  >
                    ❌
                  </button>}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input type="radio" checked={true} readOnly />
              <label className="px-2">Short Description</label>
            </div>
          </section>
        </section>

        {shortArray.map((shortDescription, index) => {
          return (
            <ShortDescription
              key={shortDescription.index}
              index={index}
              title={shortDescription.title}
              setMessage={setMessage}
              typeRef={typeWriterRef}
              responseMessage={shortDescription.shortDescResponseMessage}
              loading={loading}
              setLoading={setLoading}
              defaultValueAdded={defaultValueAdded}
              isLatest={index === 0}
              lastMessage={lastMessage}
              readyStateString={readyStateString}
              sendMessage={sendMessage}
              current={current}
            />
          );
        })}
      </div>
    </>
  );
}
