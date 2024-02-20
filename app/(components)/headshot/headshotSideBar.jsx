"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import sideBG from '@/public/assets/headshot/SidebarMainImage.png'
import RightArrow from '@/public/assets/headshot/CaretRight.svg'
import Female1 from '@/public/assets/headshot/Female1.png'
import Female2 from '@/public/assets/headshot/Female2.png'
import Female3 from '@/public/assets/headshot/Female3.png'
import Male1 from '@/public/assets/headshot/Male1.png'
import Male2 from '@/public/assets/headshot/Male2.png'
import Male3 from '@/public/assets/headshot/Male3.png'
import ArrowBack from '@/public/assets/headshot/ArrowBack.svg'
import imageIcon from '@/public/assets/headshot/ImageIcon.svg'
import closeIcon from '@/public/assets/headshot/CloseIcon.svg'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import axios from 'axios'
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function HeadshotSideBar() {

  const uid = uuidv4();

  const [secondScreen, setSecondScreen] = useState(false)
  const [uploadedImage, setUploadedImage] = useState([])
  const [imageArray, setImageArray] = useState([])
  const [projectName, setProjectName] = useState('')
  const [userId, setUserId] = useState(null)
  const [models, setModels] = useState([])
  useEffect(() => {
    localStorage.getItem('userId') ? localStorage.setItem('userId', uid) : setUserId(localStorage.getItem('userId'))
  }, [])
  useEffect(() => {
    getModels()
  })


  async function uploadFile() {
    const formData = new FormData();
    
    formData.append('user_uuid', uid);
    formData.append('project_name', projectName);
    formData.append(`uploaded_images`,imageArray );
    try {
      const response = await fetch('http://52.205.181.254:8502/train-model', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function getModels() {
    const response = await axios.get(`http://52.205.181.254:8502/list-user-models/123e4567-e89b-12d3-a456-426614174000`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    setModels(response.models)
    console.log(response.models)
  }

  /* const uploadFile = (file, onUploadProgress) => {
     const formData = new FormData();
     formData.append('project_name', 'test');
     formData.append('uploaded_images', file.url);
 
     return axios.post('http://52.205.181.254:8502/train-model/', formData, {
       headers: {
         'Content-Type': 'multipart/form-data',
         'accept': 'application/json',
       },
       onUploadProgress,
     });
   };
 */
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = e.target.files;
      const filesArray = Array.from(selectedFiles);
      const newFilesInfo = filesArray.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      const newImageArray = filesArray.map((file) => URL.createObjectURL(file));
      setImageArray(newImageArray);
      setUploadedImage((prevImages) => [...prevImages, ...newFilesInfo]);
     
    }
 
  };
  const removeImage = (index) => {
    const updatedImages = [...uploadedImage];
    updatedImages.splice(index, 1);
    setUploadedImage(updatedImages);
  };




  return (
    <div className="w-full min-h-full rounded-lg shadow-xl bg-[#fff]">
      {secondScreen ?
        <div className="w-full relative  px-3 py-2">
          <Image className="" src={ArrowBack} alt="back" onClick={() => setSecondScreen(false)} />
          <div className="mt-6">
            <p className="font-[550] text-md">Train new model</p>
            <p className="font-[400] text-xs text-[#596069]">Upload images and train your model</p>
          </div>
          <input value={projectName} className="outline-none bg-[#F0F0F0] p-2 text-sm rounded-md w-full mt-4 text-[#121212]" placeholder='Name Your Model' type="text" onChange={(e) => setProjectName(e.target.value)} />
          <p className=" font-[500] text-sm mt-4 text-[#596069]">Upload Image</p>

          <div className="w-full  rounded-xl mt-1 bg-[#F0F0F0] p-2">
            <input type="file" id="fileInput" style={{
              display: "none"
            }} onChange={handleImageChange} multiple />
            <div className="w-full bg-[#F0F0F0]  p-[2rem] h-[25vh]  outline-black rounded-xl flex flex-col justify-center " style={{ border: "2px dotted rgb(0,0,0,0.2)", cursor: "pointer" }}
              onClick={() => { document.getElementById('fileInput').click() }}>
              <Image className=" w-[15%] ml-[42.5%] mb-4" src={imageIcon} alt="upload image" />
              <p className=" text-center font-[550] w-full" style={{ fontSize: ".85rem" }}>Drag & drop files here</p>
              <p className="text-center mb-2" style={{ fontSize: ".6rem" }}>Limit 200mb per file</p>
              <Button onClick={handleImageChange} className="w-[50%]  text-xs p-0 m-1 ml-[25%] ">Browse Files</Button>
            </div>
          </div>
          <div className=" overflow-y-scroll CS max-h-[35vh] mt-4 max-w-[20rem]">
            {uploadedImage?.map((img, index) => (
              <div className="flex w-full my-4" key={index}>
                <div className="w-[15%]">
                  <Image src={img.url} alt="img" className="max-h-[2rem]" width={100} height={100} />
                </div>
                <div className="flex-1 ml-2 grid">
                  <div className="flex justify-between ">
                    <p className="text-xs whitespace-nowrap ">{img.name}</p>
                    <Image src={closeIcon} alt="close" onClick={() => removeImage(index)} />
                  </div>
                  {/*<Progress value={33} className="w-full h-[.25rem]" />*/}
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-6 h-[35px] rounded-xl" onClick={() => uploadFile()}> Generate</Button>
        </div>


        //---------------------------------------main-sidebar-----------------------------


        :
        <><div className="w-full h-[35vh] relative ">
          <Image className="flex w-full h-full rounded-lg" alt="bg" src={sideBG} />
          <div className="absolute bottom-4 ">
            <p className="text-xl font-[550] text-center">Headshot Generator</p>
            <p className="text-xs text-center p-2">Train and generate custom headshots for your product pictures</p>
          </div>
        </div>
          <hr className="border-[#f1f1f1] border-b-[.02px] mt-4 mx-[0.75rem]" />

          <div className="   w-full px-3 py-2 ">
            <div className="flex relative justify-between hover:cursor-pointer" onClick={() => setSecondScreen(true)}>
              <div>
                <p className="font-[550] text-md">Train new model</p>
                <p className="font-[400] text-xs text-[#596069]">Upload images and train your model</p>
              </div>
              <Image className="" alt="arrow" src={RightArrow} />
            </div>

            <hr className="border-[#f1f1f1] border-b-[.02px] mt-3" />
            <p className=" font-[550] text-md mt-4">Generate Image</p>
            <p className="font-[400] text-xs text-[#596069] mt-4">model*</p>
            <div className="w-full ">
              <Select >
                <SelectTrigger className=" bg-[#F0F0F0] w-full max-h-[30px] mt-1">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                {models?.map((model, index) => <SelectContent key={index} className="">
                  <SelectItem key={index + 'v'} value={model}>{model}</SelectItem>
                </SelectContent>)}
              </Select>
            </div>
            <p className="font-[400] text-xs text-[#596069] mt-4">Select Template</p>
            <div className="flex flex-wrap w-full justify-between mt-2 ">
              <Image className="w-[30%] hover:cursor-pointer" alt="img1" src={Male1} width={1000} height={1000} />
              <Image className="w-[30%] hover:cursor-pointer" alt="img1" src={Female1} width={1000} height={1000} />
              <Image className="w-[30%] hover:cursor-pointer" alt="img2" src={Male2} width={1000} height={1000} />
              <Image className="w-[30%] mt-2 hover:cursor-pointer" alt="img2" src={Female2} width={1000} height={1000} />
              <Image className="w-[30%] mt-2 hover:cursor-pointer" alt="img3" src={Male3} width={1000} height={1000} />
              <Image className="w-[30%] mt-2 hover:cursor-pointer" alt="img3" src={Female3} width={1000} height={1000} />
            </div>
            <Button className="w-full mt-6 h-[35px] rounded-xl"> Generate</Button>
          </div></>}

    </div>
  )
}
