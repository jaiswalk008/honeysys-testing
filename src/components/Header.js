import React from 'react';
import logo from '../assets/images/logo.svg';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="bg-white header-shadow border-b border-white sticky top-0 left-0 z-10">
      <div className="mx-4 sm:mx-4 md:mx-6 lg:mx-16 my-5">
        <div className="flex gap-3 justify-between lg:justify-start  flex-wrap items-center md:flex-row flex-col w-full bg ">
          <div className=" w-fit lg:w-[45%] ">
            <img
              src={logo}
              alt="logo"
              className="h-10 w-auto cursor-pointer"
              onClick={() => {
                navigate('/home');
              }}
            />
          </div>
          <div className=" font-semibold text-sm sm:text-base md:text-xl lg:text-2xl  tracking-wider uppercase text-curious_blue lg:self-center">
            <span>
              Data PLAYGR<span className="text-atlantis">o</span>UND
            </span>
          </div>
        </div>
      </div>
      {/* <div className=" py-2 md:hidden flex  flex-col items-center justify-center">
        <Disclosure>
          <Disclosure.Button className="py-2">
            <img src={MenuIcon} />
          </Disclosure.Button>
          <Disclosure.Panel className="text-gray-500">Menu</Disclosure.Panel>
        </Disclosure>
      </div> */}
    </div>
  );
}
