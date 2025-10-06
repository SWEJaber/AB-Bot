"use client";

import { BOT_IMAGE_SRC } from "@/app/constants";
import Avatar from "@/components/Avatar";
import { ChatState, Message } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  chatState: ChatState;
}

const MessageComponent = (props: { message: Message }) => {
  const {
    message: { role, content },
  } = props;

  const session = useSession();

  const avatarSrc =
    role === "assistant" ? BOT_IMAGE_SRC : session.data?.user?.image ?? "";

  return (
    <div
      className={`flex gap-2  ${
        role === "user" ? "flex-row-reverse" : "self-start"
      }`}
    >
      <Avatar className="mt-1" src={avatarSrc} size={30} />

      <p className={`bg-amber-500 max-w-[80%] p-2 rounded-2xl text-white `}>
        {content}
      </p>
    </div>
  );
};

export default function Chat(props: Props) {
  const {
    chatState: { messages, stream, botState },
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
      className="flex flex-col gap-2.5 no-scrollbar h-[75%] space-y-4 mb-4 overflow-y-scroll scroll-smooth"
      onScroll={handleScroll}
    >
      {messages.map((message, i) => (
        <MessageComponent key={"" + i} message={message} />
      ))}

      {stream && (
        <MessageComponent message={{ role: "assistant", content: stream }} />
      )}

      {botState === "loading" ? "thinking..." : ""}
    </div>
  );
}
