'use client'
import React,{useEffect} from 'react'
import DescBg from "@/public/assets/DescImg.png"
import ReviewBg from "@/public/assets/reviewImg.png"
import chatBg from "@/public/assets/chatbotImg.png"
import Image from 'next/image'
export default function InitialContent(props) {
    const dataJson = [{
        topHead: "Generate automatic product descriptions for your products",
        topSub: "Enhance Your Product Listings with AI-Generated Descriptions",
        head: "Generate Product Description",
        sub: "Generate custom Product descriptions of products from Images/Urls",
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
        <div className="min-h-[80vh] max-h-[80vh] flex flex-col justify-center">
            {props.data.inputDesc ? <Image alt="Description bg" src={DescBg} className="flex justify-center relative border-[0.02rem] w-[60%] ml-[20%] md:w-[30%] md:ml-[35%]   rounded-xl min-w-[20vw] " style={{
                background: "linear-gradient(180deg, rgba(222,228,255,1) 30%, rgba(180,161,255,1) 100%)",
                boxShadow: " 0 50px 50px 0px rgba(255,112,255,0.25), 0 0px 40px 0px rgba(180,161,255,.6)"
            }} /> : null}
            {props.data.inputReview ? <Image alt="Review bg" src={ReviewBg} className="flex justify-center relative border-[0.02rem] w-[60%] ml-[20%] md:w-[30%] md:ml-[35%]   rounded-xl min-w-[20vw] " style={{
                background: "linear-gradient(180deg, rgba(222,228,255,1) 30%, rgba(180,161,255,1) 100%)",
                boxShadow: " 0 50px 50px 0px rgba(255,112,255,0.25), 0 0px 40px 0px rgba(180,161,255,.6)"
            }} /> : null}
            {props.data.inputChat ?
                <Image  alt="chat bg" src={chatBg} className="flex justify-center relative border-[0.02rem] w-[60%] ml-[20%] md:w-[30%] md:ml-[35%]   rounded-xl min-w-[20vw]" style={{
                    background: "linear-gradient(180deg, rgba(222,228,255,1) 30%, rgba(180,161,255,1) 100%)",
                    boxShadow: " 0 50px 50px 0px rgba(255,112,255,0.25), 0 0px 40px 0px rgba(180,161,255,.6)"
                }} /> : null}
            <p className="w-[60%] min-w-[20vw] ml-[20%] font-medium mt-4 text-center text-[.87rem] md:text-[1rem]" >
                {props.data.inputDesc ? dataJson[0].topHead : null}
                {props.data.inputReview ? dataJson[1].topHead : null}
                {props.data.inputChat ? dataJson[2].topHead : null}</p>
            <p className=" w-[60%] min-w-[20vw] ml-[20%] font-[450] mt-2 text-center text-[.6rem] md:text-[.8rem]">
                {props.data.inputDesc ? dataJson[0].topSub : null}
                {props.data.inputReview ? dataJson[1].topSub : null}
            </p>
            <p className="flex w-[60%] min-w-[20vw] ml-[25%] font-medium mt-6 " >
                {/*   <span><Image className="m-2" src={Check} /></span>*/}
                {props.data.inputChat ? dataJson[2].List1 : null} </p>
            <p className="flex w-[60%] min-w-[20vw] ml-[25%] font-medium mt-2 " >
                {props.data.inputChat ? dataJson[2].List2 : null}</p>
            {/*   <span><Image className="m-2" src={Check} /></span>*/}
            <p className="flex w-[60%] min-w-[20vw] ml-[25%] font-medium mt-2 " >
                {/*   <span><Image className="m-2" src={Check} /></span>*/}
                {props.data.inputChat ? dataJson[2].List3 : null}</p>
        </div>

    )
}
