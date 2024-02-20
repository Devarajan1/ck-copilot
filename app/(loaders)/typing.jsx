'use client'
import React from "react";
import "./typing.css";
export default function TypingAnimation() {
  return (
    <div className="flip-chat-bubble">
      <div className="flip-typing">
        <div className="flip-dot"></div>
        <div className="flip-dot"></div>
        <div className="flip-dot"></div>
      </div>
    </div>
  );
}