"use client";

import { BotState, Message } from "@/types";
import { useEffect, useRef, useState } from "react";

interface Props {
  messages: Message[];
  stream: string;
  botState: BotState;
}

const MessageComponent = (props: { message: Message }) => {
  const {
    message: { role, content },
  } = props;

  return (
    <p
      className={`bg-amber-500 max-w-[80%] p-2 rounded-2xl text-white ${
        role === "user" ? "self-end" : "self-start"
      }`}
    >
      {content}
    </p>
  );
};

export default function Messages(props: Props) {
  const { messages, stream, botState } = props;

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

      {botState === "loading" ? "loading..." : ""}
    </div>
  );
}
