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
    <p>
      <strong>{role}: </strong> {content}
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
      className="no-scrollbar h-[75%] space-y-4 mb-4 overflow-y-scroll scroll-smooth"
      onScroll={handleScroll}
    >
      {messages.map((message, i) => (
        <MessageComponent key={"" + i} message={message} />
      ))}

      {stream && (
        <p>
          <strong>assistant:</strong> {stream}
        </p>
      )}

      {botState === "loading" ? "loading..." : ""}
    </div>
  );
}
