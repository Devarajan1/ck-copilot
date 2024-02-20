'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useAtom } from 'jotai';
import { messageAtom, urlAtom, productIdAtom, descriptionAtom, tableAtom } from '../(store)/store'
import TypingAnimation from '../(loaders)/typing'
import BotImg from '@/public/assets/Star1.svg'
import ReactMarkdown from 'react-markdown'
import { Remarkable } from 'remarkable';
export default function MultiModel() {
    const md = new Remarkable();

    const [imageDescription, setImageDescription] = useAtom(descriptionAtom);
    const [tableData, setTableData] = useAtom(tableAtom);
    return (
        <div className="w-full h-full relative  bg-[rgb(0,0,0,0.02)] md:pl-[25rem] flex-1">
            <div className="flex w-full">
                <div className="w-[50%] border-r-[0.02rem] p-6">
                    <p className="text-2xl justify-center flex w-full">Image Description</p>
                    {imageDescription?.length > 0 ? <ReactMarkdown className="my-4  overflow-y-scroll CS">{imageDescription}</ReactMarkdown>
                        :
                        <div className="flex ">
                            <Image src={BotImg} alt="use" className="bg-[#000] p-[0.44rem] w-[30px] h-[30px] mt-[20px] mr-2" style={{ borderRadius: "50%" }} />
                            <TypingAnimation className=" flex h-[5px] items-center  w-[30%]" />
                        </div>}
                </div>
                <div className="w-[50%] border-r-[0.02rem] p-6">
                    <p className="text-2xl justify-center flex w-full mb-6">Table Description</p>
                    {tableData?.length > 0 ?
                        <ReactMarkdown className="custom-table min-w-full grid justify-center overflow-y-scroll CS"
                        components={{
                            table: ({ node, ...props }) => (
                                <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                                  {...props}
                                </table>
                            ),
                            pre: ({ node, ...props }) => (
                                <div className="overflow-auto CS w-full my-2 m-2 bg-[#f1f1f1] p-2 rounded-lg">
                                    <pre {...props} />
                                </div>
                            ),
                            code: ({ node, ...props }) => (
                                <code className="bg-[#d0d0d0] rounded-lg p-2 m-2 font-[550] " {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className="md:pl-10 leading-8" style={{ listStyleType: 'auto' }}  {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol className="md:pl-10 leading-8" style={{ listStyleType: 'auto' }} {...props} />
                            ),
                            menu: ({ node, ...props }) => (
                                <p className="md:pl-10 leading-8" style={{ listStyleType: 'auto' }} {...props} />
                            ),
                        }}>
                            {tableData}
                        </ReactMarkdown>
                        :
                        <div className="flex">
                            <Image src={BotImg} alt="use" className="bg-[#000] p-[0.44rem] w-[30px] h-[30px] mt-[20px] mr-2" style={{ borderRadius: "50%" }} />
                            <TypingAnimation className=" flex h-[5px] items-center  w-[30%]" />
                        </div>}
                </div>
            </div>
        </div>
    )
}
