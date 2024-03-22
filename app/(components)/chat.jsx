'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import axios from 'axios'
import InitialContent from './InitialContent'

import { Button } from "@/components/ui/button"

import Star from '@/public/assets/reviewStar.svg'
import sprakle from '@/public/assets/sprakle.svg'

import star_inactive from "@/public/assets/star_inactive.svg"
import Sparkle_active from "@/public/assets/copilot_active.svg"
import inputMenu from '@/public/assets/inputMenu.svg'
import arrowUp from '@/public/assets/arrowUp.svg'
import { cn } from '@/lib/utils'
import TypingAnimation from '../(loaders)/typing'

import LineChart from '@/app/(chart)/lineChart'
import BarChart from '@/app/(chart)/barChart'
import { Loader, XCircle, Volume2, Menu } from 'lucide-react';

import userImg from '@/public/assets/userImg.svg'
import BotImg from '@/public/assets/botImg.svg'
import ReactMarkdown from 'react-markdown'

import Flipkart from './flipkart'

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAtom } from 'jotai';
import { messageAtom, urlAtom, productIdAtom, emoAtom } from '../(store)/store'
import ReactAudioPlayer from 'react-audio-player';
export default function ScrapeChat() {

    const audioRef = useRef(null);

    const [inputPopUp, setInputPopUp] = useState(false)
    const [inputDesc, setInputDesc] = useState(true)
    const [inputReview, setInputReview] = useState(false)
    const [inputChat, setInputChat] = useState(false)
    const [loading, setLoading] = useState(false);
    const [userMsg, setUserMsg] = useState('')
    const [url, setUrl] = useAtom(urlAtom)
    const [scraping, setScraping] = useState(false)
    const [streamData, setStreamData] = useState('')
    const [stream, setStream] = useState(false)
    const [message, setMessage] = useAtom(messageAtom)
    const textareaRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [chatLoader, setChatloader] = useState(false)
    const [similarProd, setSimilarProd] = useState([])
    const [reviewDrop, setReviewDrop] = useState(false)
    const [descriptionDrop, setDescriptionDrop] = useState(false)
    const [chatId, setChatId] = useAtom(productIdAtom)
    const [sp, setSp] = useState(false)
    const [reviewsData, setReviewsData] = useState(false);
    const [descriptionData, setDescriptionData] = useState(false);
    const [summary, setSummary] = useState(false)
    const [callOut, setCallout] = useState(false)
    const [trend, setTrend] = useState(false)
    const [responseData, setResponseData] = useState([])
    const [summaryArray, setSummaryArray] = useState('')
    const [calloutArray, setCalloutArray] = useState('')
    const [trendArray, setTrendArray] = useState([])
    const [emoArray, setEmoArray] = useAtom(emoAtom)
    const [desc, setDesc] = useState('')
    const [descriptionResponse, setDescriptionResponse] = useState('')
    const [chartData, setChartData] = useState([]);
    const [childLoader, setChildLoader] = useState(false);
    const [webAware, setWebAware] = useState(false);
    const [pageAware, setPageAware] = useState(true);
    const [compare, setCompare] = useState(false);
    const [modelValue, setModelValue] = useState('gpt-4');
    const [voice, setVoice] = useState(null)
    const [audioUrl, setAudioUrl] = useState(null)
    const [audioPopup, setAudioPopup] = useState(false)
    const [audioLoader, setAudioLoader] = useState(false)
    const [sheetdata, setSheetdata] = useState(false)

    const [initialData, setInitialData] = useState({
        inputChat: inputChat,
        inputReview: inputReview,
        inputDesc: inputDesc
    })

    const model = [
        { value: "gpt-4", name: "gpt-4", enabled: true },
        { value: "gpt-3.5", name: "gpt-3.5", enabled: true },
        { value: "featherlite", name: "Featherlite", enabled: true },
        // { value: "zypher-7b", name: "zephyr-7b", enabled: false },
        { value: "llama2:13b", name: "llama2-13b", enabled: false },
        { value: "openhermes-7b", name: "openhermes-7b", enabled: false },
        // { value: "mixtral", name: "mixtral-8x7b", enabled: false },
        { value: "llama2:70b", name: "llama2-70b", enabled: false }
    ]
    async function enTohi(msg, voice, ln) {
        /*setAudioPopup(true)
        setAudioLoader(true)
        const postData = {
            desc: msg,
            lang: "hindi"
        };
        const apiUrl = "http://flipkartchatbot.hexonlabs.com/bot/translate";
        const response = await axios.post(apiUrl, postData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        postVoice(response.data, voice, "hi")*/
    }

    async function postVoice(msg, voice, ln) {
        setAudioPopup(true)
        setAudioLoader(true)
        const postData = {
            "text": msg,
            "voice_model": voice,
            "language": ln
        };
        const apiUrl = "http://ec2-13-127-113-51.ap-south-1.compute.amazonaws.com:5000/tts";
        axios.post(apiUrl, postData, {
            responseType: 'blob', // Important: responseType should be set to 'blob'
        })
            .then(response => {
                const url = URL.createObjectURL(new Blob([response.data]));
                //  const audio = new Audio(url);
                // audio.play();
                setAudioUrl(url)
                setAudioLoader(false)
                audioRef.current.src = url;
                audioRef.current.play();
            })
            .catch(error => console.error("Error:", error));
    }

    // useEffect(() => {
    //     async function getVoice() {
    //         try {
    //             const response = await axios.get('http://ec2-13-127-113-51.ap-south-1.compute.amazonaws.com:5000/list_voice_models', {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //             });
    //             setVoice(response.data.voices);
    //         } catch (error) {
    //             console.error('Error fetching Voices:', error);
    //         }
    //     }
    //     getVoice()
    // }, []);



    // useEffect(() => {
    //     //textareaRef.current.focus();
    // }, []);

    useEffect(() => {
        if (message.length > 0) {
            const chatContainer = chatContainerRef?.current;
            chatContainer.scrollTop = chatContainer?.scrollHeight;
        }
    }, [message, userMsg])

    async function chat(value) {
        if (value && value.trim() !== "") {
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
                    alert("Please try again later")
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
                    if (element.type == 'emo') {
                        setEmoArray(element.data.scores)
                    }
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
            alert("Please Enter Product URL")
        }
    }
    function setReviewDataFun(i) {
        if (url?.length > 0 || url) {
            if (summaryArray.length == 0) {
                getReviewData()
            }
            if (i == 1) {
                const newMsg = {
                    bot: summaryArray
                }
                setMessage((prevMessage) => [...prevMessage, newMsg])
                if (summaryArray.length == 0) {
                    alert('Reviews not processed yet')
                }
            }
            if (i == 2) {
                const newMsg = {
                    bot: calloutArray
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
            if (i == 4) {
                const newMsg = {
                    emo: [emoArray]
                }
                setMessage((prevMessage) => [...prevMessage, newMsg])
                if (emoArray.length == 0 || !emoArray) {
                    alert('Reviews not processed yet')
                }
            }
        }
        else {
            alert("Please Enter  Product URL")
        }
    }
    async function descriptionFun(i) {
        if (url?.length > 0 || url) {
            try {
                const value = i <= 5 ? {
                    id: chatId,
                    desc_id: i.toString(),
                    llm_model: modelValue,
                    type: "desc"
                } : {
                    id: chatId,
                    llm_model: modelValue,
                    type: i == 6 ? "highlights" : "dejarg"
                }
                setChildLoader(true)
                const response = await axios.post(process.env.NEXT_PUBLIC_BOT_URL + '/bot/desc-gen',
                    value
                )
                setDescriptionResponse(response.data)
                setChildLoader(false)
                const newMsg = {
                    bot: response.data
                }
                setMessage((prevMessage) => [...prevMessage, newMsg])
            }
            catch (error) {
                setChildLoader(false)
                alert("Please try again later")
                console.log('Error', error)
            }
        }
        else {
            alert("Please Enter  Product URL")
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
        // other state updates...
    };

    const dataJson = [{
        topHead: "Generate automatic product descriptions for your products",
        topSub: "Enhance Your Product Listings with AI-Generated Descriptions",
        head: "Generate Product Description",
        sub: "Generate custom product descriptions of products from Images/Urls",
        list: ["Professional", "Technical", "Friendly", "Straightforward"]
    }, {
        topHead: "Analyse reviews and product feedback for your product",
        topSub: "Enhance Your Product with Reviews",
        head: "Analyse Reviews",
        sub: "Analyse user reviews and feedback",
        list: ["Summary", "Callout", "Analysis"]
    }, {
        topHead: "Ask anything about your product and get great insights",
        topSub: "Enhance Your Product with Reviews",
        List1: "Ask anything about your product and get great insights",
        List2: "Ask for creative selling tips tailored to your product's unique features.",
        List3: "Ask for customer behavior predictions to improve your sales approach & much more"

    }]
    return (
        <div className="w-full h-full relative  bg-[rgb(0,0,0,0.02)] md:pl-[25rem] flex-1 ">
            <div className="w-full flex justify-between md:justify-center bg-[#F1F1F1] p-2 ">
                <div className="md:hidden block">
                    <Sheet open={sheetdata} onOpenChange={(val) => setSheetdata(val)} >
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="mr-2 md:hidden block" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 max-h-[100dvh]">
                            <Flipkart />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="max-w-[1200px] xl:w-[60%] lg:w-[70%] md:w-[80%] flex justify-center">
                    <div className={inputDesc ? ("flex p-2 rounded-3xl border-[.025rem]  hover:cursor-pointer bg-[#fff] mr-8") : ("mr-8 flex p-2 rounded-3xl border-[.025rem]  hover:cursor-pointer")} onClick={() => { setInputChat(false); setInputDesc(true); setInputReview(false); setInitialData({ inputDesc: true, inputReview: false }) }}>
                        <Image src={inputDesc ? Sparkle_active : sprakle} alt="description" className=" w-[10%] md:w-[12%]" />
                        <p className="ml-3 text-center text-[.8em] lg:text-[0.8rem] md:text-[0.6rem] align-middle">
                            Product Copilot
                        </p>
                    </div>
                    <div className={inputReview ? ("flex p-2 rounded-3xl border-[.025rem]  hover:cursor-pointer bg-[#fff]") : ("flex p-2 rounded-3xl border-[.025rem]  hover:cursor-pointer")} onClick={() => { setInputChat(false); setInputDesc(false); setInputReview(true); setInitialData({ inputDesc: false, inputReview: true }); getReviewData() }}>
                        <Image src={inputReview ? Star : star_inactive} alt="review" className="w-[10%] md:w-[12%]" />
                        <p className="ml-3 text-center text-[0.8em] lg:text-[0.8rem] md:text-[0.6rem]" >
                            Review Analyser
                        </p>
                    </div>
                    {/*<div className={inputChat ? ("flex p-2 rounded-3xl border-[.025rem]  hover:cursor-pointer bg-[#fff]") : ("flex p-2 rounded-3xl border-[.025rem]  hover:cursor-pointer")} onClick={() => { setInputChat(true); setInputDesc(false); setInputReview(false) }}>
                        <Image src={inputChat ? Sparkle_active : sprakle} alt="description" className="w-[12%]" />
                        <p className="ml-3 text-center lg:text-[0.8rem] md:text-[0.6rem] " >
                            Product Copilot
                        </p>
              </div>*/}
                </div>
            </div>
            {message?.length > 0 ? null : <InitialContent data={initialData} />}

            {/*-------------- message content -----------------------*/}

            <div className="w-full flex justify-center ">

                {message?.length > 0 ? <div className="max-w-[1200px] xl:w-[60%] lg:w-[70%] md:w-[80%] w-[90%]  min-h-[80vh] max-h-[80vh]" >
                    <div className="w-full  max-h-[80vh] grid  overflow-y-scroll CS text-sm" ref={chatContainerRef}>
                        <div className="min-h-[8px]"></div>
                        {message?.map((messages, index) => (
                            <>
                                {messages.user?.length > 0 ?
                                    <div className=" my-4 ">
                                        <div className="flex mb-1">
                                            <Image className="w-[27px] h-[27px] " src={userImg} alt="user img" />
                                            <p className="font-bold p-1 pl-2">You</p>
                                        </div>
                                        <ReactMarkdown className=" ml-9  br  text-[#121212] rounded-lg " >{messages.user}</ReactMarkdown>
                                    </div>
                                    : null}
                                {message?.length == index + 1 && stream ?
                                    <div className="  my-4 ">
                                        <div className="flex mb-1">
                                            <Image className="w-[27px] h-[27px] " src={BotImg} alt="bot img" />
                                            <p className="font-bold p-1 pl-2">{process.env.NEXT_PUBLIC_TITTLE} Copilot</p>
                                        </div>
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

                                    </div>
                                    : null}

                                {messages.bot?.length > 0 &&
                                    <div className=" my-4">
                                        <div className="flex mb-1 justify-between">
                                            <div className="font-bold  flex">
                                                <Image className="w-[27px] h-[27px] " src={BotImg} alt="bot img" /><p className="p-1 pl-2">{process.env.NEXT_PUBLIC_TITTLE} Copilot</p></div>

                                            <div className="mr-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="border-0"><Volume2 className="w-[27px] h-[27px] " /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-56">
                                                        <DropdownMenuLabel>Select Voice</DropdownMenuLabel>
                                                        {voice?.length > 0 && Object.entries(voice).map(([key, index]) => (<> <DropdownMenuSub key={index}>
                                                            <DropdownMenuSubTrigger>
                                                                <span >{key}</span>
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem onClick={() => postVoice(messages.bot, key, 'en')}>
                                                                        <span>English</span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => enTohi(messages.bot, key, 'hi')}>
                                                                        <span>Hindi</span>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                            <DropdownMenuSeparator /></>))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        <ReactMarkdown className=" bl p-4  bg-[#ffff] text-[#121212] rounded-lg border-[0.095rem]"
                                            components={{
                                                table: ({ node, ...props }) => (
                                                    <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                                                        {...props}
                                                    </table>
                                                ),
                                                pre: ({ node, ...props }) => (
                                                    <div className="overflow-auto CS w-full   bg-[#f1f1f1] p-2 rounded-lg">
                                                        <pre {...props} />
                                                    </div>
                                                ),
                                                code: ({ node, ...props }) => (
                                                    <code className="bg-[#d0d0d0] rounded-lg p-2 font-[550] mt-4" {...props} />
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
                                            }}>{messages.bot}</ReactMarkdown>
                                    </div>
                                }
                                {messages.chart?.length > 0 ?
                                    <div className="mb-4   w-full"><div className="flex mb-1">
                                        <Image className="w-[27px] h-[27px] " src={BotImg} alt="bot img" />
                                        <p className="font-bold p-1 pl-2">{process.env.NEXT_PUBLIC_TITTLE} Copilot</p>
                                    </div>
                                        <div className="bl p-4 w-full   bg-[#ffff] text-[#121212] rounded-lg">
                                            <LineChart className="w-full" data={messages.chart} />
                                        </div>
                                    </div>
                                    : null}
                                {messages.emo?.length > 0 ?
                                    <div className="mb-4   w-full"><div className="flex mb-1">
                                        <Image className="w-[27px] h-[27px] " src={BotImg} alt="bot img" />
                                        <p className="font-bold p-1 pl-2">{process.env.NEXT_PUBLIC_TITTLE} Copilot</p>
                                    </div>
                                        <div className="w-full bl  p-4  bg-[#ffff] text-[#121212] rounded-lg">
                                            <BarChart className="w-full" />
                                        </div>
                                    </div>
                                    : null}

                            </>
                        ))}
                        {chatLoader || scraping || childLoader ?
                            <div className=" mt-4">
                                <div className="flex mb-1">
                                    <Image className="w-[27px] h-[27px] " src={BotImg} alt="bot img" />
                                    <p className="font-bold p-1 pl-2">{process.env.NEXT_PUBLIC_TITTLE} Copilot</p>
                                </div>
                                <TypingAnimation className=" flex h-[5px] items-center  w-[30%]" />
                            </div>
                            : null}
                        <div className="min-h-[10vh] max-h-[10vh]"></div>
                    </div >

                </div> : null}
                {audioPopup && <div className="flex justify-evenly absolute right-4 bg-[#FFF] p-4 border-[0.02rem] shadow-xl rounded-lg">
                    <XCircle className="absolute right-[-10px] top-[-10px] hover:cursor-pointer" onClick={() => { setAudioPopup(false) }} />
                    {audioLoader && <div className="w-full h-full flex ">
                        <Loader className="spin mr-2 min-w-[10px]" />
                        <p className="text-sm font-[550]">Generating Audio</p>
                    </div>}
                    {(!audioLoader && audioUrl) && <ReactAudioPlayer
                        className=""
                        ref={audioRef}
                        src={audioUrl}
                        autoPlay
                        controls
                    />}
                </div>}

            </div>

            {/* ----------------------------- input ----------------------------- */}
            <div className="w-full flex  mb-4  justify-center ">
                <div className="h-[10vh]"></div>
                {inputChat ? <div className="h-[6%]"></div> : null}
                <div className="  max-w-[1200px] drop-shadow-2xl md:w-[45%] w-[90%] absolute bottom-6 ">
                    {!inputChat ? <div
                        style={{ borderRadius: 0, borderTopRightRadius: "16px", borderTopLeftRadius: "16px" }}
                        className={cn(!inputChat ? " bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-400 w-full px-16 py-2  pb-6 " : "   w-full ")}  >
                        <>
                            <Image className="absolute top-2 left-1 m-2" src={inputDesc ? inputMenu : Star} width alt="menu" />
                            <p className="text-[0.87rem] font-[550]">
                                {inputDesc ? dataJson[0].head : null}
                                {inputReview ? dataJson[1].head : null}</p>
                            <p className="text-[0.65rem] md:text-[0.65rem] font-medium text-[rgb(0,0,0,0.4)]" >
                                {inputDesc ? dataJson[0].sub : null}
                                {inputReview ? dataJson[1].sub : null}
                            </p>

                            {inputPopUp && inputDesc ? <div className="flex w-full flex-wrap mt-2 transitionCS">
                                <p className=" hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)] rounded-3xl border-[0.02rem] flex justify-between  mr-2 mb-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { descriptionFun(1), setInputPopUp(!inputPopUp) }}>Professional</p>
                                <p className="  hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)]  rounded-3xl border-[0.02rem] flex justify-between  mr-2 mb-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { descriptionFun(2), setInputPopUp(!inputPopUp) }}>Technical</p>
                                <p className="  hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)] rounded-3xl border-[0.02rem] flex justify-between  mr-2 mb-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { descriptionFun(3), setInputPopUp(!inputPopUp) }}>Friendly</p>
                                <p className="  hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)] rounded-3xl border-[0.02rem] flex justify-between  mr-2 mb-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { descriptionFun(4), setInputPopUp(!inputPopUp) }}>Straightforward</p>
                                <p className="  hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)] rounded-3xl border-[0.02rem] flex justify-between  mr-2 mb-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { descriptionFun(5), setInputPopUp(!inputPopUp) }}>Sassy</p>
                                <p className="  hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)] rounded-3xl border-[0.02rem] flex justify-between  mr-2 mb-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { descriptionFun(6), setInputPopUp(!inputPopUp) }}>Highlights</p>
                                <p className="  hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)] rounded-3xl border-[0.02rem] flex justify-between  mr-2 mb-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { descriptionFun(7), setInputPopUp(!inputPopUp) }}>Dejargon Description</p>
                            </div> : null}
                            {inputPopUp && inputReview ? <div className="flex w-full   my-3 transitionCS" >
                                <p className=" hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)] rounded-3xl border-[0.02rem] flex justify-between  mr-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { setReviewDataFun(1), setInputPopUp(!inputPopUp) }}>Summary</p>
                                <p className="  hover:cursor-pointer  px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)]  rounded-3xl border-[0.02rem] flex justify-between  mr-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { setReviewDataFun(2), setInputPopUp(!inputPopUp) }}>Callout</p>
                                <p className="  hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)] rounded-3xl border-[0.02rem] flex justify-between  mr-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { setReviewDataFun(3), setInputPopUp(!inputPopUp) }}>Analysis</p>
                                {/* <p className="  hover:cursor-pointer px-2 md:px-2 xl:px-4 py-1 bg-[rgba(255,255,255,0.44)] rounded-3xl border-[0.02rem] flex justify-between  mr-2 hover:bg-[#fff]" style={{ fontSize: "calc(.45*(1.1vw + 1.5vh))" }} onClick={() => { setReviewDataFun(4) }}>Emotions</p>
                           */} </div> : null}

                            <Image className={cn(inputPopUp ? ("hover:cursor-pointer absolute top-1 right-1") : ("rotate-180 hover:cursor-pointer absolute top-1 right-1"))} src={arrowUp} alt="arrow"
                                onClick={() => setInputPopUp(!inputPopUp)} />
                        </> </div> : <div className="h-[2rem]"></div>}
                    <div className="flex w-full rounded-2xl">
                        <div className=" flex max-w-[150px]  justify-end  z-[99] m-0 ">
                            <Select
                                className="outline-0  rounded-0"
                                onValueChange={(value) => {
                                    setModelValue(value); // Update the state using setModelValue
                                }}
                            >
                                <SelectTrigger
                                    style={{ borderRadius: 0, borderBottomLeftRadius: "16px", borderTopLeftRadius: "16px" }}
                                    className=" m-0 rounded-0 outline-0 text-sm mt-[-1rem] h-[4rem] min-w-[100px] w-[fit-content] max-w-[200px]"
                                >
                                    <SelectValue placeholder="gpt-4" />
                                </SelectTrigger>
                                <SelectContent className="p-0 m-0 rounded-0 outline-0 ">
                                    {model.map((data, index) => (
                                        <SelectItem
                                            disabled={!data.enabled}
                                            key={index}
                                            value={data.value}
                                            onClick={() => {
                                                setWebAware(false);
                                                setPageAware(!pageAware);
                                                setCompare(false);
                                            }}
                                        >
                                            <div className="flex text-center">{data.name}</div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div
                            style={{ borderRadius: 0, borderBottomRightRadius: "16px", borderTopRightRadius: "16px" }}
                            className="-ml-1 mt-[-1rem] flex z-[99]  w-full bg-[#fff] flex-1  mx-auto  h-[4rem] border-[0.02rem] p-2">
                            <input
                                className="  w-full p-2 outline-none" type="text" placeholder='Ask anything about the product'
                                id="chat"
                                onChange={(e) => setUserMsg(e.target.value)}
                                value={userMsg}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !scraping) {
                                        chat(userMsg);
                                        setUserMsg('')
                                        e.preventDefault();
                                    }
                                }} />
                            <Button className=" py-0 px-4 rounded-lg h-[2.5rem] mt-[.25rem]" onClick={() => { chat(userMsg); setUserMsg('') }}>Submit</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
