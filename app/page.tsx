'use client'
import React from 'react'
import ScrapeChat from './(components)/chat'
import Flipcart from './(components)/flipkart'
export default function Home() {
  return (
    <div className="w-[100vw] h-[100dvh] relative" style={{ fontFamily: "BDO !important" }}>
      <div className="w-full h-full flex relative">
        <div className="w-[25rem] border-r-[0.02rem] fixed z-[80] h-full md:block hidden" >
          < Flipcart />
        </div>
        <ScrapeChat />
      </div>
    </div >
  )
}
