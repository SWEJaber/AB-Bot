"use client";

import { BiSolidSend, BiSearchAlt, BiSolidChat } from "react-icons/bi";

import { BotState, ChatMode } from "@/types";
import { useState } from "react";
import IconButton from "@/components/IconButton";

interface Props {
  mode: ChatMode;

  botState: BotState;
  isDisabled: boolean;
  toggleMode: () => void;
  sendMessage: (messageContent: string) => void;
}

export default function InputField(props: Props) {
  const { mode, isDisabled, sendMessage, toggleMode } = props;

  const [messageContent, setMessageContent] = useState<string>("");

  const sendMessageWrapper = () => {
    sendMessage(messageContent);

    setMessageContent("");
  };

  return (
    <div
      className={`my-auto flex justify-between items-center w-full h-12 px-3 ${
        isDisabled ? "bg-gray-500" : ""
      } border-black border-4 rounded-3xl overflow-hidden`}
    >
      <IconButton
        title={mode === "chat" ? "Switch to search" : "Switch to chat"}
        isDisabled={isDisabled}
        onClick={toggleMode}
      >
        {mode === "chat" ? <BiSearchAlt /> : <BiSolidChat />}
      </IconButton>

      <input
        className={`flex-1 px-3 py-2  w-[80%] outline-hidden ${
          isDisabled ? "hover:cursor-not-allowed" : ""
        }`}
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder={
          mode === "chat" ? "Type your message" : "Let's search the web!"
        }
        disabled={isDisabled}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessageWrapper();
        }}
      />

      <IconButton
        title={"send message"}
        isDisabled={!messageContent}
        onClick={sendMessageWrapper}
      >
        <BiSolidSend />
      </IconButton>
    </div>
  );
}
