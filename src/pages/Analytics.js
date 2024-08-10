import React, { useEffect, useState } from 'react';
import Card from '../components/Card';

const AddReviewSentiment = async (_review_id, _review_text, _org_id, token) => {
  // console.log("path", path);
  const resp = await fetch(
    `${process.env.REACT_APP_API_KEY}analytics/sentiment/add_review_sentiment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        review_id: _review_id,
        review_text: _review_text,
        org_id: _org_id,
      }),
    }
  );
  return await resp.json();
};

const AddReviewGender = async (_review_id, _reviewer_name, _org_id, token) => {
  // console.log("path", path);
  const resp = await fetch(`${process.env.REACT_APP_API_KEY}analytics/gender/add_review_gender`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      review_id: _review_id,
      reviewer_name: _reviewer_name,
      org_id: _org_id,
    }),
  });
  return await resp.json();
};

const Delete = async (_review_id, _org_id, token, path) => {
  // console.log("path", path);
  const resp = await fetch(`${process.env.REACT_APP_API_KEY}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      review_id: _review_id,
      org_id: _org_id,
    }),
  });
  return await resp.json();
};

const AddToCloud = async (_review_id, _review_text, _org_id, token) => {
  const resp = await fetch(
    `${process.env.REACT_APP_API_KEY}analytics/word_cloud/add_review_word_cloud`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        review_id: _review_id,
        review_text: _review_text,
        org_id: _org_id,
      }),
    }
  );
  return await resp.json();
};

const DeleteFromCloud = async (_review_id, _org_id, token) => {
  const resp = await fetch(
    `${process.env.REACT_APP_API_KEY}analytics/word_cloud/delete_review_word_cloud`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        review_id: _review_id,
        org_id: _org_id,
      }),
    }
  );
  return await resp.json();
};

export default function Analytics() {
  const token = localStorage.getItem('AccessToken');
  const [tokenNew, setTokenNew] = useState('');
  const [org_id, setOrgId] = useState('');
  const [revierText, setRevierText] = useState('');
  const [reviewrName, setRevierName] = useState('');
  const [revieId, setRevieId] = useState('');

  useEffect(() => {
    let tempToken = localStorage.getItem('AccessToken');
    setTokenNew(tempToken);
  }, []);

  const handlAddSentiment = async (e) => {
    e.preventDefault();
    if (revieId === '' || revierText === '' || org_id === '') {
      return;
    } else {
      const data = await AddReviewSentiment(revieId, revierText, org_id, tokenNew);
      alert(data.message);
    }
  };

  const handlAddGender = async (e) => {
    e.preventDefault();
    if (revieId === '' || revierText === '' || org_id === '') {
      return;
    } else {
      const data = await AddReviewGender(revieId, reviewrName, org_id, tokenNew);
      alert(data.message);
    }
  };

  const handlDeleteSentiment = async (e) => {
    e.preventDefault();
    if (revieId === '' || org_id === '') {
      return;
    } else {
      const data = await Delete(
        revieId,
        org_id,
        tokenNew,
        '/analytics/sentiment/delete_review_sentiment'
      );
      alert(data.message);
    }
  };

  const handlDeleteGender = async (e) => {
    e.preventDefault();
    if (revieId === '' || org_id === '') {
      return;
    } else {
      const data = await Delete(
        revieId,
        org_id,
        tokenNew,
        '/analytics/gender/delete_review_gender'
      );
      alert(data.message);
    }
  };

  const handlAddToCloud = async (e) => {
    e.preventDefault();
    if (revieId === '' || org_id === '' || revierText === '') {
      return;
    } else {
      const data = await AddToCloud(revieId, revierText, org_id, tokenNew);
      alert(data.message);
    }
  };

  const handlDeleteFromCloud = async (e) => {
    e.preventDefault();
    if (revieId === '' || org_id === '') {
      return;
    } else {
      const data = await DeleteFromCloud(revieId, org_id, tokenNew);
      alert(data.message);
    }
  };

  return (
    <Card>
      <div className="text-center text-gray-700 text-lg font-bold">Analytics</div>

      <div className="my-10">
        <form>
          <div className="md:flex mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4"
                for="reviewer_name"
              >
                Reviewer Name
              </label>
            </div>
            <div className="md:w-2/3 flex items-center justify-between">
              <input
                className="form-input block  focus:bg-white shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="reviewer_name"
                type="text"
                value={reviewrName}
                placeholder="Reviewer Name"
                onChange={(e) => setRevierName(e.target.value)}
              />
              <div
                className="px-5 py-2 bg-green-500 flex items-center justify-center rounded-lg cursor-pointer w-[235px]"
                onClick={(e) => {
                  handlAddSentiment(e);
                }}
              >
                <button className="text-white">Add review Sentiment</button>
              </div>
            </div>
          </div>

          <div className="md:flex mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4"
                for="review_text"
              >
                Review Text
              </label>
            </div>
            <div className="md:w-2/3 flex items-center justify-between">
              <input
                className="form-input block  focus:bg-white shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="review_text"
                type="text"
                value={revierText}
                placeholder="Review Text"
                onChange={(e) => setRevierText(e.target.value)}
              />
              <div
                className="px-5 py-2 bg-green-500 flex items-center justify-center rounded-lg cursor-pointer w-[235px]"
                onClick={(e) => {
                  handlAddGender(e);
                }}
              >
                <button className="text-white">Add review Gender</button>
              </div>
            </div>
          </div>
          <div className="md:flex mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4"
                for="org_id"
              >
                Org ID
              </label>
            </div>
            <div className="md:w-2/3 flex items-center justify-between">
              <input
                onChange={(e) => setOrgId(e.target.value)}
                className="form-input block  focus:bg-white shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="org_id"
                type="text"
                value={org_id}
                placeholder="Org ID"
              />
              <div
                className="px-5 py-2 bg-red-500 flex items-center justify-center rounded-lg cursor-pointer w-[235px]"
                onClick={(e) => {
                  handlDeleteSentiment(e);
                }}
              >
                <button className="text-white">Delete review Sentiment</button>
              </div>
            </div>
          </div>
          <div className="md:flex mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4"
                for="review_id"
              >
                Review ID
              </label>
            </div>
            <div className="md:w-2/3 flex items-center justify-between">
              <input
                className="form-input block  focus:bg-white shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="review_id"
                type="text"
                value={revieId}
                placeholder="Review ID"
                onChange={(e) => setRevieId(e.target.value)}
              />
              <div
                className="px-5 py-2 bg-red-500 flex items-center justify-center rounded-lg cursor-pointer w-[235px]"
                onClick={(e) => {
                  handlDeleteGender(e);
                }}
              >
                <button className="text-white">Delete review Gender</button>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-5 justify-center">
            <div
              className="px-5 py-2 bg-green-500 flex items-center justify-center rounded-lg cursor-pointer w-[235px]"
              onClick={(e) => {
                handlAddToCloud(e);
              }}
            >
              <button className="text-white">Add Word Cloud</button>
            </div>
            <div
              className="px-5 py-2 bg-red-500 flex items-center justify-center rounded-lg cursor-pointer w-[235px]"
              onClick={(e) => {
                handlDeleteFromCloud(e);
              }}
            >
              <button className="text-white">Delete Word Cloud</button>
            </div>
          </div>

          <div className="md:flex md:items-center">
            <div>
              <iframe
                src={`${process.env.REACT_APP_ANALYTICS_KEY}?token=${token}&org_id=${org_id}`}
                // className="w-full"
                width={1000}
                height={1000}
              ></iframe>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}
