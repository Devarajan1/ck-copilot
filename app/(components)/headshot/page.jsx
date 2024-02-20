'use client'
import React from 'react'
import HeadshotSideBar from './headshotSideBar'
import bg from '@/public/assets/headshot/EmptyStateImage.png'
import Image from 'next/image'
export default function Page() {
  return (
    <div className="flex relative h-[100vh] bg-[#F4F5F7]">
      <div className="w-[20rem] h-full  p-2  md:fixed" >
        <HeadshotSideBar />
      </div>
      <div className="md:pl-[20rem] w-full flex justify-center">
        <div className="w-[50%] h-[70%]  mt-[8%] bg-[#fff] rounded-lg flex flex-col justify-center">
          <div className="w-full h-[60%]   flex justify-center">
          <Image alt="img" src={bg} className=" w-[60%] min-w-[350px]  h-full " />
          </div>
         
          <p className="font-[500] text-lg text-center">Start generating headshots</p>
          <p className="w-[60%] ml-[20%] text-sm text-center">Select a model and a template to generate amazing headshots</p>
        </div>
      </div>
    </div>
  )
}
