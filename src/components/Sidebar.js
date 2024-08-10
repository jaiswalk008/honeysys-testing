import React from 'react';
import { ReactComponent as Edit } from '../assets/images/edit.svg';
import { Link, useLocation } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

export default function Sidebar({ open, setOpen, className, text }) {
  let current_url = useLocation().pathname.replace('/', '').toLowerCase();

  return (
    <div
      className={classNames(
        ` lg:w-fit w-[300px] top-0 -z-10 lg:z-0  h-[calc(100vh_-_81px)] lg:relative absolute duration-300 bg-white ${className}  border-r-2 border-opacity-30 border-[#D1D1D1]`
      )}
    >
      {/* {open && (
        <div className={`px-5 mt-5  flex  ${!open ? 'justify-end' : 'justify-end'}`}>
          <Menu className={`cursor-pointer`} onClick={() => setOpen(!open)} />
        </div>
      )} */}
      <div className="p-5 ">
        <div className="">
          <div className="flex gap-2 border-b pb-8 border-[#D1D1D1] lg:flex-row flex-col items-center">
            <div className="px-4 py-3 rounded-full bg-atlantis">
              <span className="text-2xl font-semibold text-white uppercase ">Ci</span>
            </div>
            <div>
              <div className="flex justify-between w-full">
                <div className="w-40 text-base font-medium tracking-wider ">Client ID</div>
                <Link to="/">
                  <Edit className="cursor-pointer h-5 w-5 text-[#616161]" />
                </Link>
              </div>
              <div className="w-40 overflow-hidden text-xs font-light tracking-wider capitalize whitespace-nowrap text-ellipsis ">
                {localStorage.getItem('clientId')}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <Link to="/create">
              <div
                className={`${
                  current_url === 'create'
                    ? 'bg-[#2F99C1] text-white'
                    : 'bg-transparent text-[#2F99C1]'
                } cursor-pointer border rounded-[10px] border-[#2F99C1] px-5 py-4`}
                onClick={() => {
                  if (text === 'mob') {
                    setOpen(false);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-base tracking-wider ">Create Description</div>
                  <PlusIcon className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-5">
            <Link to="/saved">
              <div
                className={`${
                  current_url === 'saved'
                    ? 'bg-[#2F99C1] text-white'
                    : 'bg-transparent text-[#2F99C1]'
                } border rounded-[10px] border-[#2F99C1]  px-5 py-4 cursor-pointer`}
                onClick={() => {
                  if (text === 'mob') {
                    setOpen(false);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-base tracking-wider">Saved Descriptions</div>
                  <BookmarkIcon className="w-4 h-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
