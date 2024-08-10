import React from 'react';
import DefaultBG from '../assets/images/Defaultbg.svg';

export default function Home() {
  return (
    <div className=" flex justify-center items-center flex-col ">
      <div className=" flex justify-center items-center pt-10 ">
        <img src={DefaultBG} alt="DefaultBG" className="bg-auto" />
      </div>
      <div className=" flex justify-center items-start font-Poppins font-semibold text-2xl">
        <h1 className="text-center">
          Select “create descriptions” from the navigation panel to proceed
        </h1>
      </div>
    </div>
  );
}
