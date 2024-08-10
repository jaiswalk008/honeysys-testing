import { toast } from 'react-toastify';
import { EditIcon, DeleteIcon, CopyIconFilled } from '../utils/icons';
import KeywordsBox from './common/KeywordsBox';
import Toast from './common/Toasts';
import { useEffect, useState } from 'react';
import SavedDescription from './common/SavedDescription';
export default function Saved() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('AccessToken');
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_KEY}description/list`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    setData(await resp.json());
  };
  return (
    <section className="flex flex-col gap-7 pt-10 px-8 pb-20">
      <div className="pb-5">
        <h1 className="font-bold text-2xl">Saved descriptions</h1>
        <span className="font-normal text-[#616161] text-base">
          All the saved descriptions will be displayed here.
        </span>
      </div>
      {data.length === 0 && <div>No Dedscriptions Found</div>}
      {data.map((ele) => {
        return (
          <>
            {(ele.short_description !== '' || ele.long_description !== '') && (
              <SavedDescription fetchData={fetchData} key={ele.object_id} data={ele} />
            )}
          </>
        );
      })}
    </section>
  );
}
