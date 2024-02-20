'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import imageIcon from '@/public/assets/imgIcon.svg'
import { Button } from "@/components/ui/button"
import { marked } from 'marked';
import { ImagePlus } from 'lucide-react';
import MainBg from "@/public/assets/mainBG.png"

import { useAtom } from 'jotai';
import { messageAtom, urlAtom, productIdAtom, descAtom } from '../(store)/store'

export default function Flipkart() {
    const router = useRouter()
    const [url, setUrl] = useAtom(urlAtom)
    const [scraping, setScraping] = useState(false)
    const [message, setMessage] = useAtom(messageAtom)
    const textareaRef = useRef(null);
    const [chatId, setChatId] = useAtom(productIdAtom)
    const [summaryArray, setSummaryArray] = useState([])
    const [calloutArray, setCalloutArray] = useState([])
    const [trendArray, setTrendArray] = useState([])
    const [desc, setDesc] = useAtom(descAtom)
    const [modelValue, setModelValue] = useState('gpt-4');
    const [childLoader, setChildLoader] = useState(false);
    var scrapeLoop = 0



    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setSelectedImage(URL.createObjectURL(img));
            uploadImage(img);
        }
    };

    const uploadImage = async (imageFile) => {
        setImageDescription(null);
        setTableData(null);
        setMessage([])
        const formData = new FormData();
        formData.append('img', imageFile);
        setLoading(true);
        axios.post('http://3.109.177.216:5050/search_image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            setUrl(res.data.product_url)
            setImgData(res.data)
            scrape2(res.data.product_url)

            setDesc({
                image_url: res.data.product_image_url,
                product_name: res.data.product_name
            })
            // setImageDescription(res.data);

        }).catch(err => console.log(err))

        /* const url = 'http://ec2-3-7-248-158.ap-south-1.compute.amazonaws.com:5050/generate';
 
         try {
             const response = await fetch(url, {
                 method: 'POST',
                 body: formData,
                  headers: {
              'Content-Type': 'multipart/form-data'
          }
             });
     
             if (!response.ok) {
                 throw new Error(`HTTP error! Status: ${response.status}`);
             }
     
             const data = await response.json();
       
             return data;
         } catch (error) {
             console.error("Error fetching data:", error);
         }*/

        /*  try {
              const response = await fetch(
                  'http://ec2-3-7-248-158.ap-south-1.compute.amazonaws.com:5050/generate',
                  {
                      method: 'POST',
                      body: formData,
                      headers: {
                          // No need to set 'Content-Type' for FormData; it's automatically set
                      },
                  }
              );
            
              const reader = response.body.getReader();
              const decoder = new TextDecoder();
              let partialResponse = '';
          
              const processResult = async (result) => {
                  if (result.done) {
                      setStream(false);
                  
                      return;
                  }
          
                  const chunk = decoder.decode(result.value.response, { stream: true });
                  partialResponse += chunk;

                  setImageDescription((prevData) => [...(prevData || ''), partialResponse]);
          
                  // Process and handle the streamed response chunk
                  return reader.read().then(processResult);
              };
          
              await reader.read().then(processResult);
            
          } catch (error) {
              setChatloader(false);
              console.error(`Error occurred while fetching the response.\n${error}`);
              // Handle the error accordingly
          }*/
        //     axios.post('http://13.127.199.2:5050/generate', formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     }).then(res => {

        //         setImageDescription(res.data);
        //         axios.get('http://13.127.199.2:5050/table').then(res => {

        //             setTableData(res.data);

        //             setLoading(false);
        //         }).catch(err => console.log(err))
        //     }).catch(err => console.log(err))
    }


    async function scrape2(url) {
        scrapeLoop = scrapeLoop + 1
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_BOT_URL + '/bot/scrape', {
                'url': url,
                llm_model: modelValue
            })
            setChatId(response.data.data.id)
            const newMessage = {
                bot: response.data.data.response
            }

            setMessage((prevMessage) => [...prevMessage, newMessage])
            setScraping(false)
            //     SimilarProducts(response.data.data.id);
        }
        catch (error) {
            alert('Please try again')
            setScraping(false)
            console.log('Error', error)
        }

    }
    useEffect(() => {
        // textareaRef.current.focus();
    }, []);

    useEffect(() => {
        if (message.length > 0) {
            //  const chatContainer = chatContainerRef?.current;
            //  chatContainer.scrollTop = chatContainer?.scrollHeight;
        }

    }, [message])


    async function scrape() {
        if (url && url.trim() !== "") {
            setChatId();
            trigger();
            scrapeLoop = scrapeLoop + 1
            setScraping(true)
            var myInput = document.getElementById('urlInput');
            myInput.style.outline = 'none';
            var myInput = document.getElementById('errorDiv');
            myInput.style.display = 'none';
            try {
                const response = await axios.post(process.env.NEXT_PUBLIC_BOT_URL + '/bot/scrape', {
                    url: url,
                    llm_model: modelValue
                })
                setChatId(response.data.data.id)
                setDesc(response.data.data)
                const newMessage = {
                    bot: response.data.data.response
                }
                setMessage((prevMessage) => [...prevMessage, newMessage])
                setScraping(false)
                //SimilarProducts(response.data.data.id);
            }
            catch (error) {
                setScraping(false)
                alert('Please try again')
            }
        }
        else if (url?.length == 0 || url.trim()?.length == 0) {
            var myInput = document.getElementById('urlInput');
            myInput.style.outlineColor = ' #ff8a90';
            var ErrorDiv = document.getElementById('errorDiv');
            ErrorDiv.style.display = 'block';
            setTimeout(() => {
                ErrorDiv.style.display = 'none';
            }, 1000);
        }
    }

    async function chat(value) {
        if (value && value.trim() && url && url.trim() !== "") {
            if (message?.length != 0) {
                setChatloader(true)
                var myInput = document.getElementById('urlInput');
                myInput.style.outline = 'none';
                var myInput1 = document.getElementById('chat');
                myInput1.style.outline = 'none';
                var ErrorDiv = document.getElementById('error');
                myInput1.style.visibility = 'visible';
                var ErrorDiv = document.getElementById('errorDiv');
                ErrorDiv.style.display = 'none';
                const newUserMsg = {
                    user: value
                }
                setMessage((prevMessage) => [...prevMessage, newUserMsg])
                try {
                    const response = await fetch(
                        process.env.NEXT_PUBLIC_BOT_URL + '/bot/qna'
                        , {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                url: url,
                                id: chatId,
                                query: value,
                                // is_web_aware: webAware,
                                // is_page_aware: pageAware,
                                //  compare: compare,
                                llm_model: modelValue

                            }),
                        });

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let partialResponse = '';

                    const processResult = async (result) => {

                        if (result.done) {
                            setChatloader(false)
                            setStream(false)
                            const newMsg = {
                                bot: partialResponse
                            }

                            setMessage((prevMessage) => [...prevMessage, newMsg])
                            return;
                        }

                        const chunk = decoder.decode(result.value, { stream: true });
                        partialResponse += chunk;
                        setStream(true)
                        setStreamData(partialResponse)
                        // Process and handle the streamed response chunk
                        return reader.read().then(processResult);
                    };

                    return reader.read().then(processResult);
                } catch (error) {
                    setChatloader(false)
                    console.log(`Error occurred while fetching the response.\n${error}`);
                    // isRequestInProgress = false;
                }
            }
            else {
                alert("Please Submit the Product URL")
            }
        }
        else if (url?.length == 0 || url.trim()?.length == 0) {
            var myInput = document.getElementById('urlInput');
            myInput.style.outlineColor = '#ff8a90';
            var ErrorDiv = document.getElementById('errorDiv');
            ErrorDiv.style.display = 'block';
            setTimeout(() => {
                ErrorDiv.style.display = 'none';
            }, 1000);
        }
        else if (value?.length == 0 || value.trim()?.length == 0) {
            var myInput1 = document.getElementById('chat');
            myInput1.style.borderRadius = '5px';
            myInput1.style.outlineColor = '#ff8a90';
        }
    }

    async function SimilarProducts(value) {

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BOT_URL + '/bot/qna/similar'
                , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: 'share few similar products',
                        id: value
                    }),
                });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let partialResponse = '';

            const processResult = async (result) => {

                if (result.done) {
                    setSimilarProd(marked.parse(partialResponse));

                    return;
                }
                const chunk = decoder.decode(result.value, { stream: true });
                partialResponse += chunk;

                return reader.read().then(processResult);
            };
            return reader.read().then(processResult);
        } catch (error) {

            console.log(`Error occurred while fetching the response.\n${error}`);
            // isRequestInProgress = false;


        }
    }
    async function trigger() {
        try {
            const formData1 = new FormData();
            var modifiedUrl1 = url.split("FLIPKART")[0];
            let modifiedUrl = modifiedUrl1.replace("/p/", "/product-reviews/");
            formData1.append('url', modifiedUrl + 'FLIPKART');
            formData1.append('override', false);

            const response = await axios.post(process.env.NEXT_PUBLIC_REVIEW_URL + '/vetri/trigger-summary', formData1, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type to form data
                },
            });
            getReviewData()
        } catch (error) {
            console.log('Error', error);
        }
    }
    async function getReviewData() {
        if (url?.length > 0 || url) {
            try {
                const formData = new FormData();
                var modifiedUrl1 = url.split("FLIPKART")[0];
                let modifiedUrl = modifiedUrl1.replace("/p/", "/product-reviews/");
                formData.append('url', modifiedUrl);
                formData.append('override', false);

                const response = await axios.post(process.env.NEXT_PUBLIC_REVIEW_URL + '/vetri/get-summary', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set the content type to form data
                    },
                })

                await response.data.forEach(element => {
                    if (element.type == 'summary') {

                        setSummaryArray(element.data)
                    }
                    if (element.type == 'callout') {

                        setCalloutArray(element.data)
                    }
                    if (element.type == 'trend') {

                        setTrendArray(element.data)
                        setChartData(element.data)
                    }
                    setChildLoader(false)
                });
            }
            catch (error) {
                setChildLoader(false)
                console.log('Error', error)
            }
        }
        else {
            alert("Please Enter Flipkart Product URL")
        }
    }
    function setReviewDataFun(i) {
        if (url?.length > 0 || url) {


            if (summaryArray.length == 0) {
                getReviewData()
            }
            if (i == 1) {
                const newMsg = {
                    bot: summaryArray[0]
                }
                setMessage((prevMessage) => [...prevMessage, newMsg])
                if (summaryArray.length == 0) {
                    alert('Reviews not processed yet')
                }
            }

            if (i == 2) {
                const newMsg = {
                    bot: calloutArray[0]
                }
                setMessage((prevMessage) => [...prevMessage, newMsg])
                if (calloutArray.length == 0 || !calloutArray) {
                    alert('Reviews not processed yet')
                }
            }


            if (i == 3) {
                const newMsg = {
                    chart: trendArray
                }
                setMessage((prevMessage) => [...prevMessage, newMsg])
                if (trendArray.length == 0 || !trendArray) {
                    alert('Reviews not processed yet')
                }
            }
        }
        else {
            alert("Please Enter Flipkart Product URL")
        }
    }
    async function descriptionFun(i) {
        if (url?.length > 0 || url) {

            try {
                setChildLoader(true)
                const response = await axios.post(process.env.NEXT_PUBLIC_BOT_URL + '/bot/desc-gen', {
                    id: chatId,
                    desc_id: i.toString(),
                    llm_model: modelValue
                })
                setDescriptionResponse(response.data)
                setChildLoader(false)
                const newMsg = {
                    bot: response.data
                }
                setMessage((prevMessage) => [...prevMessage, newMsg])
            }
            catch (error) {
                setChildLoader(false)
                console.log('Error', error)
            }
        }
        else {
            alert("Please Enter Flipkart Product URL")
        }
    }
    function urlError() {
        if (url?.length == 0 || url.trim()?.length == 0) {
            var myInput = document.getElementById('urlInput');
            myInput.style.outlineColor = '#ff8a90';
        }
    }
    function tableFunc(data) {
        return data
    }
    const handleChange = (e) => {
        setModelValue(e.target.value);
    };

    return (
        <>
            <div className="w-full h-[20vh] p-4 flex relative" style={{ background: "linear-gradient(90deg, rgba(222,228,255,1) 10%, rgba(180,161,255,1) 100%)" }}>
                <p className="text-[1.4rem] md:text-[1.75rem] font-[550] w-[60%] z-[2]" >Cloud Kinetics Copilot</p>
                <Image src={MainBg} className="w-[100%] h-[100%] absolute bottom-0 right-0  flex btl" alt="img" />
            </div>
            <div className="w-full flex-1   p-4 ">
                <div className="w-full space-y-6 ">
                    {message?.length > 0 || scraping ?
                        <div>
                            <div className="w-full flex justify-center relative">
                                {scraping ?
                                    <div className="w-[80%] justify-center flex animate-pulse">
                                        <div className="h-64 bg-[rgba(0,0,0,0.08)] rounded w-full"></div>
                                    </div>
                                    : null}
                                {!scraping ?
                                    <div className=" w-[60%] max-w-[60%] max-h-[40vh] justify-center  flex">
                                        <img className="w-[fit-content]  flex flex-wrap object-cover object-right-top rounded-xl" src={desc.image_url} alt="img" style={{ maxHeight: "   100%" }} />
                                    </div>
                                    : null}
                            </div>
                        </div> :
                        <>
                            {!selectedImage ? <div className="md:block hidden">  <p className=" font-semibold   text-center w-[64%] ml-[15%] mt-[2rem]" style={{ fontSize: "1.1rem" }}>Upload a Photo or a URL to use our Cloud Kinetics Product Copilot</p>
                                <div className="  w-[90%] ml-[5%] flex justify-center ">
                                    {/* <input type="file" disabled={true} id="fileInput" style={{
                                        display: "none"
                                    }} onChange={handleImageChange} />
                                    <div className="full p-[4rem] hover:cursor-not-allowed outline-black rounded-xl flex flex-col justify-center " style={{ border: "2px dotted rgb(0,0,0,0.2)" }}
                                        onClick={() => { document.getElementById('fileInput').click() }}>
                                        <Image className=" w-[40%] ml-[30%] " src={imageIcon} alt="upload image" />
                                        <p className="text-[rgb(0,0,0,0.66)] text-center" style={{ fontSize: ".8rem" }}>Upload a Product picture here</p>
                                    </div> */}
                                    <div onClick={() => { router.push('/lens') }} className=" my-8 flex border-[0.02rem] p-3 rounded-xl justify-center hover:cursor-pointer">
                                        <ImagePlus />
                                        <p className="ml-4 text-[1rem]" onClick={() => { router.push('/lens')/* document.getElementById('fileInput').click() */ }}>Upload Product Picture</p>
                                    </div>
                                </div> </div> : null}
                            {selectedImage ? <div className="w-[60%] ml-[20%]  justify-center hover:cursor-not-allowed md:flex hidden">
                                <input type="file" disabled={true} style={{
                                    display: "none"
                                }} />
                                <div className="full p-1 outline-black rounded-xl flex flex-col justify-center " style={{ border: "2px dotted rgb(0,0,0,0.2)" }} >
                                    <img className=" w-[100%]  " src={selectedImage} alt="upload image" />
                                </div>
                            </div> : null}
                        </>
                    }
                    {scraping ?
                        <div className="w-[90%] ml-[5%] justify-center flex animate-pulse  px-4">
                            <div className="h-8 bg-[rgba(0,0,0,0.08)] rounded w-full"></div>
                        </div>
                        : null}
                    {message.length > 0 || selectedImage && !scraping ?
                        <>
                            <div className="w-full justify-center flex  px-2 ">
                                <p className="whitespace-nowrap overflow-hidden  w-full font-[550]   text-center pb-4  border-b-[.1rem]" style={{ fontSize: "1.1rem" }}>
                                    {desc.product_name}
                                </p>
                            </div>
                            <div onClick={() => { router.push('/lens') }} className="flex border-[0.02rem] p-3 rounded-xl justify-center hover:cursor-pointer">
                                {/* <input type="file" id="fileInput" style={{
                                    display: "none"
                                }} onChange={handleImageChange} /> */}
                                <ImagePlus />
                                <p className="ml-4 text-[1rem]" onClick={() => { router.push('/lens')/* document.getElementById('fileInput').click() */ }}>Upload Another Product</p>
                            </div>
                        </>
                        : null}
                    {scraping ? null : <p className="font-medium text-lg text-center mt-8">Enter Product URL</p>}
                    <div className="w-full flex flex-col justify-center">
                        <div className="flex justify-between w-full mx-auto rounded-xl h-[3rem] border-[0.02rem]">
                            <input id="urlInput" value={url} ref={textareaRef} className="w-full p-2 outline-none bg-transparent" type="text  p-2" placeholder='Enter Flipkart  Product URL' onChange={(e) => setUrl(e.target.value)} />
                            <Button className=" py-0 px-3 rounded-lg h-[2rem] hover:cursor-pointer  m-2" onClick={() => { scrape(), setSelectedImage() }}>Submit</Button>
                        </div>
                        <p className="w-full px-8 text-[#ff8a90] text-sm  hidden mt-[.25rem]" id="errorDiv">Enter Product URL</p>
                    </div>
                </div>

                {/* --------------------------------right ui---------------------------- 
          {!selectedImage ? <ScrapeChat /> : null}
            {selectedImage?.length > 0 ? <MultiModel /> : null}*/}
            </div>


        </>
    )
}
