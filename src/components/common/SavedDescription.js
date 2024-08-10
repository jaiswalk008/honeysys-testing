import { toast } from 'react-toastify';
import { EditIcon, DeleteIcon, CopyIconFilled } from '../../utils/icons';
import KeywordsBox from './KeywordsBox';
import Toast from './Toasts';
import moment from 'moment/moment';
import copy from 'copy-to-clipboard';
export default function SavedDescription({ data, fetchData }) {
  console.log(data, 'data');
  const token = localStorage.getItem('AccessToken');
  const handleDelete = (status) => {
    const deleteData = async () => {
      const resp = await fetch(`${process.env.REACT_APP_API_KEY}description/delete/single`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          object_id: data.object_id,
          title: true,
          short_description: status === 'Short',
          long_description: status === 'Long',
          keywords: true,
        }),
      });
      if (resp.status === 200) {
        fetchData();
        toast(<Toast text={`${status} description removed successfully.`} color="red" />);
      } else {
        toast(<Toast text={`Something went wrong`} color="red" />);
      }
    };
    deleteData();
  };

  return (
    <>
      {data.long_description && (
        <section
          className="flex flex-col gap-0 px-1 pb-3"
          style={{ borderBottom: '1px solid black' }}
        >
          <div className="flex flex-col gap-1 ">
            <span className="font-normal text-[#616161] text-sm py-2">Title</span>
            <div
              className="relative w-full flex justify-between p-4 text-base text-black bg-white rounded-lg outline-none font-Poppins"
              style={{ border: '1px solid #616161', resize: 'none' }}
            >
              <span className="text-lg">{data.title}</span>
              <img
                onClick={() => {
                  copy(data.title);
                  toast(<Toast text="Title copied successfully." color="success" />);
                }}
                src={CopyIconFilled}
                alt="CopyIconFilled"
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between py-2 gap-y-3">
              {/* <div className="flex gap-3"> */}
              <span className="font-normal text-[#616161] text-sm">Long Description</span>
              {/* <img src={EditIcon} alt="edit-icon" className="cursor-pointer" />
              </div> */}
              <div className="flex gap-4">
                <span className="font-normal text-[#616161] text-sm">
                  {moment(data.data_modified).format('dddd')}
                </span>
                <span className="font-normal text-[#616161] text-sm">
                  {moment(data.data_modified).format('DD/MM/yyyy')}
                </span>
                <span className="font-normal text-[#616161] text-sm">
                  {moment(data.data_modified).format('hh:mm A')}
                </span>
              </div>
            </div>
            <div
              className="relative w-full p-5 text-base text-black bg-white rounded-lg outline-none font-Poppins"
              style={{ border: '1px solid #616161', resize: 'none' }}
            >
              <span className="text-lg">{data.long_description}</span>
              <img
                onClick={() => {
                  copy(data.long_description);
                  toast(<Toast text="Long description copied successfully." color="success" />);
                }}
                src={CopyIconFilled}
                alt="CopyIconFilled"
                className="absolute top-1 right-1 cursor-pointer"
              />
            </div>
          </div>
          {data.keywords && (
            <div>
              <KeywordsBox
                tagResponseData={data.keywords}
                onClick={() => {
                  copy(data.keywords);
                  toast(<Toast text="KeyWords copied successfully." color="success" />);
                }}
              />
            </div>
          )}
          <div className="pt-4">
            <img
              src={DeleteIcon}
              alt="DeleteIcon"
              className="cursor-pointer"
              onClick={() => handleDelete('Long')}
            />
          </div>
        </section>
      )}
      {data.short_description && (
        <section
          className="flex flex-col gap-0 px-1 pb-3"
          style={{ borderBottom: '1px solid black' }}
        >
          <div className="flex flex-col gap-1 ">
            <span className="font-normal text-[#616161] text-sm py-2">Title</span>
            <div
              className="relative w-full flex justify-between p-4 text-base text-black bg-white rounded-lg outline-none font-Poppins"
              style={{ border: '1px solid #616161', resize: 'none' }}
            >
              <span className="text-lg">{data.title}</span>
              <img
                onClick={() => {
                  copy(data.title);
                  toast(<Toast text="Title copied successfully." color="success" />);
                }}
                src={CopyIconFilled}
                alt="CopyIconFilled"
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between py-2 gap-y-3">
              {/* <div className="flex gap-3"> */}
              <span className="font-normal text-[#616161] text-sm">Short Description</span>
              {/* <img src={EditIcon} alt="edit-icon" className="cursor-pointer" />
              </div> */}
              <div className="flex gap-4">
                <span className="font-normal text-[#616161] text-sm">
                  {moment(data.data_modified).format('dddd')}
                </span>
                <span className="font-normal text-[#616161] text-sm">
                  {moment(data.data_modified).format('DD/MM/yyyy')}
                </span>
                <span className="font-normal text-[#616161] text-sm">
                  {moment(data.data_modified).format('hh:mm A')}
                </span>
              </div>
            </div>
            <div
              className="relative w-full p-5 text-base text-black bg-white rounded-lg outline-none font-Poppins"
              style={{ border: '1px solid #616161', resize: 'none' }}
            >
              <span className="text-lg">{data.short_description}</span>
              <img
                onClick={() => {
                  copy(data.short_description);
                  toast(<Toast text="Short description copied successfully." color="success" />);
                }}
                src={CopyIconFilled}
                alt="CopyIconFilled"
                className="absolute cursor-pointer top-1 right-1"
              />
            </div>
          </div>

          <div className="pt-4">
            <img
              src={DeleteIcon}
              alt="DeleteIcon"
              className="cursor-pointer"
              onClick={() => handleDelete('Short')}
            />
          </div>
        </section>
      )}
    </>
  );
}
