"use client";

import InputField from "@/components/InputField";
import Messages from "@/components/Messages";
import { ChatMode, Message } from "@/types";
import { useReducer, useState } from "react";

type State = {
  messages: Message[];
  stream: string;
  botState: "loading" | "typing" | "standby";
};

const initialState: State = {
  messages: [],
  stream: "",
  botState: "standby",
};

type Action =
  | { type: "ADD_USER_MESSAGE"; payload: string }
  | { type: "APPEND_STREAM"; payload: string }
  | { type: "RESET_STREAM" }
  | { type: "FINALIZE_ASSISTANT_MESSAGE" }
  | { type: "SET_LOADING"; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_USER_MESSAGE":
      return {
        ...state,

        messages: [
          ...state.messages,
          { role: "user", content: action.payload },
        ],
      };
    case "APPEND_STREAM":
      return {
        ...state,
        botState: "standby",
        stream: state.stream + action.payload,
      };
    case "RESET_STREAM":
      return { ...state, stream: "" };
    case "FINALIZE_ASSISTANT_MESSAGE":
      return {
        ...state,
        messages: [
          ...state.messages,
          { role: "assistant", content: state.stream },
        ],
        stream: "",
      };
    case "SET_LOADING":
      return { ...state, botState: "loading" };
    default:
      return state;
  }
}

export default function Bot() {
  const [mode, setMode] = useState<ChatMode>("chat");

  const toggleMode = () =>
    setMode((value) => (value === "chat" ? "search" : "chat"));

  const [chatState, dispatch] = useReducer(reducer, initialState);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = { role: "user", content: messageContent };
    const updatedMessages = [...chatState.messages, userMessage];

    dispatch({ type: "ADD_USER_MESSAGE", payload: messageContent });

    dispatch({ type: "SET_LOADING", payload: true });

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ mode, messages: updatedMessages }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    dispatch({ type: "SET_LOADING", payload: false });

    while (!done) {
      const { value, done: doneReading } = await reader!.read();
      done = doneReading;
      const chunk = decoder.decode(value || new Uint8Array(), {
        stream: true,
      });

      console.log("chunk: ", chunk);

      dispatch({ type: "APPEND_STREAM", payload: chunk });
    }

    dispatch({ type: "FINALIZE_ASSISTANT_MESSAGE" });
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {mode === "chat" ? "Chat" : "Search the web"} with AP Bot
      </h1>

      {chatState.messages.length > 0 && (
        <Messages
          messages={chatState.messages}
          stream={chatState.stream}
          botState={chatState.botState}
        />
      )}

      <InputField
        mode={mode}
        toggleMode={toggleMode}
        botState={chatState.botState}
        isDisabled={chatState.botState !== "standby"}
        sendMessage={sendMessage}
      />
    </div>
  );
}
