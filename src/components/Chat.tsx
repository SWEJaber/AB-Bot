"use client";

import { BOT_IMAGE_SRC } from "@/app/constants";
import Avatar from "@/components/Avatar";
import { ChatState, Message } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Props {
  chatState: ChatState;
}

const MessageComponent = (props: { message: Message }) => {
  const {
    message: { role, content, image, selectedMode },
  } = props;

  const session = useSession();

  const avatarSrc =
    role === "assistant" ? BOT_IMAGE_SRC : session.data?.user?.image ?? "";

  return (
    <div
      className={`flex gap-2  ${
        role === "user" ? "flex-row-reverse" : "self-start max-w-[80%]"
      }`}
    >
      <Avatar className="mt-1" src={avatarSrc} size={30} />

      <div
        className={`bg-amber-500 ${
          image ? "w-[80%]" : "max-w-[80%]"
        } p-2 rounded-2xl  text-wrap`}
      >
        {selectedMode === "search" && role === "assistant" && (
          <Image
            className="float-right ml-3 mb-2 rounded-2xl object-cover"
            src={image ?? BOT_IMAGE_SRC}
            alt=""
            width={150}
            height={150}
          />
        )}
        <p className={`text-white break-words ${image ? "max-w-[80%]" : ""}`}>
          {content}
        </p>
      </div>
    </div>
  );
};

export default function Chat(props: Props) {
  const {
    chatState: { messages, stream, botState, mode },
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;

    if (container && isAutoScroll) container.scrollTop = container.scrollHeight;
  }, [isAutoScroll, messages.length, stream]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    // If user is near bottom (<50px), allow auto-scroll
    const atBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    setIsAutoScroll(atBottom);
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col gap-2.5 no-scrollbar h-[75%] space-y-4 mb-4 overflow-y-scroll scroll-smooth"
      onScroll={handleScroll}
    >
      {messages.map((message, i) => (
        <MessageComponent key={"" + i} message={message} />
      ))}

      {stream.content && <MessageComponent message={stream} />}

      {botState === "loading"
        ? mode === "chat"
          ? "thinking..."
          : "searching the web..."
        : ""}
    </div>
  );
}
