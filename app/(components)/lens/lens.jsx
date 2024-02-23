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
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import Webcam from 'react-webcam';
export default function Lens() {
    const router = useRouter()
    const [uploadedImg, setUploadedImg] = useState([])
    const [sheetdata, setSheetdata] = useState(false)
    const [imgData, setImgData] = useState([])
    const [loading, setLoading] = useState(false)
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
        setLoading(true)
        setImgData([])
        const formData = new FormData();
        formData.append('img', imageFile);
        axios.post(process.env.NEXT_PUBLIC_LENS_URL + '/search_image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            setLoading(false)
            setImgData(res.data)
            console.log(res)
            // setDesc({
            //     image_url:res.data.product_image_url,
            //     product_name:res.data.product_name
            // })
            // setImageDescription(res.data);

        }).catch(err => (alert('Please try again later'), console.log(err), setLoading(false)))
    }

    return (
        <div className='w-full min-h-[100vh] bg-[rgb(0,0,0,0.02)] CS'>

            <div className="w-[25rem] border-r-[0.02rem] fixed z-[80] h-full hidden md:block" >
                <div className="w-full h-[20vh] p-4 flex relative" style={{ background: "linear-gradient(90deg, rgba(222,228,255,1) 10%, rgba(180,161,255,1) 100%)" }}>
                    <p className=" text-[1rem] font-[550] w-[60%] z-[2]" >{process.env.NEXT_PUBLIC_TITTLE} Lens</p>
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
                                <p className="ml-4 text-[1rem]" >Upload Another Product</p>
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
                                <p className=" text-[1rem] font-[550] w-[60%] z-[2]" >{process.env.NEXT_PUBLIC_TITTLE} Lens</p>
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
                                            <p className="ml-4 text-[1rem]" >Upload Another Product</p>
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
                <p className="text-lg font-[500] text-center w-full m-1">{process.env.NEXT_PUBLIC_TITTLE} Lens</p>
            </div>

            <div className="w-full min-h-[100vh] relative  bg-[rgb(0,0,0,0.02)] md:pl-[25rem] flex-1 overflow-y-scroll CS1">
                <div className="relative  ">
                    {imgData?.length > 0 ?
                        <div className="w-full h-full flex justify-center md:mt-0 mt-4">
                            <div className="w-full p-4 rounded-sm flex flex-wrap">
                                {imgData.map((img, index) => (
                                    <div key={index} className="flex  w-full p-1  border-b-[rgb(18,18,18,0.1)] bg-[#FFF] border-[1px]  hover:cursor-pointer" onClick={() => window.open(img.product_url, 'blank')}>
                                        <img className="max-w-[30%] h-[fit-content] min-h-[100px] max-h-[250px] p-8" src={img.product_image_url} style={{ borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }} />
                                        <div className=" p-2 w-[55%]">
                                            <p className=" text-lg font-[550] ">{img.product_name}</p>
                                            <div className="flex w-full text-[#878787] font-[550] mt-1">
                                                <div className="px-2 flex bg-[#388e3c] w-[50px] rounded-sm text-white"><p className="text-md">{img.Rating}</p><Star className="" /></div>
                                                <p className="px-2 text-sm">{img.RatingsCount} Ratings</p>
                                                <p>&</p>
                                                <p className="px-2 text-sm">{img.ReviewsCount} Reviews</p>
                                            </div>
                                            <p className="mt-2 text-sm font-[450] text-[#000] content">{img.Highlights}</p>
                                        </div>
                                        <div className=" w-[15%] p-2">
                                            <p className="text-xl font-[550]">{img.Price}</p>
                                            <div className="flex text-center">
                                                <p className="px-2 text-sm text-[#878787] line-through">{img.OriginalPrice}</p>
                                                <p className="px-2 mt-1 text-xs text-[#388e3c] font-[500]">{img.Discount}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* {imgData.map((img, index) => (
                                    <div key={index} className="md:w-[22%] w-[90%] max-w-[300px] p-1  m-2 bg-[#f1f1f1] border-[2px]  rounded-lg hover:cursor-pointer" onClick={() => window.open(img.product_url, 'blank')}>
                                        <img className="w-full  min-h-[100px] h-[fit-content] max-h-[300px]  " src={img.product_image_url} style={{ borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }} />
                                        <div className="w-full p-2 bg-[#f1f1f1]">
                                            <p className="text-center text-xs bg-[#f1f1f1]">{img.product_name}</p>
                                        </div>
                                    </div>
                                ))} */}
                            </div>
                        </div>

                        : <>{!loading ?
                            <div className=" flex justify-center w-full relative">
                                <div className="relative  w-[90%] md:w-[50%]">
                                    <div className=" w-full flex justify-center relative">
                                        <Image alt="Description bg" src={dressImg} className="flex justify-center  border-[0.02rem] w-[350px]  h-[280px]  rounded-xl  mt-[20vh]" style={{
                                            background: "linear-gradient(180deg, rgba(222,228,255,1) 30%, rgba(180,161,255,1) 100%)",
                                            boxShadow: " 0 50px 50px 0px rgba(255,112,255,0.25), 0 0px 40px 0px rgba(180,161,255,.6)"
                                        }} />
                                        <div className="absolute mt-[160px] ml-[310px] hidden md:flex w-[50%] h-[fit-content]  shadow-xl bg-[#fff] p-2 rounded-xl">
                                            <Image src={Scan} alt="Scan" className=" w-[20px] h-[20px]" />
                                            <p className="text-sm font-[500] ml-2">Explore and discover the product.</p>
                                        </div>
                                    </div>
                                    <p className=" text-xl font-[500] text-center  mt-4">Utilize image recognition to scan and search for products corresponding to the uploaded image.</p>
                                </div>
                            </div> : <div className="w-full h-full flex justify-center md:mt-0 mt-4">
                                <div className="w-full p-8  ">
                                    <div className=" w-[95%]  p-1  mx-2 bg-[#f1f1f1]  rounded-lg hover:cursor-pointer">
                                        <div className=" animate-pulse w-full h-[300px] md:h-[300px] bg-[rgba(0,0,0,0.08)] rounded "></div>
                                    </div>
                                    <div className=" w-[95%]  p-1  mx-2 bg-[#f1f1f1]  rounded-lg hover:cursor-pointer">
                                        <div className=" animate-pulse w-full h-[300px] md:h-[300px] bg-[rgba(0,0,0,0.08)] rounded "></div>
                                    </div>
                                    <div className=" w-[95%]  p-1  mx-2 bg-[#f1f1f1]  rounded-lg hover:cursor-pointer">
                                        <div className=" animate-pulse w-full h-[300px] md:h-[300px] bg-[rgba(0,0,0,0.08)] rounded "></div>
                                    </div>
                                    <div className=" w-[95%]  p-1  mx-2 bg-[#f1f1f1]  rounded-lg hover:cursor-pointer">
                                        <div className=" animate-pulse w-full h-[300px] md:h-[300px] bg-[rgba(0,0,0,0.08)] rounded "></div>
                                    </div>
                                    <div className=" w-[95%]  p-1  mx-2 bg-[#f1f1f1]  rounded-lg hover:cursor-pointer">
                                        <div className=" animate-pulse w-full h-[300px] md:h-[300px] bg-[rgba(0,0,0,0.08)] rounded "></div>
                                    </div>
                                </div>
                            </div>}</>
                    }
                </div>
            </div>
        </div>
    )
}
