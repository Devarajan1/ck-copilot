'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import imageIcon from '@/public/assets/headshot/ImageIcon.svg'
import { Button } from "@/components/ui/button"
import MainBg from "@/public/assets/mainBG.png"
import axios from 'axios'
import dressImg from '@/public/assets/lens/dress.png'
import Scan from '@/public/assets/lens/scan.png'
import { ImagePlus, Star, Menu, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown'
import { Remarkable } from 'remarkable';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

import { useRouter } from 'next/navigation'
export default function DescriptionGenerator() {
    const md = new Remarkable();
    const router = useRouter()
    const [uploadedImg, setUploadedImg] = useState([])
    const [sheetdata, setSheetdata] = useState(false)
    const [imgData, setImgData] = useState([])
    const [loading, setLoading] = useState(false)
    const [stream, setStream] = useState(false)
    const [streamData, setStreamData] = useState('')
    const [tableData, setTableData] = useState('')
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = e.target.files;
            const filesArray = Array.from(selectedFiles);
            const newFilesInfo = filesArray.map((file) => ({
                name: file.name,
                url: URL.createObjectURL(file),
            }));
            let img = e.target.files[0];
            uploadImage(img)
            const newImageArray = filesArray.map((file) => URL.createObjectURL(file));
            setUploadedImg(newImageArray);
        }
    };




    const uploadImage = async (imageFile) => {
        setLoading(true);
        setImgData([]);
        setTableData('')
        const formData = new FormData();
        formData.append('image', imageFile);
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_DESCRIPTION_URL + '/generate', {
                method: 'POST',
                body: formData, // Pass formData as the body
                headers: {
                    // No need to specify Content-Type, fetch will do it automatically for FormData
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let partialResponse = '';
            setLoading(false);

            const processResult = async (result) => {
                if (result.done) {
                    setStream(false);
                    getTableData()
                    return;
                }

                const chunk = decoder.decode(result.value, { stream: true });
                partialResponse += chunk;
                setStream(true);

                setStreamData(partialResponse);
                // Process and handle the streamed response chunk
                return reader.read().then(processResult);
            };

            return reader.read().then(processResult);
        } catch (error) {
            setLoading(false);
            alert("Please try again later");
            console.error(`Error occurred while fetching the response.\n${error}`);
            // Handle error
        }
    }

    async function getTableData() {
        axios.get(process.env.NEXT_PUBLIC_DESCRIPTION_URL + '/table', {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            setTableData(res.data)


        }).catch(err => (alert('Please try again later'), console.log(err), setLoading(false)))
    }
    const MarkdownTable = ({ node, ...props }) => (
        <table className="border-collapse border border-black px-3 py-1 dark:border-white">
            <tbody>{props.children}</tbody>
        </table>
    );
    return (
        <div className='w-full min-h-[100vh] bg-[rgb(0,0,0,0.02)] CS'>

            <div className="w-[25rem] border-r-[0.02rem] fixed z-[80] h-full hidden md:block" >
                <div className="w-full h-[20vh] p-4 flex relative" style={{ background: "linear-gradient(90deg, rgba(222,228,255,1) 10%, rgba(180,161,255,1) 100%)" }}>
                    <p className=" text-[1.2rem] font-[550] w-[60%] z-[2]" >{process.env.NEXT_PUBLIC_TITTLE} Smart Tagging</p>
                    <Image src={MainBg} className="w-[100%] h-[100%] absolute bottom-0 right-0  flex btl" alt="img" />
                </div>
                {uploadedImg?.length > 0 ? <p className="text-lg font-[500] w-full text-center mt-8">Uploaded Image</p> : <p className=" mt-8 text-lg font-[500] w-full text-center">Upload Image</p>}
                {uploadedImg?.length > 0 ?
                    <>
                        <div className="flex justify-center ">
                            <div className=" w-[90%]  flex justify-center  rounded-xl mt-4">
                                <img className=" max-w-[300px]  h-[fit-content] max-h-[280px]  rounded-lg" src={uploadedImg[0]} alt="selected Image" />
                            </div>
                        </div>
                        <div className="flex justify-center mt-8 w-[80%] ml-[10%]">
                            <div className="flex w-full border-[0.02rem] p-3 rounded-xl justify-center hover:cursor-pointer" onClick={() => { document.getElementById('fileInput').click() }}>
                                <input type="file" accept="image/*" id="fileInput" style={{
                                    display: "none"
                                }} onChange={handleImageChange} />
                                <ImagePlus />
                                <p className="ml-4 text-[1rem]" >Upload Another Image</p>
                            </div>
                        </div>
                    </>
                    :
                    <div className="flex justify-center "><div className=" w-[90%] h-[265px]  rounded-xl  bg-[#F0F0F0] p-2 mt-4">

                        <input type="file" accept="image/*" id="fileInput" style={{
                            display: "none"
                        }} onChange={handleImageChange} />
                        <div className="w-full bg-[#F0F0F0]  p-[2rem] h-[250px]   outline-black rounded-xl flex flex-col justify-center " style={{ border: "2px dotted rgb(0,0,0,0.2)", cursor: "pointer" }}
                            onClick={() => { document.getElementById('fileInput').click() }}>
                            <Image className=" w-[15%] ml-[42.5%] mb-4" src={imageIcon} alt="upload image" />
                            <p className=" text-center font-[550] w-full" style={{ fontSize: ".85rem" }}>Drag & drop files here</p>
                            <p className="text-center mb-2" style={{ fontSize: ".6rem" }}>Limit 200mb per file</p>
                            <Button onClick={handleImageChange} className="w-[50%] py-2 px-0 text-xs  m-1 ml-[25%] ">Browse Files</Button>
                        </div>
                    </div>
                    </div>}
                <div className="hover:cursor-pointer border-[.025rem] p-2  flex rounded-lg justify-center mt-8 w-[80%] ml-[10%]"
                    onClick={() => router.push("/")}>
                    <ChevronLeft className="mt-[0.15rem]" />
                    <p className="text-lg gont-[500]">Go back to CoPilot</p>
                </div>
            </div>
            <div className="md:hidden flex w-full justify-start fixed z-[99] bg-[#ffff] overflow-y-scroll min-h-[fit-content]">
                <Sheet open={sheetdata} onOpenChange={(val) => setSheetdata(val)} >
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="mx-2 md:hidden block" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 max-h-[100dvh] z-[100]">
                        <div >
                            <div className="w-full h-[20vh] p-4 flex relative" style={{ background: "linear-gradient(90deg, rgba(222,228,255,1) 10%, rgba(180,161,255,1) 100%)" }}>
                                <p className=" text-[1.2rem] font-[550] w-[60%] z-[2]" >{process.env.NEXT_PUBLIC_TITTLE} Smart Tagging</p>
                                <Image src={MainBg} className="w-[100%] h-[100%] absolute bottom-0 right-0  flex btl" alt="img" />
                            </div>
                            {uploadedImg?.length > 0 ? <p className="text-lg font-[500] w-full text-center mt-8">Uploaded Image</p> : <p className=" mt-8 text-lg font-[500] w-full text-center">Upload Image</p>}

                            {uploadedImg?.length > 0 ?
                                <>
                                    <div className="flex justify-center">
                                        <div className=" w-[90%]  flex justify-center  rounded-xl mt-4">
                                            <img className=" max-w-[300px]  h-[fit-content] max-h-[200px]  rounded-lg" src={uploadedImg[0]} alt="selected Image" />
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-8 w-[80%] ml-[10%]">
                                        <div className="flex w-full border-[0.02rem] p-3 rounded-xl justify-center hover:cursor-pointer" onClick={() => { document.getElementById('fileInput').click() }}>
                                            <input type="file" accept="image/*" id="fileInput" style={{
                                                display: "none"
                                            }} onChange={handleImageChange} />
                                            <ImagePlus />
                                            <p className="ml-4 text-[1rem]" >Upload Another Image</p>
                                        </div>
                                    </div>
                                </>
                                :
                                <div className="flex justify-center "><div className=" w-[90%] h-[220px]  rounded-xl  bg-[#F0F0F0] p-2 mt-4">

                                    <input type="file" accept="image/*" id="fileInput" style={{
                                        display: "none"
                                    }} onChange={handleImageChange} />
                                    <div className="w-full bg-[#F0F0F0]  p-[2rem] h-[200px]   outline-black rounded-xl flex flex-col justify-center " style={{ border: "2px dotted rgb(0,0,0,0.2)", cursor: "pointer" }}
                                        onClick={() => { document.getElementById('fileInput').click() }}>
                                        <Image className=" w-[15%] ml-[42.5%] mb-4" src={imageIcon} alt="upload image" />
                                        <p className=" text-center font-[550] w-full" style={{ fontSize: ".85rem" }}>Drag & drop files here</p>
                                        <p className="text-center mb-2" style={{ fontSize: ".6rem" }}>Limit 200mb per file</p>
                                        <Button onClick={handleImageChange} className="w-[50%] py-2 px-0 text-xs  m-1 ml-[25%] ">Browse Files</Button>
                                    </div>
                                </div>
                                </div>}
                        </div>
                    </SheetContent>
                </Sheet>
                <p className="text-lg font-[500] text-center w-full m-1">{process.env.NEXT_PUBLIC_TITTLE} Smart Tagging</p>
            </div>

            <div className="w-full min-h-[100vh] relative  bg-[rgb(0,0,0,0.02)] md:pl-[25rem] flex-1 overflow-y-scroll CS1">
                <div className="relative  ">
                    {streamData?.length > 0 ?
                        <div className="w-full h-full flex justify-center md:mt-0 mt-4">
                            <div className="w-[80%] mt-[2.5rem]">
                                <ReactMarkdown className="bl p-4  bg-[rgb(255,255,255)] text-[#121212] rounded-lg border-[0.1rem]"
                                    components={{
                                        table: ({ node, ...props }) => (
                                            <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                                                {...props}
                                            </table>
                                        ),
                                        pre: ({ node, ...props }) => (
                                            <div className="overflow-auto CS w-full  bg-[#121212] p-2 rounded-lg">
                                                <pre {...props} />
                                            </div>
                                        ),
                                        code: ({ node, ...props }) => (
                                            <code className="bg-[#121212] rounded-lg p-1  mt-4 " {...props} />
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
                                    }}>{streamData}</ReactMarkdown>

                                {tableData ? <div className="table mt-[.5rem] w-[100%] rounded-sm" dangerouslySetInnerHTML={{ __html: md.render(tableData) }}></div>
                                    : <div class="overflow-x-auto mt-[.5rem]">
                                        <table class="table-auto min-w-full divide-y divide-gray-200">
                                            <thead class="bg-gray-50">
                                                <tr>
                                                    <th class="px-6 py-3 w-1/4">Attribute</th>
                                                    <th class="px-6 py-3">Description</th>

                                                </tr>
                                            </thead>
                                            <tbody class="bg-white divide-y divide-gray-200">

                                                <tr class="animate-pulse">
                                                    <td class="px-6 py-4">
                                                        <div class="bg-gray-200 h-4 w-3/4 rounded"></div>
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        <div class="bg-gray-200 h-4 rounded"></div>
                                                    </td>

                                                </tr>
                                                <tr class="animate-pulse">
                                                    <td class="px-6 py-4">
                                                        <div class="bg-gray-200 h-4 w-3/4 rounded"></div>
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        <div class="bg-gray-200 h-4 rounded"></div>
                                                    </td>

                                                </tr>
                                                <tr class="animate-pulse">
                                                    <td class="px-6 py-4">
                                                        <div class="bg-gray-200 h-4 w-3/4 rounded"></div>
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        <div class="bg-gray-200 h-4 rounded"></div>
                                                    </td>

                                                </tr>
                                                <tr class="animate-pulse">
                                                    <td class="px-6 py-4">
                                                        <div class="bg-gray-200 h-4 w-3/4 rounded"></div>
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        <div class="bg-gray-200 h-4 rounded"></div>
                                                    </td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                }

                            </div>
                        </div>

                        : <>
                            <div className=" flex justify-center w-full relative">
                                <div className="relative  w-[90%] md:w-[50%]">
                                    <div className=" w-full flex justify-center relative">
                                        <Image alt="Description bg" src={dressImg} className="flex justify-center  border-[0.02rem] w-[350px]  h-[280px]  rounded-xl  mt-[20vh]" style={{
                                            background: "linear-gradient(180deg, rgba(222,228,255,1) 30%, rgba(180,161,255,1) 100%)",
                                            boxShadow: " 0 50px 50px 0px rgba(255,112,255,0.25), 0 0px 40px 0px rgba(180,161,255,.6)"
                                        }} />
                                        {/* <div className="absolute mt-[160px] ml-[310px] hidden md:flex w-[50%] h-[fit-content]  shadow-xl bg-[#fff] p-2 rounded-xl">
                                            <Image src={Scan} alt="Scan" className=" w-[20px] h-[20px]" />
                                            <p className="text-sm font-[500] ml-2">Explore and discover the product.</p>
                                        </div> */}
                                    </div>
                                    <p className=" text-xl font-[500] text-center  mt-4">Effortlessly extract text and tabular information from images. Simply upload your image, and let our advanced algorithms do the rest.</p>
                                </div>
                            </div> </>
                    }
                </div>
            </div>
        </div >
    )
}
